import { FaInstagram, FaWhatsapp } from 'react-icons/fa'

export default function SocialMediaComponent() {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-semibold tracking-wide text-gray-600 dark:text-gray-400 uppercase">
        Ikuti Kami
      </p>

      <div className="flex items-center gap-4">
        <a
          href="https://www.instagram.com/pakargaming.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 hover:opacity-80 hover:scale-110 transition-all duration-200"
        >
          <FaInstagram className="w-6 h-6" />
        </a>

        <a
          href="https://wa.me/628131793708"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-500 hover:opacity-80 hover:scale-110 transition-all duration-200"
        >
          <FaWhatsapp className="w-6 h-6" />
        </a>
      </div>
    </div>
  )
}
