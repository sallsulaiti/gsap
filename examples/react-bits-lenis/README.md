# GSAP + Lenis + React Bits

A React (Vite) page with [Lenis](https://github.com/darkroomengineering/lenis)
smooth scrolling and three GSAP text effects in the style of
[React Bits](https://reactbits.dev):

| Component | Effect |
| --- | --- |
| `SplitText` | Characters rise into place on mount (GSAP SplitText) |
| `ScrollReveal` | Words fade and un-blur as you scroll (ScrollTrigger scrub) |
| `ScrollFloat` | Characters float up and stretch into place as you scroll |

```bash
npm install
npm run dev
```

## How Lenis is wired up

`src/SmoothScroll.jsx` wraps the app in `<ReactLenis root>` with `autoRaf: false`
and drives Lenis from `gsap.ticker`, so Lenis and ScrollTrigger update on the
same frame:

```jsx
gsap.ticker.add((time) => lenisRef.current?.lenis?.raf(time * 1000)) // GSAP gives seconds, Lenis wants ms
gsap.ticker.lagSmoothing(0)

useLenis(ScrollTrigger.update) // inside <ReactLenis>
```

Animations use `useGSAP` from `@gsap/react`, which reverts them on unmount.
