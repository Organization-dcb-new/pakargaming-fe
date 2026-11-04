import SearchComponent from './Search'

interface MobileSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function MobileSearch({ open, onOpenChange }: MobileSearchProps) {
  return (
    <div className="flex min-w-0 flex-1 justify-end lg:hidden">
      {/* Phone: ikon melebar ke kiri (logo ikut collapse). Tablet: bar penuh, maks. md */}
      <div
        className={[
          'w-full min-w-0 transition-[max-width] duration-300 ease-in-out motion-reduce:transition-none sm:max-w-md',
          open ? 'max-w-full' : 'max-w-12',
        ].join(' ')}
      >
        <SearchComponent variant="mobile" onOpenChange={onOpenChange} />
      </div>
    </div>
  )
}
