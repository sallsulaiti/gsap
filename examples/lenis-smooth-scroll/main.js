// npm i lenis
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Drive Lenis from GSAP's ticker instead of `autoRaf: true` so Lenis and
// ScrollTrigger update on the same frame (no jitter on pinned/scrubbed triggers).
const lenis = new Lenis({ autoRaf: false })

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

gsap.utils.toArray('.box').forEach((box) => {
  gsap.from(box, {
    x: -200,
    rotation: -45,
    opacity: 0,
    scrollTrigger: {
      trigger: box,
      start: 'top 80%',
      end: 'top 30%',
      scrub: true,
    },
  })
})
