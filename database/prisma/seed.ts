import { PrismaClient, type Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

type SeedQuestion = {
  prompt: string
  formulaDisplay?: string
  options: { id: string; label: string }[]
  correctChoiceId: string
  explanation: string
}

type SeedLesson = {
  slug: string
  title: string
  description: string
  durationMin: number
  tags: ('video' | 'interactive' | 'exercise')[]
  exercise: {
    iconSymbol: string
    difficulty: 'easy' | 'medium' | 'hard'
    title: string
    description: string
    durationMin: number
    points: number
    questions: SeedQuestion[]
  }
}

type SeedUnit = {
  number: number
  title: string
  lessons: SeedLesson[]
}

// Conteúdo de exemplo: "Matrizes", espelhando os 10 tópicos pedidos e a
// numeração de unidades já usada no frontend (7 unidades).
const MATRIZES_UNITS: SeedUnit[] = [
  {
    number: 1,
    title: 'Fundamentos das Matrizes',
    lessons: [
      {
        slug: 'o-que-e-uma-matriz',
        title: 'O que é uma matriz',
        description: 'Organize números em linhas e colunas e entenda a notação aij.',
        durationMin: 8,
        tags: ['interactive', 'exercise'],
        exercise: {
          iconSymbol: '□',
          difficulty: 'easy',
          title: 'Fundamentos das Matrizes',
          description: 'Dimensões, notação e o que faz uma matriz ser quadrada.',
          durationMin: 6,
          points: 40,
          questions: [
            {
              prompt: 'Quantas linhas e colunas tem a matriz A abaixo?',
              formulaDisplay: 'A = [[2, 5, 9], [1, 4, 7]]',
              options: [
                { id: 'a', label: '3 linhas e 2 colunas' },
                { id: 'b', label: '2 linhas e 3 colunas' },
                { id: 'c', label: '2 linhas e 2 colunas' },
                { id: 'd', label: '6 linhas e 1 coluna' },
              ],
              correctChoiceId: 'b',
              explanation: 'A tem 2 linhas e 3 colunas, por isso é uma matriz 2×3.',
            },
            {
              prompt: 'Como é chamada a matriz que tem o mesmo número de linhas e colunas?',
              options: [
                { id: 'a', label: 'Matriz quadrada' },
                { id: 'b', label: 'Matriz linha' },
                { id: 'c', label: 'Matriz nula' },
                { id: 'd', label: 'Matriz coluna' },
              ],
              correctChoiceId: 'a',
              explanation: 'Matriz quadrada é aquela com número de linhas igual ao número de colunas.',
            },
            {
              prompt: 'Na notação aᵢⱼ, o que representam i e j?',
              options: [
                { id: 'a', label: 'i é a coluna, j é a linha' },
                { id: 'b', label: 'i é a linha, j é a coluna' },
                { id: 'c', label: 'i e j são sempre iguais' },
                { id: 'd', label: 'i é o valor, j é a posição' },
              ],
              correctChoiceId: 'b',
              explanation: 'Por convenção, o primeiro índice (i) é a linha e o segundo (j) é a coluna.',
            },
          ],
        },
      },
      {
        slug: 'tipos-de-matrizes',
        title: 'Tipos de matrizes',
        description: 'Diagonal, identidade, nula e outras formas especiais.',
        durationMin: 7,
        tags: ['exercise'],
        exercise: {
          iconSymbol: '▦',
          difficulty: 'easy',
          title: 'Tipos de Matrizes',
          description: 'Reconheça matrizes diagonais, identidade e nulas.',
          durationMin: 5,
          points: 35,
          questions: [
            {
              prompt: 'Uma matriz onde todos os elementos fora da diagonal principal são zero é chamada de:',
              options: [
                { id: 'a', label: 'Matriz diagonal' },
                { id: 'b', label: 'Matriz identidade' },
                { id: 'c', label: 'Matriz nula' },
                { id: 'd', label: 'Matriz transposta' },
              ],
              correctChoiceId: 'a',
              explanation: 'É a definição de matriz diagonal — identidade é um caso particular dela.',
            },
            {
              prompt: 'A matriz identidade de ordem 3 tem quantos elementos iguais a 1?',
              options: [
                { id: 'a', label: '1' },
                { id: 'b', label: '3' },
                { id: 'c', label: '9' },
                { id: 'd', label: '0' },
              ],
              correctChoiceId: 'b',
              explanation: 'Os três elementos da diagonal principal (a11, a22, a33) valem 1.',
            },
          ],
        },
      },
      {
        slug: 'localizando-e-comparando',
        title: 'Localizando e comparando',
        description: 'Encontre elementos por posição e diga quando duas matrizes são iguais.',
        durationMin: 7,
        tags: ['exercise'],
        exercise: {
          iconSymbol: '⌗',
          difficulty: 'easy',
          title: 'Localização e Comparação',
          description: 'Leitura de elementos e igualdade entre matrizes.',
          durationMin: 5,
          points: 45,
          questions: [
            {
              prompt: 'Na matriz A = [[4,1,7],[2,9,5],[6,3,8]], qual é o elemento a₂₃ (linha 2, coluna 3)?',
              options: [
                { id: 'a', label: '7' },
                { id: 'b', label: '5' },
                { id: 'c', label: '9' },
                { id: 'd', label: '3' },
              ],
              correctChoiceId: 'b',
              explanation: 'A linha 2 é [2, 9, 5]; a coluna 3 dessa linha é 5.',
            },
            {
              prompt: 'Duas matrizes são iguais quando:',
              options: [
                { id: 'a', label: 'Têm a mesma soma de elementos' },
                { id: 'b', label: 'Têm a mesma dimensão e todos os elementos correspondentes são iguais' },
                { id: 'c', label: 'Têm o mesmo determinante' },
                { id: 'd', label: 'Têm a mesma quantidade de linhas apenas' },
              ],
              correctChoiceId: 'b',
              explanation: 'Igualdade de matrizes exige mesma dimensão e igualdade elemento a elemento.',
            },
          ],
        },
      },
    ],
  },
  {
    number: 2,
    title: 'Operações entre Matrizes',
    lessons: [
      {
        slug: 'soma-subtracao-e-escalar',
        title: 'Soma, subtração e multiplicação por escalar',
        description: 'As três operações mais básicas entre matrizes.',
        durationMin: 9,
        tags: ['exercise'],
        exercise: {
          iconSymbol: '+',
          difficulty: 'medium',
          title: 'Operações Básicas',
          description: 'Some, subtraia e multiplique matrizes por um número.',
          durationMin: 7,
          points: 65,
          questions: [
            {
              prompt: 'Some as matrizes A=[[1,2],[3,4]] e B=[[5,6],[7,8]]. Qual o elemento resultante na posição (1,1)?',
              options: [
                { id: 'a', label: '6' },
                { id: 'b', label: '5' },
                { id: 'c', label: '1' },
                { id: 'd', label: '8' },
              ],
              correctChoiceId: 'a',
              explanation: 'Soma elemento a elemento: 1 + 5 = 6.',
            },
            {
              prompt: 'Ao multiplicar uma matriz por um escalar k, o que acontece?',
              options: [
                { id: 'a', label: 'Só a primeira linha é multiplicada' },
                { id: 'b', label: 'Cada elemento da matriz é multiplicado por k' },
                { id: 'c', label: 'Apenas a diagonal é multiplicada' },
                { id: 'd', label: 'A matriz muda de dimensão' },
              ],
              correctChoiceId: 'b',
              explanation: 'Multiplicação por escalar afeta todos os elementos, um a um.',
            },
          ],
        },
      },
    ],
  },
  {
    number: 3,
    title: 'Multiplicação de Matrizes',
    lessons: [
      {
        slug: 'multiplicacao-linha-por-coluna',
        title: 'Multiplicação linha por coluna',
        description: 'A regra de compatibilidade de dimensões e o produto matricial.',
        durationMin: 10,
        tags: ['interactive', 'exercise'],
        exercise: {
          iconSymbol: '×',
          difficulty: 'medium',
          title: 'Multiplicação de Matrizes',
          description: 'Pratique o produto linha por coluna.',
          durationMin: 8,
          points: 75,
          questions: [
            {
              prompt: 'Para multiplicar A (m×n) por B (p×q), qual condição é necessária?',
              options: [
                { id: 'a', label: 'm = p' },
                { id: 'b', label: 'n = p' },
                { id: 'c', label: 'n = q' },
                { id: 'd', label: 'm = q' },
              ],
              correctChoiceId: 'b',
              explanation: 'O número de colunas de A deve ser igual ao número de linhas de B.',
            },
            {
              prompt: 'Multiplicando A=[[1,2]] (1×2) por B=[[3],[4]] (2×1), qual o resultado?',
              options: [
                { id: 'a', label: '[11]' },
                { id: 'b', label: '[7]' },
                { id: 'c', label: '[3, 8]' },
                { id: 'd', label: '[4, 6]' },
              ],
              correctChoiceId: 'a',
              explanation: '1×3 + 2×4 = 3 + 8 = 11.',
            },
          ],
        },
      },
    ],
  },
  {
    number: 4,
    title: 'Propriedades Especiais',
    lessons: [
      {
        slug: 'identidade-transposta-e-determinante',
        title: 'Identidade, transposta e determinante',
        description: 'Três ferramentas essenciais para entender uma matriz por dentro.',
        durationMin: 10,
        tags: ['exercise'],
        exercise: {
          iconSymbol: 'Δ',
          difficulty: 'medium',
          title: 'Identidade, Transposta e Determinante',
          description: 'Propriedades que aparecem em quase todo exercício de matrizes.',
          durationMin: 8,
          points: 80,
          questions: [
            {
              prompt: 'A transposta de A=[[1,2],[3,4]] é:',
              options: [
                { id: 'a', label: '[[1,3],[2,4]]' },
                { id: 'b', label: '[[4,3],[2,1]]' },
                { id: 'c', label: '[[1,2],[3,4]]' },
                { id: 'd', label: '[[2,1],[4,3]]' },
              ],
              correctChoiceId: 'a',
              explanation: 'A transposta troca linhas por colunas: aᵢⱼ vira aⱼᵢ.',
            },
            {
              prompt: 'O determinante de A=[[3,1],[2,4]] é:',
              options: [
                { id: 'a', label: '10' },
                { id: 'b', label: '14' },
                { id: 'c', label: '2' },
                { id: 'd', label: '12' },
              ],
              correctChoiceId: 'a',
              explanation: 'det(A) = 3×4 − 1×2 = 12 − 2 = 10.',
            },
            {
              prompt: 'Multiplicar uma matriz A pela matriz identidade I resulta em:',
              options: [
                { id: 'a', label: 'A matriz nula' },
                { id: 'b', label: 'A própria matriz A' },
                { id: 'c', label: 'A transposta de A' },
                { id: 'd', label: 'A inversa de A' },
              ],
              correctChoiceId: 'b',
              explanation: 'A identidade é o elemento neutro da multiplicação de matrizes.',
            },
          ],
        },
      },
    ],
  },
  {
    number: 5,
    title: 'Matriz Inversa',
    lessons: [
      {
        slug: 'matriz-inversa',
        title: 'Matriz inversa',
        description: 'Quando existe, o que significa e como ela desfaz uma transformação.',
        durationMin: 10,
        tags: ['exercise'],
        exercise: {
          iconSymbol: '⁻¹',
          difficulty: 'medium',
          title: 'Matriz Inversa',
          description: 'Existência e significado da matriz inversa.',
          durationMin: 8,
          points: 85,
          questions: [
            {
              prompt: 'Uma matriz só possui inversa se:',
              options: [
                { id: 'a', label: 'For quadrada e seu determinante for diferente de zero' },
                { id: 'b', label: 'Tiver apenas números positivos' },
                { id: 'c', label: 'For simétrica' },
                { id: 'd', label: 'Tiver determinante igual a zero' },
              ],
              correctChoiceId: 'a',
              explanation: 'Determinante zero significa que a matriz é singular — não invertível.',
            },
            {
              prompt: 'Se A · A⁻¹ = I, o que representa I?',
              options: [
                { id: 'a', label: 'A matriz nula' },
                { id: 'b', label: 'A matriz identidade' },
                { id: 'c', label: 'A matriz transposta de A' },
                { id: 'd', label: 'O determinante de A' },
              ],
              correctChoiceId: 'b',
              explanation: 'Por definição, A vezes sua inversa resulta na matriz identidade.',
            },
          ],
        },
      },
    ],
  },
  {
    number: 6,
    title: 'Transformações Geométricas',
    lessons: [
      {
        slug: 'transformacoes-geometricas',
        title: 'Transformações geométricas',
        description: 'Rotação, reflexão e escala como multiplicação de matrizes.',
        durationMin: 9,
        tags: ['interactive', 'exercise'],
        exercise: {
          iconSymbol: '↻',
          difficulty: 'hard',
          title: 'Transformações Geométricas',
          description: 'Matrizes que rotacionam, refletem e escalam vetores.',
          durationMin: 9,
          points: 130,
          questions: [
            {
              prompt: 'Qual matriz de transformação 2×2 representa uma reflexão em torno do eixo x?',
              options: [
                { id: 'a', label: '[[1,0],[0,-1]]' },
                { id: 'b', label: '[[-1,0],[0,1]]' },
                { id: 'c', label: '[[0,1],[1,0]]' },
                { id: 'd', label: '[[1,0],[0,1]]' },
              ],
              correctChoiceId: 'a',
              explanation: 'Inverter o sinal da coordenada y reflete o vetor em torno do eixo x.',
            },
            {
              prompt: 'Multiplicar um vetor por uma matriz de rotação faz o quê geometricamente?',
              options: [
                { id: 'a', label: 'Escala o vetor' },
                { id: 'b', label: 'Rotaciona o vetor em torno da origem' },
                { id: 'c', label: 'Reflete o vetor' },
                { id: 'd', label: 'Translada o vetor' },
              ],
              correctChoiceId: 'b',
              explanation: 'Matrizes de rotação giram vetores em torno da origem por um ângulo θ.',
            },
          ],
        },
      },
    ],
  },
  {
    number: 7,
    title: 'Tópicos Avançados',
    lessons: [
      {
        slug: 'mais-tipos-de-matrizes',
        title: 'Mais tipos de matrizes',
        description: 'Simétricas, triangulares e outras formas que aparecem em aplicações.',
        durationMin: 8,
        tags: ['exercise'],
        exercise: {
          iconSymbol: '⊞',
          difficulty: 'medium',
          title: 'Mais Tipos de Matrizes',
          description: 'Simétricas e triangulares.',
          durationMin: 6,
          points: 70,
          questions: [
            {
              prompt: 'Uma matriz simétrica satisfaz qual propriedade?',
              options: [
                { id: 'a', label: 'A = −A' },
                { id: 'b', label: 'A = Aᵀ (igual à sua própria transposta)' },
                { id: 'c', label: 'A = A⁻¹' },
                { id: 'd', label: 'A = I' },
              ],
              correctChoiceId: 'b',
              explanation: 'Matriz simétrica é aquela que é igual à sua transposta.',
            },
            {
              prompt: 'Uma matriz triangular superior tem zeros:',
              options: [
                { id: 'a', label: 'Acima da diagonal principal' },
                { id: 'b', label: 'Abaixo da diagonal principal' },
                { id: 'c', label: 'Na diagonal principal' },
                { id: 'd', label: 'Em toda a matriz' },
              ],
              correctChoiceId: 'b',
              explanation: 'Triangular superior tem todos os elementos abaixo da diagonal iguais a zero.',
            },
          ],
        },
      },
      {
        slug: 'teorema-de-cayley-hamilton',
        title: 'Teorema de Cayley-Hamilton',
        description: 'Toda matriz quadrada satisfaz sua própria equação característica.',
        durationMin: 12,
        tags: ['exercise'],
        exercise: {
          iconSymbol: 'λ',
          difficulty: 'hard',
          title: 'Cayley-Hamilton',
          description: 'O teorema mais elegante (e mais temido) do módulo de matrizes.',
          durationMin: 10,
          points: 145,
          questions: [
            {
              prompt: 'O Teorema de Cayley-Hamilton afirma que toda matriz quadrada A satisfaz:',
              options: [
                { id: 'a', label: 'Sua própria equação característica' },
                { id: 'b', label: 'A equação x² = 1' },
                { id: 'c', label: 'Que A é sempre invertível' },
                { id: 'd', label: 'Que det(A) = 0' },
              ],
              correctChoiceId: 'a',
              explanation: 'É a definição do teorema: p(A) = 0, onde p é o polinômio característico de A.',
            },
            {
              prompt: 'Para uma matriz 2×2 A com traço t e determinante d, o polinômio característico é:',
              options: [
                { id: 'a', label: 'λ² − tλ + d = 0' },
                { id: 'b', label: 'λ² + tλ − d = 0' },
                { id: 'c', label: 'λ² − dλ + t = 0' },
                { id: 'd', label: 'λ = t + d' },
              ],
              correctChoiceId: 'a',
              explanation: 'Para 2×2, o polinômio característico é sempre λ² − (traço)λ + (determinante).',
            },
          ],
        },
      },
    ],
  },
]

async function main() {
  // --- Usuário de teste (senha SEMPRE hasheada — nunca texto puro, nem em seed) ---
  const passwordHash = await bcrypt.hash('MatekaDemo123!', 12)
  const user = await prisma.user.upsert({
    where: { email: 'aluno.demo@mateka.dev' },
    update: {},
    create: {
      email: 'aluno.demo@mateka.dev',
      emailVerified: true,
      passwordHash,
      authProvider: 'email',
      displayName: 'Aluno Demo',
      role: 'student',
    },
  })
  console.log(`Seed user: ${user.email} (senha de teste: MatekaDemo123!)`)

  // --- Subject: Matrizes ---
  const subject = await prisma.subject.upsert({
    where: { slug: 'matrizes' },
    update: {},
    create: {
      slug: 'matrizes',
      title: 'Matrizes',
      iconSymbol: '[A]',
      level: 'ensino_medio',
      description:
        'Organize números em linhas e colunas e aprenda a somar, multiplicar e transformar matrizes.',
      orderIndex: 1,
    },
  })

  let firstLessonId: string | null = null
  let secondLessonId: string | null = null

  for (const unitSeed of MATRIZES_UNITS) {
    const unit = await prisma.unit.upsert({
      where: { subjectId_number: { subjectId: subject.id, number: unitSeed.number } },
      update: { title: unitSeed.title },
      create: {
        subjectId: subject.id,
        number: unitSeed.number,
        title: unitSeed.title,
        lockedByDefault: unitSeed.number !== 1,
      },
    })

    for (const [lessonIndex, lessonSeed] of unitSeed.lessons.entries()) {
      const lesson = await prisma.lesson.upsert({
        where: { unitId_slug: { unitId: unit.id, slug: lessonSeed.slug } },
        update: {
          title: lessonSeed.title,
          description: lessonSeed.description,
          durationMin: lessonSeed.durationMin,
        },
        create: {
          unitId: unit.id,
          slug: lessonSeed.slug,
          title: lessonSeed.title,
          description: lessonSeed.description,
          durationMin: lessonSeed.durationMin,
          orderIndex: lessonIndex + 1,
        },
      })

      if (!firstLessonId) firstLessonId = lesson.id
      else if (!secondLessonId) secondLessonId = lesson.id

      for (const tag of lessonSeed.tags) {
        await prisma.lessonTag.upsert({
          where: { lessonId_tag: { lessonId: lesson.id, tag } },
          update: {},
          create: { lessonId: lesson.id, tag },
        })
      }

      // Exercise has no unique slug/title column in the schema, so upsert
      // isn't available — find-or-create by (unitId, title) keeps re-running
      // the seed idempotent instead of duplicating rows on every run.
      const exerciseSeed = lessonSeed.exercise
      const exerciseData = {
        unitId: unit.id,
        iconSymbol: exerciseSeed.iconSymbol,
        difficulty: exerciseSeed.difficulty,
        title: exerciseSeed.title,
        description: exerciseSeed.description,
        durationMin: exerciseSeed.durationMin,
        questionCount: exerciseSeed.questions.length,
        points: exerciseSeed.points,
        orderIndex: lessonIndex + 1,
      }
      const existingExercise = await prisma.exercise.findFirst({
        where: { unitId: unit.id, title: exerciseSeed.title },
      })
      const exercise = existingExercise
        ? await prisma.exercise.update({ where: { id: existingExercise.id }, data: exerciseData })
        : await prisma.exercise.create({ data: exerciseData })

      for (const [qIndex, q] of exerciseSeed.questions.entries()) {
        const correctAnswer = { kind: 'multiple-choice', choiceId: q.correctChoiceId } satisfies Prisma.InputJsonValue
        await prisma.exerciseQuestion.upsert({
          where: { exerciseId_orderIndex: { exerciseId: exercise.id, orderIndex: qIndex + 1 } },
          update: {
            prompt: q.prompt,
            formulaDisplay: q.formulaDisplay,
            correctAnswer,
            options: q.options as unknown as Prisma.InputJsonValue,
            explanation: q.explanation,
          },
          create: {
            exerciseId: exercise.id,
            prompt: q.prompt,
            formulaDisplay: q.formulaDisplay,
            correctAnswer,
            options: q.options as unknown as Prisma.InputJsonValue,
            explanation: q.explanation,
            orderIndex: qIndex + 1,
          },
        })
      }
    }
  }

  // --- Progresso de exemplo para o usuário demo ---
  const unit1 = await prisma.unit.findFirstOrThrow({ where: { subjectId: subject.id, number: 1 } })
  await prisma.unitUnlock.upsert({
    where: { userId_unitId: { userId: user.id, unitId: unit1.id } },
    update: {},
    create: { userId: user.id, unitId: unit1.id },
  })

  if (firstLessonId) {
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId: firstLessonId } },
      update: {},
      create: {
        userId: user.id,
        lessonId: firstLessonId,
        status: 'done',
        accuracy: 100,
        completedAt: new Date(),
      },
    })
  }
  if (secondLessonId) {
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId: secondLessonId } },
      update: {},
      create: {
        userId: user.id,
        lessonId: secondLessonId,
        status: 'in-progress',
      },
    })
  }

  // Streak de exemplo: últimos 3 dias (append-only — só INSERT).
  const today = new Date()
  for (let daysAgo = 0; daysAgo < 3; daysAgo += 1) {
    const date = new Date(today)
    date.setUTCDate(date.getUTCDate() - daysAgo)
    date.setUTCHours(0, 0, 0, 0)
    await prisma.streakLog.upsert({
      where: { userId_activityDate: { userId: user.id, activityDate: date } },
      update: {},
      create: { userId: user.id, activityDate: date },
    })
  }

  // Um par de tentativas de exemplo contra a primeira questão da primeira
  // lição (append-only — só INSERT, nunca gerado por upsert).
  const firstExercise = await prisma.exercise.findFirst({
    where: { unitId: unit1.id },
    orderBy: { orderIndex: 'asc' },
    include: { questions: { orderBy: { orderIndex: 'asc' }, take: 1 } },
  })
  const firstQuestion = firstExercise?.questions[0]
  if (firstExercise && firstQuestion) {
    const alreadyAttempted = await prisma.exerciseAttempt.findFirst({
      where: { userId: user.id, questionId: firstQuestion.id },
    })
    if (!alreadyAttempted) {
      await prisma.exerciseAttempt.create({
        data: {
          userId: user.id,
          exerciseId: firstExercise.id,
          questionId: firstQuestion.id,
          submittedAnswer: { kind: 'multiple-choice', choiceId: 'c' },
          isCorrect: false,
        },
      })
      await prisma.exerciseAttempt.create({
        data: {
          userId: user.id,
          exerciseId: firstExercise.id,
          questionId: firstQuestion.id,
          submittedAnswer: { kind: 'multiple-choice', choiceId: 'b' },
          isCorrect: true,
        },
      })
    }
  }

  console.log('Seed concluído: 1 subject, 7 units, 10 lessons, exercícios com questões reais.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
