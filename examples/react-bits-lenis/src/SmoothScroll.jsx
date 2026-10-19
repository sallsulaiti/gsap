import { useEffect, useRef } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Lenis on the root scroller, driven by GSAP's ticker so Lenis and
// ScrollTrigger update on the same frame.
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    // Lenis is created after this effect runs, so read the ref on every tick.
    const update = (time) => lenisRef.current?.lenis?.raf(time * 1000) // GSAP gives seconds, Lenis wants ms
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => gsap.ticker.remove(update)
  }, [])

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  )
}

function ScrollTriggerSync() {
  useLenis(ScrollTrigger.update)
  return null
}
