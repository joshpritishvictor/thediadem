import { ArrowUp, Sparkles, X } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { easeOutExpo } from '../lib/motion'
import { answer, type Reply } from '../lib/assistant'

type Message = { from: 'bot' | 'user'; text: string; link?: Reply['link'] }

// Optional: a backend that turns the conversation into an answer. It receives
// { messages: [{ role: 'user' | 'assistant', content }] } and returns { reply }.
// Without it, the assistant answers from the site's own FAQs and services.
const endpoint = import.meta.env.VITE_ASSISTANT_ENDPOINT

const welcome: Message = {
  from: 'bot',
  text: 'Hi, I’m Crest, Diadem’s assistant. Ask me about our services or how we work, and I’ll point you in the right direction.',
}

const suggestions = [
  'What services do you offer?',
  'How is Diadem different?',
  'How do I book a consultation?',
]

async function ask(history: Message[]): Promise<Reply> {
  const question = history[history.length - 1].text
  if (!endpoint) return answer(question)

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: history.map((m) => ({
          role: m.from === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
      }),
    })
    const data = (await response.json()) as { reply?: string }
    return data.reply ? { text: data.reply } : answer(question)
  } catch {
    return answer(question)
  }
}

/** Floating assistant at the bottom right: a round button that opens a small chat */
export default function AiAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([welcome])
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, typing, open])

  useEffect(() => {
    if (!open) return
    input.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || typing) return
    const history: Message[] = [...messages, { from: 'user', text: trimmed }]
    setMessages(history)
    setDraft('')
    setTyping(true)
    const [reply] = await Promise.all([
      ask(history),
      new Promise((r) => setTimeout(r, 700)), // a short pause so the reply feels considered
    ])
    setMessages([...history, { from: 'bot', ...reply }])
    setTyping(false)
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    void send(draft)
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {open && (
          <m.section
            role="dialog"
            aria-label="Crest, Diadem assistant"
            className="absolute right-0 bottom-0 flex h-[48rem] max-h-[calc(100svh-7rem)] w-[calc(100vw-2rem)] max-w-sm origin-bottom-right flex-col overflow-hidden rounded-3xl border border-gold-500/30 bg-card shadow-2xl shadow-teal-900/25 sm:max-w-md"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
          >
            <header className="flex items-center gap-3 bg-teal-900 px-4 py-3.5 text-cream">
              <span className="grid size-10 place-items-center rounded-full bg-gold-500 text-teal-950">
                <Sparkles size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gold-300">Crest</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="grid size-8 place-items-center rounded-full text-cream/80 transition hover:bg-cream/10 hover:text-cream"
              >
                <X size={18} />
              </button>
            </header>

            <div
              className="min-h-0 flex-1 [scrollbar-width:thin] [scrollbar-color:theme(colors.gold.500)_transparent] space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
              aria-live="polite"
            >
              {messages.map((message, i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: easeOutExpo }}
                  className={
                    message.from === 'user' ? 'flex justify-end' : 'flex'
                  }
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      message.from === 'user'
                        ? 'rounded-br-md bg-teal-900 text-cream'
                        : 'rounded-bl-md border border-gold-500/25 bg-beige text-ink'
                    }`}
                  >
                    {message.text}
                    {message.link && (
                      <Link
                        to={message.link.to}
                        onClick={() => setOpen(false)}
                        className="mt-2 block font-semibold text-teal-900 underline decoration-gold-500 underline-offset-4"
                      >
                        {message.link.label}
                      </Link>
                    )}
                  </div>
                </m.div>
              ))}

              {typing && (
                <div className="flex" aria-label="The assistant is typing">
                  <div className="flex gap-1 rounded-2xl rounded-bl-md border border-gold-500/25 bg-beige px-4 py-3.5">
                    {[0, 1, 2].map((dot) => (
                      <m.span
                        key={dot}
                        className="size-1.5 rounded-full bg-teal-900/50"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: dot * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {messages.length === 1 && !typing && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void send(s)}
                      className="rounded-full border border-gold-500/50 bg-beige px-3 py-1 text-xs font-semibold text-teal-900 transition hover:border-gold-500 hover:bg-gold-500/20"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div ref={end} />
            </div>

            <form
              onSubmit={onSubmit}
              className="border-t border-gold-500/30 bg-card p-3"
            >
              <div className="flex items-center gap-2 rounded-full border border-gold-500/40 bg-beige py-1 pr-1 pl-4">
                <input
                  ref={input}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask a question…"
                  aria-label="Your question"
                  className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink/45 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || typing}
                  aria-label="Send"
                  className="grid size-9 place-items-center rounded-full bg-gold-500 text-teal-950 transition hover:bg-gold-400 disabled:opacity-40"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
              <p className="mt-2 text-center text-[0.65rem] text-ink/45">
                Automated assistant. General information only, not financial,
                tax or legal advice.
              </p>
            </form>
          </m.section>
        )}
      </AnimatePresence>

      {!open && (
        <m.button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Chat with Crest"
          className="group relative grid size-12 place-items-center rounded-full bg-teal-900 text-gold-400 shadow-xl shadow-teal-900/30 transition-colors hover:bg-teal-800"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-ping rounded-full border border-gold-500/60 [animation-duration:2.8s]"
          />
          <Sparkles size={21} className="relative" />
          <span className="pointer-events-none absolute right-full mr-3 hidden rounded-full bg-teal-900 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-gold-300 opacity-0 shadow-lg transition group-hover:opacity-100 lg:block">
            Ask Crest
          </span>
        </m.button>
      )}
    </div>
  )
}
