import CtaBanner from '../components/CtaBanner'
import PageHero from '../components/PageHero'
import Reveal, { RevealItem } from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import Seo from '../components/Seo'
import SpotlightCard from '../components/SpotlightCard'
import { about } from '../content/about'

export default function About() {
  return (
    <>
      <Seo
        title="About Us"
        description={about.story[0]}
        image={about.images.secondary}
      />
      <PageHero eyebrow={about.eyebrow} title="About Us" />

      <section className="container-page pb-24 md:pb-32">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative">
            <img
              src={about.images.primary}
              alt="A Diadem advisor in a client meeting"
              width={700}
              height={930}
              fetchPriority="high"
              className="aspect-[4/5] w-full max-w-md rounded-[2rem] object-cover shadow-2xl shadow-teal-900/15"
            />
            <img
              src={about.images.secondary}
              alt=""
              width={1400}
              height={786}
              loading="lazy"
              className="absolute -right-2 -bottom-10 hidden w-1/2 rounded-3xl border-8 border-cream object-cover shadow-xl sm:block"
            />
          </Reveal>

          <div>
            <SectionHeading title={about.heading} />
            <Reveal className="mt-6 space-y-5 text-lg text-ink/65">
              {about.story.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white/50 py-24 md:py-32">
        <div className="container-page">
          <SectionHeading
            eyebrow="Why Diadem"
            title="A simpler path to the right expertise"
            align="center"
          />
          <Reveal
            staggerChildren={0.08}
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {about.pillars.map(({ icon: Icon, title, body }) => (
              <RevealItem key={title}>
                <SpotlightCard className="h-full">
                  <span className="grid size-12 place-items-center rounded-2xl bg-teal-900 text-gold-400">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-ink/60">{body}</p>
                </SpotlightCard>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
