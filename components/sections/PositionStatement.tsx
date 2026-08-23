'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, useGsapSetup, prefersReducedMotion } from '@/lib/gsap'

const lines = [
  'Most agencies pick one lane.',
  'We build the intelligence, secure it end to end,',
  'and ship the product it lives in \u2014 as one continuous system.',
]

export default function PositionStatement() {
  useGsapSetup()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>('[data-reveal-line]')

      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 })
        return
      }

      gsap.set(targets, { opacity: 0, y: 24 })
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="mx-auto max-w-4xl px-6 py-32">
      <p className="font-display text-xs font-medium tracking-[0.3em] text-primary uppercase">
        What we are
      </p>
      <div className="mt-8 space-y-2">
        {lines.map((line, i) => (
          <p
            key={i}
            data-reveal-line
            className="text-balance font-display text-2xl font-medium text-foreground md:text-4xl"
          >
            {line}
          </p>
        ))}
      </div>
    </section>
  )
}
