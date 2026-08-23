import Hero from '@/components/sections/Hero'
import PositionStatement from '@/components/sections/PositionStatement'
import ServicesTeaser from '@/components/sections/ServicesTeaser'
import TrustSection from '@/components/sections/TrustSection'
import CTASection from '@/components/sections/CTASection'

export default function Home() {
  return (
    <main>
      {/*
        Pinned hero: the hero sticks to the viewport (z-0) while the content
        block below (opaque bg, z-10) scrolls UP and slides over it. Combined
        with the hero's own center fade-in + scroll-out fade, the effect is
        the image settling in place, then the next section rising over it.
      */}
      <div className="sticky top-0 z-0 h-[100dvh]">
        <Hero />
      </div>
      <div className="relative z-10 bg-background">
        <PositionStatement />
        <ServicesTeaser />
        <TrustSection />
        <CTASection />
      </div>
    </main>
  )
}
