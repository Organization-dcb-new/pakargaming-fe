import { useEffect, useState } from "react";
import { Show } from "../../types/Show";
import { useLocale } from "next-intl";
import { getRibbon } from "../../utils/ribbon";
import Image from "next/image";
import Link from "next/link";

interface ShowSectionProps {
  shows: Show[];
}
export default function ShowSectionGames({ shows }: ShowSectionProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const locale = useLocale();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile(); // initial
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* ===== SHOW SECTIONS ===== */}
      {shows.map((show) => {
        const limit = isMobile ? 3 : 7;
        const isExpanded = expanded[show.ID] ?? false;
        const hasManyGames = show.Games.length > limit;

        const games = isExpanded ? show.Games : show.Games.slice(0, limit);

        const ribbon = getRibbon(show);

        return (
          <div
            key={show.ID}
            id={`show-${show.ID}`}
            className="scroll-mt-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-10 space-y-12"
          >
            {/* HEADER */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                {show.Name}
              </h2>
            </div>

            {/* GAMES GRID */}
            <div
              className="grid grid-cols-3 justify-items-center
 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4"
            >
              {games.map((game) => (
                <Link
                  key={game.ID}
                  href={`/${locale}/games/${game.Slug}`}
                  className="
    group relative
    w-[120px] h-[120px]
    overflow-hidden rounded-2xl
    border border-white/10
    bg-gray-300 dark:bg-zinc-900/40
    transition-all duration-300
    hover:border-purple-500/60
    hover:shadow-lg hover:shadow-purple-500/20
  "
                >
                  <div className="relative w-full h-full overflow-hidden">
                    {/* RIBBON */}
                    {ribbon && (
                      <div
                        className={`
          absolute z-20
          top-2 left-[-40px]
          rotate-[-45deg]
          bg-gradient-to-r ${ribbon.className}
          w-[130px]
          py-1
          text-[8px]
          font-extrabold text-white
          uppercase tracking-wider
          text-center shadow-md
        `}
                      >
                        {ribbon.label}
                      </div>
                    )}

                    {/* IMAGE */}
                    <Image
                      src={
                        game.ThumbnailURL ||
                        "https://api.dicebear.com/9.x/pixel-art/svg"
                      }
                      alt={game.Name}
                      fill
                      priority
                      className="
        object-cover
        transition-transform duration-500
        group-hover:scale-105
      "
                    />

                    {/* TITLE OVERLAY */}
                    <div
                      className="
      absolute bottom-0 left-0 w-full
      bg-gradient-to-t from-black/80 via-black/40 to-transparent
      px-2 py-1
    "
                    >
                      <p
                        className="
        text-[10px]
        font-semibold
        text-white
        text-center
        line-clamp-2
      "
                      >
                        {game.Name}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* TOMBOL TAMPILKAN LEBIH BANYAK */}
            {hasManyGames && (
              <div className="mt-1 flex justify-center">
                <button
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [show.ID]: !isExpanded,
                    }))
                  }
                  className="text-sm cursor-pointer font-medium text-purple-600 dark:text-purple-400 hover:underline"
                >
                  {isExpanded
                    ? "Tampilkan lebih sedikit"
                    : "Tampilkan lebih banyak"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
