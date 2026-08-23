import { z } from 'zod'

// Shared between the client form and the /api/contact route. Never trust
// client-side validation alone — the route re-validates this same schema
// against the raw request body.
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Tell us your name.').max(100),
  email: z.string().trim().email('That email doesn\u2019t look right.'),
  company: z.string().trim().max(120).optional().or(z.literal('')),
  service: z.enum(['ai-agents', 'cybersecurity', 'web-dev', 'app-dev', 'other']),
  message: z.string().trim().min(10, 'A few more details would help.').max(2000),
  turnstileToken: z.string().min(1, 'Verification failed \u2014 please retry.'),
})

export type ContactInput = z.infer<typeof contactSchema>

export const serviceOptions: { value: ContactInput['service']; label: string }[] = [
  { value: 'ai-agents', label: 'AI Agents' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'web-dev', label: 'Web Development' },
  { value: 'app-dev', label: 'App Development' },
  { value: 'other', label: 'Something else' },
]
