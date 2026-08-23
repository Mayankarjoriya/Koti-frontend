'use client'

import { motion } from 'framer-motion'

// Small embedded animation per expanded service card. CSS/Framer Motion
// only \u2014 no Lottie dependency needed for something this simple, and it
// keeps the bundle smaller. Each variant is a restrained, looping visual
// cue tied to what the service actually does.
const variants: Record<string, React.ReactNode> = {
  'ai-agents': <AgentPulse />,
  cybersecurity: <ShieldScan />,
  'web-dev': <StackBars />,
  'app-dev': <DeviceTap />,
}

function AgentPulse() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full bg-primary"
          animate={{ height: [8, 24, 8] }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.12,
          }}
          style={{ height: 8 }}
        />
      ))}
    </div>
  )
}

function ShieldScan() {
  return (
    <div className="relative h-10 w-10">
      <svg viewBox="0 0 40 40" className="h-full w-full">
        <path
          d="M20 4 L34 10 V20 C34 29 28 34 20 36 C12 34 6 29 6 20 V10 Z"
          fill="none"
          stroke="var(--color-graphite)"
          strokeWidth="1.5"
        />
      </svg>
      <motion.div
        className="absolute inset-x-1 h-px bg-primary"
        animate={{ top: ['15%', '80%', '15%'] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

function StackBars() {
  return (
    <div className="flex items-end gap-1.5">
      {[14, 22, 10, 18].map((h, i) => (
        <motion.span
          key={i}
          className="w-2 rounded-sm bg-primary/80"
          style={{ height: h }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

function DeviceTap() {
  return (
    <div className="relative flex h-10 w-7 items-center justify-center rounded-md border border-graphite/60">
      <motion.span
        className="size-2 rounded-full bg-primary"
        animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

export default function ServiceMicroAnimation({ id }: { id: string }) {
  return variants[id] ?? null
}
