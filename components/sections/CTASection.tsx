import Link from 'next/link'
import ScrollReveal from '@/components/animation/ScrollReveal'

export default function CTASection() {
  return (
    <ScrollReveal
      as="section"
      stagger
      className="mx-auto max-w-4xl px-6 py-32 text-center"
    >
      <h2 className="text-balance font-display text-3xl font-medium text-foreground md:text-5xl">
        Have a signal worth acting on?
      </h2>
      <p className="mt-4 text-pretty text-muted-foreground">
        Tell us what you&apos;re building. We&apos;ll reply within 24 hours.
      </p>
      <div className="mt-8">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Start a conversation
        </Link>
      </div>
    </ScrollReveal>
  )
}
