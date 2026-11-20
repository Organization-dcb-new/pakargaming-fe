#!/usr/bin/env bash
# Deploys one image tag of the storefront on this server, and rolls back to the version that was
# running when the new one doesn't pass its healthcheck in time.
#
# Run by the deploy job of .github/workflows/dev.yml and main.yml, on the server's self-hosted
# runner, from a checkout of deploy/. It installs the repo's compose file in DEPLOY_DIR, so the
# compose file on the server is always the one of the commit being deployed.
#
# Environment (all required unless a default is given):
#   DEPLOY_DIR      folder on the server that holds the compose project and its .env
#   COMPOSE_SRC     compose file in the checkout, e.g. deploy/docker-compose.prod.yml
#   CONTAINER       container_name in that compose file, e.g. fe-client-prod
#   NETWORK         external Docker network that compose file joins, e.g. pakargaming-prod-client;
#                   the backend's deploy creates it (topup-be deploy/NETWORKS.md)
#   BACKEND_CONTAINER  the backend's container, e.g. backend-prod: the deploy stops while it isn't
#                   on NETWORK yet
#   IMAGE_REPO      ghcr.io/<owner>/<repo>, lowercase
#   NEW_TAG         image tag to deploy, e.g. prod-1.2.3
#   TAG_PREFIX      prod- or dev-; older images with it are removed after a good deploy
#   GHCR_USER, GHCR_TOKEN   registry login for the pull
#   HEALTH_TIMEOUT  seconds the new version gets to report healthy, default 90. The compose file's
#                   healthcheck first probes 10s after start and calls it unhealthy after ~40s.
#   KEEP_IMAGES     versions of the image kept on disk for a rollback, default 3
#
# What the container reads when it runs is not passed by the job: it is DEPLOY_DIR/.env on the
# server (deploy/dev.env.example and prod.env.example list it).
#
# The health check is the container's own (healthcheck in the compose file, a request for a static
# file to the Next.js server inside it), not a request to the host port: that port, and the address
# it is bound to, are the server's choice (FE_PUBLISH in DEPLOY_DIR/.env).
set -euo pipefail

: "${DEPLOY_DIR:?}" "${COMPOSE_SRC:?}" "${CONTAINER:?}" "${NETWORK:?}" "${IMAGE_REPO:?}"
: "${NEW_TAG:?}" "${TAG_PREFIX:?}" "${GHCR_USER:?}" "${GHCR_TOKEN:?}"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-90}"
KEEP_IMAGES="${KEEP_IMAGES:-3}"

# What the container reads when it runs (environment in the compose file). These and FE_PUBLISH are
# the server's: compose takes them from DEPLOY_DIR/.env, or the compose file's default. Whatever this
# shell has under those names is dropped, so it can't override .env. The job log shows the values of
# the public ones; of a secret, only whether it is set.
RUNTIME_PUBLIC="NEXT_PUBLIC_API_BASE_URL API_INTERNAL_URL NEXT_SITE_BASE_URL NEXT_PUBLIC_TURNSTILE_SITE_KEY NEXT_PUBLIC_GA_MEASUREMENT_ID NEXT_PUBLIC_FOOTER_LOGO_URL CLIENT_IP_HEADER"
RUNTIME_SECRETS="ENCRYPT_SECRET_KEY STOREFRONT_PROXY_SECRET TURNSTILE_SECRET_KEY"
RUNTIME_SETTINGS="$RUNTIME_PUBLIC $RUNTIME_SECRETS"
# shellcheck disable=SC2086 # one name per word
unset $RUNTIME_SETTINGS FE_PUBLISH

is_secret() {
  [[ " $RUNTIME_SECRETS " == *" $1 "* ]]
}

# The compose file is used as docker-compose.yml in DEPLOY_DIR; the one it replaces is kept beside
# it as docker-compose.yml.previous, which a rollback puts back.
COMPOSE_NAME="docker-compose.yml"
COMPOSE_PREVIOUS="docker-compose.yml.previous"
COMPOSE_SRC="$(realpath "$COMPOSE_SRC")"

# compose reads IMAGE_REPO and IMAGE_TAG from the environment (see the compose file).
export IMAGE_REPO

compose() {
  docker compose -f "$COMPOSE_NAME" "$@"
}

# container_state NAME prints a container's state for the job log.
container_state() {
  docker inspect --format 'state={{.State.Status}} health={{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}} restarts={{.RestartCount}} exit_code={{.State.ExitCode}} image={{.Config.Image}}' "$1" 2>/dev/null ||
    echo "container $1 not found"
}

# env_of NAME VAR prints the value of VAR in container NAME; nothing when either isn't there.
env_of() {
  [ -n "$1" ] || return 0
  { docker inspect --format '{{range .Config.Env}}{{println .}}{{end}}' "$1" 2>/dev/null || true; } |
    sed -n "/^$2=/{s/^$2=//p;q;}"
}

# publish_of NAME prints the host side of container NAME's mapping of port 3000 as compose writes it:
# 3000 (every address) or 127.0.0.1:3000. Nothing when the container or the mapping isn't there.
publish_of() {
  [ -n "$1" ] || return 0
  local ip="" port=""
  read -r ip port < <(
    docker inspect --format '{{with index .HostConfig.PortBindings "3000/tcp"}}{{with index . 0}}{{if .HostIp}}{{.HostIp}}{{else}}-{{end}} {{.HostPort}}{{end}}{{end}}' "$1" 2>/dev/null || true
  ) || true
  if [ -z "$port" ]; then
    return 0
  fi
  case "$ip" in
    -) echo "$port" ;;
    *:*) echo "[$ip]:$port" ;;
    *) echo "$ip:$port" ;;
  esac
}

# wait_healthy NAME waits until container NAME's healthcheck says healthy, and gives up when it says
# unhealthy, the container is gone, or HEALTH_TIMEOUT seconds pass. A container without a
# healthcheck (started from a compose file from before this script, which is what a rollback can
# bring back) only has to stay running, without restarting, for 10s.
wait_healthy() {
  local name="$1"
  local deadline=$((SECONDS + HEALTH_TIMEOUT))
  local status health restarts
  while [ "$SECONDS" -lt "$deadline" ]; do
    read -r status health restarts < <(
      docker inspect --format '{{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}} {{.RestartCount}}' "$name" 2>/dev/null ||
        echo "missing missing 0"
    ) || true
    case "$status/$health" in
      running/healthy)
        echo "Healthy after ${SECONDS}s"
        return 0
        ;;
      */unhealthy | missing/*)
        return 1
        ;;
      running/none)
        sleep 10
        if [ "$(docker inspect --format '{{.State.Status}} {{.RestartCount}}' "$name" 2>/dev/null)" = "running $restarts" ]; then
          echo "Running after ${SECONDS}s (it has no healthcheck, so that is all there is to check)"
          return 0
        fi
        ;;
    esac
    sleep 3
  done
  return 1
}

# show_output prints the end of the failed container's output, which names why it didn't start
# (a port already taken, a crash at boot). Called only when the new version failed, before the
# rollback replaces the container and its output with it. It is boot output, but anyone who can
# read the job log sees it.
show_output() {
  echo "   Last lines of its output:"
  docker logs --tail 30 "$CONTAINER" 2>&1 | sed 's/^/   | /' || true
}

printf '%s' "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin
# Leave no registry credential behind on the server.
trap 'docker logout ghcr.io >/dev/null 2>&1 || true' EXIT

# The backend's deploy (topup-be deploy/deploy.sh) creates this network and joins the backend to it
# (topup-be deploy/NETWORKS.md). Before that, this app would start where it can't reach the backend:
# stop instead, before the running container is touched.
if ! docker network inspect "$NETWORK" >/dev/null 2>&1; then
  echo "❌ Network $NETWORK does not exist yet: deploy topup-be first, which creates it (topup-be deploy/NETWORKS.md)."
  exit 1
fi
if [ -n "${BACKEND_CONTAINER:-}" ] &&
  ! docker inspect --format '{{range $name, $v := .NetworkSettings.Networks}}{{$name}}{{"\n"}}{{end}}' "$BACKEND_CONTAINER" 2>/dev/null | grep -qx "$NETWORK"; then
  echo "❌ $BACKEND_CONTAINER is not on $NETWORK yet: deploy topup-be first (topup-be deploy/NETWORKS.md)."
  exit 1
fi

cd "$DEPLOY_DIR"

# The container running now is the rollback target, and what the settings below are taken from.
# It is CONTAINER, or, when no container has that name yet (the server's compose file from before
# this script named it differently), the one compose started from this folder.
CURRENT_CONTAINER="$CONTAINER"
if ! docker inspect "$CONTAINER" >/dev/null 2>&1; then
  CURRENT_CONTAINER="$(docker ps -a --filter "label=com.docker.compose.project.working_dir=$PWD" --format '{{.Names}}' 2>/dev/null | sed -n 1p || true)"
  if [ -n "$CURRENT_CONTAINER" ]; then
    echo "No container is named $CONTAINER yet; it replaces $CURRENT_CONTAINER, started from $PWD"
  fi
fi

current() {
  if [ -n "$CURRENT_CONTAINER" ]; then
    docker inspect --format "$1" "$CURRENT_CONTAINER" 2>/dev/null || true
  fi
}

# Before this script managed the compose file, the image was a moving *-latest tag or a fixed one;
# such a tag is never pulled here, so locally it still names the old image and is a valid rollback
# target as well.
CURRENT_IMAGE="$(current '{{.Config.Image}}')"
CURRENT_TAG=""
case "$CURRENT_IMAGE" in
  *:*) CURRENT_TAG="${CURRENT_IMAGE##*:}" ;;
esac
echo "Current: ${CURRENT_IMAGE:-none}${CURRENT_CONTAINER:+ ($CURRENT_CONTAINER)}"
echo "New:     $IMAGE_REPO:$NEW_TAG ($CONTAINER)"

# The rollback goes by the running image's ID, tagged <prefix>previous here, not by its tag: a tag
# can be pushed again and then names the new image (the old version bump did that to dev-* tags).
ROLLBACK_TAG="${TAG_PREFIX}previous"
CURRENT_IMAGE_ID="$(current '{{.Image}}')"
if [ -n "$CURRENT_IMAGE_ID" ]; then
  docker tag "$CURRENT_IMAGE_ID" "$IMAGE_REPO:$ROLLBACK_TAG"
fi

# Pulled before anything on the server changes, so a failed pull leaves it as it was.
echo "Pulling $NEW_TAG..."
docker pull "$IMAGE_REPO:$NEW_TAG"

# When .env doesn't set one of the settings, it is taken from the container running now and written
# to .env, so the first deploy with the repo's compose file keeps what the container had: the port
# the reverse proxy sends traffic to, the backend URL and secrets the old deploy job passed. Nothing
# to take means the compose file's default, or, for a required one, the stop at `compose config`
# below. (What older images had built in, such as the Turnstile site key, isn't in the container's
# environment to take: fill it in .env.)
# env_has NAME: .env gives NAME a value. An empty one (NAME=, NAME='', as the *.env.example files
# have them) counts as not set; a line added after it wins.
env_has() {
  [ -f .env ] && grep -Eq "^[[:space:]]*(export[[:space:]]+)?$1=[[:space:]]*([^[:space:]\"'#]|\"[^\"]|'[^'])" .env
}

# carry_over NAME VALUE [secret]: a secret's value isn't printed.
carry_over() {
  local name="$1" value="$2" shown="$2"
  if env_has "$name" || [ -z "$value" ]; then
    return 0
  fi
  if [ "${3:-}" = secret ]; then
    shown="(not shown)"
  fi
  echo "$name is not in $DEPLOY_DIR/.env; keeping what $CURRENT_CONTAINER uses now: $name=$shown"
  export "$name=$value"
  case "$value" in
    *"'"* | *$'\n'*)
      echo "⚠️ It can't be written to .env in single quotes; add $name to $DEPLOY_DIR/.env by hand"
      return 0
      ;;
  esac
  # .env holds secrets: when this creates it, only its owner can read it.
  if [ ! -e .env ]; then
    (umask 077 && : >.env) 2>/dev/null || true
  fi
  if ! printf "\n# Taken by deploy/deploy.sh on %s from the container running then.\n%s='%s'\n" \
    "$(date -u +%F)" "$name" "$value" >>.env 2>/dev/null; then
    echo "⚠️ Could not write it to $DEPLOY_DIR/.env; add $name there by hand"
  fi
}

# moved_backend VALUE: VALUE with the backend's old address on the network the apps used to share
# replaced by its address on NETWORK (topup-be deploy/NETWORKS.md), for a value taken from the
# container before.
moved_backend() {
  printf '%s' "${1//172.20.0.10:4001/172.16.10.10:4001}"
}

carry_over FE_PUBLISH "$(publish_of "$CURRENT_CONTAINER")"
SET_BEFORE=" "
for name in $RUNTIME_SETTINGS; do
  value="$(env_of "$CURRENT_CONTAINER" "$name")"
  if [ "$name" = API_INTERNAL_URL ]; then
    value="$(moved_backend "$value")"
  fi
  if [ -n "$value" ]; then
    SET_BEFORE="$SET_BEFORE$name "
  fi
  if is_secret "$name"; then
    carry_over "$name" "$value" secret
  else
    carry_over "$name" "$value"
  fi
done
unset value

# Keep the compose file now in use (whatever its name, in compose's own order of preference) for a
# rollback, then make docker-compose.yml the only one, so a manual `docker compose` on the server
# uses the same file.
rm -f "$COMPOSE_PREVIOUS"
for f in compose.yaml compose.yml docker-compose.yaml docker-compose.yml; do
  if [ -f "$f" ]; then
    cp "$f" "$COMPOSE_PREVIOUS"
    break
  fi
done

restore_compose() {
  if [ -f "$COMPOSE_PREVIOUS" ]; then
    cp "$COMPOSE_PREVIOUS" "$COMPOSE_NAME"
  fi
}

for f in compose.yaml compose.yml docker-compose.yaml; do
  if [ -f "$f" ]; then
    echo "Moving $f aside to $f.replaced; $COMPOSE_NAME from the repo replaces it"
    mv "$f" "$f.replaced"
  fi
done
install -m 0644 "$COMPOSE_SRC" "$COMPOSE_NAME"

# A compose file that doesn't resolve here stops the deploy, before the running container is touched.
if ! IMAGE_TAG="$NEW_TAG" compose config --quiet; then
  echo "❌ $COMPOSE_SRC does not resolve on this server; the server's previous compose file is back in place."
  echo "   A setting named above as missing goes in $DEPLOY_DIR/.env; deploy/*.env.example in the repo lists them."
  restore_compose
  exit 1
fi

# The backend's address on the network every app used to share (172.20.0.10) can't be reached from
# NETWORK: a API_INTERNAL_URL still naming it in .env stops here.
if IMAGE_TAG="$NEW_TAG" compose config 2>/dev/null | grep -Eq '^[[:space:]]+API_INTERNAL_URL: .*172\.20\.'; then
  echo "❌ API_INTERNAL_URL names the backend's old address (172.20.x), which $NETWORK can't reach."
  echo "   In $DEPLOY_DIR/.env set API_INTERNAL_URL=http://172.16.10.10:4001, then deploy again (topup-be deploy/NETWORKS.md)."
  restore_compose
  exit 1
fi

# rollback starts the version that was running before, with the compose file it ran with, and
# fails the job either way.
rollback() {
  if [ -z "$CURRENT_IMAGE_ID" ]; then
    echo "⚠️ No version was running before this one, so there is nothing to roll back to"
    exit 1
  fi

  echo "Rolling back to $CURRENT_TAG (image ${CURRENT_IMAGE_ID#sha256:})..."
  restore_compose
  # A compose file from before this script may name a fixed *-latest image and ignore IMAGE_TAG;
  # that tag is never pulled here, so it still names the old image.
  IMAGE_TAG="$ROLLBACK_TAG" compose up -d --remove-orphans || true

  # The previous compose file brings back its own container; without one, the repo's starts the
  # old image under CONTAINER.
  local name="$CURRENT_CONTAINER"
  if [ ! -f "$COMPOSE_PREVIOUS" ]; then
    name="$CONTAINER"
  fi
  SECONDS=0
  if wait_healthy "$name"; then
    echo "🔄 Rolled back to $CURRENT_TAG, which is up"
  else
    echo "❌ The rollback to $CURRENT_TAG is not healthy either: $(container_state "$name")"
  fi
  exit 1
}

echo "Starting $NEW_TAG..."
if ! IMAGE_TAG="$NEW_TAG" compose up -d --remove-orphans; then
  echo "❌ docker compose up failed: $(container_state "$CONTAINER")"
  show_output
  rollback
fi

RUNNING_IMAGE="$(docker inspect --format '{{.Config.Image}}' "$CONTAINER" 2>/dev/null || true)"
if [ "$RUNNING_IMAGE" != "$IMAGE_REPO:$NEW_TAG" ]; then
  echo "❌ $CONTAINER runs ${RUNNING_IMAGE:-nothing}, not $IMAGE_REPO:$NEW_TAG: check container_name and image in $COMPOSE_SRC"
  rollback
fi

echo "Waiting up to ${HEALTH_TIMEOUT}s for $CONTAINER to report healthy..."
SECONDS=0
if ! wait_healthy "$CONTAINER"; then
  echo "❌ $NEW_TAG did not become healthy in ${HEALTH_TIMEOUT}s: $(container_state "$CONTAINER")"
  show_output
  rollback
fi

# For a manual `docker compose` on the server: IMAGE_TAG=$(cat .deployed-tag) docker compose up -d
printf '%s\n' "$NEW_TAG" >.deployed-tag

# A secret shows as set or empty, never its value. A setting the version before had and this one
# doesn't is the sign of a .env line that sets it empty.
echo "Runtime settings of $CONTAINER:"
for name in $RUNTIME_SETTINGS; do
  value="$(env_of "$CONTAINER" "$name")"
  if [ -n "$value" ] && is_secret "$name"; then
    echo "   $name: set"
  elif [ -n "$value" ]; then
    echo "   $name=$value"
  elif [[ "$SET_BEFORE" == *" $name "* ]]; then
    echo "   ⚠️ $name: empty, and the version before had it set"
  else
    echo "   $name: empty"
  fi
done

# Whether the new version can use the backend the way every buyer's request will (an IP-filtered
# route, from inside the container, at the address it is configured with). Only reported, never a
# rollback: a backend that is down is not this deploy's to fix. A 403 is the backend's ALLOWED_IPS
# not listing this container, the usual slip when API_INTERNAL_URL is first set.
BACKEND="$(env_of "$CONTAINER" API_INTERNAL_URL)"
BACKEND="${BACKEND%/}"
if [ -n "$BACKEND" ]; then
  if PROBE="$(docker exec "$CONTAINER" wget -q -T 5 -O /dev/null "$BACKEND/v1/maintenances" 2>&1)"; then
    echo "Backend answers $CONTAINER at $BACKEND"
  else
    ADDRS="$(docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}} {{end}}' "$CONTAINER" 2>/dev/null || true)"
    echo "⚠️ $CONTAINER can't use the backend at $BACKEND: ${PROBE:-no answer}"
    case "$PROBE" in
      *403*) echo "   Add this container's address (${ADDRS% }) to ALLOWED_IPS in the backend's .env, then restart the backend." ;;
      *refused* | *"timed out"* | *"bad address"*) echo "   Check the address and port (the backend listens on 4001: http://172.16.10.10:4001)." ;;
    esac
  fi
fi

# Port 3000 open to other machines lets anyone send a forged buyer IP header past the reverse proxy
# (README, "Edge proxy"). Not a failure: the reverse proxy may be on another machine.
PUBLISH="$(publish_of "$CONTAINER")"
if [ -n "$PUBLISH" ] && { [ "${PUBLISH#*:}" = "$PUBLISH" ] || [ "${PUBLISH%:*}" = "0.0.0.0" ] || [ "${PUBLISH%:*}" = "[::]" ]; }; then
  echo "⚠️ Port 3000 is published on every address of this server ($PUBLISH). Unless the reverse proxy"
  echo "   is on another machine, set FE_PUBLISH=127.0.0.1:3000 in $DEPLOY_DIR/.env (and check the firewall)."
fi

# docker image prune only removes untagged images, and every deploy leaves a tagged one behind.
# Keep the newest KEEP_IMAGES versions, and always the one now running and the rollback target.
echo "Removing old images, keeping the newest $KEEP_IMAGES..."
docker image ls "$IMAGE_REPO" --format '{{.Tag}}' |
  { grep -E "^${TAG_PREFIX}[0-9]+\.[0-9]+\.[0-9]+$" || true; } |
  sort -V -r |
  tail -n +"$((KEEP_IMAGES + 1))" |
  while read -r tag; do
    if [ "$tag" = "$NEW_TAG" ] || [ "$tag" = "$CURRENT_TAG" ]; then
      continue
    fi
    docker image rm "$IMAGE_REPO:$tag" >/dev/null || echo "Could not remove $tag (still in use?)"
  done
docker image prune -f

echo "Deployment of $NEW_TAG succeeded 🚀"
