import Link from 'next/link'

export default function Information() {
  return (
    <div className="max-w-sm flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
        Informasi
      </h3>

      <div className="flex flex-col gap-2">
        <Link
          href="/en/about"
          className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 hover:translate-x-1"
        >
          Tentang Kami
        </Link>

        <Link
          href="/en/term-and-condition"
          className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 hover:translate-x-1"
        >
          Syarat & Ketentuan
        </Link>

        <Link
          href="/en/policy-and-privacy"
          className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 hover:translate-x-1"
        >
          Kebijakan dan Privasi
        </Link>

        <Link
          href="/en/check-transaction"
          className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 hover:translate-x-1"
        >
          Cek Transaksi
        </Link>
      </div>
    </div>
  )
}
