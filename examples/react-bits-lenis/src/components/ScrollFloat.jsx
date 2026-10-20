import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Characters float up and stretch into place as the heading scrolls into view.
export default function ScrollFloat({ children, className = '' }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '.char',
        { opacity: 0, yPercent: 120, scaleY: 2.3, scaleX: 0.7, transformOrigin: '50% 0%' },
        {
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          ease: 'back.inOut(2)',
          stagger: 0.03,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom-=10%',
            end: 'bottom center',
            scrub: true,
          },
        }
      )
    },
    { scope: ref }
  )

  return (
    <h2 ref={ref} className={`scroll-float ${className}`}>
      {children.split('').map((char, i) => (
        <span className="char" key={i}>
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </h2>
  )
}
