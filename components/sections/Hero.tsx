'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, useGsapSetup, prefersReducedMotion } from '@/lib/gsap'

export default function Hero() {
  useGsapSetup()
  const sectionRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!visualRef.current || !sectionRef.current || !copyRef.current) return
    if (prefersReducedMotion()) return // static: skip the scroll-linked fade entirely

    // Scroll-down fade: both the background image and the hero copy fade
    // out together as the user scrolls past the hero. Their *entrance* is
    // handled by CSS-only animations (never JS-gated), so if this effect
    // never attaches, everything simply stays fully visible instead of
    // getting stuck hidden.
    const ctx = gsap.context(() => {
      gsap.to(visualRef.current, {
        opacity: 0,
        scale: 0.94,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      gsap.to(copyRef.current, {
        opacity: 0,
        y: -40,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '65% top',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative h-[100dvh] w-full overflow-hidden bg-background">
      <div ref={visualRef} className="absolute inset-0 flex items-center justify-center">
        {/*
          Center fade-in: the wireframe image starts slightly scaled up and
          transparent, then eases down to full size/opacity from the middle
          of the frame outward. CSS-only (see .animate-scale-fade-in in
          globals.css) so it always resolves even without JS.
        */}
        <Image
          src="/images/hero-wireframe-bg.jpg"
          alt="Abstract wireframe terrain mesh, a visual signal in the dark"
          fill
          priority
          className="animate-scale-fade-in origin-center object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background" />
      </div>

      {/*
        CSS-only entrance (see .animate-fade-up-in in globals.css): runs on
        paint, immune to React Strict Mode double-invoke / Fast Refresh
        killing a JS timeline mid-flight. Above-the-fold copy must always
        end up visible with no dependency on an effect completing. The
        scroll-out fade above is layered on top via the copyRef wrapper.
      */}
      <div
        ref={copyRef}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <p
          className="animate-fade-up-in font-display text-xs font-medium tracking-[0.3em] text-primary uppercase [animation-delay:0.1s]"
        >
          AI &middot; Security &middot; Engineering
        </p>
        <h1 className="animate-fade-up-in mt-6 max-w-3xl text-balance font-display text-5xl font-medium text-foreground [animation-delay:0.22s] md:text-7xl">
          Intelligence, secured.
        </h1>
        <p className="animate-fade-up-in mt-6 max-w-xl text-pretty text-lg text-muted-foreground [animation-delay:0.36s]">
          AI agents, cybersecurity, and product engineering built by one team
          &mdash; from first signal to shipped system.
        </p>
        <div className="animate-fade-up-in mt-10 [animation-delay:0.5s]">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start a conversation
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-xs tracking-[0.2em] text-muted-foreground uppercase">
        Scroll
      </div>
    </section>
  )
}
