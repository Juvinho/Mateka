import { type RefObject, useEffect } from 'react'

type SpringRevealOptions = {
  rootRef: RefObject<HTMLElement | null>
  selector?: string
  staggerMs?: number
  disabled?: boolean
  includeRoot?: boolean
}

type SpringState = {
  y: number
  velocity: number
  delayUntil: number
  active: boolean
  done: boolean
}

const STIFFNESS = 0.08
const DAMPING = 0.75

export const useSpringReveal = ({
  rootRef,
  selector,
  staggerMs = 60,
  disabled = false,
  includeRoot = false,
}: SpringRevealOptions): void => {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const selected = selector
      ? Array.from(root.querySelectorAll<HTMLElement>(selector))
      : [root]

    const targets = includeRoot ? [root, ...selected.filter((item) => item !== root)] : selected

    if (targets.length === 0) return

    if (disabled) {
      for (const target of targets) {
        target.style.opacity = ''
        target.style.transform = ''
        target.style.willChange = 'auto'
      }
      return
    }

    const stateMap = new Map<HTMLElement, SpringState>()
    for (const target of targets) {
      target.style.opacity = '0'
      target.style.transform = 'translateY(40px)'
      target.style.willChange = 'transform, opacity'

      stateMap.set(target, {
        y: 40,
        velocity: 0,
        delayUntil: 0,
        active: false,
        done: false,
      })
    }

    let frame = 0

    const tick = (now: number): void => {
      let shouldContinue = false

      for (const [target, state] of stateMap) {
        if (state.done) continue
        if (!state.active) {
          shouldContinue = true
          continue
        }

        if (now < state.delayUntil) {
          shouldContinue = true
          continue
        }

        state.velocity += (0 - state.y) * STIFFNESS
        state.velocity *= DAMPING
        state.y += state.velocity

        const opacity = Math.max(0, Math.min(1, 1 - state.y / 40))
        target.style.opacity = opacity.toFixed(3)
        target.style.transform = `translateY(${state.y.toFixed(2)}px)`

        if (Math.abs(state.y) < 0.1 && Math.abs(state.velocity) < 0.1) {
          state.y = 0
          state.velocity = 0
          state.done = true
          target.style.opacity = '1'
          target.style.transform = ''
          target.style.willChange = 'auto'
          continue
        }

        shouldContinue = true
      }

      if (!shouldContinue) return
      frame = window.requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue

          const target = entry.target as HTMLElement
          const state = stateMap.get(target)
          if (!state || state.active) continue

          const index = targets.indexOf(target)
          state.active = true
          state.delayUntil = performance.now() + index * staggerMs

          if (frame === 0) {
            frame = window.requestAnimationFrame(tick)
          }

          observer.unobserve(target)
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    for (const target of targets) {
      observer.observe(target)
    }

    return () => {
      observer.disconnect()
      if (frame !== 0) {
        window.cancelAnimationFrame(frame)
      }

      for (const target of targets) {
        target.style.willChange = 'auto'
      }
    }
  }, [disabled, includeRoot, rootRef, selector, staggerMs])
}
