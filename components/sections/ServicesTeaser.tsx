'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { services } from '@/lib/services-data'
import ServiceMicroAnimation from '@/components/sections/ServiceMicroAnimation'
import ScrollReveal from '@/components/animation/ScrollReveal'

// Netflix/movie-carousel-style peek cards: the active card scales up and
// lifts forward (z-index + shadow) while its capability list slides in,
// and siblings settle back and dim slightly \u2014 same interaction language
// as the hover-expand grid on /services, adapted to a horizontal row.
export default function ServicesTeaser() {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <ScrollReveal className="flex items-baseline justify-between gap-6">
        <h2 className="font-display text-3xl font-medium text-foreground md:text-4xl">
          What we build
        </h2>
        <Link
          href="/services"
          className="hidden shrink-0 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary sm:inline-flex"
        >
          All services <ArrowUpRight className="size-4" />
        </Link>
      </ScrollReveal>

      <div
        className="mt-10 flex gap-5 overflow-x-auto pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-visible md:pb-0"
        style={{ perspective: 1200 }}
      >
        {services.map((service) => {
          const isActive = activeId === service.id

          return (
            <motion.div
              key={service.id}
              initial={false}
              animate={{
                scale: isActive ? 1.06 : 1,
                y: isActive ? -10 : 0,
                opacity: activeId && !isActive ? 0.55 : 1,
              }}
              whileTap={{ scale: isActive ? 1.03 : 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              style={{ zIndex: isActive ? 10 : 1 }}
              className="group relative w-[72vw] shrink-0 sm:w-[46%] md:w-1/4"
              onHoverStart={() => setActiveId(service.id)}
              onHoverEnd={() => setActiveId((current) => (current === service.id ? null : current))}
              onFocus={() => setActiveId(service.id)}
              onBlur={() => setActiveId((current) => (current === service.id ? null : current))}
            >
              <Link
                href="/services"
                className="relative block overflow-hidden rounded-xl border border-border bg-card p-6 outline-none focus-visible:border-primary"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                <div className="relative flex items-start justify-between gap-4">
                  <h3 className="font-display text-lg font-medium text-foreground">
                    {service.label}
                  </h3>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>

                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.summary}
                </p>

                <div className="relative mt-5 flex h-10 items-center">
                  <ServiceMicroAnimation id={service.id} />
                </div>

                <motion.ul
                  initial={false}
                  animate={{
                    height: isActive ? 'auto' : 0,
                    opacity: isActive ? 1 : 0,
                    marginTop: isActive ? 16 : 0,
                  }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="relative flex flex-col gap-1.5 overflow-hidden"
                >
                  {service.capabilities.map((capability) => (
                    <li
                      key={capability}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <span className="size-1 shrink-0 rounded-full bg-primary" />
                      {capability}
                    </li>
                  ))}
                </motion.ul>
              </Link>
            </motion.div>
          )
        })}
      </div>

      <Link
        href="/services"
        className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary sm:hidden"
      >
        All services <ArrowUpRight className="size-4" />
      </Link>
    </section>
  )
}
