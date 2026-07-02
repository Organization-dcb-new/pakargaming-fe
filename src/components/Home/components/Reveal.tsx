'use client'

import { motion, useReducedMotion } from 'motion/react'
import { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Delay tambahan (detik) untuk efek stagger antar item */
  delay?: number
  className?: string
}

/** Fade + slide-up sekali saat elemen masuk viewport. Nonaktif saat prefers-reduced-motion. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
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
