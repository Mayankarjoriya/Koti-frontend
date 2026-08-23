'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { services } from '@/lib/services-data'
import ServiceMicroAnimation from './ServiceMicroAnimation'

// Heco-style hover-expand: the active card grows, siblings shrink/dim with
// natural (spring) easing. Hover drives it on pointer devices; a click/tap
// toggles the same state so touch and keyboard users get an equivalent
// interaction \u2014 never a drag- or hover-only path (masterplan.md section 7).
export default function ServicesGrid() {
  const [activeId, setActiveId] = useState<string>(services[0].id)

  return (
    <div
      className="flex flex-col gap-3 md:h-[560px] md:flex-row"
      onMouseLeave={() => setActiveId(services[0].id)}
    >
      {services.map((service) => {
        const isActive = service.id === activeId
        return (
          <motion.button
            key={service.id}
            type="button"
            aria-expanded={isActive}
            onMouseEnter={() => setActiveId(service.id)}
            onFocus={() => setActiveId(service.id)}
            onClick={() => setActiveId(service.id)}
            layout
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            animate={{ flexGrow: isActive ? 3 : 1, opacity: isActive ? 1 : 0.55 }}
            className="relative flex min-h-[180px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card p-6 text-left outline-none focus-visible:border-primary md:min-h-0"
          >
            <h3
              className={`font-display font-medium text-foreground transition-[font-size] duration-300 ${
                isActive ? 'text-2xl md:text-3xl' : 'text-xl break-words md:text-2xl'
              }`}
            >
              {service.label}
            </h3>

            <motion.div
              initial={false}
              animate={{ opacity: isActive ? 1 : 0, height: isActive ? 'auto' : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 flex flex-1 flex-col justify-between overflow-hidden"
            >
              <div>
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <ul className="mt-5 space-y-2">
                  {service.capabilities.map((cap) => (
                    <li key={cap} className="text-sm text-foreground/90">
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <ServiceMicroAnimation id={service.id} />
              </div>
            </motion.div>

            {!isActive && (
              <p className="mt-3 text-sm text-muted-foreground md:absolute md:bottom-6 md:left-6 md:right-6">
                {service.summary}
              </p>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
