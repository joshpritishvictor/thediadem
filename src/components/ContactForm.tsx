import { CheckCircle2, Loader2, X } from 'lucide-react'
import {
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type RefObject,
  type ReactElement,
} from 'react'
import { useSearchParams } from 'react-router-dom'
import { contactForm } from '../content/contact'
import { featuredServices } from '../content/services'

type Status = 'idle' | 'sending' | 'error'

// Serverless function in api/contact.ts (saves the lead to GoHighLevel)
const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact'

const fieldClass =
  'w-full rounded-2xl border border-gold-500/40 bg-card px-4 py-3.5 text-ink transition placeholder:text-ink/45 focus:border-gold-500 focus:bg-card focus:ring-4 focus:ring-gold-400/30 focus:outline-none autofill:shadow-[inset_0_0_0_100px_#f2eacf] autofill:[-webkit-text-fill-color:#28241f]'

// Own arrow for dropdowns so it sits inside the field, not against its edge
const chevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2328241f' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")"
const selectClass = `${fieldClass} select-field appearance-none bg-no-repeat pr-12 bg-[position:right_1.25rem_center]`

const serviceOptions = [
  ...featuredServices.map((s) => s.title),
  contactForm.serviceCatchAll,
]

export default function ContactForm() {
  // A service page's button sends ?service=<title>; the dropdown opens on it when it is one of the options
  const requested = useSearchParams()[0].get('service') ?? ''
  const preselected = serviceOptions.includes(requested) ? requested : ''
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
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
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
          <Select
            key={preselected}
            name="service"
            options={serviceOptions}
            defaultValue={preselected}
          />
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

        <label className="flex items-start gap-3 text-sm text-cream/75 sm:col-span-2 lg:col-span-3">
          <input
            name="consent"
            type="checkbox"
            value="yes"
            className="consent-box mt-0.5 size-5 shrink-0 cursor-pointer appearance-none rounded-md border border-gold-500 bg-card bg-center bg-no-repeat transition checked:bg-gold-500 focus-visible:ring-4 focus-visible:ring-gold-500/30 focus-visible:outline-none"
          />
          {contactForm.consent}
        </label>

        {status === 'error' && (
          <p
            role="alert"
            className="text-sm font-medium text-red-300 sm:col-span-2 lg:col-span-3"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn-primary disabled:opacity-60 sm:col-span-2 sm:justify-self-start lg:col-span-3"
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
      className={`grid gap-2 text-sm font-medium text-[#f2eacf] ${wide ? 'sm:col-span-2 lg:col-span-3' : ''}`}
    >
      <span>
        {label}
        {required && <span className="text-gold-400"> *</span>}
      </span>
      {children}
    </label>
  )
}

function Select({
  name,
  options,
  defaultValue = '',
}: {
  name: string
  options: string[]
  defaultValue?: string
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className={selectClass}
      style={{ backgroundImage: chevron }}
    >
      <option value="" disabled className="text-ink">
        Select…
      </option>
      {options.map((option) => (
        <option key={option} className="text-ink">
          {option}
        </option>
      ))}
    </select>
  )
}
