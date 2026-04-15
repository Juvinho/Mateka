import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import CustomCursor from './components/CustomCursor'
import Footer from './components/Footer'
import HeroSection from './components/HeroSection'
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
  '#aula-1': 'Aula 1 — Conceitos Basicos',
  '#aula-2': 'Aula 2 — Pre-Calculo Visual',
}

const App = () => {
  const [activeHash, setActiveHash] = useState(window.location.hash || '#hero')
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
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    if (reducedMotion) {
      elements.forEach((element) => {
        element.classList.add(revealedClass)
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue

          const target = entry.target as HTMLElement
          const staggerIndex = Number(target.dataset.stagger ?? 0)
          target.style.transitionDelay = `${staggerIndex * 100}ms`
          target.classList.add(revealedClass)
          observer.unobserve(target)
        }
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -4% 0px',
      },
    )

    elements.forEach((element) => {
      observer.observe(element)
    })

    return () => {
      observer.disconnect()
    }
  }, [activeHash, reducedMotion])

  const onToggleAmbience = useCallback(() => {
    void toggleAmbience()
  }, [toggleAmbience])

  const activeLessonTitle = lessonTitles[activeHash]

  return (
    <div className="app-shell">
      <div className="scroll-progress-bar" style={{ transform: `scaleX(${progress})` }} />

      <CustomCursor />
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
              Este hash route ja esta funcional com History API nativa. Aqui voce pode plugar o
              player de aula, quizzes e progresso por modulo.
            </p>
            <div className="lesson-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => navigateTo('#conteudos')}
                aria-label="Voltar para os modulos"
              >
                Voltar para Modulos
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

          <Suspense
            fallback={<div className="lazy-loading">Carregando visualizador de derivadas...</div>}
          >
            <DerivativeVisualizer />
          </Suspense>

          <Suspense
            fallback={<div className="lazy-loading">Carregando visualizador de integrais...</div>}
          >
            <IntegralVisualizer />
          </Suspense>

          <ModuleGrid onNavigate={navigateTo} />
          <StatsCounter />
          <TestimonialSection />
          <Footer onNavigate={navigateTo} />
        </main>
      )}
    </div>
  )
}

export default App
