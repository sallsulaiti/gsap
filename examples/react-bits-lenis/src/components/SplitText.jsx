import { useRef } from 'react'
import gsap from 'gsap'
import { SplitText as GSAPSplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(GSAPSplitText, useGSAP)

// Characters rise into place one after another when the text mounts.
export default function SplitText({ text, as: Tag = 'h1', className = '', delay = 0.03 }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const split = GSAPSplitText.create(ref.current, { type: 'chars', mask: 'chars' })
      gsap.from(split.chars, {
        yPercent: 110,
        duration: 0.8,
        ease: 'power4.out',
        stagger: delay,
      })
      return () => split.revert()
    },
    { scope: ref }
  )

  return (
    <Tag ref={ref} className={`split-text ${className}`}>
      {text}
    </Tag>
  )
}
