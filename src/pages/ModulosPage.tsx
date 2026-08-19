import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'

import RippleBackground from '../components/ui/RippleBackground'
import ModuleHeader from '../components/modules/ModuleHeader'
import ModuleHero from '../components/modules/ModuleHero'
import ModuleProgress from '../components/modules/ModuleProgress'
import UnitSection from '../components/modules/UnitSection'
import ExerciseCard from '../components/modules/ExerciseCard'
import type { ExerciseCardData } from '../components/modules/ExerciseCard'
import QuizQuestion from '../components/modules/QuizQuestion'
import type { QuizQuestionData } from '../components/modules/QuizQuestion'
import StreakSection from '../components/modules/StreakSection'
import type { LessonCardData } from '../components/modules/LessonCard'

import { ALL_LESSONS, MATRIZES_UNITS } from '../data/matrizes/units'
import { ALL_EXERCISE_SETS } from '../data/matrizes/exerciseSets'
import { TRACK, isNodeUnlocked } from '../data/matrizes/track'
import { useMatrizesProgress } from '../state/useMatrizesProgress'

type TabId = 'aulas' | 'exercicios' | 'quiz'

const TAB_LABELS: Record<TabId, string> = {
  aulas: 'Aulas',
  exercicios: 'Exercícios',
  quiz: 'Quiz Rápido',
}

const QUIZ_QUESTIONS: QuizQuestionData[] = [
  {
    id: 'q1',
    number: 1,
    difficulty: 'Fácil',
    question: 'Quantas linhas e colunas tem a matriz A abaixo?',
    formula: 'A = [2 5 9; 1 4 7]',
    options: [
      { letter: 'A', text: '3 linhas e 2 colunas', isCorrect: false },
      { letter: 'B', text: '2 linhas e 3 colunas', isCorrect: true },
      { letter: 'C', text: '2 linhas e 2 colunas', isCorrect: false },
      { letter: 'D', text: '6 linhas e 1 coluna', isCorrect: false },
    ],
  },
  {
    id: 'q2',
    number: 2,
    difficulty: 'Médio',
    question: 'Qual é o elemento a₂₃ (linha 2, coluna 3) da matriz A?',
    formula: 'A = [4 1 7; 2 9 5; 6 3 8]',
    options: [
      { letter: 'A', text: '7', isCorrect: false },
      { letter: 'B', text: '5', isCorrect: true },
      { letter: 'C', text: '9', isCorrect: false },
      { letter: 'D', text: '3', isCorrect: false },
    ],
  },
  {
    id: 'q3',
    number: 3,
    difficulty: 'Médio',
    question: 'Como se chama uma matriz que tem o mesmo número de linhas e colunas?',
    formula: 'A = [1 2; 3 4]  (2×2)',
    options: [
      { letter: 'A', text: 'Matriz quadrada', isCorrect: true },
      { letter: 'B', text: 'Matriz linha', isCorrect: false },
      { letter: 'C', text: 'Matriz nula', isCorrect: false },
      { letter: 'D', text: 'Matriz coluna', isCorrect: false },
    ],
  },
]

const TABS: TabId[] = ['aulas', 'exercicios', 'quiz']

type ModulosPageProps = {
  onNavigate?: (hash: string) => void
}

const ModulosPage = ({ onNavigate }: ModulosPageProps) => {
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const { state, streakCount, averageAccuracy } = useMatrizesProgress()

  const [activeTab, setActiveTab]     = useState<TabId>('aulas')
  const [displayedTab, setDisplayedTab] = useState<TabId>('aulas')
  const isTransitioning               = useRef(false)

  const pageRef       = useRef<HTMLDivElement>(null)
  const progressRef   = useRef<HTMLDivElement>(null)
  const tabsBarRef    = useRef<HTMLDivElement>(null)
  const tabContentRef = useRef<HTMLDivElement>(null)
  const underlineRef  = useRef<HTMLDivElement>(null)
  const tabBtnRefs    = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({})

  // ── Page entrance timeline ──────────────────────────────────────────
  useEffect(() => {
    if (reducedMotion) return

    const page    = pageRef.current
    const progress = progressRef.current
    const tabsBar  = tabsBarRef.current
    const content  = tabContentRef.current
    if (!page) return

    const header = page.querySelector<HTMLElement>('.modulos-header')

    if (header)   gsap.set(header,   { opacity: 0, y: -8 })
    if (progress) gsap.set(progress, { opacity: 0 })
    if (tabsBar)  gsap.set(tabsBar,  { opacity: 0 })
    if (content)  gsap.set(content,  { opacity: 0 })

    const tl = gsap.timeline()
    if (header)   tl.to(header,   { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
    if (progress) tl.to(progress, { opacity: 1, duration: 0.3 }, '>0.3')
    if (tabsBar)  tl.to(tabsBar,  { opacity: 1, duration: 0.3, delay: 0.2 }, '>')
    if (content)  tl.to(content,  { opacity: 1, duration: 0.25 }, '>')

    return () => { tl.kill() }
  }, [reducedMotion])

  // ── Tab underline positioning ────────────────────────────────────────
  const positionUnderline = (tab: TabId, animate: boolean) => {
    const btn       = tabBtnRefs.current[tab]
    const underline = underlineRef.current
    const bar       = tabsBarRef.current
    if (!btn || !underline || !bar) return

    const barRect = bar.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()
    const left    = btnRect.left - barRect.left + bar.scrollLeft

    if (animate && !reducedMotion) {
      gsap.to(underline, { left, width: btnRect.width, duration: 0.25, ease: 'power2.out' })
    } else {
      gsap.set(underline, { left, width: btnRect.width })
    }
  }

  useEffect(() => {
    positionUnderline(activeTab, false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Tab switch ───────────────────────────────────────────────────────
  const handleTabChange = (tab: TabId) => {
    if (tab === activeTab || isTransitioning.current) return

    positionUnderline(tab, true)

    const el = tabContentRef.current
    if (!el || reducedMotion) {
      setActiveTab(tab)
      setDisplayedTab(tab)
      return
    }

    isTransitioning.current = true

    gsap.to(el, {
      opacity: 0,
      x: -12,
      duration: 0.15,
      ease: 'power1.in',
      onComplete: () => {
        setDisplayedTab(tab)
        setActiveTab(tab)
        requestAnimationFrame(() => {
          gsap.fromTo(
            el,
            { opacity: 0, x: 12 },
            {
              opacity: 1,
              x: 0,
              duration: 0.2,
              ease: 'power2.out',
              onComplete: () => { isTransitioning.current = false },
            },
          )
        })
      },
    })
  }

  // ── Derived data: lessons, exercise sets, module stats ────────────────
  const lessonCardsByUnit = useMemo(() => {
    const map: Record<number, LessonCardData[]> = {}
    for (const unit of MATRIZES_UNITS) {
      map[unit.number] = unit.lessons.map((lesson) => {
        const done = Boolean(state.completedNodeIds[lesson.id])
        const unlocked = isNodeUnlocked(lesson.id, state.completedNodeIds)
        const result = state.exerciseResults[lesson.exerciseSetId]
        return {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          tags: lesson.tags,
          status: done ? 'done' : unlocked ? 'in-progress' : 'locked',
          accuracy: result ? Math.round(result.bestAccuracy * 100) : null,
          duration: lesson.duration,
        }
      })
    }
    return map
  }, [state.completedNodeIds, state.exerciseResults])

  const exerciseCards: ExerciseCardData[] = useMemo(
    () =>
      ALL_EXERCISE_SETS.map((set) => {
        const unlocked = isNodeUnlocked(set.id, state.completedNodeIds)
        const result = state.exerciseResults[set.id]
        return {
          id: set.id,
          icon: set.icon,
          difficulty: set.difficulty,
          title: set.title,
          description: set.description,
          duration: set.exercises.length * 2,
          questions: set.exercises.length,
          points: set.points,
          status: result ? 'completed' : unlocked ? 'pending' : 'locked',
          accuracy: result ? Math.round(result.bestAccuracy * 100) : undefined,
        }
      }),
    [state.completedNodeIds, state.exerciseResults],
  )

  const completedLessonsCount = ALL_LESSONS.filter((l) => state.completedNodeIds[l.id]).length
  const completedTrackNodes = TRACK.filter((n) => state.completedNodeIds[n.id]).length
  const progressPct = TRACK.length > 0 ? Math.round((completedTrackNodes / TRACK.length) * 100) : 0
  const accuracyPct = Math.round(averageAccuracy * 100)

  const MODULE_DATA = {
    name: 'Matrizes',
    icon: '[A]',
    badge: 'Ensino Médio',
    description:
      'Organize números em linhas e colunas e aprenda a somar, multiplicar e transformar matrizes com visualizações interativas.',
    progress: progressPct,
    totalLessons: ALL_LESSONS.length,
    completedLessons: completedLessonsCount,
    accuracy: accuracyPct,
    streak: streakCount,
  }

  const streakDays = useMemo(() => {
    const lastDate = state.streak.lastPracticedISODate
    if (!lastDate || state.streak.count === 0) return Array<boolean>(7).fill(false)
    const anchor = new Date(`${lastDate}T00:00:00`)
    const anchorIndex = anchor.getDay() === 0 ? 6 : anchor.getDay() - 1
    return Array.from({ length: 7 }, (_, i) => {
      const diff = (anchorIndex - i + 7) % 7
      return diff < state.streak.count
    })
  }, [state.streak.lastPracticedISODate, state.streak.count])

  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

  const handleLessonClick = (id: string) => {
    onNavigate?.(`#aula-${id}`)
  }

  const handleExerciseClick = (id: string) => {
    onNavigate?.(`#exercicio-${id}`)
  }

  const handleContinue = () => {
    const firstIncomplete = TRACK.find((node) => !state.completedNodeIds[node.id])
    if (!firstIncomplete) return
    onNavigate?.(firstIncomplete.kind === 'lesson' ? `#aula-${firstIncomplete.id}` : `#exercicio-${firstIncomplete.id}`)
  }

  return (
    <div
      ref={pageRef}
      className="modulos-page"
      style={{ position: 'relative', zIndex: 10 }}
    >
      <RippleBackground />

      <ModuleHeader
        moduleName={MODULE_DATA.name}
        streak={MODULE_DATA.streak}
        userInitials="JF"
      />

      <ModuleHero
        icon={MODULE_DATA.icon}
        badge={MODULE_DATA.badge}
        title={MODULE_DATA.name}
        description={MODULE_DATA.description}
        progress={MODULE_DATA.progress}
        totalLessons={MODULE_DATA.totalLessons}
        completedLessons={MODULE_DATA.completedLessons}
        accuracy={MODULE_DATA.accuracy}
        onContinue={handleContinue}
      />

      <div ref={progressRef}>
        <ModuleProgress percentage={MODULE_DATA.progress} />
      </div>

      {/* Tabs bar with sliding underline */}
      <div
        ref={tabsBarRef}
        className="modulos-tabs-bar"
        role="tablist"
        aria-label="Seções do módulo"
        style={{
          maxWidth: 'min(1160px, calc(100% - 40px))',
          marginInline: 'auto',
          position: 'relative',
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            ref={(el) => { tabBtnRefs.current[tab] = el }}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={`modulos-tab-btn${activeTab === tab ? ' is-active' : ''}`}
            onClick={() => handleTabChange(tab)}
            style={{ borderBottomColor: 'transparent' }}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}

        {/* Animated underline indicator */}
        <div
          ref={underlineRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            height: '2px',
            background: '#22d3ee',
            borderRadius: '2px 2px 0 0',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Tab content — no key remount, animated via ref */}
      <div
        ref={tabContentRef}
        className="modulos-tab-content"
        role="tabpanel"
        aria-label={TAB_LABELS[displayedTab]}
        style={{ paddingTop: '76px' }}
      >
        {displayedTab === 'aulas' && (
          <>
            {MATRIZES_UNITS.map((unit) => (
              <UnitSection
                key={unit.number}
                unitNumber={unit.number}
                title={unit.title}
                lessons={lessonCardsByUnit[unit.number]}
                locked={!isNodeUnlocked(unit.lessons[0].id, state.completedNodeIds)}
                onLessonClick={handleLessonClick}
              />
            ))}
          </>
        )}

        {displayedTab === 'exercicios' && (
          <div className="exercise-grid">
            {exerciseCards.map((ex) => (
              <ExerciseCard key={ex.id} {...ex} onClick={handleExerciseClick} />
            ))}
          </div>
        )}

        {displayedTab === 'quiz' && (
          <>
            <div className="quiz-list">
              {QUIZ_QUESTIONS.map((q) => (
                <QuizQuestion key={q.id} {...q} />
              ))}
            </div>
            <StreakSection streak={streakCount} days={streakDays} todayIndex={todayIndex} />
          </>
        )}
      </div>
    </div>
  )
}

export default ModulosPage
