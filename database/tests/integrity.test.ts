import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from './setup'

// These tests prove the CHECK constraints and append-only triggers actually
// reject bad data at the DATABASE level — not just that the Prisma schema
// compiles. Each test inserts something the raw SQL spec says must be
// rejected, and asserts the insert throws.

let subjectId: string
let unitId: string
let lessonId: string
let exerciseId: string
let userId: string

beforeAll(async () => {
  const subject = await prisma.subject.create({
    data: {
      slug: `integrity-test-${Date.now()}`,
      title: 'Integrity Test Subject',
      level: 'ensino_medio',
      orderIndex: 999,
    },
  })
  subjectId = subject.id

  const unit = await prisma.unit.create({
    data: { subjectId, number: 1, title: 'Integrity Test Unit' },
  })
  unitId = unit.id

  const lesson = await prisma.lesson.create({
    data: {
      unitId,
      slug: 'integrity-test-lesson',
      title: 'Integrity Test Lesson',
      durationMin: 5,
      orderIndex: 1,
    },
  })
  lessonId = lesson.id

  const exercise = await prisma.exercise.create({
    data: {
      unitId,
      iconSymbol: '#',
      difficulty: 'easy',
      title: 'Integrity Test Exercise',
      description: 'Fixture exercise for integrity tests.',
      durationMin: 5,
      questionCount: 0,
      points: 40,
      orderIndex: 1,
    },
  })
  exerciseId = exercise.id

  const user = await prisma.user.create({
    data: {
      email: `integrity-test-${Date.now()}@mateka.dev`,
      passwordHash: 'not-a-real-hash-just-a-fixture',
      displayName: 'Integrity Test User',
    },
  })
  userId = user.id
})

afterAll(async () => {
  // FK ON DELETE CASCADE takes care of children (units, lessons, exercises,
  // lesson_progress, exercise_attempts, ...) once the parents are deleted.
  await prisma.user.delete({ where: { id: userId } }).catch(() => {})
  await prisma.subject.delete({ where: { id: subjectId } }).catch(() => {})
  await prisma.$disconnect()
})

describe('users.password_or_oauth', () => {
  it('rejects auth_provider=email with password_hash=NULL', async () => {
    await expect(
      prisma.user.create({
        data: {
          email: `no-password-${Date.now()}@mateka.dev`,
          authProvider: 'email',
          passwordHash: null,
          displayName: 'No Password User',
        },
      }),
    ).rejects.toThrow()
  })

  it('accepts a real email user with a password hash (control)', async () => {
    const user = await prisma.user.create({
      data: {
        email: `has-password-${Date.now()}@mateka.dev`,
        authProvider: 'email',
        passwordHash: 'some-bcrypt-hash',
        displayName: 'Has Password User',
      },
    })
    expect(user.id).toBeTruthy()
    await prisma.user.delete({ where: { id: user.id } })
  })
})

describe('exercises.points_by_difficulty', () => {
  it('rejects difficulty=hard with points=50 (below the 120–150 range)', async () => {
    await expect(
      prisma.exercise.create({
        data: {
          unitId,
          iconSymbol: '#',
          difficulty: 'hard',
          title: 'Invalid Points Exercise',
          description: 'Should be rejected by points_by_difficulty.',
          durationMin: 5,
          questionCount: 0,
          points: 50,
          orderIndex: 2,
        },
      }),
    ).rejects.toThrow()
  })
})

describe('lessons unique (unit_id, order_index)', () => {
  it('rejects a second lesson in the same unit reusing order_index=1', async () => {
    await expect(
      prisma.lesson.create({
        data: {
          unitId,
          slug: 'integrity-test-lesson-duplicate',
          title: 'Duplicate Order Index Lesson',
          durationMin: 5,
          orderIndex: 1, // already used by the fixture lesson created in beforeAll
        },
      }),
    ).rejects.toThrow()
  })
})

describe('lesson_progress.completed_consistency', () => {
  it('rejects status=done with completed_at=NULL', async () => {
    await expect(
      prisma.lessonProgress.create({
        data: {
          userId,
          lessonId,
          status: 'done',
          completedAt: null,
        },
      }),
    ).rejects.toThrow()
  })

  it('accepts status=done with completed_at set (control)', async () => {
    const progress = await prisma.lessonProgress.create({
      data: {
        userId,
        lessonId,
        status: 'done',
        completedAt: new Date(),
      },
    })
    expect(progress.completedAt).not.toBeNull()
    await prisma.lessonProgress.delete({ where: { userId_lessonId: { userId, lessonId } } })
  })
})

describe('append-only tables', () => {
  it('blocks UPDATE on exercise_attempts', async () => {
    const attempt = await prisma.exerciseAttempt.create({
      data: {
        userId,
        exerciseId,
        submittedAnswer: { kind: 'multiple-choice', choiceId: 'a' },
        isCorrect: true,
      },
    })

    await expect(
      prisma.exerciseAttempt.update({
        where: { id: attempt.id },
        data: { isCorrect: false },
      }),
    ).rejects.toThrow()
  })

  it('blocks UPDATE on streak_log', async () => {
    const activityDate = new Date('2026-01-01T00:00:00.000Z')
    await prisma.streakLog.create({ data: { userId, activityDate } })

    await expect(
      prisma.streakLog.update({
        where: { userId_activityDate: { userId, activityDate } },
        data: { activityDate: new Date('2026-01-02T00:00:00.000Z') },
      }),
    ).rejects.toThrow()
  })
})
