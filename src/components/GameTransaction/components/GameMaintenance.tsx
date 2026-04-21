import Link from "next/link";
import { ShieldAlert } from "lucide-react";

interface GameMaintenanceProps {
  gameName?: string;
}

export default function GameMaintenance({ gameName }: GameMaintenanceProps) {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-purple-500/30 bg-black/5 p-6 text-center shadow-xl dark:bg-white/10 sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-md">
          <ShieldAlert className="h-7 w-7" />
        </div>

        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          {gameName ? `${gameName} Sedang Maintenance` : "Game Sedang Maintenance"}
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
          Top up untuk game ini sementara tidak tersedia. Silakan coba lagi beberapa saat
          ke depan.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-purple-500/30"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
