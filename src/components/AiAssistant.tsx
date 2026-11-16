import { ArrowUp, RotateCcw, Sparkles, X } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { Fragment, useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { easeOutExpo } from '../lib/motion'
import { site } from '../content/site'
import { answer, type Reply } from '../lib/assistant'

type Message = { from: 'bot' | 'user'; text: string; link?: Reply['link'] }

// Before a handover, Claude answers and books consultations (functions/api/assistant.ts).
// When the visitor asks for a real person, the chat collects their name, phone and email
// (or Claude does, with its connect_to_team tool) and hands them to the team in GoHighLevel
// on the "Website chat" channel (functions/api/live.ts, functions/_lib/liveChat.ts). From
// then on their messages go to the team, whose replies are polled and shown here.
// If Claude can't be reached, the chat answers from the site's own FAQs and services.
const assistantEndpoint =
  import.meta.env.VITE_ASSISTANT_ENDPOINT || '/api/assistant'
const liveEndpoint = '/api/live'
const POLL_MS = 4000
/** No reply from the team yet after this long: say they'll follow up */
const NUDGE_MS = 3 * 60_000
/** Stop checking for replies after this long without any */
const IDLE_MS = 60 * 60_000
/** Allows for the browser's clock being a little off from GoHighLevel's */
const CLOCK_SLACK_MS = 2 * 60_000
/** Earlier messages sent to the team with the handover, so they have the context */
const TRANSCRIPT_MESSAGES = 12
const TEAM = 'Client Relations'

// Asking for a real person: the chat collects their name, phone and email itself
const PERSON =
  /\b(real person|real human|human|live agent|real agent|an agent|representative|someone real|real people|(talk|speak|chat) (to|with) (a |an )?(person|someone|somebody|team|staff))\b/i
const PHONE = /^[+()\-.\s\d]{7,30}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Details = {
  step: 'name' | 'phone' | 'email'
  name?: string
  phone?: string
}

type ChatReply = { id: string; text: string; at: number }

async function live(body: object) {
  const response = await fetch(liveEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`Live chat: ${response.status}`)
  return (await response.json()) as { session?: string; replies?: ChatReply[] }
}

/** Claude's reply; `live` is set when it has handed the visitor to the team */
async function ask(history: Message[]): Promise<Reply & { live?: string }> {
  const question = history[history.length - 1].text
  try {
    const response = await fetch(assistantEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: history.map((m) => ({
          role: m.from === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
      }),
    })
    if (!response.ok) return answer(question)
    const data = (await response.json()) as {
      reply?: string
      link?: string
      label?: string
      live?: string
    }
    if (!data.reply) return answer(question)
    return {
      text: data.reply,
      ...(data.link && {
        link: { to: data.link, label: data.label ?? 'Learn more' },
      }),
      ...(data.live && { live: data.live }),
    }
  } catch {
    return answer(question)
  }
}

/** The chat so far, as plain text for the team */
const transcript = (messages: Message[]) =>
  messages
    .slice(1) // the canned welcome
    .slice(-TRANSCRIPT_MESSAGES)
    .map((m) => `${m.from === 'user' ? 'Visitor' : 'Kiara'}: ${m.text}`)
    .join('\n')

/** Text with web addresses as links (e.g. an appointment link from the team) */
function Linked({ text }: { text: string }) {
  return text.split(/(https?:\/\/[^\s<>"]+)/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold break-all text-teal-900 underline decoration-gold-500 underline-offset-4"
      >
        {part}
      </a>
    ) : (
      part
    ),
  )
}

const welcome: Message = {
  from: 'bot',
  text: 'Hi, I’m Kiara, Diadem’s assistant. Ask me about our services or how we work, or I can book your free consultation right here.',
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
  // Set once the visitor is handed to the team: a session for /api/live
  const [session, setSession] = useState<string | null>(null)
  // Collecting their details for a real person (null: not collecting)
  const [details, setDetails] = useState<Details | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const end = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  // Bumped by "Start a new chat", so replies still on their way to the old chat are dropped
  const chatId = useRef(0)

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

  // On phones the open chat covers most of the screen: keep the page behind it still
  useEffect(() => {
    if (!open || !window.matchMedia('(max-width: 639px)').matches) return
    const html = document.documentElement
    const before = [html.style.overflow, document.body.style.overflow]
    html.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    // iOS Safari can still scroll the page by touch: only let the messages scroll
    const onTouchMove = (e: TouchEvent) => {
      if (!(e.target instanceof Node && scroller.current?.contains(e.target)))
        e.preventDefault()
    }
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      ;[html.style.overflow, document.body.style.overflow] = before
      document.removeEventListener('touchmove', onTouchMove)
    }
  }, [open])

  // Handed over: check for the team's replies and show them in the chat
  useEffect(() => {
    if (!session) return
    const seen = new Set<string>()
    const started = Date.now()
    let since = started - CLOCK_SLACK_MS
    let lastReply = started
    let nudged = false
    let timer = 0

    const tick = async () => {
      try {
        const { replies = [] } = await live({ action: 'poll', session, since })
        const fresh = replies.filter((r) => !seen.has(r.id))
        if (fresh.length) {
          fresh.forEach((r) => seen.add(r.id))
          since = Math.max(since, ...fresh.map((r) => r.at))
          lastReply = Date.now()
          nudged = true
          setMessages((prev) => [
            ...prev,
            ...fresh.map((r) => ({ from: 'bot' as const, text: r.text })),
          ])
          setOpen(true)
        }
      } catch {
        // Try again on the next tick
      }
      if (!nudged && Date.now() - started > NUDGE_MS) {
        nudged = true
        setMessages((prev) => [
          ...prev,
          {
            from: 'bot',
            text: `Our ${TEAM} team hasn’t picked this up yet. They’ll reply right here, or contact you by phone or email, as soon as they can.`,
          },
        ])
      }
      if (Date.now() - lastReply < IDLE_MS)
        timer = window.setTimeout(tick, POLL_MS)
    }
    timer = window.setTimeout(tick, POLL_MS)
    return () => window.clearTimeout(timer)
  }, [session])

  /** A short pause, then a message from the chat itself */
  async function say(text: string) {
    const id = chatId.current
    setTyping(true)
    await new Promise((r) => setTimeout(r, 600))
    if (id !== chatId.current) return
    setMessages((prev) => [...prev, { from: 'bot', text }])
    setTyping(false)
  }

  /** Clears the conversation (and any handover) and starts again from the welcome */
  function restart() {
    chatId.current += 1
    setMessages([welcome])
    setSession(null)
    setDetails(null)
    setTyping(false)
    setDraft('')
    input.current?.focus()
  }

  /** Next step of collecting name, phone and email; true if the message was handled here */
  async function collectDetails(text: string, history: Message[]) {
    // A suggestion clicked mid-way isn't an answer: stop asking and handle it normally
    const step = suggestions.includes(text) ? null : details
    if (details && !step) setDetails(null)
    if (!step) {
      if (!PERSON.test(text)) return false
      setDetails({ step: 'name' })
      await say(
        `Of course, I’ll connect you with our ${TEAM} team. First, what’s your full name?`,
      )
      return true
    }

    if (step.step === 'name') {
      setDetails({ step: 'phone', name: text.slice(0, 160) })
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
      setDetails({ ...step, step: 'email', phone: text })
      await say('And your email address?')
      return true
    }

    if (!EMAIL.test(text)) {
      await say('That doesn’t look like an email address. Could you check it?')
      return true
    }
    setDetails(null)
    setTyping(true)
    const id = chatId.current
    try {
      const result = await live({
        action: 'person',
        name: step.name,
        phone: step.phone,
        email: text,
        transcript: transcript(history),
      })
      if (!result.session) throw new Error('Live chat: no session')
      if (id !== chatId.current) return true
      setTyping(false)
      setSession(result.session)
      await say(
        `Thanks, ${step.name?.split(/\s+/)[0]}. I’ve passed this to our ${TEAM} team, and someone will reply right here shortly.`,
      )
    } catch {
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
    const history: Message[] = [...messages, { from: 'user', text: trimmed }]
    setMessages(history)
    setDraft('')

    // Handed over: the message goes to the team, who reply in this chat
    if (session) {
      try {
        await live({ action: 'send', session, text: trimmed })
      } catch {
        await say(
          'That message didn’t go through. Please try again in a moment.',
        )
      }
      return
    }

    if (await collectDetails(trimmed, history)) return

    setTyping(true)
    const id = chatId.current
    const [reply] = await Promise.all([
      ask(history),
      new Promise((r) => setTimeout(r, 700)), // a short pause so the reply feels considered
    ])
    if (id !== chatId.current) return
    const { live: handedOver, ...rest } = reply
    setMessages([...history, { from: 'bot', ...rest }])
    setTyping(false)
    if (handedOver) setSession(handedOver)
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
                onClick={restart}
                aria-label="Start a new chat"
                title="Start a new chat"
                className="grid size-8 place-items-center rounded-full text-cream/80 transition hover:bg-cream/10 hover:text-cream"
              >
                <RotateCcw size={17} />
              </button>
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
              ref={scroller}
              className="min-h-0 flex-1 [scrollbar-width:thin] [scrollbar-color:theme(colors.gold.500)_transparent] space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
              aria-live="polite"
            >
              {messages.map((message, i) => (
                <Fragment key={i}>
                  <m.div
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
                      <Linked text={message.text} />
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
                  {/* The suggestions stay under the welcome message */}
                  {i === 0 && (
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
                </Fragment>
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
