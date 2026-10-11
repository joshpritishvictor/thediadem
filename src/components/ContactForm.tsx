import { CheckCircle2, Loader2 } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useState, type FormEvent, type ReactElement } from 'react'
import { contactForm } from '../content/contact'
import { featuredServices } from '../content/services'
import { site } from '../content/site'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT

const fieldClass =
  'w-full rounded-2xl border border-ink/12 bg-white px-4 py-3.5 text-ink transition placeholder:text-ink/40 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15 focus:outline-none'

const serviceOptions = [
  ...featuredServices.map((s) => s.title),
  contactForm.serviceCatchAll,
]

/** Opens the visitor's email app when no form backend is configured */
function openMailto(data: Record<string, FormDataEntryValue>) {
  const body = Object.entries(data)
    .filter(([key, value]) => key !== 'company' && value)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
  window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(
    'Discovery call request',
  )}&body=${encodeURIComponent(body)}`
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    if (data.company) return // honeypot: only bots fill the hidden field

    if (!endpoint) {
      openMailto(data)
      return
    }

    setStatus('sending')
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === 'sent' ? (
        <m.div
          key="sent"
          role="status"
          className="grid min-h-96 place-items-center text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div>
            <CheckCircle2 size={56} className="mx-auto text-gold-500" />
            <h3 className="mt-6 text-2xl font-semibold">
              {contactForm.success.heading}
            </h3>
            <p className="mt-3 text-ink/65">{contactForm.success.body}</p>
          </div>
        </m.div>
      ) : (
        <m.form
          key="form"
          onSubmit={handleSubmit}
          className="grid gap-4 sm:grid-cols-2"
          exit={{ opacity: 0, scale: 0.98 }}
        >
          <Field label="First name" required>
            <input
              name="firstName"
              autoComplete="given-name"
              required
              className={fieldClass}
            />
          </Field>
          <Field label="Last name" required>
            <input
              name="lastName"
              autoComplete="family-name"
              required
              className={fieldClass}
            />
          </Field>
          <Field label="Email address" required>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className={fieldClass}
            />
          </Field>
          <Field label="Phone number">
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              className={fieldClass}
            />
          </Field>
          <Field label="Preferred contact method">
            <Select
              name="preferredContact"
              options={contactForm.preferredContact}
            />
          </Field>
          <Field label="Primary services needed">
            <Select name="service" options={serviceOptions} />
          </Field>
          <Field label="Business or employment type" wide>
            <Select name="entityType" options={contactForm.entityTypes} />
          </Field>
          <Field label="How can we help? (optional)" wide>
            <textarea name="message" rows={4} className={fieldClass} />
          </Field>

          {/* Honeypot: hidden from people, tempting to bots */}
          <input
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <label className="flex items-start gap-3 text-sm text-ink/65 sm:col-span-2">
            <input
              name="consent"
              type="checkbox"
              value="yes"
              className="mt-1 size-4 shrink-0 accent-teal-900"
            />
            {contactForm.consent}
          </label>

          {status === 'error' && (
            <p
              role="alert"
              className="text-sm font-medium text-red-700 sm:col-span-2"
            >
              {contactForm.error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="btn-primary disabled:opacity-60 sm:col-span-2 sm:justify-self-start"
          >
            {status === 'sending' && (
              <Loader2 size={16} className="animate-spin" />
            )}
            {contactForm.submit}
          </button>
        </m.form>
      )}
    </AnimatePresence>
  )
}

function Field({
  label,
  required,
  wide,
  children,
}: {
  label: string
  required?: boolean
  wide?: boolean
  children: ReactElement
}) {
  return (
    <label
      className={`grid gap-2 text-sm font-medium ${wide ? 'sm:col-span-2' : ''}`}
    >
      <span>
        {label}
        {required && <span className="text-gold-600"> *</span>}
      </span>
      {children}
    </label>
  )
}

function Select({ name, options }: { name: string; options: string[] }) {
  return (
    <select name={name} defaultValue="" className={fieldClass}>
      <option value="" disabled>
        Select…
      </option>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  )
}
