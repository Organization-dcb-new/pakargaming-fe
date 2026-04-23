import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("About");

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-gray-800 dark:text-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">
        <section className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-bold tracking-wide uppercase">
              {t("badge")}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {t("title")}
            </h1>
            <p className="text-lg leading-relaxed opacity-90">{t("intro1")}</p>
            <p className="text-lg leading-relaxed opacity-90">{t("intro2")}</p>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative group w-full max-w-[400px]">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <Image
                src="/logo.png"
                alt={t("altLogo")}
                width={400}
                height={400}
                priority
                unoptimized={true}
                className="relative rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 object-cover"
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-8 bg-gray-50 dark:bg-zinc-900/50 p-8 md:p-12 rounded-3xl border border-gray-100 dark:border-zinc-800">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-2xl text-center font-bold text-gray-900 dark:text-white">
              {t("whyTitle")}
            </h2>
            <p className="leading-relaxed text-center">{t("whyP1")}</p>
            <p className="leading-relaxed font-medium text-purple-600 dark:text-purple-400 text-center">
              {t("whyP2")}
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src="https://s3.nevaobjects.id/image-dev/uploads/20260216102608.png"
              alt={t("altReviewBanner")}
              className="w-full max-w-2xl h-auto object-contain rounded-2xl"
            />
          </div>
        </section>

        <section className="text-center space-y-8  bg-gray-50 dark:bg-zinc-900/50  p-8 md:p-12  rounded-3xl  border border-gray-100 dark:border-zinc-800">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t("catalogTitle")}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t("catalogDesc")}</p>
          </div>

          <div className="flex justify-center px-4 ">
            <img
              src="https://s3.nevaobjects.id/image-dev/uploads/20260216104127.png"
              alt={t("altCatalog")}
              className="w-full max-w-3xl h-auto rounded-3xl shadow-lg border border-gray-100 dark:border-zinc-800 object-contain"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
