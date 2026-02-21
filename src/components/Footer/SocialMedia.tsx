import { FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function SocialMediaComponent() {
  return (
    <div className="flex items-center gap-3">
      <p>Ikuti kami</p>
      <a
        href="https://www.instagram.com/pakargaming.id/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 hover:bg-purple-500 hover:text-white transition-all duration-300"
      >
        <FaInstagram className="w-5 h-5" />
      </a>

      <a
        href="https://wa.me/628131793708"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white transition-all duration-300"
      >
        <FaWhatsapp className="w-5 h-5" />
      </a>
    </div>
  )
}
