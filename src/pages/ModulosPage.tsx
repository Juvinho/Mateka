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

const MODULE_DATA = {
  name: 'Cálculo Diferencial',
  icon: "f'",
  badge: 'Universitário',
  description:
    'Domine a variação instantânea através de visualizações interativas de derivadas, limites e suas aplicações reais.',
  progress: 45,
  totalLessons: 11,
  completedLessons: 5,
  accuracy: 88,
  streak: 7,
}

const UNIT_1_LESSONS: LessonCardData[] = [
  {
    id: 'l1',
    title: 'Introdução aos Limites',
    description: 'Conceito intuitivo de limite e notação formal.',
    tags: ['Vídeo', 'Interativo'],
    status: 'done',
    accuracy: 100,
    duration: 18,
  },
  {
    id: 'l2',
    title: 'Limites Laterais',
    description: 'Limites pela esquerda e pela direita.',
    tags: ['Vídeo', 'Exercício'],
    status: 'done',
    accuracy: 92,
    duration: 22,
  },
  {
    id: 'l3',
    title: 'Continuidade de Funções',
    description: 'Definição formal e pontos de descontinuidade.',
    tags: ['Interativo', 'Exercício'],
    status: 'done',
    accuracy: 88,
    duration: 25,
  },
]

const UNIT_2_LESSONS: LessonCardData[] = [
  {
    id: 'l4',
    title: 'Definição de Derivada',
    description: 'Taxa de variação instantânea via limite.',
    tags: ['Vídeo', 'Interativo'],
    status: 'done',
    accuracy: 95,
    duration: 20,
  },
  {
    id: 'l5',
    title: 'Regras de Derivação',
    description: 'Regra da soma, produto, quociente e cadeia.',
    tags: ['Vídeo', 'Exercício'],
    status: 'done',
    accuracy: 78,
    duration: 30,
  },
  {
    id: 'l6',
    title: 'Derivadas Trigonométricas',
    description: 'Derivadas de sin, cos, tan e suas inversas.',
    tags: ['Vídeo', 'Interativo'],
    status: 'in-progress',
    accuracy: null,
    duration: 28,
  },
  {
    id: 'l7',
    title: 'Derivadas de Funções Compostas',
    description: 'Aplicação da regra da cadeia em situações reais.',
    tags: ['Exercício'],
    status: 'locked',
    accuracy: null,
    duration: 35,
  },
  {
    id: 'l8',
    title: 'Derivadas Implícitas',
    description: 'Diferenciação de equações implícitas.',
    tags: ['Vídeo', 'Exercício'],
    status: 'locked',
    accuracy: null,
    duration: 32,
  },
]

const UNIT_3_LESSONS: LessonCardData[] = [
  {
    id: 'l9',
    title: 'Máximos e Mínimos',
    description: 'Pontos críticos e teste da segunda derivada.',
    tags: ['Interativo', 'Exercício'],
    status: 'locked',
    accuracy: null,
    duration: 40,
  },
  {
    id: 'l10',
    title: 'Problemas de Otimização',
    description: 'Modelagem e solução de problemas reais.',
    tags: ['Vídeo', 'Exercício'],
    status: 'locked',
    accuracy: null,
    duration: 45,
  },
  {
    id: 'l11',
    title: 'Esboço de Curvas',
    description: 'Análise completa do gráfico usando derivadas.',
    tags: ['Interativo'],
    status: 'locked',
    accuracy: null,
    duration: 38,
  },
]

const EXERCISES: ExerciseCardData[] = [
  {
    id: 'e1',
    icon: "f'",
    difficulty: 'easy',
    title: 'Derivadas Básicas',
    description: 'Aplique as regras fundamentais de derivação.',
    duration: 10,
    questions: 8,
    points: 40,
    status: 'completed',
    accuracy: 100,
  },
  {
    id: 'e2',
    icon: '∂',
    difficulty: 'medium',
    title: 'Regra da Cadeia',
    description: 'Derivadas de funções compostas em múltiplos níveis.',
    duration: 15,
    questions: 6,
    points: 70,
    status: 'completed',
    accuracy: 83,
  },
  {
    id: 'e3',
    icon: '⛓',
    difficulty: 'medium',
    title: 'Derivadas Implícitas',
    description: 'Diferencie equações definidas implicitamente.',
    duration: 20,
    questions: 5,
    points: 120,
    status: 'pending',
  },
  {
    id: 'e4',
    icon: 'sin',
    difficulty: 'hard',
    title: 'Aplicações de Derivadas',
    description: 'Problemas de otimização e taxa de variação.',
    duration: 25,
    questions: 4,
    points: 150,
    status: 'pending',
  },
  {
    id: 'e5',
    icon: 'ln',
    difficulty: 'medium',
    title: 'Funções Transcendentes',
    description: 'Derivadas de logarítmicas e exponenciais.',
    duration: 18,
    questions: 6,
    points: 90,
    status: 'pending',
  },
  {
    id: 'e6',
    icon: 'max',
    difficulty: 'hard',
    title: 'Extremos Globais',
    description: 'Maximos e mínimos absolutos em intervalos fechados.',
    duration: 30,
    questions: 5,
    points: 150,
    status: 'pending',
  },
]

const QUIZ_QUESTIONS: QuizQuestionData[] = [
  {
    id: 'q1',
    number: 1,
    difficulty: 'Fácil',
    question: 'Qual é a derivada da função f(x) = x²?',
    formula: "f'(x) = lim[h→0] (f(x+h) - f(x)) / h",
    options: [
      { letter: 'A', text: "f'(x) = x", isCorrect: false },
      { letter: 'B', text: "f'(x) = 2x", isCorrect: true },
      { letter: 'C', text: "f'(x) = 2", isCorrect: false },
      { letter: 'D', text: "f'(x) = x²", isCorrect: false },
    ],
  },
  {
    id: 'q2',
    number: 2,
    difficulty: 'Médio',
    question: 'Qual é a derivada de f(x) = sin(x) · cos(x) usando a regra do produto?',
    formula: "(u · v)' = u'v + uv'",
    options: [
      { letter: 'A', text: 'cos²(x) - sin²(x)', isCorrect: true },
      { letter: 'B', text: '2sin(x)cos(x)', isCorrect: false },
      { letter: 'C', text: '-sin²(x)', isCorrect: false },
      { letter: 'D', text: 'cos(x) - sin(x)', isCorrect: false },
    ],
  },
  {
    id: 'q3',
    number: 3,
    difficulty: 'Difícil',
    question: 'Encontre dy/dx para a equação implícita x² + y² = 25.',
    formula: 'x² + y² = 25',
    options: [
      { letter: 'A', text: 'dy/dx = y/x', isCorrect: false },
      { letter: 'B', text: 'dy/dx = -x/y', isCorrect: true },
      { letter: 'C', text: 'dy/dx = x/y', isCorrect: false },
      { letter: 'D', text: 'dy/dx = -y/x', isCorrect: false },
    ],
  },
]

const STREAK_DAYS: boolean[] = [true, true, true, true, true, true, true]

const TABS: TabId[] = ['aulas', 'exercicios', 'quiz']

const ModulosPage = () => {
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

  const handleContinue = () => {
    const inProgress = [...UNIT_1_LESSONS, ...UNIT_2_LESSONS, ...UNIT_3_LESSONS].find(
      (l) => l.status === 'in-progress',
    )
    if (inProgress) {
      console.log('Navegar para aula:', inProgress.id)
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
            <UnitSection unitNumber={1} title="Limites e Continuidade" lessons={UNIT_1_LESSONS} />
            <UnitSection unitNumber={2} title="Derivadas"              lessons={UNIT_2_LESSONS} />
            <UnitSection unitNumber={3} title="Aplicações"             lessons={UNIT_3_LESSONS} locked />
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
