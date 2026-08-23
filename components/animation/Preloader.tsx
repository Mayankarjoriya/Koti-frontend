'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

// Full-screen intro overlay shown on first load. The logo pulses/rotates
// in while a progress line fills, then the whole overlay lifts away to
// reveal the hero. Purely presentational — it never blocks hydration of
// the page beneath it (the app is fully mounted underneath the overlay).
export default function Preloader() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Minimum on-screen time so the animation reads, then dismiss once
    // the window has fired `load` (or a hard cap as a safety net).
    const minTime = new Promise<void>((r) => setTimeout(r, 1600))
    const loaded =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((r) =>
            window.addEventListener('load', () => r(), { once: true }),
          )
    const cap = new Promise<void>((r) => setTimeout(r, 3500))

    let cancelled = false
    Promise.race([Promise.all([minTime, loaded]).then(() => undefined), cap]).then(() => {
      if (!cancelled) setDone(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Lock scroll while the overlay is visible.
  useEffect(() => {
    document.documentElement.style.overflow = done ? '' : 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [done])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/images/logo-mark-white.png"
              alt="Loading"
              width={72}
              height={72}
              priority
              className="size-16 w-auto"
            />
          </motion.div>

          <div className="mt-8 h-px w-40 overflow-hidden bg-border">
            <motion.div
              className="h-full bg-primary"
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </div>

          <motion.p
            className="mt-5 font-display text-xs uppercase tracking-[0.35em] text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Signal
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
