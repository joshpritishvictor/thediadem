import type { Transition, Variants } from 'motion/react'

export const easeOutExpo = [0.16, 1, 0.3, 1] as const

export const revealTransition: Transition = { duration: 0.8, ease: easeOutExpo }

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: revealTransition },
}

export const stagger = (
  staggerChildren = 0.1,
  delayChildren = 0,
): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
})
