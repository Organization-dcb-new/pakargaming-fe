'use client'

export default function GlobalWhatsAppButton() {
  const phoneNumber = '628131793708' // ganti nomor CS (pakai format 62 tanpa +)
  const message = 'Halo CS Pakargaming, saya butuh bantuan.'

  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        fixed right-6 z-50
        flex items-center gap-3
        bg-green-500 hover:bg-green-600
        text-white
        px-5 py-3
        rounded-full
        shadow-xl
        transition-all duration-300
        hover:scale-105
        bottom-[calc(4rem+env(safe-area-inset-bottom))]
      `}
    >
      {/* WhatsApp Icon */}
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.52 3.48A11.91 11.91 0 0012.05 0C5.41 0 .02 5.39.02 12.05c0 2.13.56 4.22 1.63 6.06L0 24l6.06-1.6a11.97 11.97 0 005.99 1.53h.01c6.64 0 12.03-5.39 12.03-12.05 0-3.21-1.25-6.23-3.57-8.45zM12.05 21.9h-.01a9.88 9.88 0 01-5.03-1.38l-.36-.21-3.6.95.96-3.51-.23-.36a9.85 9.85 0 01-1.52-5.34c0-5.45 4.44-9.89 9.9-9.89a9.9 9.9 0 019.89 9.9c0 5.45-4.44 9.89-9.9 9.89zm5.45-7.36c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.17c-.17.2-.35.22-.65.07-.3-.15-1.28-.47-2.44-1.5-.9-.8-1.51-1.8-1.69-2.1-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.23-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37s-1.05 1.03-1.05 2.5 1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.1 4.48.71.3 1.27.48 1.7.62.71.22 1.36.19 1.87.11.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
      </svg>

      <span className="text-sm font-medium hidden sm:inline"> Chat CS</span>
    </a>
  )
}
