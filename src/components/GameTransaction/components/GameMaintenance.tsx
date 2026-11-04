"use client";

import { Link } from "../../../i18n/routing";
import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";

interface GameMaintenanceProps {
  gameName?: string;
}

export default function GameMaintenance({ gameName }: GameMaintenanceProps) {
  const t = useTranslations("GameCheckout");

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center py-10">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-warning/40 bg-warning/10 text-warning">
          <ShieldAlert className="h-7 w-7" aria-hidden />
        </div>

        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          {gameName
            ? t("maintenanceTitleWithName", { name: gameName })
            : t("maintenanceTitleGeneric")}
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t("maintenanceDescription")}
        </p>

        <div className="mt-6 flex items-center justify-center">
          <Link
            href="/"
            className="chamfer inline-flex h-11 items-center rounded-sm bg-primary px-6 text-sm font-bold text-primary-foreground transition-colors duration-200 hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card motion-reduce:transition-none"
          >
            {t("maintenanceBackHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
