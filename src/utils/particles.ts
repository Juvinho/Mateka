import gsap from 'gsap'

const SYMBOLS = ['∂', '∑', 'π', '∫', '∇', 'λ']

export const createSymbolBurst = (el: HTMLElement, count = 4) => {
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span')
    span.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    span.style.cssText = `position:fixed; pointer-events:none; z-index:9999; font-size:11px; color:rgba(34,211,238,0.9); font-family:monospace;`;
    document.body.appendChild(span)
    const rect = el.getBoundingClientRect()
    const x = rect.left + Math.random() * rect.width
    const y = rect.top + Math.random() * rect.height
    gsap.fromTo(
      span,
      { x, y, opacity: 1, scale: 0.5 },
      {
        x: x + (Math.random() - 0.5) * 80,
        y: y - 40 - Math.random() * 30,
        opacity: 0,
        scale: 1.2,
        duration: 0.7 + Math.random() * 0.3,
        ease: 'power2.out',
        onComplete: () => span.remove(),
      },
    )
  }
}

export default createSymbolBurst
