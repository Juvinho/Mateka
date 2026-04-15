import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import BackgroundCanvas from './components/BackgroundCanvas'
import CustomCursor from './components/CustomCursor'
import { PlaygroundErrorBoundary } from './components/PlaygroundErrorBoundary'
import Footer from './components/Footer'
import HeroSection from './components/HeroSection'
import LoadingScreen from './components/LoadingScreen'
import ModuleGrid from './components/ModuleGrid'
import NavBar from './components/NavBar'
import StatsBar from './components/StatsBar'
import StatsCounter from './components/StatsCounter'
import TestimonialSection from './components/TestimonialSection'
import WavePlayground from './components/WavePlayground'
import WhyItMatters from './components/WhyItMatters'
import { useAmbience } from './hooks/useAmbience'
import { useScrollProgress } from './hooks/useScrollProgress'

const DerivativeVisualizer = lazy(() => import('./components/DerivativeVisualizer'))
const IntegralVisualizer = lazy(() => import('./components/IntegralVisualizer'))

const lessonTitles: Record<string, string> = {
  '#aula-1': 'Aula 1 — Conceitos Básicos',
  '#aula-2': 'Aula 2 — Pré-Cálculo Visual',
}

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

const App = () => {
  const [activeHash, setActiveHash] = useState(window.location.hash || '#hero')
  const [loadingVisible, setLoadingVisible] = useState(
    () => sessionStorage.getItem('mateka:loaded') !== 'true',
  )
  const [professorMode, setProfessorMode] = useState(false)
  const [konamiFlashVisible, setKonamiFlashVisible] = useState(false)
  const [professorMessageVisible, setProfessorMessageVisible] = useState(false)

  const konamiIndexRef = useRef(0)
  const flashTimeoutRef = useRef<number | null>(null)
  const messageTimeoutRef = useRef<number | null>(null)
  const professorTimeoutRef = useRef<number | null>(null)

  const progress = useScrollProgress()
  const { enabled: ambienceEnabled, toggle: toggleAmbience } = useAmbience()

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const touchDevice = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none), (pointer: coarse)').matches,
    [],
  )

  const navigateTo = useCallback((hash: string): void => {
    const nextHash = hash.startsWith('#') ? hash : `#${hash}`

    history.pushState({ hash: nextHash }, '', nextHash)
    setActiveHash(nextHash)

    if (nextHash.startsWith('#aula-')) return

    const targetId = nextHash.replace('#', '')
    const target = document.getElementById(targetId)

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  useEffect(() => {
    const onLocationChange = (): void => {
      setActiveHash(window.location.hash || '#hero')
    }

    window.addEventListener('popstate', onLocationChange)
    window.addEventListener('hashchange', onLocationChange)

    return () => {
      window.removeEventListener('popstate', onLocationChange)
      window.removeEventListener('hashchange', onLocationChange)
    }
  }, [])

  useEffect(() => {
    if (activeHash.startsWith('#aula-')) return

    const targetId = activeHash.replace('#', '')
    if (!targetId) return

    const target = document.getElementById(targetId)
    if (!target) return

    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [activeHash])

  const activateProfessorMode = useCallback((): void => {
    setProfessorMode(true)
    setKonamiFlashVisible(true)
    setProfessorMessageVisible(true)

    if (flashTimeoutRef.current) {
      window.clearTimeout(flashTimeoutRef.current)
    }

    if (messageTimeoutRef.current) {
      window.clearTimeout(messageTimeoutRef.current)
    }

    if (professorTimeoutRef.current) {
      window.clearTimeout(professorTimeoutRef.current)
    }

    flashTimeoutRef.current = window.setTimeout(() => {
      setKonamiFlashVisible(false)
      flashTimeoutRef.current = null
    }, 300)

    messageTimeoutRef.current = window.setTimeout(() => {
      setProfessorMessageVisible(false)
      messageTimeoutRef.current = null
    }, 3000)

    professorTimeoutRef.current = window.setTimeout(() => {
      setProfessorMode(false)
      professorTimeoutRef.current = null
    }, 10000)
  }, [])

  useEffect(() => {
    if (touchDevice || reducedMotion) return

    const onKeyDown = (event: KeyboardEvent): void => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      const index = konamiIndexRef.current
      const expected = KONAMI_SEQUENCE[index]

      if (key === expected) {
        const nextIndex = index + 1
        konamiIndexRef.current = nextIndex

        if (nextIndex !== KONAMI_SEQUENCE.length) return

        konamiIndexRef.current = 0
        activateProfessorMode()
        return
      }

      konamiIndexRef.current = key === KONAMI_SEQUENCE[0] ? 1 : 0
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activateProfessorMode, reducedMotion, touchDevice])

  useEffect(() => {
    document.body.classList.toggle('professor-mode', professorMode)

    return () => {
      document.body.classList.remove('professor-mode')
    }
  }, [professorMode])

  useEffect(() => {
    return () => {
      if (flashTimeoutRef.current) {
        window.clearTimeout(flashTimeoutRef.current)
        flashTimeoutRef.current = null
      }

      if (messageTimeoutRef.current) {
        window.clearTimeout(messageTimeoutRef.current)
        messageTimeoutRef.current = null
      }

      if (professorTimeoutRef.current) {
        window.clearTimeout(professorTimeoutRef.current)
        professorTimeoutRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const revealedClass = 'is-visible'

    const revealAll = (): void => {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
        element.classList.add(revealedClass)
      })
    }

    if (reducedMotion || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      revealAll()

      const fallbackObserver = new MutationObserver(() => {
        revealAll()
      })

      fallbackObserver.observe(document.body, { childList: true, subtree: true })

      return () => {
        fallbackObserver.disconnect()
      }
    }

    const timerByElement = new WeakMap<HTMLElement, number>()
    const timers = new Set<number>()

    // IntersectionObserver shared across all [data-reveal] elements (including
    // those added later by lazy-loaded components via MutationObserver).
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const target = entry.target as HTMLElement
          const staggerIndex = Number(target.dataset.stagger ?? 0)
          target.style.transitionDelay = `${staggerIndex * 100}ms`
          target.classList.add(revealedClass)

          const timeoutId = timerByElement.get(target)
          if (timeoutId) {
            window.clearTimeout(timeoutId)
            timers.delete(timeoutId)
            timerByElement.delete(target)
          }

          io.unobserve(target)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    )

    const observeIfNeeded = (el: HTMLElement): void => {
      if (!el.classList.contains(revealedClass)) {
        io.observe(el)

        const timeoutId = window.setTimeout(() => {
          if (el.classList.contains(revealedClass)) return
          el.classList.add(revealedClass)
          io.unobserve(el)
        }, 1000)

        timerByElement.set(el, timeoutId)
        timers.add(timeoutId)
      }
    }

    // Observe elements already in the DOM
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(observeIfNeeded)

    // Watch for [data-reveal] elements added later (lazy-loaded components)
    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) continue
          if (node.hasAttribute('data-reveal')) observeIfNeeded(node)
          node.querySelectorAll<HTMLElement>('[data-reveal]').forEach(observeIfNeeded)
        }
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()

      for (const timeoutId of timers) {
        window.clearTimeout(timeoutId)
      }

      timers.clear()
    }
  }, [activeHash, reducedMotion])

  const onToggleAmbience = useCallback(() => {
    void toggleAmbience()
  }, [toggleAmbience])

  const activeLessonTitle = lessonTitles[activeHash]

  useEffect(() => {
    if (!import.meta.env.DEV) return
    const currentView = activeLessonTitle ? 'lesson' : 'landing'
    const lessonId = activeLessonTitle ? activeHash : 'none'
    console.log('current view:', currentView, 'lessonId:', lessonId)
  }, [activeHash, activeLessonTitle])

  const handleLoadingComplete = useCallback(() => {
    setLoadingVisible(false)
  }, [])

  return (
    <div className="app-shell">
      <BackgroundCanvas ambienceActive={ambienceEnabled} intensityBoost={professorMode ? 0.5 : 0} />

      {konamiFlashVisible ? <div className="konami-flash-overlay" aria-hidden="true" /> : null}
      {professorMessageVisible ? (
        <div className="professor-mode-banner" role="status" aria-live="polite">
          🎓 MODO PROFESSOR ATIVADO
        </div>
      ) : null}

      <div className="scroll-progress-bar" style={{ transform: `scaleX(${progress})` }} />

      {loadingVisible ? <LoadingScreen onComplete={handleLoadingComplete} /> : null}

      <CustomCursor professorMode={professorMode} />
      <div className={`app-content ${loadingVisible ? 'is-loading' : 'is-ready'}`}>
        <NavBar
          ambienceEnabled={ambienceEnabled}
          onToggleAmbience={onToggleAmbience}
          onNavigate={navigateTo}
        />

        {activeLessonTitle ? (
          <main className="lesson-shell">
            <section className="lesson-view reveal is-visible" data-reveal>
              <p className="section-kicker">Modo aula</p>
              <h1>{activeLessonTitle}</h1>
              <p>
                Este hash route já está funcional com History API nativa. Aqui você pode plugar o
                player de aula, quizzes e progresso por módulo.
              </p>
              <div className="lesson-actions">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => navigateTo('#conteudos')}
                  aria-label="Voltar para os módulos"
                >
                  Voltar para Módulos
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => navigateTo('#hero')}
                  aria-label="Voltar para a landing page"
                >
                  Landing Principal
                </button>
              </div>
            </section>
          </main>
        ) : (
          <main>
            <HeroSection onNavigate={navigateTo} />
            <StatsBar />
            <WhyItMatters />
            <WavePlayground />

            <PlaygroundErrorBoundary name="Playground de Derivadas">
              <Suspense
                fallback={<div className="lazy-loading">Carregando visualizador de derivadas...</div>}
              >
                <DerivativeVisualizer />
              </Suspense>
            </PlaygroundErrorBoundary>

            <PlaygroundErrorBoundary name="Playground de Integrais">
              <Suspense
                fallback={<div className="lazy-loading">Carregando visualizador de integrais...</div>}
              >
                <IntegralVisualizer />
              </Suspense>
            </PlaygroundErrorBoundary>

            <ModuleGrid onNavigate={navigateTo} />
            <StatsCounter />
            <TestimonialSection />
            <Footer onNavigate={navigateTo} />
          </main>
        )}
      </div>
    </div>
  )
}

export default App
