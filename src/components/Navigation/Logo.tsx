import Link from 'next/link'

export default function LogoNavigation() {
  return (
    <Link href="/">
      <div className="w-full lg:mr-2 flex justify-center lg:justify-start">
        <div className="animate-fadeInUp">
          <img
            src="https://s3.nevaobjects.id/image-dev/uploads/20260121141804.png"
            alt="Logo"
            className="
    object-contain
    w-32 sm:w-36 md:w-40

    animate-floatSoft

    drop-shadow-[0_10px_25px_rgba(0,0,0,0.25)]
    hover:drop-shadow-[0_14px_35px_rgba(139,92,246,0.35)]
    transition-all duration-500
  "
          />
        </div>
      </div>
    </Link>
  )
}
