import { GameDetail } from "../../../types/Game";

const features = [
  {
    icon: "/icons/speedometer.gif",
    label: "Proses Cepat",
  },
  {
    icon: "/icons/support.gif",
    label: "Layanan 24/7",
  },
  {
    icon: "/icons/shield.gif",
    label: "Pembayaran Aman",
  },
];

interface GameTransactionProps {
  game: GameDetail;
}

export default function BannerGameTransaction({ game }: GameTransactionProps) {
  return (
    <div className="w-full flex flex-col justify-center items-center border-b border-purple-500/30 dark:border-purple-500/20 ">
      {/* COVER */}
      <div className="relative w-full aspect-[2560/720] overflow-hidden">
        <img
          src={
            game.banner_url ||
            "https://images.unsplash.com/photo-1542751371-adc38448a05e"
          }
          alt="cover"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative px-4 sm:px-6 pb-8 xl:max-w-[1500px] mx-auto w-full">
        {/* Thumbnail */}
        <div
          className="
  absolute
  -top-14
  sm:-top-16
  md:-top-20
  lg:-top-24
  xl:-top-28
  2xl:-top-32
  left-4 sm:left-6 md:left-10 lg:left-16 xl:left-20
  z-30
"
        >
          <div
            className="
 group
w-[120px] h-[120px]
sm:w-[140px] sm:h-[140px]
md:w-[160px] md:h-[160px]
lg:w-[180px] lg:h-[180px]
xl:w-[200px] xl:h-[200px]
2xl:w-[220px] 2xl:h-[220px]
    rounded-lg overflow-hidden
    shadow-xl 
    transition-all duration-300 ease-out
    hover:-translate-y-2 hover:scale-105
    hover:shadow-[0_25px_60px_rgba(124,58,237,0.45)]
  "
          >
            <img
              src={game.thumbnail_url}
              alt="game"
              className="
      w-full h-full object-cover
      transition-transform duration-500 ease-out
      group-hover:scale-110 group-hover:rotate-1
    "
            />
          </div>
        </div>

        {/* TITLE */}
        <div className="pt-5 pl-35 sm:pl-40 sm:mb-5 md:pl-71 xl:pl-75">
          <h1 className="text-sm sm:text-xl font-bold">{game.name}</h1>
        </div>

        {/* FEATURES */}
        <div className="mt-10 sm:mt-3 sm:mr-7.5 md:ml-63 lg:w-100 xl:ml-72 lg:ml-68 ">
          <div className="flex flex-row justify-between sm:justify-center sm:gap-3 items-center text-xs sm:text-sm text-gray-600 font-medium ">
            {features.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-1 sm:mb-2 text-gray-700 dark:text-gray-200 "
              >
                <img src={item.icon} alt={item.label} className="w-5 h-5" />
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
