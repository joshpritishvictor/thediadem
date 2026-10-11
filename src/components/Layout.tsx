import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { useLocation, useOutlet } from 'react-router-dom'
import { easeOutExpo } from '../lib/motion'
import Footer from './Footer'
import Header from './Header'

export default function Layout() {
  const location = useLocation()
  // useOutlet (not <Outlet />) so the old page stays rendered while it animates out
  const outlet = useOutlet()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  return (
    <div className="flex min-h-screen flex-col">
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gold-500"
        style={{ scaleX: progress }}
      />
      <Header />

      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.main
          key={location.pathname}
          className="flex-1"
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
        >
          {outlet}
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  )
}
