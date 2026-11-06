import type { CSSProperties } from 'react'
import { BACKDROP_ITEMS, type BackdropIcon } from './items'

/** Grid 7×6 untuk hati pixel (1 = kotak terisi) */
const HEART_PIXELS = ['0110110', '1111111', '1111111', '0111110', '0011100', '0001000']

const glint = { fill: 'var(--game-glint)' }

/** Simbol item: digambar sekali, dipakai ulang lewat <use>. Semua warna dari palet logo (theme.css). */
function Symbols() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="gb-brand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--logo-purple)' }} />
          <stop offset="1" style={{ stopColor: 'var(--logo-cyan)' }} />
        </linearGradient>
        <linearGradient id="gb-cyan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--game-glint)' }} />
          <stop offset="1" style={{ stopColor: 'var(--logo-cyan)' }} />
        </linearGradient>

        <symbol id="gb-diamond" viewBox="0 0 48 48">
          <path d="M14 5h20l10 12-20 26L4 17z" fill="url(#gb-brand)" />
          <path d="M14 5l4 12h12l4-12z" style={glint} opacity=".35" />
          <path d="M18 17l6 26 6-26z" style={glint} opacity=".18" />
          <path d="M4 17h40" stroke="var(--game-glint)" strokeOpacity=".5" strokeWidth="1.5" />
        </symbol>

        <symbol id="gb-coin" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="19" fill="url(#gb-brand)" />
          <circle cx="24" cy="24" r="14" fill="none" stroke="var(--game-glint)" strokeOpacity=".5" strokeWidth="2.5" />
          <path d="M24 15l7 9-7 9-7-9z" style={glint} opacity=".55" />
          <path d="M12 18a13 13 0 0 1 8-8" fill="none" stroke="var(--game-glint)" strokeOpacity=".7" strokeWidth="2.5" strokeLinecap="round" />
        </symbol>

        <symbol id="gb-gamepad" viewBox="0 0 48 48">
          <path
            d="M14 13h20c6 0 10 5 11 12l1 7c1 5-3 8-7 5l-5-5H14l-5 5c-4 3-8 0-7-5l1-7c1-7 5-12 11-12z"
            fill="url(#gb-brand)"
          />
          <path d="M11 20.5h8v3h-8zM13.5 18h3v8h-3z" style={glint} opacity=".7" />
          <circle cx="32" cy="19.5" r="2" style={glint} opacity=".7" />
          <circle cx="36.5" cy="24" r="2" style={glint} opacity=".7" />
        </symbol>

        <symbol id="gb-sparkle" viewBox="0 0 48 48">
          <path d="M24 2c2 14 8 20 22 22-14 2-20 8-22 22-2-14-8-20-22-22 14-2 20-8 22-22z" fill="url(#gb-cyan)" />
        </symbol>

        <symbol id="gb-potion" viewBox="0 0 48 48">
          <rect x="19" y="4" width="10" height="6" rx="1.5" fill="url(#gb-brand)" />
          <path
            d="M20 10h8v8c7 2.5 12 8.5 12 15.5 0 8-7 12.5-16 12.5S8 41.5 8 33.5C8 26.5 13 20.5 20 18z"
            fill="url(#gb-brand)"
            opacity=".4"
          />
          <path d="M9.5 31c4-2 9 2 14.5 0s10.5-2 14.5 0c.5 7-6 12.5-14.5 12.5S9 38 9.5 31z" fill="url(#gb-brand)" />
          <path d="M14 27c1.5-3.5 3.5-5 6-6" fill="none" stroke="var(--game-glint)" strokeOpacity=".7" strokeWidth="2" strokeLinecap="round" />
          <circle cx="28" cy="36" r="1.75" style={glint} opacity=".6" />
          <circle cx="22" cy="39" r="1.25" style={glint} opacity=".6" />
        </symbol>

        <symbol id="gb-heart" viewBox="0 0 48 48">
          {HEART_PIXELS.flatMap((row, y) =>
            [...row].map((cell, x) =>
              cell === '1' ? (
                <rect key={`${x}-${y}`} x={3 + x * 6} y={6 + y * 6} width="6.2" height="6.2" fill="url(#gb-brand)" />
              ) : null,
            ),
          )}
          <rect x="9" y="12" width="6" height="6" style={glint} opacity=".45" />
        </symbol>

        <symbol id="gb-bolt" viewBox="0 0 48 48">
          <path d="M28 3L10 27h11l-3 18 20-26H27z" fill="url(#gb-cyan)" />
        </symbol>
      </defs>
    </svg>
  )
}

const ICON_ANIMATION: Record<BackdropIcon, string> = {
  diamond: 'game-float',
  coin: 'game-float',
  gamepad: 'game-float',
  potion: 'game-float',
  heart: 'game-float',
  bolt: 'game-float',
  sparkle: 'game-twinkle',
}

/**
 * Latar "item game melayang" untuk seluruh situs: diamond, koin, gamepad, potion, dsb.
 * Fixed di belakang konten (z-index negatif, tanpa pointer events), murni dekoratif.
 * Animasi hanya transform (ringan) dan mati otomatis saat prefers-reduced-motion.
 */
export default function GameBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-(--game-item-opacity)"
    >
      <Symbols />
      {BACKDROP_ITEMS.map((item, i) => (
        <div
          key={i}
          className={`absolute aspect-square w-[calc(var(--size)*0.7)] md:w-(--size) ${item.desktopOnly ? 'hidden md:block' : ''}`}
          style={
            {
              left: item.x,
              top: item.y,
              opacity: item.depth ?? 1,
              transform: `translate(-50%, -50%) rotate(${item.rotate ?? 0}deg)`,
              '--size': item.size,
            } as CSSProperties
          }
        >
          <svg
            viewBox="0 0 48 48"
            className={`size-full ${ICON_ANIMATION[item.icon]}`}
            style={
              {
                '--float-duration': `${item.duration}s`,
                '--float-delay': `${item.delay}s`,
              } as CSSProperties
            }
          >
            <use href={`#gb-${item.icon}`} />
          </svg>
        </div>
      ))}
    </div>
  )
}
