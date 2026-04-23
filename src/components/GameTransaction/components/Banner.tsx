"use client";

import { GameDetail } from "../../../types/Game";
import { Gauge, Headset, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

const COVER_BANNER_WIDTH = 1600;
const COVER_BANNER_HEIGHT = 400;

interface GameTransactionProps {
  game: GameDetail;
}

export default function BannerGameTransaction({ game }: GameTransactionProps) {
  const t = useTranslations("GameCheckout");
  const features = [
    { icon: Gauge, label: t("bannerFeature1") },
    { icon: Headset, label: t("bannerFeature2") },
    { icon: ShieldCheck, label: t("bannerFeature3") },
  ];

  return (
    <div className="w-full flex flex-col justify-center items-center border-b border-purple-500/30 dark:border-purple-500/20 ">
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: `${COVER_BANNER_WIDTH} / ${COVER_BANNER_HEIGHT}`,
        }}
      >
        <img
          src={
            game.banner_url ||
            "https://images.unsplash.com/photo-1542751371-adc38448a05e"
          }
          alt={`${game.name}`}
          className="h-full w-full object-cover"
          decoding="async"
          fetchPriority="high"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent dark:from-black/45"
          aria-hidden
        />
      </div>

      <div className="relative px-4 sm:px-6 pb-8 xl:max-w-[1500px] mx-auto w-full">
        <div className="absolute left-4 z-30 -top-14 sm:left-6 sm:-top-16 md:left-10 md:-top-20 lg:left-16 lg:-top-24 xl:left-20 xl:-top-28 2xl:-top-32">
          <div className="group relative h-[120px] w-[120px] overflow-hidden rounded-xl shadow-xl ring-1 ring-black/10 transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_25px_60px_rgba(124,58,237,0.45)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 dark:ring-white/15 sm:h-[140px] sm:w-[140px] md:h-[160px] md:w-[160px] lg:h-[180px] lg:w-[180px] xl:h-[200px] xl:w-[200px] 2xl:h-[220px] 2xl:w-[220px]">
            {game.thumbnail_url ? (
              <img
                src={game.thumbnail_url}
                alt={game.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0"
                decoding="async"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                role="img"
                aria-label={game.name}
              />
            )}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 opacity-80 transition-opacity duration-500 group-hover:opacity-100 dark:from-black/35"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/25 opacity-0 blur-md transition-all duration-700 group-hover:left-[130%] group-hover:opacity-70 dark:bg-white/20"
              aria-hidden
            />
          </div>
        </div>

        <div className="pt-5 pl-35 sm:pl-40 sm:mb-5 md:pl-71 xl:pl-75">
          <h1 className="text-balance text-base font-bold tracking-tight text-gray-900 sm:text-xl dark:text-white">
            {game.name}
          </h1>
        </div>

        <div className="mt-10 sm:mt-3 sm:mr-7.5 md:ml-63 lg:w-100 xl:ml-72 lg:ml-68 ">
          <div className="flex flex-row justify-between sm:justify-center sm:gap-3 items-center text-xs sm:text-sm text-gray-600 font-medium ">
            {features.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-1 sm:mb-2 text-gray-700 dark:text-gray-200 "
              >
                <item.icon
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-purple-600 dark:text-purple-300 sm:h-5 sm:w-5"
                  strokeWidth={2}
                />
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
