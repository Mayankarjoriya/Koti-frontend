import type { Metadata } from 'next'
import ServicesGrid from '@/components/sections/ServicesGrid'
import CTASection from '@/components/sections/CTASection'
import ScrollReveal from '@/components/animation/ScrollReveal'

export const metadata: Metadata = {
  title: 'Services \u2014 Signal',
  description:
    'AI agents, cybersecurity, web development, and app development \u2014 engineered as one continuous system.',
}

export default function ServicesPage() {
  return (
    <main className="pt-16">
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <ScrollReveal stagger start="top 90%">
          <p className="font-display text-xs font-medium tracking-[0.3em] text-primary uppercase">
            Services
          </p>
          <h1 className="mt-4 max-w-2xl text-balance font-display text-4xl font-medium text-foreground md:text-6xl">
            Four disciplines. One team.
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
            Hover or select a discipline to see how we approach it.
          </p>
        </ScrollReveal>

        <ScrollReveal className="mt-14" delay={0.1}>
          <ServicesGrid />
        </ScrollReveal>
      </section>
      <CTASection />
    </main>
  )
}
