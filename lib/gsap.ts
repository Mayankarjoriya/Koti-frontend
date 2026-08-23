'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

/** Returns true once, on the client, if the user has requested reduced motion. */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Global GSAP setup — call once per component tree that needs ScrollTrigger.
// Any component using GSAP should check prefersReducedMotion() before
// building a scroll-linked timeline (masterplan.md section 7).
export function useGsapSetup() {
  useEffect(() => {
    if (registered) return
    gsap.registerPlugin(ScrollTrigger)
    gsap.defaults({
      duration: prefersReducedMotion() ? 0.01 : 0.8,
    })
    registered = true
  }, [])
}

export { gsap, ScrollTrigger }
