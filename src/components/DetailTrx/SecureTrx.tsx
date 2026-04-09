import Image from 'next/image'
import { Info } from 'lucide-react'

export default function SecurityCard() {
  return (
    <div className=" max-w-md mx-auto px-4">
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        {/* Icon */}
        <div className="flex-shrink-0">
          <Image
            src="https://s3.nevaobjects.id/image-dev/uploads/20260120142828.webp"
            alt="Garansi Aman"
            width={48}
            height={48}
            unoptimized={true}
            className="object-contain"
          />
        </div>

        {/* Text */}
        <p className="flex-1 text-xs sm:text-sm text-gray-800 leading-snug">
          <span className="block">Transaksi ini dijamin aman</span>
          <span className="block">dan garansi uang kembali 10x lipat</span>
        </p>

        {/* Button */}
        <button
          className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
          aria-label="Info">
          <Info size={14} />
        </button>
      </div>
    </div>
  );
}
