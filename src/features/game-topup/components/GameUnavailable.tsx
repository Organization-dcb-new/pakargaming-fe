"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { STATE_GLYPH, StateGlyph } from "@/components/ui/state-glyph";
import { HudPanel } from "@/components/ui/hud-panel";

interface GameUnavailableProps {
  /** `not-found`: slug tidak ada / gagal dimuat (empty state, rules §6). `maintenance`: game sedang dirawat. */
  reason: "not-found" | "maintenance";
  gameName?: string;
}

/** Kartu pengganti halaman top-up saat game tidak bisa dibeli, dengan tombol kembali ke beranda. */
export default function GameUnavailable({ reason, gameName }: GameUnavailableProps) {
  const t = useTranslations("GameCheckout");
  const maintenance = reason === "maintenance";

  const title = maintenance
    ? gameName
      ? t("maintenanceTitleWithName", { name: gameName })
      : t("maintenanceTitleGeneric")
    : t("gameNotFoundTitle");

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center py-10">
      <HudPanel
        accent={maintenance}
        borderClassName={maintenance ? "bg-warning/50" : "bg-border"}
        className="w-full max-w-xl"
        innerClassName="p-6 text-center sm:p-8"
      >
        <StateGlyph
          glyph={maintenance ? STATE_GLYPH.maintenance : STATE_GLYPH.notFound}
          tone={maintenance ? "warning" : "muted"}
          className="mb-4"
        />

        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{title}</h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          {maintenance ? t("maintenanceDescription") : t("gameNotFoundDesc")}
        </p>

        <div className="mt-6 flex items-center justify-center">
          <Link
            href="/"
            className="chamfer inline-flex h-11 items-center rounded-sm bg-primary px-6 text-sm font-bold text-primary-foreground transition-colors duration-200 hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card motion-reduce:transition-none"
          >
            {t("maintenanceBackHome")}
          </Link>
        </div>
      </HudPanel>
    </div>
  );
}
