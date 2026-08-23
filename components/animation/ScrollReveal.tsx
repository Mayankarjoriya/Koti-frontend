'use client'

import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { gsap, useGsapSetup, prefersReducedMotion } from '@/lib/gsap'

type ScrollRevealProps = {
  children: ReactNode
  /** Wrapper element to render. Defaults to a div. */
  as?: ElementType
  className?: string
  /** Stagger direct children instead of animating the wrapper as one unit. */
  stagger?: boolean
  /** Distance (px) the element travels up into place. */
  y?: number
  /** Delay before the reveal begins, in seconds. */
  delay?: number
  /** Where in the viewport the trigger fires (ScrollTrigger `start`). */
  start?: string
}

// Reusable scroll-triggered reveal. Elements start offset + transparent and
// ease into place once they enter the viewport. Entrance is JS-gated, so we
// only hide targets *after* confirming the effect attached (and never when the
// user prefers reduced motion) — otherwise content could get stuck hidden.
export default function ScrollReveal({
  children,
  as,
  className,
  stagger = false,
  y = 28,
  delay = 0,
  start = 'top 82%',
}: ScrollRevealProps) {
  useGsapSetup()
  const ref = useRef<HTMLElement>(null)
  const Tag = (as ?? 'div') as ElementType

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) return // native scroll, content already visible

    const ctx = gsap.context(() => {
      const targets = stagger
        ? (Array.from(el.children) as HTMLElement[])
        : [el]

      gsap.set(targets, { opacity: 0, y })
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay,
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none none',
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [stagger, y, delay, start])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
