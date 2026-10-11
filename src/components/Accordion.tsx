import { Plus } from 'lucide-react'
import { m } from 'motion/react'
import { useId, useState } from 'react'
import type { Faq } from '../content/services'
import { easeOutExpo } from '../lib/motion'

type AccordionProps = {
  items: Faq[]
  /** Index open on first render; -1 for none */
  defaultOpen?: number
  light?: boolean
}

export default function Accordion({
  items,
  defaultOpen = 0,
  light = false,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()

  return (
    <div
      className={`divide-y rounded-3xl border ${
        light
          ? 'divide-cream/10 border-cream/10 bg-cream/5'
          : 'divide-ink/8 border-ink/8 bg-white'
      }`}
    >
      {items.map(({ question, answer }, i) => {
        const isOpen = open === i
        const panelId = `${id}-panel-${i}`
        return (
          <div key={question}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-display text-lg font-semibold md:px-8"
              >
                {question}
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full transition duration-300 ${
                    isOpen
                      ? 'rotate-45 bg-gold-500 text-teal-950'
                      : light
                        ? 'bg-cream/10'
                        : 'bg-teal-900/8 text-teal-900'
                  }`}
                >
                  <Plus size={16} />
                </span>
              </button>
            </h3>
            {/* Always in the DOM (so answers are in the pre-rendered HTML for search engines); inert when closed */}
            <m.div
              id={panelId}
              role="region"
              inert={!isOpen}
              className="overflow-hidden"
              initial={false}
              animate={
                isOpen
                  ? { height: 'auto', opacity: 1 }
                  : { height: 0, opacity: 0 }
              }
              transition={{ duration: 0.4, ease: easeOutExpo }}
            >
              <p
                className={`px-6 pb-6 md:px-8 ${light ? 'text-cream/70' : 'text-ink/65'}`}
              >
                {answer}
              </p>
            </m.div>
          </div>
        )
      })}
    </div>
  )
}
