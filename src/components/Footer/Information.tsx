import Link from 'next/link'

export default function Information() {
  return (
    <div className="max-w-sm">
      <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-5">Informasi</h3>

      <Link
        href="/en/term-and-condition"
        target='_blank'
        className="block text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 text-sm font-medium"
      >
        Syarat & Ketentuan
      </Link>
    </div>
  )
}
