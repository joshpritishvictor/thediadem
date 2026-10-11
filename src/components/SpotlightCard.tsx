import type { MouseEvent, ReactNode } from 'react'

type SpotlightCardProps = {
  children: ReactNode
  className?: string
}

/** Card whose gold glow follows the cursor (styles in the `card` utility) */
export default function SpotlightCard({
  children,
  className = '',
}: SpotlightCardProps) {
  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  return (
    <div className={`card ${className}`} onMouseMove={handleMove}>
      <div className="relative">{children}</div>
    </div>
  )
}
