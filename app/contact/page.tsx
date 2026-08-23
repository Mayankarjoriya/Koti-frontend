import type { Metadata } from 'next'
import ConversationalForm from '@/components/sections/ConversationalForm'

export const metadata: Metadata = {
  title: 'Contact \u2014 Signal',
  description: 'Tell us what you\u2019re building. We reply within 24 hours.',
}

export default function ContactPage() {
  return (
    <main className="pt-16">
      <section className="mx-auto max-w-2xl px-6 py-20 md:py-28">
        <p className="font-display text-xs font-medium tracking-[0.3em] text-primary uppercase">
          Contact
        </p>
        <h1 className="mt-4 text-balance font-display text-4xl font-medium text-foreground md:text-5xl">
          Let&apos;s talk signal.
        </h1>
        <p className="mt-4 max-w-md text-pretty text-muted-foreground">
          Answer a few quick prompts. We&apos;ll reply within 24 hours.
        </p>

        <div className="mt-12">
          <ConversationalForm />
        </div>
      </section>
    </main>
  )
}
