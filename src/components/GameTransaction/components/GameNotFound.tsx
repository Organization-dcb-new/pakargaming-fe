"use client";

import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/routing";

/** State kosong saat slug game tidak ditemukan / gagal dimuat (rules §6). */
export default function GameNotFound() {
  const t = useTranslations("GameCheckout");

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center py-10">
      <div className="w-full max-w-xl rounded-2xl border border-dashed border-border bg-card p-6 text-center sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <SearchX className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          {t("gameNotFoundTitle")}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t("gameNotFoundDesc")}
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
