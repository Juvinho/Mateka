import { useEffect, useMemo, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import gsap from 'gsap'

import RippleBackground from '../components/ui/RippleBackground'
import { PlaygroundErrorBoundary } from '../components/PlaygroundErrorBoundary'
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

import type { UnitContent, LessonContent } from '../data/lessonTypes'
import type { ExerciseSet, Exercise, Difficulty } from '../data/exerciseTypes'
import type { TrackNode } from '../data/trackUtils'
import { useModuleProgress, effectiveStreakCount } from '../state/useModuleProgress'
import { useAuth } from '../state/useAuth'

const ENDLESS_DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']
const ENDLESS_LABEL: Record<Difficulty, string> = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' }

type TabId = 'aulas' | 'exercicios' | 'quiz' | 'endless' | 'playground'

const TAB_LABELS: Record<TabId, string> = {
  aulas: 'Aulas',
  exercicios: 'Exercícios',
  quiz: 'Quiz Rápido',
  endless: 'Modo Endless',
  playground: 'Playground',
}

export type ModuleConfig = {
  moduleId: string
  name: string
  icon: string
  badge: string
  description: string
  units: UnitContent[]
  allLessons: LessonContent[]
  exerciseSets: ExerciseSet[]
  track: TrackNode[]
  isNodeUnlocked: (nodeId: string, completedNodeIds: Record<string, true>) => boolean
  endlessBank?: Record<Difficulty, Exercise[]>
  quizQuestions?: QuizQuestionData[]
  IntroComponent?: ComponentType
  PlaygroundComponent?: ComponentType
}

type ModulosPageProps = {
  config: ModuleConfig
  onNavigate?: (hash: string) => void
}

const ModulosPage = ({ config, onNavigate }: ModulosPageProps) => {
  const {
    moduleId,
    name,
    icon,
    badge,
    description,
    units,
    allLessons,
    exerciseSets,
    track,
    isNodeUnlocked,
    endlessBank,
    quizQuestions,
    IntroComponent,
    PlaygroundComponent,
  } = config

  const tabs = useMemo<TabId[]>(() => {
    const list: TabId[] = ['aulas', 'exercicios']
    if (quizQuestions && quizQuestions.length > 0) list.push('quiz')
    if (endlessBank) list.push('endless')
    if (PlaygroundComponent) list.push('playground')
    return list
  }, [quizQuestions, endlessBank, PlaygroundComponent])

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const { state, streakCount, averageAccuracy } = useModuleProgress(moduleId)
  const { user } = useAuth()

  const userInitials = useMemo(() => {
    const parts = user?.displayName.trim().split(/\s+/).filter(Boolean) ?? []
    if (parts.length === 0) return 'U'
    const first = parts[0]![0]!
    const last = parts.length > 1 ? parts[parts.length - 1]![0] : ''
    return (first + last).toUpperCase()
  }, [user])

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
    for (const unit of units) {
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
  }, [units, isNodeUnlocked, state.completedNodeIds, state.exerciseResults])

  const exerciseCards: ExerciseCardData[] = useMemo(
    () =>
      exerciseSets.map((set) => {
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
    [exerciseSets, isNodeUnlocked, state.completedNodeIds, state.exerciseResults],
  )

  // Free-practice mode: always available, no unit progress required.
  const endlessCards: ExerciseCardData[] = useMemo(() => {
    if (!endlessBank) return []
    return ENDLESS_DIFFICULTIES.map((difficulty) => {
      const stats = state.endless[difficulty]
      const bankSize = endlessBank[difficulty].length
      const accuracy = stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : undefined
      return {
        id: `endless-${moduleId}-${difficulty}`,
        icon: '∞',
        difficulty,
        title: `Modo Endless — ${ENDLESS_LABEL[difficulty]}`,
        description: `Prática livre e sem fim com questões ${ENDLESS_LABEL[difficulty].toLowerCase()}s de todo o módulo.`,
        duration: 0,
        durationLabel: 'Sem limite',
        questions: bankSize,
        questionsLabel: `${bankSize}+ questões`,
        points: 0,
        pointsLabel: '+5 pts/acerto',
        status: stats.totalAnswered > 0 ? 'completed' : 'pending',
        accuracy,
        isEndless: true,
      }
    })
  }, [endlessBank, state.endless, moduleId])

  const completedLessonsCount = allLessons.filter((l) => state.completedNodeIds[l.id]).length
  const completedTrackNodes = track.filter((n) => state.completedNodeIds[n.id]).length
  const progressPct = track.length > 0 ? Math.round((completedTrackNodes / track.length) * 100) : 0
  const accuracyPct = Math.round(averageAccuracy * 100)

  // The single source of truth for "what's next" — reused by the Continuar
  // button's click handler and by its label/color below, so the two can
  // never disagree with each other about what "next" means.
  const firstIncomplete = useMemo(
    () => track.find((node) => !state.completedNodeIds[node.id]),
    [track, state.completedNodeIds],
  )
  const nextIsChallenge = useMemo(() => {
    if (!firstIncomplete || firstIncomplete.kind !== 'exercise') return false
    const set = exerciseSets.find((s) => s.id === firstIncomplete.id)
    return set?.difficulty === 'hard'
  }, [firstIncomplete, exerciseSets])

  const streakDays = useMemo(() => {
    const lastDate = state.streak.lastPracticedISODate
    const activeCount = effectiveStreakCount(state.streak)
    if (!lastDate || activeCount === 0) return Array<boolean>(7).fill(false)
    const anchor = new Date(`${lastDate}T00:00:00`)
    const anchorIndex = anchor.getDay() === 0 ? 6 : anchor.getDay() - 1
    return Array.from({ length: 7 }, (_, i) => {
      const diff = (anchorIndex - i + 7) % 7
      return diff < activeCount
    })
  }, [state.streak])

  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

  const handleLessonClick = (id: string) => {
    onNavigate?.(`#aula-${id}`)
  }

  const handleExerciseClick = (id: string) => {
    if (id.startsWith('endless-')) {
      onNavigate?.(`#${id}`)
      return
    }
    onNavigate?.(`#exercicio-${id}`)
  }

  const handleContinue = () => {
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
      {IntroComponent ? <IntroComponent /> : null}

      <ModuleHeader
        moduleName={name}
        streak={streakCount}
        userInitials={userInitials}
      />

      <ModuleHero
        icon={icon}
        badge={badge}
        title={name}
        description={description}
        progress={progressPct}
        totalLessons={allLessons.length}
        completedLessons={completedLessonsCount}
        accuracy={accuracyPct}
        allComplete={!firstIncomplete}
        isNextChallenge={nextIsChallenge}
        onContinue={handleContinue}
      />

      <div ref={progressRef}>
        <ModuleProgress percentage={progressPct} />
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
        {tabs.map((tab) => (
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
            {units.map((unit) => (
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

        {displayedTab === 'quiz' && quizQuestions && (
          <>
            <div className="quiz-list">
              {quizQuestions.map((q) => (
                <QuizQuestion key={q.id} {...q} />
              ))}
            </div>
            <StreakSection streak={streakCount} days={streakDays} todayIndex={todayIndex} />
          </>
        )}

        {displayedTab === 'endless' && endlessBank && (
          <>
            <div className="endless-tab-intro">
              <p className="section-kicker">Prática livre</p>
              <h2>Sem unidade, sem fim — só prática.</h2>
              <p>Escolha uma dificuldade e pratique o quanto quiser, puxando questões do módulo inteiro. Disponível a qualquer momento, sem pré-requisitos.</p>
            </div>
            <div className="exercise-grid">
              {endlessCards.map((ex) => (
                <ExerciseCard key={ex.id} {...ex} onClick={handleExerciseClick} />
              ))}
            </div>
          </>
        )}

        {displayedTab === 'playground' && PlaygroundComponent && (
          <PlaygroundErrorBoundary name={`Playground — ${name}`}>
            <PlaygroundComponent />
          </PlaygroundErrorBoundary>
        )}
      </div>
    </div>
  )
}

export default ModulosPage
