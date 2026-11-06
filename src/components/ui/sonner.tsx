"use client";

import { CircleCheck, CircleX, Info, LoaderCircle, TriangleAlert, X, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { cn } from "./utils";

type Tone = "success" | "error" | "warning" | "info" | "loading";

const TONE_ICON_CLASS: Record<Tone, string> = {
  success: "bg-success/15 text-success",
  error: "bg-destructive/15 text-destructive",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/15 text-info",
  loading: "bg-primary/15 text-primary",
};

/** Ikon status di kotak chamfer bertint — status tidak hanya lewat warna (rules §7). */
function ToastIcon({ tone, icon: Icon, spin }: { tone: Tone; icon: LucideIcon; spin?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "chamfer flex size-8 items-center justify-center [--chamfer:6px]",
        TONE_ICON_CLASS[tone],
      )}
    >
      <Icon className={cn("size-4", spin && "animate-spin motion-reduce:animate-none")} />
    </span>
  );
}

/**
 * Toast "HUD": kartu bg-popover + bar aksen warna status di kiri + ikon chamfer.
 * API tetap `toast.success()` / `toast.error()` dari "sonner".
 *
 * Sonner menyuntik CSS-nya tanpa @layer, jadi selalu menang lawan utility Tailwind.
 * Karena itu toast dibuat `unstyled` dan semua tampilan lewat `classNames`. `theme` dikunci "light"
 * karena tema "dark" Sonner punya aturan warna (close button, description) yang tidak ikut dimatikan
 * oleh `unstyled` — warna light/dark tetap ikut token kita.
 */
const Toaster = (props: ToasterProps) => {
  const t = useTranslations("Common");

  return (
    <Sonner
      theme="light"
      position="top-center"
      expand
      closeButton
      // Di bawah navbar sticky: md:h-16 (64px) / h-14 (56px) + jarak 12px
      offset={{ top: 76 }}
      mobileOffset={{ top: "calc(68px + env(safe-area-inset-top, 0px))" }}
      containerAriaLabel={t("notifications")}
      style={{ zIndex: 120 }}
      icons={{
        success: <ToastIcon tone="success" icon={CircleCheck} />,
        error: <ToastIcon tone="error" icon={CircleX} />,
        warning: <ToastIcon tone="warning" icon={TriangleAlert} />,
        info: <ToastIcon tone="info" icon={Info} />,
        loading: <ToastIcon tone="loading" icon={LoaderCircle} spin />,
        close: <X className="size-4" aria-hidden="true" />,
      }}
      toastOptions={{
        unstyled: true,
        closeButtonAriaLabel: t("closeNotification"),
        classNames: {
          toast:
            "toast-accent flex w-(--width) items-center gap-3 rounded-xl border border-border bg-popover py-3 pr-2 pl-4 font-sans text-popover-foreground shadow-lg",
          // Sonner memasang `classNames.default` ke SEMUA toast, jadi default/loading cukup pakai
          // fallback --primary di utility toast-accent (theme.css)
          success: "[--toast-accent:var(--success)]",
          error: "[--toast-accent:var(--destructive)]",
          warning: "[--toast-accent:var(--warning)]",
          info: "[--toast-accent:var(--info)]",
          icon: "flex shrink-0",
          content: "flex min-w-0 flex-1 flex-col gap-0.5",
          title: "text-sm leading-snug font-semibold",
          description: "text-sm leading-snug text-muted-foreground",
          closeButton:
            "order-last flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          actionButton:
            "shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
          cancelButton:
            "shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
