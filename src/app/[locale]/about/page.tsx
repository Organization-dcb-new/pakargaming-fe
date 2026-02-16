import Image from 'next/image'

export default function AboutPage() {
  const popularGames = [
    'Mobile Legends',
    'PUBG Mobile',
    'Free Fire',
    'Genshin Impact',
    'Steam Wallet',
    'Google Play',
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-gray-800 dark:text-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">
        {/* --- HERO SECTION --- */}
        <section className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-bold tracking-wide uppercase">
              Tentang Kami
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Pakargaming <span className="text-purple-600">:</span> Platform Top Up Game
            </h1>
            <p className="text-lg leading-relaxed opacity-90">
              <span className="font-bold text-purple-600">pakargaming.id</span> adalah platform
              digital yang ahlinya menyediakan layanan top up game, voucher, dan berbagai produk
              hiburan digital dengan proses yang{' '}
              <span className="text-gray-900 dark:text-white font-semibold">
                cepat, aman, dan praktis
              </span>
              .
            </p>
            <p className="text-lg leading-relaxed opacity-90">
              Dikelola oleh{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                Aura Pakar Inovasi
              </span>
              , kami berfokus pada pengembangan solusi digital untuk kebutuhan komunitas gaming
              modern.
            </p>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative group w-full max-w-[400px]">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <Image
                src="/logo.png"
                alt="Logo PakarGaming"
                width={400}
                height={400}
                priority
                className="relative rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 object-cover"
              />
            </div>
          </div>
        </section>

        {/* --- VALUE PROPOSITION --- */}
        <section className="flex flex-col gap-8 bg-gray-50 dark:bg-zinc-900/50 p-8 md:p-12 rounded-3xl border border-gray-100 dark:border-zinc-800">
          {/* Bagian Teks (Atas) */}
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-2xl text-center font-bold text-gray-900 dark:text-white">
              Kenapa Memilih Kami?
            </h2>
            <p className="leading-relaxed text-center">
              Kami hadir untuk mempermudah para gamer dalam melakukan transaksi tanpa proses yang
              rumit. Dengan dukungan <span className="font-bold">10+ mitra pembayaran</span> yang
              tersebar di berbagai wilayah Asia, pengguna dapat menikmati metode pembayaran yang
              fleksibel.
            </p>
            <p className="leading-relaxed font-medium text-purple-600 dark:text-purple-400 text-center">
              Berkomitmen menghadirkan layanan yang stabil, terpercaya, serta pengalaman transaksi
              yang nyaman.
            </p>
          </div>

          {/* Bagian Gambar (Bawah) */}
          <div className="flex justify-center">
            <img
              src="https://s3.nevaobjects.id/image-dev/uploads/20260216102608.png"
              alt="banner-payment-method"
              className="w-full max-w-2xl h-auto object-contain rounded-2xl"
            />
          </div>
        </section>
        {/* --- GAME PREVIEW --- */}
        <section className="text-center space-y-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Katalog Produk</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Tersedia berbagai macam game favorit dan voucher digital dengan harga bersaing.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {popularGames.map((game) => (
              <div key={game} className="group space-y-3">
                <div className="aspect-square bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl font-black text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-purple-500/20 group-hover:-translate-y-1">
                  {game[0]}
                </div>
                <p className="text-sm font-bold opacity-80 group-hover:opacity-100">{game}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
