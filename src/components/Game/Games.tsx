"use client";

import { Link } from "../../i18n/routing";
import { Search, Filter, SlidersHorizontal, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useGetGames } from "../../hooks/useGame";
import { useGetCategory } from "../../hooks/useCategory";
import { GameCardSkeleton } from "../GameCardSkeleton";

export function Games() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState("featured");
  const t = useTranslations("Games");

  // Data Games
  const {
    data: dataGames,
    isLoading: isLoadingGame,
    isError: isErrorGames,
    refetch: refetchGames,
  } = useGetGames();

  // Data Category
  const {
    data: dataCategory,
    isLoading: isLoadingCategory,
    isError: isErrorCategories,
    refetch: refetchCategories,
  } = useGetCategory();
  const filteredGames = useMemo(() => {
    if (!dataGames?.data) return [];

    return dataGames.data.filter((game) => {
      const matchesSearch = game.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || game.category.slug === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [dataGames, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    if (!dataCategory?.data) return [];

    return [
      { label: t("allCategories"), slug: "all" },
      ...dataCategory.data.map((cat) => ({
        label: cat.name,
        slug: cat.slug,
      })),
    ];
  }, [dataCategory, t]);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto mb-12 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-600">
            {t("title")}
          </h1>
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-purple-600 dark:group-focus-within:text-purple-500 transition-colors" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 dark:bg-black/40 border border-purple-200 dark:border-purple-500/20 rounded-full py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-all placeholder-gray-500"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-purple-200 dark:border-purple-500/10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            <Filter className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />

            {isLoadingCategory ? (
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-9 w-32 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse"
                  />
                ))}
              </div>
            ) : isErrorCategories ? (
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-red-50 dark:bg-red-500/10 text-sm">
                <span className="text-red-600 dark:text-red-400 font-medium">
                  Failed To Fetch Categories
                </span>

                <button
                  onClick={() => refetchCategories()}
                  className="inline-flex items-center gap-1 cursor-pointer text-purple-600 dark:text-purple-400 hover:underline font-medium">
                  Retry
                </button>
              </div>
            ) : categories.length === 0 ? (
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 dark:bg-white/5 text-sm text-gray-500 dark:text-gray-400">
                Categories not Available
              </div>
            ) : (
              categories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm ${
                    selectedCategory === category.slug
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5"
                  }`}>
                  {category.label}
                </button>
              ))
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <SlidersHorizontal className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-100 dark:bg-black/40 border border-purple-200 dark:border-purple-500/20 rounded-lg py-2 px-4 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 text-sm w-full md:w-auto cursor-pointer hover:bg-gray-200 dark:hover:bg-black/60 transition-colors">
              <option value="featured">{t("sortBy")}</option>
              <option value="price-asc">{t("priceAsc")}</option>
              <option value="price-desc">{t("priceDesc")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoadingGame ? (
          <GameCardSkeleton count={8} />
        ) : isErrorGames ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/10 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M5.455 19h13.09c1.14 0 1.845-1.243 1.255-2.197L13.8 4.803c-.57-.964-1.83-.964-2.4 0L4.2 16.803C3.61 17.757 4.315 19 5.455 19z"
                />
              </svg>
            </div>

            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Failed to load games
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
              Something went wrong while fetching the games. Please try again.
            </p>

            <button
              onClick={() => refetchGames()}
              className="mt-4 inline-flex items-center cursor-pointer gap-2 px-5 py-2 rounded-full text-sm font-medium
               bg-purple-600 text-white hover:bg-purple-700
               shadow-lg shadow-purple-500/30 transition-all">
              Retry
            </button>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className=" col-span-full flex flex-col items-center justify-center py-16 text-center">
            Game not Available
          </div>
        ) : (
          filteredGames?.map((game, index) => (
            <Link
              href={`/games/${game.slug}`}
              key={game.id}
              className="group relative bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-white/5 hover:border-purple-400 dark:hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20"
              style={{
                animationDelay: `${index * 50}ms`,
              }}>
              <div className="aspect-[16/9] overflow-hidden relative">
                {game.thumbnail_url ? (
                  <Image
                    fill
                    src={game.thumbnail_url}
                    alt={game.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-purple-600 dark:text-purple-400 text-xs font-medium bg-purple-100 dark:bg-purple-500/10 px-2 py-1 rounded">
                    {game.category?.name}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {game.name}
                </h3>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
