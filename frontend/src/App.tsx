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
import ClickBurst from './components/ClickBurst'
import FloatingEquations from './components/FloatingEquations'
import { PlaygroundErrorBoundary } from './components/PlaygroundErrorBoundary'
import Footer from './components/Footer'
import HeroSection from './components/HeroSection'
import LoadingScreen from './components/LoadingScreen'
import MathTrail from './components/MathTrail'
import ModuleGrid from './components/ModuleGrid'
import NavBar from './components/NavBar'
import StatsBar from './components/StatsBar'
import StatsCounter from './components/StatsCounter'
import TestimonialSection from './components/TestimonialSection'
import VideoIntro from './components/VideoIntro'
import WavePlayground from './components/WavePlayground'
import WhyItMatters from './components/WhyItMatters'
import AuthCardFlip from './components/AuthCardFlip'
import InteractiveWidgetHost from './components/labs/InteractiveWidgetHost'
import LessonNarrator from './components/mascot/LessonNarrator'
import MatrixDisplay from './components/MatrixDisplay'
import ErrorPageView from './components/ErrorPageView'
import ModulosPage from './pages/ModulosPage'
import ExerciseSessionPage from './pages/ExerciseSessionPage'
import EndlessSessionPage from './pages/EndlessSessionPage'
import ConhecaEmyPage from './pages/ConhecaEmyPage'
import PerfilPage from './pages/PerfilPage'
import UserProfilePage from './pages/UserProfilePage'
import { useAuth } from './state/useAuth'
import { useAmbience } from './hooks/useAmbience'
import { useScrollProgress } from './hooks/useScrollProgress'
import { useScrollVelocity } from './hooks/useScrollVelocity'
import { LESSON_BY_ID } from './data/matrizes/units'
import { EXERCISE_SET_BY_ID } from './data/matrizes/exerciseSets'
import { MATRIZES_MODULE_CONFIG } from './data/matrizes/moduleConfig'
import { BASICOS_LESSON_BY_ID } from './data/basicos/units'
import { BASICOS_EXERCISE_SET_BY_ID } from './data/basicos/exerciseSets'
import { BASICOS_MODULE_CONFIG } from './data/basicos/moduleConfig'
import { PRECALCULO_LESSON_BY_ID } from './data/precalculo/units'
import { PRECALCULO_EXERCISE_SET_BY_ID } from './data/precalculo/exerciseSets'
import { PRECALCULO_MODULE_CONFIG } from './data/precalculo/moduleConfig'
import { SISTEMAS_LESSON_BY_ID } from './data/sistemas/units'
import { SISTEMAS_EXERCISE_SET_BY_ID } from './data/sistemas/exerciseSets'
import { SISTEMAS_MODULE_CONFIG } from './data/sistemas/moduleConfig'
import { GEOMETRIA_LESSON_BY_ID } from './data/geometria/units'
import { GEOMETRIA_EXERCISE_SET_BY_ID } from './data/geometria/exerciseSets'
import { GEOMETRIA_MODULE_CONFIG } from './data/geometria/moduleConfig'
import { PLANA_LESSON_BY_ID } from './data/plana/units'
import { PLANA_EXERCISE_SET_BY_ID } from './data/plana/exerciseSets'
import { PLANA_MODULE_CONFIG } from './data/plana/moduleConfig'
import { ESPACIAL_LESSON_BY_ID } from './data/espacial/units'
import { ESPACIAL_EXERCISE_SET_BY_ID } from './data/espacial/exerciseSets'
import { ESPACIAL_MODULE_CONFIG } from './data/espacial/moduleConfig'
import type { Difficulty, Exercise } from './data/exerciseTypes'
import type { LessonContent } from './data/lessonTypes'
import type { ExerciseSet } from './data/exerciseTypes'
import { useModuleProgress } from './state/useModuleProgress'
import cansadaImg from './assets/mascot/cansada.webp'
import policialImg from './assets/mascot/policial.webp'
import sobrecarregadaImg from './assets/mascot/sobrecarregada.webp'
import gamerImg from './assets/mascot/gamer.webp'
import { EmyCallout } from './components/emy/EmyCallout'
import { ReverseEmy } from './components/emy/ReverseEmy'
import { VirtualNotebook } from './components/VirtualNotebook'

const ENDLESS_DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']

const MODULE_LABEL: Record<string, string> = {
  matrizes: 'Matrizes',
  'conceitos-basicos': 'Conceitos Básicos',
  'pre-calculo': 'Pré-Cálculo',
  'sistemas-lineares': 'Sistemas Lineares',
  'geometria-analitica': 'Geometria Analítica',
  'geometria-plana': 'Geometria Plana',
  'geometria-espacial': 'Geometria Espacial',
}

// Every hash the app actually knows how to route — used to decide when to
// show the 404 page. Exact matches are static in-page anchors/pages; prefixes
// carry a dynamic id that gets resolved separately (and can still 404 on its
// own if the id doesn't match anything).
const KNOWN_EXACT_HASHES = new Set([
  '#hero',
  '#why-it-matters',
  '#playground',
  '#conteudos',
  '#derivadas',
  '#integrais',
  '#login',
  '#register',
  '#modulos',
  '#basicos',
  '#pre-calculo',
  '#sistemas-lineares',
  '#geometria-analitica',
  '#geometria-plana',
  '#geometria-espacial',
  '#conheca-emy',
  '#perfil',
])
const KNOWN_DYNAMIC_PREFIXES = ['#modulos/', '#aula-', '#exercicio-', '#endless-', '#usuario-']
// Dedicated hashes to preview each error page on demand, without needing to
// actually break a link or hit a real permission/rate-limit wall (this app
// has no live auth enforcement or backend rate limiting yet — these are the
// only way to reach these pages today).
const FORCED_NOT_FOUND_HASH = '#404'
const FORCED_FORBIDDEN_HASH = '#403'
const FORCED_TOO_MANY_REQUESTS_HASH = '#429'
// Not a real HTTP status — a hidden easter egg, deliberately not linked
// anywhere in the UI. Only reachable by typing the hash directly.
const FORCED_EASTER_EGG_HASH = '#220'

function resolveLesson(hash: string): { lesson: LessonContent; moduleId: string } | undefined {
  if (!hash.startsWith('#aula-')) return undefined
  const id = hash.slice('#aula-'.length)
  const matrizes = LESSON_BY_ID[id]
  if (matrizes) return { lesson: matrizes, moduleId: 'matrizes' }
  const basicos = BASICOS_LESSON_BY_ID[id]
  if (basicos) return { lesson: basicos, moduleId: 'conceitos-basicos' }
  const precalculo = PRECALCULO_LESSON_BY_ID[id]
  if (precalculo) return { lesson: precalculo, moduleId: 'pre-calculo' }
  const sistemas = SISTEMAS_LESSON_BY_ID[id]
  if (sistemas) return { lesson: sistemas, moduleId: 'sistemas-lineares' }
  const geometria = GEOMETRIA_LESSON_BY_ID[id]
  if (geometria) return { lesson: geometria, moduleId: 'geometria-analitica' }
  const plana = PLANA_LESSON_BY_ID[id]
  if (plana) return { lesson: plana, moduleId: 'geometria-plana' }
  const espacial = ESPACIAL_LESSON_BY_ID[id]
  if (espacial) return { lesson: espacial, moduleId: 'geometria-espacial' }
  return undefined
}

function resolveExerciseSet(hash: string): { set: ExerciseSet; moduleId: string } | undefined {
  if (!hash.startsWith('#exercicio-')) return undefined
  const id = hash.slice('#exercicio-'.length)
  const matrizes = EXERCISE_SET_BY_ID[id]
  if (matrizes) return { set: matrizes, moduleId: 'matrizes' }
  const basicos = BASICOS_EXERCISE_SET_BY_ID[id]
  if (basicos) return { set: basicos, moduleId: 'conceitos-basicos' }
  const precalculo = PRECALCULO_EXERCISE_SET_BY_ID[id]
  if (precalculo) return { set: precalculo, moduleId: 'pre-calculo' }
  const sistemas = SISTEMAS_EXERCISE_SET_BY_ID[id]
  if (sistemas) return { set: sistemas, moduleId: 'sistemas-lineares' }
  const geometria = GEOMETRIA_EXERCISE_SET_BY_ID[id]
  if (geometria) return { set: geometria, moduleId: 'geometria-analitica' }
  const plana = PLANA_EXERCISE_SET_BY_ID[id]
  if (plana) return { set: plana, moduleId: 'geometria-plana' }
  const espacial = ESPACIAL_EXERCISE_SET_BY_ID[id]
  if (espacial) return { set: espacial, moduleId: 'geometria-espacial' }
  return undefined
}

// Hash shape: #endless-{moduleId}-{difficulty}. moduleId can itself contain a
// hyphen (e.g. 'conceitos-basicos'), so match by the known difficulty suffix
// rather than splitting on the first hyphen.
function resolveEndless(
  hash: string,
): { moduleId: string; difficulty: Difficulty; bank: Record<Difficulty, Exercise[]> } | undefined {
  if (!hash.startsWith('#endless-')) return undefined
  const rest = hash.slice('#endless-'.length)
  const difficulty = ENDLESS_DIFFICULTIES.find((d) => rest.endsWith(`-${d}`))
  if (!difficulty) return undefined
  const moduleId = rest.slice(0, rest.length - difficulty.length - 1)
  const config =
    moduleId === MATRIZES_MODULE_CONFIG.moduleId
      ? MATRIZES_MODULE_CONFIG
      : moduleId === BASICOS_MODULE_CONFIG.moduleId
        ? BASICOS_MODULE_CONFIG
        : moduleId === PRECALCULO_MODULE_CONFIG.moduleId
          ? PRECALCULO_MODULE_CONFIG
          : moduleId === SISTEMAS_MODULE_CONFIG.moduleId
            ? SISTEMAS_MODULE_CONFIG
            : moduleId === GEOMETRIA_MODULE_CONFIG.moduleId
              ? GEOMETRIA_MODULE_CONFIG
              : moduleId === PLANA_MODULE_CONFIG.moduleId
                ? PLANA_MODULE_CONFIG
                : moduleId === ESPACIAL_MODULE_CONFIG.moduleId
                  ? ESPACIAL_MODULE_CONFIG
                  : undefined
  if (!config?.endlessBank) return undefined
  return { moduleId, difficulty, bank: config.endlessBank }
}

const DerivativeVisualizer = lazy(() => import('./components/DerivativeVisualizer'))
const IntegralVisualizer = lazy(() => import('./components/IntegralVisualizer'))

const lessonTitles: Record<string, string> = {
  '#aula-1': 'Aula 1 — Conceitos Básicos',
}

// Where to send a guest who tries a gated route, so login can bounce them
// back instead of dumping them on the home page.
const AUTH_REDIRECT_KEY = 'mateka:auth:redirect'

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
  const scrollBoosting = useScrollVelocity()
  const { enabled: ambienceEnabled, toggle: toggleAmbience } = useAmbience()
  const { status: authStatus } = useAuth()

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
  const resolvedLesson = resolveLesson(activeHash)
  const activeLesson = resolvedLesson?.lesson
  const activeLessonModuleId = resolvedLesson?.moduleId
  const resolvedExercise = resolveExerciseSet(activeHash)
  const activeExerciseSet = resolvedExercise?.set
  const activeExerciseModuleId = resolvedExercise?.moduleId
  const resolvedEndless = resolveEndless(activeHash)
  const isAuthRoute = activeHash === '#login' || activeHash === '#register'
  const isModulosRoute = activeHash === '#modulos' || activeHash.startsWith('#modulos/')
  const isBasicosRoute = activeHash === '#basicos'
  const isPreCalculoRoute = activeHash === '#pre-calculo'
  const isSistemasRoute = activeHash === '#sistemas-lineares'
  const isGeometriaRoute = activeHash === '#geometria-analitica'
  const isPlanaRoute = activeHash === '#geometria-plana'
  const isEspacialRoute = activeHash === '#geometria-espacial'
  const isConhecaEmyRoute = activeHash === '#conheca-emy'
  const isPerfilRoute = activeHash === '#perfil'
  const isUserProfileRoute = activeHash.startsWith('#usuario-')
  const viewedUserId = isUserProfileRoute ? activeHash.slice('#usuario-'.length) : undefined
  // 404 covers two cases: a dynamic-id route (aula/exercicio/endless) whose id
  // didn't resolve to anything, or a hash that isn't part of the app's known
  // route set at all (typo'd/stale link, or the dedicated #404 test route).
  const isUnresolvedDynamicRoute =
    (activeHash.startsWith('#aula-') && !activeLesson && !activeLessonTitle) ||
    (activeHash.startsWith('#exercicio-') && !activeExerciseSet) ||
    (activeHash.startsWith('#endless-') && !resolvedEndless)
  const isKnownRoute =
    KNOWN_EXACT_HASHES.has(activeHash) || KNOWN_DYNAMIC_PREFIXES.some((prefix) => activeHash.startsWith(prefix))
  const isForbiddenRoute = activeHash === FORCED_FORBIDDEN_HASH
  const isTooManyRequestsRoute = activeHash === FORCED_TOO_MANY_REQUESTS_HASH
  const isEasterEggRoute = activeHash === FORCED_EASTER_EGG_HASH
  const isNotFoundRoute =
    !isForbiddenRoute &&
    !isTooManyRequestsRoute &&
    !isEasterEggRoute &&
    (activeHash === FORCED_NOT_FOUND_HASH || isUnresolvedDynamicRoute || !isKnownRoute)

  // Registration exists now, so modules (and everything inside them — lessons,
  // exercises, endless mode) require a session. Deep links are covered too:
  // resolving straight to #aula-x/#exercicio-x/#endless-x is gated the same
  // way as the module hub itself.
  const isGatedRoute =
    isModulosRoute ||
    isBasicosRoute ||
    isPreCalculoRoute ||
    isSistemasRoute ||
    isGeometriaRoute ||
    isPlanaRoute ||
    isEspacialRoute ||
    isPerfilRoute ||
    isUserProfileRoute ||
    Boolean(activeLesson) ||
    Boolean(activeLessonTitle) ||
    Boolean(activeExerciseSet) ||
    Boolean(resolvedEndless)

  // Guest hitting a gated route: remember where they were headed and bounce
  // to login. Already-authenticated user landing on #login/#register: send
  // them onward instead of showing the form again.
  useEffect(() => {
    if (!isGatedRoute || authStatus !== 'guest') return
    try {
      sessionStorage.setItem(AUTH_REDIRECT_KEY, activeHash)
    } catch {
      // ignore write failures (private browsing, storage full, etc.)
    }
    navigateTo('#login')
  }, [isGatedRoute, authStatus, activeHash, navigateTo])

  useEffect(() => {
    if (!isAuthRoute || authStatus !== 'authenticated') return
    navigateTo('#hero')
  }, [isAuthRoute, authStatus, navigateTo])

  // Emy-chan's small callout is a home-only element now — everywhere else
  // (sections, exercises, error pages, the "Conheça Emy" page itself) she's
  // only reachable through that page. "Home" is whatever falls through to
  // the full landing page below, i.e. none of the other named routes.
  const isHomeRoute =
    !isModulosRoute &&
    !isBasicosRoute &&
    !isPreCalculoRoute &&
    !isSistemasRoute &&
    !isGeometriaRoute &&
    !isPlanaRoute &&
    !isEspacialRoute &&
    !isConhecaEmyRoute &&
    !isPerfilRoute &&
    !isUserProfileRoute &&
    !activeExerciseSet &&
    !resolvedEndless &&
    !activeLesson &&
    !activeLessonTitle &&
    !isEasterEggRoute &&
    !isForbiddenRoute &&
    !isTooManyRequestsRoute &&
    !isNotFoundRoute

  // Mii-chan (the small notebook-gateway avatar) lives in the sections —
  // module hubs, lesson pages, and exercises — but not on the home page,
  // and not on a module's very first visit: that's when the big Emy-chan
  // intro is doing the explaining, so the small avatar stays out of the way
  // until the module has been seen at least once.
  const isSectionRoute =
    isModulosRoute ||
    isBasicosRoute ||
    isPreCalculoRoute ||
    isSistemasRoute ||
    isGeometriaRoute ||
    isPlanaRoute ||
    isEspacialRoute ||
    Boolean(activeLesson) ||
    Boolean(activeLessonTitle) ||
    Boolean(activeExerciseSet)
  const currentSectionModuleConfig = isModulosRoute
    ? MATRIZES_MODULE_CONFIG
    : isBasicosRoute
      ? BASICOS_MODULE_CONFIG
      : isPreCalculoRoute
        ? PRECALCULO_MODULE_CONFIG
        : isSistemasRoute
          ? SISTEMAS_MODULE_CONFIG
          : isGeometriaRoute
            ? GEOMETRIA_MODULE_CONFIG
            : isPlanaRoute
              ? PLANA_MODULE_CONFIG
              : isEspacialRoute
                ? ESPACIAL_MODULE_CONFIG
                : activeLessonModuleId === 'matrizes'
                  ? MATRIZES_MODULE_CONFIG
                  : activeLessonModuleId === 'conceitos-basicos'
                    ? BASICOS_MODULE_CONFIG
                    : activeLessonModuleId === 'pre-calculo'
                      ? PRECALCULO_MODULE_CONFIG
                      : activeLessonModuleId === 'sistemas-lineares'
                        ? SISTEMAS_MODULE_CONFIG
                        : activeLessonModuleId === 'geometria-analitica'
                          ? GEOMETRIA_MODULE_CONFIG
                          : activeLessonModuleId === 'geometria-plana'
                            ? PLANA_MODULE_CONFIG
                            : activeLessonModuleId === 'geometria-espacial'
                              ? ESPACIAL_MODULE_CONFIG
                              : undefined
  const hasSeenCurrentModuleIntro = (() => {
    if (!currentSectionModuleConfig?.IntroComponent) return true
    try {
      return localStorage.getItem(`mateka:${currentSectionModuleConfig.moduleId}:introSeen`) === 'true'
    } catch {
      return true
    }
  })()
  const showMii = isSectionRoute && hasSeenCurrentModuleIntro

  const { markLessonSeen: markMatrizesLessonSeen } = useModuleProgress('matrizes')
  const { markLessonSeen: markBasicosLessonSeen } = useModuleProgress('conceitos-basicos')
  const { markLessonSeen: markPreCalculoLessonSeen } = useModuleProgress('pre-calculo')
  const { markLessonSeen: markSistemasLessonSeen } = useModuleProgress('sistemas-lineares')
  const { markLessonSeen: markGeometriaLessonSeen } = useModuleProgress('geometria-analitica')
  const { markLessonSeen: markPlanaLessonSeen } = useModuleProgress('geometria-plana')
  const { markLessonSeen: markEspacialLessonSeen } = useModuleProgress('geometria-espacial')

  useEffect(() => {
    if (!activeLesson || !activeLessonModuleId) return
    if (activeLessonModuleId === 'matrizes') markMatrizesLessonSeen(activeLesson.id)
    else if (activeLessonModuleId === 'conceitos-basicos') markBasicosLessonSeen(activeLesson.id)
    else if (activeLessonModuleId === 'pre-calculo') markPreCalculoLessonSeen(activeLesson.id)
    else if (activeLessonModuleId === 'sistemas-lineares') markSistemasLessonSeen(activeLesson.id)
    else if (activeLessonModuleId === 'geometria-analitica') markGeometriaLessonSeen(activeLesson.id)
    else if (activeLessonModuleId === 'geometria-plana') markPlanaLessonSeen(activeLesson.id)
    else if (activeLessonModuleId === 'geometria-espacial') markEspacialLessonSeen(activeLesson.id)
  }, [
    activeLesson,
    activeLessonModuleId,
    markMatrizesLessonSeen,
    markBasicosLessonSeen,
    markPreCalculoLessonSeen,
    markSistemasLessonSeen,
    markGeometriaLessonSeen,
    markPlanaLessonSeen,
    markEspacialLessonSeen,
  ])

  useEffect(() => {
    if (!import.meta.env.DEV) return
    const currentView =
      activeHash === '#login' ? 'login' : activeLessonTitle || activeLesson ? 'lesson' : 'landing'
    const lessonId = activeLessonTitle || activeLesson ? activeHash : 'none'
    console.log('current view:', currentView, 'lessonId:', lessonId)
  }, [activeHash, activeLessonTitle, activeLesson])

  const handleLoadingComplete = useCallback(() => {
    setLoadingVisible(false)
  }, [])


  if (isAuthRoute) {
    const initialView = window.location.hash === '#register' ? 'register' : 'login'
    const goToIntendedDestination = () => {
      let redirect = '#hero'
      try {
        const stored = sessionStorage.getItem(AUTH_REDIRECT_KEY)
        if (stored) {
          redirect = stored
          sessionStorage.removeItem(AUTH_REDIRECT_KEY)
        }
      } catch {
        // ignore read/write failures — falls back to #hero
      }
      navigateTo(redirect)
    }
    return (
      <AuthCardFlip
        view={initialView}
        onFlip={(v) => navigateTo(`#${v}`)}
        onAuthenticated={goToIntendedDestination}
      />
    )
  }

  const renderPageContent = () => {
    if (isGatedRoute && authStatus !== 'authenticated') {
      return (
        <div className="auth-gate-notice">
          <div className="lazy-loading">Verificando sessão...</div>
        </div>
      )
    }

    if (isModulosRoute) {
      return <ModulosPage key="matrizes" config={MATRIZES_MODULE_CONFIG} onNavigate={navigateTo} />
    }

    if (isBasicosRoute) {
      return <ModulosPage key="basicos" config={BASICOS_MODULE_CONFIG} onNavigate={navigateTo} />
    }

    if (isPreCalculoRoute) {
      return <ModulosPage key="pre-calculo" config={PRECALCULO_MODULE_CONFIG} onNavigate={navigateTo} />
    }

    if (isSistemasRoute) {
      return <ModulosPage key="sistemas-lineares" config={SISTEMAS_MODULE_CONFIG} onNavigate={navigateTo} />
    }

    if (isGeometriaRoute) {
      return <ModulosPage key="geometria-analitica" config={GEOMETRIA_MODULE_CONFIG} onNavigate={navigateTo} />
    }

    if (isPlanaRoute) {
      return <ModulosPage key="geometria-plana" config={PLANA_MODULE_CONFIG} onNavigate={navigateTo} />
    }

    if (isEspacialRoute) {
      return <ModulosPage key="geometria-espacial" config={ESPACIAL_MODULE_CONFIG} onNavigate={navigateTo} />
    }

    if (isConhecaEmyRoute) {
      return <ConhecaEmyPage onNavigate={navigateTo} />
    }

    if (isPerfilRoute) {
      return <PerfilPage onNavigate={navigateTo} />
    }

    if (isUserProfileRoute && viewedUserId) {
      return <UserProfilePage key={viewedUserId} userId={viewedUserId} onNavigate={navigateTo} />
    }

    if (activeExerciseSet && activeExerciseModuleId) {
      return (
        <ExerciseSessionPage
          key={`${activeExerciseModuleId}-${activeExerciseSet.id}`}
          exerciseSet={activeExerciseSet}
          moduleId={activeExerciseModuleId}
          onNavigate={navigateTo}
        />
      )
    }

    if (resolvedEndless) {
      return (
        <EndlessSessionPage
          key={`${resolvedEndless.moduleId}-${resolvedEndless.difficulty}`}
          difficulty={resolvedEndless.difficulty}
          moduleId={resolvedEndless.moduleId}
          bank={resolvedEndless.bank[resolvedEndless.difficulty]}
          onNavigate={navigateTo}
        />
      )
    }

    return (
      <div className="app-shell">
        <BackgroundCanvas ambienceActive={ambienceEnabled} intensityBoost={professorMode ? 0.5 : 0} />
        <FloatingEquations />
        <MathTrail boostSymbols={scrollBoosting || professorMode} />
        <ClickBurst />

        {konamiFlashVisible ? <div className="konami-flash-overlay" aria-hidden="true" /> : null}
        {professorMessageVisible ? (
          <div className="professor-mode-banner" role="status" aria-live="polite">
            🎓 MODO PROFESSOR ATIVADO
          </div>
        ) : null}

        <div className="scroll-progress-bar" style={{ transform: `scaleX(${progress})` }} />

        {loadingVisible ? <LoadingScreen onComplete={handleLoadingComplete} /> : null}

        <div className={`app-content ${loadingVisible ? 'is-loading' : 'is-ready'}`}>
          <NavBar
            ambienceEnabled={ambienceEnabled}
            onToggleAmbience={onToggleAmbience}
            onNavigate={navigateTo}
            isAuthenticated={authStatus === 'authenticated'}
          />

          {activeLesson ? (
            <main className="lesson-shell">
              <section className="lesson-view reveal is-visible" data-reveal>
                <p className="section-kicker">{MODULE_LABEL[activeLessonModuleId ?? ''] ?? ''}</p>
                <h1>{activeLesson.title}</h1>
                {activeLesson.intro.map((paragraph, i) => (
                  <p key={`intro-${i}`}>{paragraph}</p>
                ))}
                {activeLesson.examples && activeLesson.examples.length > 0 ? (
                  <div className="lesson-examples-row">
                    {activeLesson.examples.map((ex) => (
                      <MatrixDisplay key={ex.label} label={ex.label} matrix={ex.matrix} />
                    ))}
                  </div>
                ) : null}
                {activeLesson.after?.map((paragraph, i) => (
                  <p key={`after-${i}`}>{paragraph}</p>
                ))}
                {activeLesson.interactiveWidget ? <InteractiveWidgetHost widget={activeLesson.interactiveWidget} /> : null}
                <div className="lesson-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => navigateTo(`#exercicio-${activeLesson.exerciseSetId}`)}
                    aria-label="Praticar exercícios"
                  >
                    Praticar exercícios →
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
              <LessonNarrator key={activeLesson.id} lessonId={activeLesson.id} />
            </main>
          ) : activeLessonTitle ? (
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
          ) : isEasterEggRoute ? (
            <ErrorPageView
              code="220"
              title="Emy tá só esperando a marretada."
              message="A Emy está esperando o Saltitão dar uma marretada no computador pra resolver esse erro — a boa e velha força bruta."
              mascotSrc={gamerImg}
              mascotAlt="Emy-chan de moletom de tubarão, jogando videogame tranquila"
              primaryAction={{ label: 'Voltar para o início', onClick: () => navigateTo('#hero') }}
              secondaryAction={{ label: 'Ver módulos', onClick: () => navigateTo('#modulos') }}
            />
          ) : isForbiddenRoute ? (
            <ErrorPageView
              code="403"
              tone="danger"
              title="Emy mandou parar bem aqui."
              message="Você não tem permissão para acessar essa página. Se acha que isso é engano, entra na conta certa e tenta de novo."
              mascotSrc={policialImg}
              mascotAlt="Emy-chan fardada de policial, mandando parar com uma placa de PARE"
              primaryAction={{ label: 'Fazer login', onClick: () => navigateTo('#login') }}
              secondaryAction={{ label: 'Voltar para o início', onClick: () => navigateTo('#hero') }}
            />
          ) : isTooManyRequestsRoute ? (
            <ErrorPageView
              code="429"
              tone="warning"
              title="Calma, muita coisa de uma vez só."
              message="Foram pedidos demais em pouco tempo e a Emy não deu conta de todos. Espera um instante e tenta de novo."
              mascotSrc={sobrecarregadaImg}
              mascotAlt="Emy-chan sobrecarregada, segurando uma pilha enorme de papéis"
              primaryAction={{ label: 'Tentar novamente', onClick: () => window.location.reload() }}
              secondaryAction={{ label: 'Voltar para o início', onClick: () => navigateTo('#hero') }}
            />
          ) : isNotFoundRoute ? (
            <ErrorPageView
              code="404"
              title="Emy procurou tanto que cansou."
              message="A página que você tentou acessar não existe (ou mudou de lugar). Bora voltar pra um lugar que existe de verdade?"
              mascotSrc={cansadaImg}
              mascotAlt="Emy-chan deitada no chão, exausta de tanto procurar"
              primaryAction={{ label: 'Voltar para o início', onClick: () => navigateTo('#hero') }}
              secondaryAction={{ label: 'Ver módulos', onClick: () => navigateTo('#modulos') }}
            />
          ) : (
            <main>
              <HeroSection onNavigate={navigateTo} />
              <StatsBar />
              <WhyItMatters />
              <VideoIntro />
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

  return (
    <>
      {renderPageContent()}
      {/* Emy-chan's callout: home only. Mii-chan: sections, once the module's
          intro has been seen. The notebook itself stays mounted everywhere so
          an already-open one can still be closed from a page Mii isn't on. */}
      {isHomeRoute ? <EmyCallout activeHash={activeHash} onNavigate={navigateTo} /> : null}
      {showMii ? <ReverseEmy /> : null}
      <VirtualNotebook />
    </>
  )
}

export default App

