import { DotLottieReact, setWasmUrl } from '@lottiefiles/dotlottie-react'
import wasmUrl from '@lottiefiles/dotlottie-web/dotlottie-player.wasm?url'
import { useReducedMotion } from 'motion/react'

// Serve the player's WASM from our own build instead of a third-party CDN
setWasmUrl(wasmUrl)

type LottiePlayerProps = {
  /** Path to a .lottie or .json file, e.g. "/animations/hero.lottie" */
  src: string
  className?: string
  loop?: boolean
}

/** Load with React.lazy so the player is only downloaded where it's used */
export default function LottiePlayer({
  src,
  className,
  loop = true,
}: LottiePlayerProps) {
  const reduceMotion = useReducedMotion()

  return (
    <DotLottieReact
      src={src}
      className={className}
      loop={loop}
      autoplay={!reduceMotion}
    />
  )
}
