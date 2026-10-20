import SmoothScroll from './SmoothScroll.jsx'
import SplitText from './components/SplitText.jsx'
import ScrollReveal from './components/ScrollReveal.jsx'
import ScrollFloat from './components/ScrollFloat.jsx'

export default function App() {
  return (
    <SmoothScroll>
      <section className="panel">
        <SplitText text="Smooth by default" />
        <p className="hint">Scroll down</p>
      </section>

      <section className="panel">
        <ScrollReveal>
          Lenis eases every scroll, and GSAP's ticker drives it, so ScrollTrigger reads the same
          position on every frame and scrubbed animations stay perfectly in sync.
        </ScrollReveal>
      </section>

      <section className="panel">
        <ScrollFloat>Float into view</ScrollFloat>
      </section>

      <section className="panel">
        <SplitText as="h2" text="The end" />
      </section>
    </SmoothScroll>
  )
}
