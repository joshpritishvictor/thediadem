import { animate, useInView } from 'motion/react'
import { useEffect, useRef } from 'react'

type CounterProps = {
  value: number
  prefix?: string
  suffix?: string
  className?: string
}

/** Counts up from 0 when scrolled into view. Renders the final value without JS. */
export default function Counter({
  value,
  prefix = '',
  suffix = '',
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    const node = ref.current
    if (!inView || !node) return
    // Writes straight to the DOM so counting doesn't re-render React
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = `${prefix}${Math.round(v)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, value, prefix, suffix])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  )
}
