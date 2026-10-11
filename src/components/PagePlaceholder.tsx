import Reveal from './Reveal'

type PagePlaceholderProps = {
  title: string
}

export default function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <section className="relative overflow-hidden pt-40 pb-24">
      <div className="absolute -top-24 right-0 size-96 animate-blob rounded-full bg-gold-300/30 blur-3xl" />
      <div className="relative container-page">
        <Reveal>
          <p className="eyebrow">Diadem &amp; Co.</p>
          <h1 className="mt-4 text-5xl font-bold md:text-6xl">{title}</h1>
          <p className="mt-6 text-lg text-ink/60">Content coming soon.</p>
        </Reveal>
      </div>
    </section>
  )
}
