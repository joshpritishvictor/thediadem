import { CheckCircle2, Loader2, X } from 'lucide-react'
import {
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type RefObject,
  type ReactElement,
} from 'react'
import { contactForm } from '../content/contact'
import { featuredServices } from '../content/services'

type Status = 'idle' | 'sending' | 'error'

// Serverless function in api/contact.ts (saves the lead to GoHighLevel)
const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact'

const fieldClass =
  'w-full rounded-2xl border border-ink/12 bg-white px-4 py-3.5 text-ink transition placeholder:text-ink/40 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15 focus:outline-none'

const serviceOptions = [
  ...featuredServices.map((s) => s.title),
  contactForm.serviceCatchAll,
]

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState(contactForm.error)
  const successDialog = useRef<HTMLDialogElement>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    if (data.company) return // honeypot: only bots fill the hidden field

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
      if (!response.ok) {
        // Validation problems (400) have a message worth showing; anything else gets the generic one
        const { error: message } = await response.json().catch(() => ({}))
        setError(
          response.status === 400 && message ? message : contactForm.error,
        )
        setStatus('error')
        return
      }
      form.reset()
      setStatus('idle')
      successDialog.current?.showModal()
    } catch {
      setError(contactForm.error)
      setStatus('error')
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
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
            {error}
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
      </form>

      <SuccessDialog dialogRef={successDialog} />
    </>
  )
}

/**
 * Native <dialog>: showModal() gives focus trapping, Esc to close and a
 * backdrop for free. Fades/scales in with CSS (@starting-style), no JS animation.
 */
function SuccessDialog({
  dialogRef,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>
}) {
  const close = () => dialogRef.current?.close()
  // Clicks on the dimmed backdrop land on the <dialog> element itself
  const onBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) close()
  }

  return (
    <dialog
      ref={dialogRef}
      onClick={onBackdropClick}
      aria-labelledby="contact-success-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md scale-95 rounded-[2rem] bg-white p-0 text-ink opacity-0 shadow-2xl shadow-teal-950/30 transition-all transition-discrete duration-300 ease-out-expo backdrop:bg-teal-950/0 backdrop:backdrop-blur-none backdrop:transition-all backdrop:transition-discrete backdrop:duration-300 open:scale-100 open:opacity-100 open:backdrop:bg-teal-950/50 open:backdrop:backdrop-blur-sm starting:open:scale-95 starting:open:opacity-0 starting:open:backdrop:bg-teal-950/0"
    >
      <div className="relative px-8 pt-12 pb-8 text-center">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 grid size-10 place-items-center rounded-full text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <X size={20} />
        </button>

        <CheckCircle2 size={56} className="mx-auto text-gold-500" />
        <h2
          id="contact-success-title"
          className="mt-6 text-2xl leading-snug font-semibold"
        >
          {contactForm.success.heading}
        </h2>
        <p className="mt-3 text-ink/65">{contactForm.success.body}</p>

        <button type="button" onClick={close} className="btn-primary mt-8">
          Close
        </button>
      </div>
    </dialog>
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
