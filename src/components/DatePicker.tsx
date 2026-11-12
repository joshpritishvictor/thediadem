import { CalendarDays } from 'lucide-react'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { DayPicker, type Matcher } from 'react-day-picker'
import 'react-day-picker/style.css'

const pad = (n: number) => String(n).padStart(2, '0')

/** YYYY-MM-DD ↔ a local Date for that calendar day (the picker works in local dates) */
const toDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}
const toValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

type DatePickerProps = {
  /** Submitted with the form as YYYY-MM-DD, or empty */
  name: string
  value: string
  onChange: (value: string) => void
  /** First and last pickable days, YYYY-MM-DD ('' until known in the browser) */
  min: string
  max: string
  /** Days to grey out, besides those outside min–max */
  isDisabled?: (value: string) => boolean
  /** ID of the visible label, so screen readers announce it */
  labelId: string
  placeholder?: string
  className?: string
}

/**
 * A field-styled button that opens a calendar. Unlike <input type="date">, it can
 * grey out individual days (e.g. Sundays).
 */
export default function DatePicker({
  name,
  value,
  onChange,
  min,
  max,
  isDisabled,
  labelId,
  placeholder = 'Select a date',
  className = '',
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const valueId = useId()

  // Close when clicking anywhere outside the field and calendar
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  function close() {
    setOpen(false)
    trigger.current?.focus()
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && open) {
      event.stopPropagation()
      close()
    }
  }

  const selected = value ? toDate(value) : undefined
  const disabled: Matcher[] = min
    ? [
        { before: toDate(min) },
        { after: toDate(max) },
        (date: Date) => isDisabled?.(toValue(date)) ?? false,
      ]
    : []

  return (
    <div ref={root} className="relative" onKeyDown={onKeyDown}>
      <input type="hidden" name={name} value={value} />
      <button
        ref={trigger}
        type="button"
        // Usable once "today" is known in the browser
        disabled={!min}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={`${labelId} ${valueId}`}
        className={`${className} flex items-center justify-between gap-3 text-left`}
      >
        <span id={valueId} className={value ? '' : 'text-ink/45'}>
          {selected
            ? selected.toLocaleDateString('en-CA', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : placeholder}
        </span>
        <CalendarDays size={18} className="shrink-0 text-ink/60" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose a call date"
          className="date-picker absolute top-full left-0 z-20 mt-2 rounded-2xl border border-gold-500/40 bg-card p-3 text-ink shadow-xl shadow-teal-950/20"
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              onChange(date ? toValue(date) : '')
              close()
            }}
            disabled={disabled}
            today={toDate(min)}
            startMonth={toDate(min)}
            endMonth={toDate(max)}
            defaultMonth={selected ?? toDate(min)}
            autoFocus
            footer={
              value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange('')
                    close()
                  }}
                  className="mt-2 text-sm font-medium text-gold-600 underline underline-offset-4 hover:text-ink"
                >
                  Clear date
                </button>
              )
            }
          />
        </div>
      )}
    </div>
  )
}
