'use client'

import React from 'react'
import { ArrowRight, BookOpen, Clock, Sparkles, Tag } from 'lucide-react'
import { useGetPublicBlogs } from '@/hooks/useBlog'

// Fallback data artikel jika API belum memiliki artikel terpublikasi
const FALLBACK_ARTICLES = [
  {
    id: 'build-granger-tersakit-2026',
    title: 'Build Granger Tersakit 2026: Sekali Combos Hero Core Langsung Rata!',
    excerpt:
      'Panduan lengkap item emblem dan susunan item terbaik untuk memaksimalkan damage burst Granger di patch terbaru.',
    category: 'MLBB Guide',
    categoryColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    readTime: '3 min read',
    date: '23 Jul 2026',
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    url: 'http://localhost:3001/news/build-granger-tersakit-2026',
  },
  {
    id: 'bisa-dapat-skin-free-fire-gratis',
    title: 'Event Terbaru Free Fire: Klaim Bundle & Skin Senjata Eksklusif Pekan Ini',
    excerpt:
      'Jangan lewatkan misi harian terbatas untuk mendapatkan skin incubator gratis dan bonus voucher diamond.',
    category: 'Event & Promo',
    categoryColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    readTime: '4 min read',
    date: '22 Jul 2026',
    image:
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop',
    url: 'http://localhost:3001/news/event-terbaru-free-fire',
  },
  {
    id: 'banner-genshin-impact-5-x',
    title: 'Bocoran Banner Genshin Impact 5.x: Karakter Bintang 5 & Weapon Terbaru',
    excerpt:
      'Rincian bocoran banner phase 1 dan phase 2 beserta persiapan Primogems yang kamu butuhkan.',
    category: 'Gaming News',
    categoryColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    readTime: '5 min read',
    date: '20 Jul 2026',
    image:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
    url: 'http://localhost:3001/news/banner-genshin-impact-5-x',
  },
]

export default function BlogSection() {
  const BLOG_BASE_URL = process.env.NEXT_PUBLIC_BLOG_URL || 'http://localhost:3001'
  const { data: blogResponse, isLoading } = useGetPublicBlogs(1, 3)

  const articles =
    blogResponse?.data && blogResponse.data.length > 0
      ? blogResponse.data.map((item) => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt || 'Baca artikel selengkapnya di Blog Pakargaming.',
          category: item.category || 'Gaming News',
          categoryColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
          readTime: item.read_time || '3 min read',
          date: item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Terbaru',
          image: item.cover_image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
          url: `${BLOG_BASE_URL}/news/${item.id}`,
        }))
      : FALLBACK_ARTICLES

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 py-12 md:py-16">
      {/* Background Decorative Glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand/5 blur-[120px] rounded-full" />
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kabar & Guide Gaming</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            Berita & Tips Gaming Terbaru
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            Simak rekomendasi build hero, bocoran event, hingga update patch game kesayanganmu.
          </p>
        </div>

        <a
          href={BLOG_BASE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 self-start sm:self-auto text-sm font-semibold text-brand hover:text-brand-2 transition-colors duration-200 group"
        >
          <span>Lihat Semua Artikel</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </a>
      </div>

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <article
            key={article.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md transition-all duration-300 hover:border-brand/50 hover:shadow-xl hover:shadow-brand/10 hover:-translate-y-1"
          >
            {/* Image Thumbnail */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
              <img
                src={article.image}
                alt={article.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border backdrop-blur-md ${article.categoryColor}`}
                >
                  <Tag className="w-3 h-3" />
                  {article.category}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex flex-1 flex-col justify-between p-5">
              <div className="space-y-2">
                {/* Meta info */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                  <span>•</span>
                  <span>{article.date}</span>
                </div>

                {/* Article Title */}
                <h3 className="text-base font-bold text-foreground line-clamp-2 transition-colors duration-200 group-hover:text-brand">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus:outline-none"
                  >
                    {article.title}
                  </a>
                </h3>

                {/* Article Excerpt */}
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              {/* Action Footer */}
              <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs font-medium text-brand group-hover:underline inline-flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  Baca Selengkapnya
                </span>
                <div className="h-7 w-7 rounded-full bg-brand/10 text-brand flex items-center justify-center transition-all duration-200 group-hover:bg-brand group-hover:text-brand-foreground">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
