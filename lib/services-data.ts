export const services = [
  {
    id: 'ai-agents',
    label: 'AI Agents',
    summary: 'Autonomous systems that reason and act.',
    description:
      'We design, train, and deploy agents that handle real workflows \u2014 not demos. Tool use, memory, and hand-off boundaries are engineered in from the start, so the agent knows exactly when to escalate to a human.',
    capabilities: ['Tool-calling architectures', 'Retrieval & memory design', 'Evaluation & guardrails'],
    image: '/images/card-ai-agents.png',
    stat: '40%',
    statLabel: 'less manual ops work',
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity',
    summary: 'Threat modeling and hardened infrastructure.',
    description:
      'Security is a design input, not a final audit. We threat-model your system before a line of code ships, then harden the infrastructure, pipelines, and access controls around it.',
    capabilities: ['Threat modeling', 'Penetration testing', 'Zero-trust infrastructure'],
    image: '/images/card-cybersecurity.png',
    stat: 'Zero',
    statLabel: 'trust by default',
  },
  {
    id: 'web-dev',
    label: 'Web Development',
    summary: 'Fast, accessible, production-grade platforms.',
    description:
      'No template shortcuts. We build web platforms tuned for real performance budgets and real accessibility standards, engineered to hold up under production traffic, not just a Lighthouse run.',
    capabilities: ['Next.js & React', 'Performance engineering', 'Accessibility (WCAG AA+)'],
    image: '/images/card-web-dev.png',
    stat: '100',
    statLabel: 'Lighthouse targets',
  },
  {
    id: 'app-dev',
    label: 'App Development',
    summary: 'Native-feeling mobile and desktop products.',
    description:
      'From first prototype to app-store release, we build products that feel native to their platform \u2014 engineered for the update cycle and scale your business will actually hit.',
    capabilities: ['iOS & Android', 'Cross-platform architecture', 'Offline-first design'],
    image: '/images/card-app-dev.png',
    stat: '2x',
    statLabel: 'faster ship cycles',
  },
] as const

export type Service = (typeof services)[number]
