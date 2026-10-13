import { AnimatePresence, m, useScroll, useSpring } from 'motion/react'
import { Suspense, useEffect } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { easeOutExpo } from '../lib/motion'
import { preloadRoute } from '../routes'
import Footer from './Footer'
import Header from './Header'

/** Preload a page's code when the user hovers, focuses or touches a link to it */
function usePreloadOnIntent() {
  useEffect(() => {
    const seen = new Set<string>()
    const onIntent = (event: Event) => {
      const link = (event.target as Element).closest?.('a[href^="/"]')
      if (!(link instanceof HTMLAnchorElement)) return
      const { pathname } = link
      if (seen.has(pathname)) return
      seen.add(pathname)
      preloadRoute(pathname)
    }
    const events = ['pointerover', 'focusin', 'touchstart'] as const
    events.forEach((e) =>
      document.addEventListener(e, onIntent, { passive: true }),
    )
    return () =>
      events.forEach((e) => document.removeEventListener(e, onIntent))
  }, [])
}

/** Turn on section snapping (see index.css) only after the page has rendered and settled */
function useSnapWhenSettled(pathname: string) {
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('snap')
    let timer = 0
    // Retry until the new page's content is in place (it may still be loading)
    const enable = () => {
      timer = window.setTimeout(() => {
        const main = document.getElementById('main')
        if (main && main.offsetHeight > window.innerHeight / 2)
          root.classList.add('snap')
        else enable()
      }, 600)
    }
    if (document.readyState === 'complete') enable()
    else window.addEventListener('load', enable, { once: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('load', enable)
      root.classList.remove('snap')
    }
  }, [pathname])
}

export default function Layout() {
  const { pathname } = useLocation()
  // useOutlet (not <Outlet />) so the old page stays rendered while it animates out
  const outlet = useOutlet()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  usePreloadOnIntent()
  useSnapWhenSettled(pathname)

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only z-[70] rounded-full bg-teal-900 px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <m.div
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gold-500"
        style={{ scaleX: progress }}
      />
      <Header />

      {/* Outside AnimatePresence so navigation keeps the current page visible while the next one loads */}
      <Suspense fallback={<div className="min-h-screen flex-1" />}>
        {/* initial={false}: the first (pre-rendered) page is visible without waiting for JS */}
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={() => window.scrollTo(0, 0)}
        >
          <m.main
            id="main"
            key={pathname}
            className="flex-1"
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
          >
            {outlet}
          </m.main>
        </AnimatePresence>
      </Suspense>

      <Footer />
    </div>
  )
}
