export default function EtcComponent() {
  return (
    <div className="flex flex-row md:flex-row md:items-center md:justify-between gap-11">
      {/* Layanan Pengaduan */}
      <div className="flex flex-col gap-2 text-sm">
        <span className="text-xs text-gray-900 dark:text-white">Layanan Pengaduan Konsumen</span>

        <div className="flex flex-col gap-2 text-xs">
          <a
            href="https://wa.me/628131793708"
            className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
          >
            +62 813-1793-708
          </a>

          <a
            href="mailto:pakargaming1@gmail.com"
            className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
          >
            pakargaming1@gmail.com
          </a>
        </div>
      </div>

      {/* Keamanan dan Privasi */}
      <div className="flex flex-col gap-4">
        <p className="text-xs">Keamanan & Privasi </p>
        <div className="flex flex-row gap-5">
          <img src="/ssl.webp" alt="Secure Payment" className="h-8 object-contain" />
          <img src="/kan.webp" alt="Privacy Protected" className="h-8 object-contain" />
        </div>
      </div>
    </div>
  )
}
