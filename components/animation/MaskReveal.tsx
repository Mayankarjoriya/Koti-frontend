'use client'

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from 'react'
import { gsap, useGsapSetup, prefersReducedMotion } from '@/lib/gsap'

type MaskRevealProps = {
  children: ReactNode
  /** Heading tag (or any element) to render. Defaults to h2. */
  as?: ElementType
  className?: string
  /** Delay before the reveal begins, in seconds. */
  delay?: number
  /** Where in the viewport the trigger fires (ScrollTrigger `start`). */
  start?: string
}

// SSR-safe layout effect: run before paint on the client (so we can hide the
// line before the browser shows it, avoiding a flash) and no-op on the server.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Edolus-style text mask reveal. The heading text lives inside an
// overflow-hidden "clip" wrapper; the inner line starts pushed fully below
// that clip's baseline (invisible) and slides up into view as it enters the
// viewport — a masked slide-up rather than a plain fade.
//
// Never-stuck-invisible guarantee: the DEFAULT (SSR / no-JS / reduced-motion)
// state has NO transform, so the text renders fully visible. Only once the
// effect actually attaches on the client do we push the line down and then
// animate it back — mirroring the codebase's existing "hide only after the
// effect is confirmed" pattern (see ScrollReveal).
export default function MaskReveal({
  children,
  as,
  className,
  delay = 0,
  start = 'top 88%',
}: MaskRevealProps) {
  useGsapSetup()
  const Tag = (as ?? 'h2') as ElementType
  const clipRef = useRef<HTMLSpanElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)

  useIsomorphicLayoutEffect(() => {
    const clip = clipRef.current
    const line = lineRef.current
    if (!clip || !line) return
    if (prefersReducedMotion()) return // static: leave text fully visible

    const ctx = gsap.context(() => {
      // Hide only now that the effect is confirmed attached.
      gsap.set(line, { yPercent: 120 })
      gsap.to(line, {
        yPercent: 0,
        duration: 1,
        ease: 'power4.out',
        delay,
        scrollTrigger: {
          trigger: clip,
          start,
          toggleActions: 'play none none none',
        },
      })
    }, clip)

    return () => ctx.revert()
  }, [delay, start])

  return (
    <Tag className={className}>
      {/* Clip mask: overflow-hidden with a touch of vertical padding so
          descenders (g, y, p) are never shaved by the mask edge. */}
      <span
        ref={clipRef}
        className="block overflow-hidden pb-[0.12em] [margin-bottom:-0.12em]"
      >
        <span ref={lineRef} className="block [will-change:transform]">
          {children}
        </span>
      </span>
    </Tag>
  )
}
