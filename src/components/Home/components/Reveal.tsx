'use client'

import { motion, useReducedMotion } from 'motion/react'
import { ReactNode, useState } from 'react'
import { isEntranceSuppressed } from '../../../lib/pageTransition'

interface RevealProps {
  children: ReactNode
  /** Delay tambahan (detik) untuk efek stagger antar item */
  delay?: number
  className?: string
}

/**
 * Fade + slide-up sekali saat elemen masuk viewport. Nonaktif saat prefers-reduced-motion,
 * dan saat mount ulang akibat ganti bahasa (halaman sudah di-crossfade, jangan animasi dua kali).
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduceMotion = useReducedMotion()
  const [skipEntrance] = useState(isEntranceSuppressed)

  if (reduceMotion || skipEntrance) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </motion.div>
  )
}
