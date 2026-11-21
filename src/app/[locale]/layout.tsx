import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import '@/app/globals.css'
import { Navbar } from '@/features/navbar/Navbar'
import { Footer } from '@/features/footer/Footer'
// @wrksz/themes/next: script anti-flash disuntik via useServerInsertedHTML — tanpa warning
// "Encountered a script tag" dari React 19 (next-themes merender <script> di komponen)
import { ThemeProvider } from '@wrksz/themes/next'
import QueryProvider from '@/providers/QueryProvider'
import { fontDisplay, fontSans } from '@/styles/fonts'

import { Toaster } from '@/components/ui/sonner'
import GameBackdrop from '@/components/game-backdrop/GameBackdrop'
import ProgressBar from '@/components/ProgressBar'
import WhatsAppButton from '@/components/WhatsAppButton'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import CryptoProvider from '@/providers/CryptoProvider'
import PublicEnvProvider from '@/providers/PublicEnvProvider'
import { getPublicEnv } from '@/config/runtimeEnv'
import { AuthDialogProvider } from '@/features/auth/components/AuthDialogProvider'
import MaintenancePage from '@/features/maintenance/MaintenancePage'
import MaintenanceWatcher from '@/features/maintenance/MaintenanceWatcher'
import { getActiveMaintenance } from '@/features/maintenance/lib/maintenance'
import { isMaintenanceExempt, PATHNAME_HEADER } from '@/features/maintenance/lib/exempt'
import { headers } from 'next/headers'
import AnnouncementCenter from '@/features/announcements/AnnouncementCenter'
import { getActiveAnnouncements } from '@/features/announcements/lib/announcements'

export const metadata = {
  title: 'Pakar Gaming - Ahlinya Top Up Game Murah, Instan & Terpercaya',
  description:
    'Website top up game yang terpercaya, cepat, aman, dan didukung layanan CS 24 jam yang siap membantu kapan saja.',
  icons: {
    icon: '/logo.png',
  },
  verification: {
    google: 'h27BvVEjm8BhnYDrPzmkkkg6wwVrsNVpKxtazmr06HQ',
  },
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  // Pengumuman & maintenance sama-sama dari cache memori server (paling lama menunggu ~3 detik)
  const [messages, maintenance, announcements, requestHeaders] = await Promise.all([
    getMessages(),
    getActiveMaintenance(),
    getActiveAnnouncements(),
    headers(),
  ])
  // Halaman bayar dan cek transaksi tetap terbuka saat maintenance (lib/exempt.ts)
  const showMaintenance = Boolean(maintenance) && !isMaintenanceExempt(requestHeaders.get(PATHNAME_HEADER))

  return (
    <html
      lang={locale}
      className={`${fontSans.variable} ${fontDisplay.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground" suppressHydrationWarning>
        {/* Latar item game melayang — di luar provider karena murni dekoratif (server component) */}
        <GameBackdrop />
        {/*
          BUKAN kontrol keamanan: kunci "enkripsi" body request ini sengaja dikirim ke browser, jadi siapa pun
          bisa membaca/membuat payload-nya, dan proxy tetap menerima body polos. Kerahasiaan datang dari HTTPS;
          validasi & otorisasi tetap di backend. Jangan menaruh rahasia apa pun di ENCRYPT_SECRET_KEY.
        */}
        <CryptoProvider secretKey={process.env.ENCRYPT_SECRET_KEY || ""} />
        {/* Site key Turnstile, id GA, logo, base URL backend: dibaca dari .env server per request (runtimeEnv.ts) */}
        <PublicEnvProvider value={getPublicEnv()}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              <MaintenanceWatcher active={Boolean(maintenance)} showing={showMaintenance} />
              {showMaintenance && maintenance ? (
                <MaintenancePage schedule={maintenance} />
              ) : (
                <AuthDialogProvider>
                  <div className="min-h-screen">
                    <ProgressBar />
                    {/* Bar pengumuman di alur normal di atas navbar sticky: ikut tergulir, navbar tetap menempel di top-0 */}
                    <AnnouncementCenter initial={announcements} />
                    <Navbar />
                    <main>
                      {children}
                      <Toaster />
                    </main>
                    <Footer />

                    <WhatsAppButton />
                    {/* Id halaman bayar & param kredensial disamarkan sebelum dikirim ke GA (lihat komponennya) */}
                    <GoogleAnalytics />
                  </div>
                </AuthDialogProvider>
              )}
            </NextIntlClientProvider>
          </ThemeProvider>
        </QueryProvider>
        </PublicEnvProvider>
      </body>
    </html>
  )
}
