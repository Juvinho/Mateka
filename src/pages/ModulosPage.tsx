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

type TabId = 'aulas' | 'exercicios' | 'quiz'

const TAB_LABELS: Record<TabId, string> = {
  aulas: 'Aulas',
  exercicios: 'Exercícios',
  quiz: 'Quiz Rápido',
}

type UnitDef = {
  number: number
  title: string
  lessons: LessonCardData[]
  locked?: boolean
}

const UNIT_1_LESSONS: LessonCardData[] = [
  {
    id: 'matriz-1',
    title: 'O que é uma matriz?',
    description: 'Notação, dimensão m×n e como localizar cada elemento.',
    tags: ['Interativo', 'Exercício'],
    status: 'in-progress',
    accuracy: null,
    duration: 8,
  },
  {
    id: 'matriz-2',
    title: 'Tipos de matrizes',
    description: 'Matriz quadrada, linha, coluna e nula.',
    tags: ['Interativo', 'Exercício'],
    status: 'locked',
    accuracy: null,
    duration: 8,
  },
  {
    id: 'matriz-3',
    title: 'Localizando e comparando',
    description: 'Notação aᵢⱼ e quando duas matrizes são iguais.',
    tags: ['Interativo', 'Exercício'],
    status: 'locked',
    accuracy: null,
    duration: 8,
  },
]

const ROADMAP_UNITS: UnitDef[] = [
  {
    number: 2,
    title: 'Operações Básicas',
    locked: true,
    lessons: [
      {
        id: 'op-basicas',
        title: 'Soma, subtração e multiplicação por escalar',
        description: 'Combine matrizes de mesma dimensão elemento a elemento.',
        tags: ['Vídeo', 'Exercício'],
        status: 'locked',
        accuracy: null,
        duration: 12,
      },
    ],
  },
  {
    number: 3,
    title: 'Multiplicação de Matrizes',
    locked: true,
    lessons: [
      {
        id: 'mult-matrizes',
        title: 'Multiplicação linha por coluna',
        description: 'A operação que mais confunde — e como visualizá-la.',
        tags: ['Interativo', 'Exercício'],
        status: 'locked',
        accuracy: null,
        duration: 15,
      },
    ],
  },
  {
    number: 4,
    title: 'Determinante e Transposta',
    locked: true,
    lessons: [
      {
        id: 'det-transposta',
        title: 'Identidade, transposta e determinante',
        description: 'Matrizes especiais e o cálculo do determinante 2×2 e 3×3.',
        tags: ['Vídeo', 'Exercício'],
        status: 'locked',
        accuracy: null,
        duration: 15,
      },
    ],
  },
  {
    number: 5,
    title: 'Inversa e Sistemas Lineares',
    locked: true,
    lessons: [
      {
        id: 'inversa-sistemas',
        title: 'Matriz inversa e sistemas lineares',
        description: 'Use a inversa para resolver sistemas de equações.',
        tags: ['Interativo', 'Exercício'],
        status: 'locked',
        accuracy: null,
        duration: 18,
      },
    ],
  },
  {
    number: 6,
    title: 'Aplicações Reais',
    locked: true,
    lessons: [
      {
        id: 'aplicacoes',
        title: 'Transformações geométricas e grafos',
        description: 'Onde matrizes aparecem fora da sala de aula.',
        tags: ['Interativo'],
        status: 'locked',
        accuracy: null,
        duration: 15,
      },
    ],
  },
]

const ALL_UNITS: UnitDef[] = [{ number: 1, title: 'Fundamentos', lessons: UNIT_1_LESSONS }, ...ROADMAP_UNITS]
const ALL_LESSONS: LessonCardData[] = ALL_UNITS.flatMap((unit) => unit.lessons)

const MODULE_DATA = {
  name: 'Matrizes',
  icon: '[A]',
  badge: 'Ensino Médio',
  description:
    'Organize números em linhas e colunas e aprenda a somar, multiplicar e transformar matrizes com visualizações interativas.',
  progress: 0,
  totalLessons: ALL_LESSONS.length,
  completedLessons: 0,
  accuracy: 0,
  streak: 0,
}

const EXERCISES: ExerciseCardData[] = [
  {
    id: 'ex-fundamentos',
    icon: '[A]',
    difficulty: 'easy',
    title: 'Fundamentos: Identificação',
    description: 'Reconheça dimensões, elementos e tipos de matriz.',
    duration: 8,
    questions: 5,
    points: 40,
    status: 'pending',
  },
  {
    id: 'ex-tipos',
    icon: '□',
    difficulty: 'easy',
    title: 'Tipos de Matrizes',
    description: 'Diferencie matriz quadrada, linha, coluna e nula.',
    duration: 8,
    questions: 5,
    points: 40,
    status: 'pending',
  },
  {
    id: 'ex-localizacao',
    icon: 'aᵢⱼ',
    difficulty: 'medium',
    title: 'Localizando Elementos',
    description: 'Pratique a notação aᵢⱼ e a igualdade de matrizes.',
    duration: 10,
    questions: 5,
    points: 60,
    status: 'pending',
  },
  {
    id: 'ex-boss',
    icon: '★',
    difficulty: 'hard',
    title: 'Desafio: Fundamentos',
    description: 'Revisão mista de tudo que você aprendeu na Unidade 1.',
    duration: 12,
    questions: 6,
    points: 100,
    status: 'pending',
  },
]

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

const STREAK_DAYS: boolean[] = [false, false, false, false, false, false, false]

const TABS: TabId[] = ['aulas', 'exercicios', 'quiz']

type ModulosPageProps = {
  onNavigate?: (hash: string) => void
}

const ModulosPage = ({ onNavigate }: ModulosPageProps) => {
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

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

  const handleLessonClick = (id: string) => {
    onNavigate?.(`#aula-${id}`)
  }

  const handleContinue = () => {
    const inProgress = ALL_LESSONS.find((l) => l.status === 'in-progress')
    if (inProgress) {
      onNavigate?.(`#aula-${inProgress.id}`)
    }
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
            {ALL_UNITS.map((unit) => (
              <UnitSection
                key={unit.number}
                unitNumber={unit.number}
                title={unit.title}
                lessons={unit.lessons}
                locked={unit.locked}
                onLessonClick={handleLessonClick}
              />
            ))}
          </>
        )}

        {displayedTab === 'exercicios' && (
          <div className="exercise-grid">
            {EXERCISES.map((ex) => (
              <ExerciseCard key={ex.id} {...ex} />
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
            <StreakSection
              streak={MODULE_DATA.streak}
              days={STREAK_DAYS}
              todayIndex={new Date().getDay() === 0 ? 6 : new Date().getDay() - 1}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default ModulosPage
