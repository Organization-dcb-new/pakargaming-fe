import { Metadata } from "next";
import GameTransaction from "../../../../components/GameTransaction/GameTransaction";
import { GetGameResponse } from "../../../../types/Game";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/games/slug/${slug}`,
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
  return <GameTransaction />;
}
