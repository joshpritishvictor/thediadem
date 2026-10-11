import { m } from 'motion/react'
import type { ReactNode } from 'react'
import { fadeUp, revealTransition, stagger } from '../lib/motion'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  /** Animate <RevealItem> children one after another */
  staggerChildren?: number
}

/** Fades content up the first time it scrolls into view */
export default function Reveal({
  children,
  className,
  delay = 0,
  staggerChildren,
}: RevealProps) {
  const isStagger = staggerChildren !== undefined

  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={isStagger ? stagger(staggerChildren, delay) : fadeUp}
      transition={isStagger ? undefined : { ...revealTransition, delay }}
    >
      {children}
    </m.div>
  )
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <m.div className={className} variants={fadeUp}>
      {children}
    </m.div>
  )
}
