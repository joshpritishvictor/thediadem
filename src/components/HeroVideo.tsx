import { useEffect, useRef } from 'react'

const GESTURES = ['touchend', 'click', 'keydown'] as const

/**
 * Looping background video behind the hero text.
 *
 * iOS refuses to autoplay video in Low Power Mode (and when Safari's data
 * saving is on), even muted. It does allow playback once the visitor has
 * interacted with the page, so when the initial play() is rejected we show
 * the poster and start the video on their first tap, click or key press.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    // Belt and braces: autoplay policies only allow muted video, and React
    // sets `muted` as a property, so make sure it is really on before playing
    video.muted = true

    const tryPlay = () =>
      video.play().then(
        () => true,
        () => false,
      )

    let removeGestureListeners = () => {}
    const onGesture = async () => {
      if (await tryPlay()) removeGestureListeners()
    }
    const waitForGesture = () => {
      for (const event of GESTURES) {
        window.addEventListener(event, onGesture, { passive: true })
      }
      removeGestureListeners = () => {
        for (const event of GESTURES) {
          window.removeEventListener(event, onGesture)
        }
      }
    }

    // Safari also pauses background video when the tab is hidden; resume it
    const onVisible = () => {
      if (document.visibilityState === 'visible' && video.paused) {
        void tryPlay()
      }
    }
    document.addEventListener('visibilitychange', onVisible)

    void tryPlay().then((played) => {
      if (!played) waitForGesture()
    })

    return () => {
      removeGestureListeners()
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return (
    <video
      ref={ref}
      className="hero-video absolute inset-0 h-full w-full object-cover"
      src="/videos/hero.mp4"
      poster="/videos/hero-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  )
}
