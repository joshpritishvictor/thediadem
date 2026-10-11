import { LazyMotion, MotionConfig } from 'motion/react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { routes } from './routes'

// Animation features are split out of the main bundle and loaded after first render
const loadMotionFeatures = () =>
  import('./lib/motion-features').then((mod) => mod.default)

export default function App() {
  return (
    // strict: errors if a full `motion.*` component sneaks in and undoes the split
    <LazyMotion features={loadMotionFeatures} strict>
      {/* Honour the OS "reduce motion" setting for every animation */}
      <MotionConfig reducedMotion="user">
        <Routes>
          <Route element={<Layout />}>
            {routes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>
        </Routes>
      </MotionConfig>
    </LazyMotion>
  )
}
