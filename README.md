# Animated Website — Portfolio & Agency

A multi-section portfolio and freelance agency website showcasing purposeful CSS and JavaScript animation, dark/light theme switching, animated counters, pricing cards, FAQ accordion, and a validated contact form. Built with vanilla HTML, CSS, JavaScript and Animate.css.

## Features

- **9 sections:** Hero, Stats, About, Services, Work, Gallery, Process, Pricing, Reviews, FAQ, Contact
- **Dark / Light theme** toggle — reads from `localStorage`, falls back to system preference (`prefers-color-scheme`)
- **Animate.css integration** with a JS lifecycle that adds the class, waits for `animationend`, then removes it so hover transforms still work
- **IntersectionObserver** scroll-reveal for all sections below the hero
- **Animated counters** using `requestAnimationFrame` with cubic ease-out
- **Pricing tier cards** (Starter, Business, Custom) with a featured highlight
- **FAQ section** using native `<details>` / `<summary>` elements
- **Contact form** with blur/input validation and headShake animation on error
- **Mobile hamburger menu** with CSS transform morphing (two bars → X)
- **Sticky header** with scroll-aware bottom border
- **Skip link** and full keyboard accessibility
- `prefers-reduced-motion` — all animations suppressed when set

## Tech Stack

- HTML5 (semantic elements, ARIA attributes, `<details>`)
- CSS3 (Grid, Flexbox, `clamp()`, custom properties, `color-mix()`, custom keyframes)
- JavaScript (IIFE, IntersectionObserver, requestAnimationFrame, localStorage, matchMedia)
- Animate.css 4.1.1
- Google Fonts: Fraunces, Inter
- Images: Picsum Photos (placeholder)

## Files

| File | Purpose |
| :--- | :--- |
| `index.html` | Full page structure — all 9 sections |
| `style.css` | Design tokens (light + dark), layout, animations, responsive breakpoints |
| `script.js` | Theme toggle, header scroll, reveal observer, counters, form validation |

## Run Locally

Open `index.html` in any browser.
