import { Metadata } from "next";
import GameTopUp from "@/features/game-topup/GameTopUp";
import { GetGameResponse } from "@/types/game";
import { isGameSlug } from "@/lib/backendIds";
import { getApiBaseUrl } from "@/config/runtimeEnv";

const DEFAULT_METADATA: Metadata = {
  title: "Pakar Gaming - Top Up Game Murah & Instan",
  description: "Top up game murah, cepat dan aman.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  // Fetch ini jalan di server FE (dipercaya backend). Slug dari URL dicek dulu lalu di-encode:
  // tanpa itu `..`/`%2F` bisa membelokkan request server ke path backend lain.
  if (!isGameSlug(slug)) return DEFAULT_METADATA;

  try {
    const res = await fetch(
      `${getApiBaseUrl()}/v1/games/slug/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return {
        title: "Pakar Gaming - Top Up Game Murah & Instan",
        description: "Top up game murah, cepat dan aman.",
      };
    }

    const data: GetGameResponse = await res.json();
    const gameName = data?.data?.name;

    if (!gameName) {
      return {
        title: "Pakar Gaming - Top Up Game Murah & Instan",
        description: "Top up game murah, cepat dan aman.",
      };
    }

    return {
      title: `Top Up ${gameName} Murah & Instan 24 Jam | Pakar Gaming`,
      description: `Top up ${gameName} murah, cepat dan aman. Proses 1 menit, support QRIS, Dana, OVO.`,
      alternates: {
        canonical: `https://pakargaming.id/${locale}/games/${slug}`,
      },
    };
  } catch (error) {
    return {
      title: "Pakar Gaming - Top Up Game Murah & Instan",
      description: "Top up game murah, cepat dan aman.",
    };
  }
}

export default function GamePage() {
  return <GameTopUp />;
}
