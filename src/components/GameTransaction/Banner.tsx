import { GamDetail } from '../../types/Game'

const features = [
  {
    icon: '/icons/lightning.gif',
    label: 'Proses Cepat',
  },
  {
    icon: '/icons/contact-support.gif',
    label: 'Layanan 24/7',
  },
  {
    icon: '/icons/secure.gif',
    label: 'Pembayaran Aman',
  },
]

interface GameTransactionProps {
  game: GamDetail
}

export default function BannerGameTransaction({ game }: GameTransactionProps) {
  return (
    <div className="w-full border-b border-purple-500/30 dark:border-purple-500/20 ">
      {/* COVER */}
      <div className="relative h-52 sm:h-60 md:h-80 w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e"
          alt="cover"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative px-4 sm:px-6 pb-8">
        {/* Thumbnail */}
        <div className="absolute -top-14 sm:-top-16 left-4 sm:left-6 z-30">
          <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-lg overflow-hidden shadow-xl">
            <img src={game.thumbnail_url} alt="game" className="h-full w-full object-cover" />
          </div>
        </div>

        {/* TITLE */}
        <div className="pt-3 sm:pt-20 pl-32 sm:pl-44 ">
          <h1 className="text-sm sm:text-xl font-bold">{game.name}</h1>
        </div>

        {/* FEATURES */}
        <div className="mt-10">
          <div className="flex flex-row justify-between  items-center text-xs sm:text-sm text-gray-600 font-medium">
            {features.map((item, i) => (
              <div key={i} className="flex items-center gap-2  text-gray-700 dark:text-gray-200">
                <img src={item.icon} alt={item.label} className="w-5 h-5" />
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
