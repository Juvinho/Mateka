import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import CustomCursor from './components/CustomCursor'
import { PlaygroundErrorBoundary } from './components/PlaygroundErrorBoundary'
import Footer from './components/Footer'
import HeroSection from './components/HeroSection'
import LoadingScreen from './components/LoadingScreen'
import ModuleGrid from './components/ModuleGrid'
import NavBar from './components/NavBar'
import ParticleField from './components/ParticleField'
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

const App = () => {
  const [activeHash, setActiveHash] = useState(window.location.hash || '#hero')
  const [loadingVisible, setLoadingVisible] = useState(
    () => sessionStorage.getItem('mateka:loaded') !== 'true',
  )
  const progress = useScrollProgress()
  const { enabled: ambienceEnabled, toggle: toggleAmbience } = useAmbience()

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
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

  useEffect(() => {
    const revealedClass = 'is-visible'

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
          io.unobserve(target)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    )

    const observeIfNeeded = (el: HTMLElement): void => {
      if (reducedMotion) {
        el.classList.add(revealedClass)
        return
      }
      if (!el.classList.contains(revealedClass)) {
        io.observe(el)
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
    }
  }, [activeHash, reducedMotion])

  const onToggleAmbience = useCallback(() => {
    void toggleAmbience()
  }, [toggleAmbience])

  const activeLessonTitle = lessonTitles[activeHash]
  const handleLoadingComplete = useCallback(() => {
    setLoadingVisible(false)
  }, [])

  return (
    <div className="app-shell">
      <div className="scroll-progress-bar" style={{ transform: `scaleX(${progress})` }} />

      <ParticleField />
      <div className="global-scanlines" aria-hidden="true" />

      {loadingVisible ? <LoadingScreen onComplete={handleLoadingComplete} /> : null}

      <CustomCursor />
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
            <HeroSection onNavigate={navigateTo} ambienceEnabled={ambienceEnabled} />
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
