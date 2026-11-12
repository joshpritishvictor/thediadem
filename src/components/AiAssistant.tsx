import { ArrowUp, Sparkles, X } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { easeOutExpo } from '../lib/motion'
import { site } from '../content/site'
import { answer, type Reply } from '../lib/assistant'

type Message = { from: 'bot' | 'user'; text: string; link?: Reply['link'] }

// The chat runs on GoHighLevel (functions/api/live.ts, functions/_lib/liveChat.ts): each
// message goes into a GHL conversation, Kiara (GHL's AI agent) answers there, and her
// replies, or the team's after she hands over, are polled and shown here.
// If GHL can't be reached, the chat answers from the site's own FAQs and services.
const endpoint = '/api/live'
/** How often to check for replies: quickly while one is expected, slower otherwise */
const FAST_POLL_MS = 2000
const SLOW_POLL_MS = 6000
/** Waiting longer than this for a reply: stop the typing dots and say the team will follow up */
const REPLY_TIMEOUT_MS = 45_000
/** Stop checking for replies after this long with no activity */
const IDLE_MS = 60 * 60_000
/** Allows for the browser's clock being a little off from GoHighLevel's */
const CLOCK_SLACK_MS = 2 * 60_000
const TEAM = 'Client Relations'

/** Current time; only called from event handlers and timers */
const now = () => Date.now()

// Asking for a real person: the chat collects their name, phone and email itself, saves
// them on the GHL contact, then passes the request to Kiara so her Human Handover runs
const PERSON =
  /\b(real person|real human|human|live agent|real agent|an agent|representative|someone real|real people|(talk|speak|chat) (to|with) (a |an )?(person|someone|somebody|team|staff))\b/i
const PHONE = /^[+()\-.\s\d]{7,30}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Details = {
  step: 'name' | 'phone' | 'email'
  name?: string
  phone?: string
}

type ChatReply = {
  id: string
  text: string
  at: number
  from: 'agent' | 'team'
}

async function chat(body: object) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`Chat: ${response.status}`)
  return (await response.json()) as { session?: string; replies?: ChatReply[] }
}

const welcome: Message = {
  from: 'bot',
  text: 'Hi, I’m Kiara, Diadem’s assistant. Ask me about our services or how we work, or I can help you book a free consultation.',
}

const suggestions = [
  'What services do you offer?',
  'How is Diadem different?',
  'Book a free consultation',
  'Talk to a real person',
]

/** Floating assistant at the bottom right: a round button that opens a small chat */
export default function AiAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([welcome])
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState('')
  // The visitor's GHL conversation, once they've sent a message
  const [session, setSession] = useState<string | null>(null)
  // When the visitor last sent a message and is waiting for a reply (0: not waiting)
  const waitingSince = useRef(0)
  const lastActivity = useRef(0)
  // Collecting their details for a real person (null: not collecting)
  const details = useRef<Details | null>(null)
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

  // Check for Kiara's and the team's replies and show them in the chat
  useEffect(() => {
    if (!session) return
    const seen = new Set<string>()
    let since = Date.now() - CLOCK_SLACK_MS
    let timer = 0

    const tick = async () => {
      try {
        const { replies = [] } = await chat({ action: 'poll', session, since })
        const fresh = replies.filter((r) => !seen.has(r.id))
        if (fresh.length) {
          fresh.forEach((r) => seen.add(r.id))
          since = Math.max(since, ...fresh.map((r) => r.at))
          waitingSince.current = 0
          lastActivity.current = Date.now()
          setTyping(false)
          setMessages((prev) => [
            ...prev,
            ...fresh.map((r) => ({
              from: 'bot' as const,
              text: r.from === 'team' ? `${TEAM}: ${r.text}` : r.text,
            })),
          ])
          setOpen(true)
        }
      } catch {
        // Try again on the next tick
      }

      const waiting = waitingSince.current
      if (waiting && Date.now() - waiting > REPLY_TIMEOUT_MS) {
        waitingSince.current = 0
        setTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            from: 'bot',
            text: `Thanks for your message. Our ${TEAM} team will get back to you right here as soon as they can.`,
          },
        ])
      }
      if (Date.now() - lastActivity.current < IDLE_MS)
        timer = window.setTimeout(
          tick,
          waitingSince.current ? FAST_POLL_MS : SLOW_POLL_MS,
        )
    }
    timer = window.setTimeout(tick, FAST_POLL_MS)
    return () => window.clearTimeout(timer)
  }, [session])

  /** A short pause, then a message from the chat itself (not from GHL) */
  async function say(text: string) {
    setTyping(true)
    await new Promise((r) => setTimeout(r, 600))
    setMessages((prev) => [...prev, { from: 'bot', text }])
    setTyping(false)
  }

  /** Next step of collecting name, phone and email; true if the message was handled here */
  async function collectDetails(text: string) {
    const step = details.current
    if (!step) {
      if (!PERSON.test(text)) return false
      details.current = { step: 'name' }
      await say(
        `Of course, I’ll connect you with our ${TEAM} team. First, what’s your full name?`,
      )
      return true
    }

    if (step.step === 'name') {
      details.current = { step: 'phone', name: text.slice(0, 160) }
      await say(
        `Thanks, ${text.split(/\s+/)[0]}. What’s the best phone number to reach you?`,
      )
      return true
    }
    if (step.step === 'phone') {
      if (!PHONE.test(text) || text.replace(/\D/g, '').length < 7) {
        await say('That doesn’t look like a phone number. Could you check it?')
        return true
      }
      details.current = { ...step, step: 'email', phone: text }
      await say('And your email address?')
      return true
    }

    if (!EMAIL.test(text)) {
      await say('That doesn’t look like an email address. Could you check it?')
      return true
    }
    details.current = null
    setTyping(true)
    waitingSince.current = now()
    lastActivity.current = now()
    try {
      const result = await chat({
        action: 'person',
        session,
        name: step.name,
        phone: step.phone,
        email: text,
      })
      if (!result.session) throw new Error('Chat: no session')
      setSession(result.session)
    } catch {
      waitingSince.current = 0
      setTyping(false)
      await say(
        `Sorry, I couldn’t reach the team just now. Please call us at ${site.contact.phone}, or try again in a moment.`,
      )
    }
    return true
  }

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || typing) return
    setMessages((prev) => [...prev, { from: 'user', text: trimmed }])
    setDraft('')
    if (await collectDetails(trimmed)) return
    setTyping(true)
    waitingSince.current = now()
    lastActivity.current = now()

    try {
      if (session) {
        await chat({ action: 'send', session, text: trimmed })
      } else {
        const started = await chat({ action: 'start', text: trimmed })
        if (!started.session) throw new Error('Chat: no session')
        setSession(started.session)
      }
    } catch {
      // GHL unreachable: answer from the site's own FAQs and services instead
      waitingSince.current = 0
      await new Promise((r) => setTimeout(r, 700))
      setMessages((prev) => [...prev, { from: 'bot', ...answer(trimmed) }])
      setTyping(false)
    }
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
            aria-label="Kiara, Diadem assistant"
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
                <p className="font-semibold text-gold-300">Kiara</p>
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
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
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
          aria-label="Chat with Kiara"
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
            Ask Kiara
          </span>
        </m.button>
      )}
    </div>
  )
}
