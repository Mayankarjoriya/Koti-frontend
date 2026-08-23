import ScrollReveal from '@/components/animation/ScrollReveal'

const markers = [
  {
    label: 'One team, full stack',
    detail: 'The people who model your threats also ship your product \u2014 no handoff gaps.',
  },
  {
    label: 'Security-first delivery',
    detail: 'Every engagement starts with a threat model, not an afterthought audit.',
  },
  {
    label: 'Built to operate',
    detail: 'Systems designed for the on-call reality, not just the demo.',
  },
]

// Placeholder for client logos until real content is provided \u2014 see
// masterplan.md section 8. Capability markers instead of fabricated
// vanity stats: each line is a real claim about how the team works, not
// a decorative number.
export default function TrustSection() {
  return (
    <section className="border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <ScrollReveal
          stagger
          className="grid grid-cols-1 gap-10 md:grid-cols-3"
        >
          {markers.map((marker) => (
            <div key={marker.label}>
              <h3 className="font-display text-lg font-medium text-foreground">
                {marker.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {marker.detail}
              </p>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
