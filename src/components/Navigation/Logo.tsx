import Link from 'next/link'

export default function LogoNavigation() {
  return (
    <Link href="/">
      <div className="w-full lg:mr-2 ">
        <img
          src="https://s3.nevaobjects.id/image-dev/uploads/20260121141804.png"
          alt="Logo"
          className="object-contain w-32 sm:w-36 md:w-40  "
        />
      </div>
    </Link>
  )
}
