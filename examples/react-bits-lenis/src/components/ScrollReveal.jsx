import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Words fade and un-blur in step with the scroll position.
export default function ScrollReveal({ children, className = '' }) {
  const ref = useRef(null)
  const words = children.split(/(\s+)/)

  useGSAP(
    () => {
      gsap.fromTo(
        '.word',
        { opacity: 0.1, filter: 'blur(4px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'none',
          stagger: 0.05,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 85%',
            end: 'bottom 50%',
            scrub: true,
          },
        }
      )
    },
    { scope: ref }
  )

  return (
    <p ref={ref} className={`scroll-reveal ${className}`}>
      {words.map((word, i) =>
        /^\s+$/.test(word) ? word : (
          <span className="word" key={i}>
            {word}
          </span>
        )
      )}
    </p>
  )
}
