import type { ReactNode } from 'react'
import Reveal from './Reveal'

type SectionHeadingProps = {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  light?: boolean
  className?: string
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  light = false,
  className = '',
}: SectionHeadingProps) {
  return (
    <Reveal
      className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''} ${className}`}
    >
      {eyebrow && (
        <p className={`eyebrow ${light ? 'text-gold-400' : ''}`}>{eyebrow}</p>
      )}
      <h2 className="mt-4 text-4xl font-bold md:text-5xl">{title}</h2>
      {description && (
        <p
          className={`mt-5 text-lg ${light ? 'text-cream/70' : 'text-ink/65'}`}
        >
          {description}
        </p>
      )}
    </Reveal>
  )
}
