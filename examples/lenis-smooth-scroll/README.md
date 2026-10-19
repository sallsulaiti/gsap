# GSAP + Lenis smooth scroll

Shows [Lenis](https://github.com/darkroomengineering/lenis) smooth scrolling
working with GSAP's ScrollTrigger.

```bash
npm install
npm run dev
```

## Using Lenis alone

Without GSAP, Lenis can run its own animation loop:

```js
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

const lenis = new Lenis({ autoRaf: true })
```

## Using Lenis with ScrollTrigger

With ScrollTrigger, turn `autoRaf` off and drive Lenis from `gsap.ticker`, so
both libraries update on the same frame:

```js
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```
