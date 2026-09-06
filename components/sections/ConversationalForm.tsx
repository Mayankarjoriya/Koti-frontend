'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Turnstile } from '@marsidev/react-turnstile'
import { contactSchema, serviceOptions, type ContactInput } from '@/lib/validation'
import { prefersReducedMotion } from '@/lib/gsap'

type StepId = 'name' | 'email' | 'service' | 'message' | 'company' | 'review'

const steps: { id: StepId; prompt: string }[] = [
  { id: 'name', prompt: 'What should we call you?' },
  { id: 'email', prompt: 'Best email to reach you at?' },
  { id: 'service', prompt: 'What are you looking to build?' },
  { id: 'message', prompt: 'Tell us a bit more.' },
  { id: 'company', prompt: 'Company or project name? (optional)' },
  { id: 'review', prompt: 'Ready to send?' },
]

type FormState = {
  name: string
  email: string
  service: ContactInput['service'] | ''
  message: string
  company: string
}

const initialState: FormState = { name: '', email: '', service: '', message: '', company: '' }

type ConversationalFormProps = {
  turnstileSiteKey?: string
}

export default function ConversationalForm({ turnstileSiteKey }: ConversationalFormProps = {}) {
  const activeSiteKey = turnstileSiteKey || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || process.env.TURNSTILE_SITE_KEY
  const [stepIndex, setStepIndex] = useState(0)
  const [values, setValues] = useState<FormState>(initialState)
  const [error, setError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [serverMessage, setServerMessage] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  const reduced = prefersReducedMotion()
  const step = steps[stepIndex]
  const isLast = stepIndex === steps.length - 1

  function validateStep(): string | null {
    if (step.id === 'name' && values.name.trim().length < 2) return 'Name needs at least 2 characters.'
    if (step.id === 'email') {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
      if (!ok) return 'That email doesn\u2019t look right.'
    }
    if (step.id === 'service' && !values.service) return 'Pick one so we route you correctly.'
    if (step.id === 'message' && values.message.trim().length < 10) return 'A few more details would help.'
    return null
  }

  function goNext() {
    const err = validateStep()
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  }

  function goBack() {
    setError(null)
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    // CJK IME guard: don't advance on the Enter that confirms composition.
    if (e.nativeEvent.isComposing || (e as unknown as { keyCode?: number }).keyCode === 229) return
    if (e.key === 'Enter' && !e.shiftKey && step.id !== 'review') {
      e.preventDefault()
      goNext()
    }
  }

  async function handleSubmit() {
    if (!turnstileToken) {
      setError('Please complete the verification check.')
      return
    }
    const parsed = contactSchema.safeParse({
      name: values.name,
      email: values.email,
      company: values.company,
      service: values.service,
      message: values.message,
      turnstileToken,
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Please check your answers.')
      return
    }

    setStatus('submitting')
    setError(null)
    try {
      const endpoint = '/api/contact'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus('error')
        const detailMsg = typeof data.detail === 'string' ? data.detail : data.error ?? data.message
        setServerMessage(detailMsg ?? 'Something went wrong \u2014 try again in a moment.')
        return
      }
      setStatus('success')
      setServerMessage(data.message ?? 'Message sent \u2014 we\u2019ll reply within 24h.')
    } catch (err) {
      console.error('[ConversationalForm Submission Error]:', err)
      setStatus('error')
      setServerMessage('Connection dropped \u2014 check your network and retry.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-primary/30 bg-card p-8 font-mono text-sm">
        <p className="text-primary">$ transmission_complete</p>
        <p className="mt-3 text-foreground">{serverMessage}</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 font-mono text-sm sm:p-8">
      {/* Terminal-style breadcrumb of answered prompts */}
      <div className="space-y-1.5 text-muted-foreground">
        {steps.slice(0, stepIndex).map((s) => (
          <p key={s.id}>
            <span className="text-primary">$</span> {s.prompt}{' '}
            <span className="text-foreground">
              {s.id === 'service'
                ? serviceOptions.find((o) => o.value === values.service)?.label
                : (values as Record<string, string>)[s.id] || '\u2014'}
            </span>
          </p>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={reduced ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4"
        >
          <p className="text-primary">
            <span aria-hidden="true">$</span> {step.prompt}
          </p>

          <div className="mt-3">
            {step.id === 'name' && (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                autoFocus
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                onKeyDown={handleKeyDown}
                placeholder="Jane Doe"
                className="w-full border-b border-border bg-transparent py-2 text-foreground outline-none placeholder:text-muted-foreground/50 focus-visible:border-primary"
              />
            )}
            {step.id === 'email' && (
              <input
                type="email"
                autoFocus
                value={values.email}
                onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                onKeyDown={handleKeyDown}
                placeholder="jane@company.com"
                className="w-full border-b border-border bg-transparent py-2 text-foreground outline-none placeholder:text-muted-foreground/50 focus-visible:border-primary"
              />
            )}
            {step.id === 'service' && (
              <div className="flex flex-wrap gap-2">
                {serviceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValues((v) => ({ ...v, service: opt.value }))}
                    className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                      values.service === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
            {step.id === 'message' && (
              <textarea
                autoFocus
                rows={4}
                value={values.message}
                onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.nativeEvent.isComposing || (e as unknown as { keyCode?: number }).keyCode === 229) return
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault()
                    goNext()
                  }
                }}
                placeholder="What are you trying to solve?"
                className="w-full resize-none border-b border-border bg-transparent py-2 text-foreground outline-none placeholder:text-muted-foreground/50 focus-visible:border-primary"
              />
            )}
            {step.id === 'company' && (
              <input
                autoFocus
                value={values.company}
                onChange={(e) => setValues((v) => ({ ...v, company: e.target.value }))}
                onKeyDown={handleKeyDown}
                placeholder="Acme Inc. (optional)"
                className="w-full border-b border-border bg-transparent py-2 text-foreground outline-none placeholder:text-muted-foreground/50 focus-visible:border-primary"
              />
            )}
            {step.id === 'review' && (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We&apos;ll verify you&apos;re human, then send this to our team.
                </p>
                {activeSiteKey ? (
                  <Turnstile
                    siteKey={activeSiteKey}
                    onSuccess={setTurnstileToken}
                    onExpire={() => setTurnstileToken(null)}
                    options={{ theme: 'dark' }}
                  />
                ) : (
                  <p className="text-xs text-destructive">
                    Verification is not configured (missing site key).
                  </p>
                )}
              </div>
            )}
          </div>

          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          {status === 'error' && serverMessage && (
            <p className="mt-2 text-xs text-destructive">{serverMessage}</p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIndex === 0}
          className="text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-0"
        >
          &larr; back
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === 'submitting' || !turnstileToken}
            className="rounded-md bg-primary px-5 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'submitting' ? 'Sending\u2026' : 'Send message'}
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            className="rounded-md bg-primary px-5 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Continue &rarr;
          </button>
        )}
      </div>
    </div>
  )
}
