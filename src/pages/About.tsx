import { m } from 'motion/react'
import CtaBanner from '../components/CtaBanner'
import PageHero from '../components/PageHero'
import Reveal, { RevealItem } from '../components/Reveal'
import Seo from '../components/Seo'
import { about, type Person } from '../content/about'
import { easeOutExpo } from '../lib/motion'

/** Gold, capitals, 20px: the same style as the other page headings */
const label = 'text-center font-sans eyebrow text-base! font-bold md:text-xl!'

export default function About() {
  return (
    <>
      <Seo title="About Us" description={about.intro} />
      <PageHero title="About Us" compact />

      {/* Meet the people: why we exist, and who we work with, at a glance */}
      <section className="container-page pt-6 pb-16 md:pb-20">
        <Reveal>
          <div>
            <div className="text-center">
              <h2 className={label}>{about.eyebrow}</h2>
              <p className="mt-2 text-sm font-semibold text-ink/60">
                {about.heading}
              </p>
            </div>

            <Reveal
              staggerChildren={0.12}
              className="mt-8 grid gap-4 md:grid-cols-3"
            >
              {about.points.map(({ icon: Icon, title, body }) => (
                <RevealItem key={title} className="h-full">
                  <div className="group h-full rounded-2xl border border-ink/8 bg-card p-5 text-center transition duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-900/10">
                    <span className="mx-auto grid size-12 place-items-center rounded-full bg-teal-900 text-gold-400 transition duration-500 ease-out-expo group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-teal-950">
                      <Icon size={22} />
                    </span>
                    <h3 className="mt-3 text-lg font-semibold">{title}</h3>
                    <p className="mt-1.5 text-sm text-ink/65">{body}</p>
                  </div>
                </RevealItem>
              ))}
            </Reveal>

            {/* Partners: three independent professions, with Diadem helping them work together */}
            <div className="mt-10 border-t border-ink/10 pt-10 text-center">
              <h2 className={label}>{about.partners.eyebrow}</h2>
              <Reveal
                staggerChildren={0.12}
                className="mt-5 flex flex-wrap justify-center gap-3"
              >
                {about.partners.roles.map(({ icon: Icon, title }) => (
                  <RevealItem key={title}>
                    <div className="group inline-flex items-center gap-2 rounded-full border border-ink/8 bg-card px-4 py-1.5 text-sm transition duration-500 ease-out-expo hover:-translate-y-0.5 hover:border-gold-500 hover:shadow-md hover:shadow-gold-500/15">
                      <Icon
                        size={16}
                        className="text-gold-600 transition-transform duration-500 ease-out-expo group-hover:scale-110"
                      />
                      <span className="font-semibold">{title}</span>
                    </div>
                  </RevealItem>
                ))}
              </Reveal>

              <p className="mt-4 text-sm text-ink/65">
                {about.partners.expertise}
              </p>

              <m.p
                className="mt-1 text-lg font-bold text-gold-600"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: 0.2, ease: easeOutExpo }}
              >
                {about.partners.together}
              </m.p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Founders: one full-screen section, like the home page sections */}
      <section className="container-page section-screen">
        <Reveal>
          <h2 className={label}>{about.founders.eyebrow}</h2>
        </Reveal>
        <Reveal
          staggerChildren={0.15}
          className="mx-auto mt-8 grid max-w-5xl gap-6"
        >
          {about.founders.people.map((person) => (
            <RevealItem key={person.name} className="h-full">
              <FounderCard person={person} />
            </RevealItem>
          ))}
        </Reveal>
      </section>

      {/* Team: the next full-screen section */}
      <section className="container-page section-screen">
        <Reveal>
          <h2 className={label}>{about.team.eyebrow}</h2>
        </Reveal>
        <Reveal
          staggerChildren={0.1}
          className="mx-auto mt-8 grid max-w-5xl gap-5 lg:grid-cols-2"
        >
          {about.team.people.map((person) => (
            <RevealItem key={person.name} className="h-full">
              <TeamCard person={person} />
            </RevealItem>
          ))}
        </Reveal>
      </section>

      <CtaBanner />
    </>
  )
}

/** Portrait photo, or the person's initials on a green block when there is no photo yet */
function Portrait({
  person,
  className,
}: {
  person: Person
  className: string
}) {
  const { name, initials, photo } = person

  return photo ? (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={photo}
        alt={name}
        width={720}
        height={900}
        loading="lazy"
        className="size-full object-cover object-[50%_12%] saturate-[0.4] transition duration-700 ease-out-expo group-hover:scale-105 group-hover:saturate-[1.15] [@media(hover:none)]:saturate-100"
      />
    </div>
  ) : (
    <div
      aria-hidden="true"
      className={`grid place-items-center bg-teal-900 font-display text-5xl font-bold text-gold-400 ${className}`}
    >
      {initials}
    </div>
  )
}

function FounderCard({ person }: { person: Person }) {
  const { name, role, body } = person

  // Photo on the left; name, role and description stacked on the right
  return (
    <article className="group relative grid overflow-hidden rounded-3xl border border-ink/8 bg-card transition duration-500 ease-out-expo hover:border-gold-500/50 hover:shadow-2xl hover:shadow-teal-900/10 md:h-[clamp(13rem,30svh,18rem)] md:grid-cols-[14rem_1fr] lg:grid-cols-[16rem_1fr]">
      <Portrait person={person} className="h-56 md:h-full" />
      <div className="flex flex-col justify-center px-6 py-5 md:px-8 md:py-6">
        <h3 className="text-2xl font-semibold">{name}</h3>
        <p className="mt-1 text-sm font-semibold text-gold-600">{role}</p>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">
          {body}
        </p>
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl border-b-2 border-gold-500 transition-[clip-path] duration-700 ease-out-expo [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0)]"
      />
    </article>
  )
}

function TeamCard({ person }: { person: Person }) {
  const { name, role, body } = person

  // Same layout as a founder, smaller: photo left, name, role and description right
  return (
    <article className="group relative grid h-full grid-cols-[6.5rem_1fr] overflow-hidden rounded-3xl border border-ink/8 bg-card transition duration-500 ease-out-expo hover:border-gold-500/50 hover:shadow-xl hover:shadow-teal-900/10 sm:grid-cols-[9rem_1fr] lg:grid-cols-[10rem_1fr]">
      <Portrait person={person} className="h-full min-h-[10rem]" />
      <div className="flex flex-col justify-center px-4 py-4 sm:px-5">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="mt-1 text-sm font-semibold text-gold-600">{role}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink/65">{body}</p>
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl border-b-2 border-gold-500 transition-[clip-path] duration-700 ease-out-expo [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0)]"
      />
    </article>
  )
}
