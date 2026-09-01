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

describe('users.email_format', () => {
  it('rejects an email without an @ or a TLD', async () => {
    await expect(
      prisma.user.create({
        data: {
          email: `not-an-email-${Date.now()}`,
          passwordHash: 'some-bcrypt-hash',
          displayName: 'Bad Email User',
        },
      }),
    ).rejects.toThrow()
  })
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

describe('users.role_valid', () => {
  it('rejects role=teacher (not in student/admin)', async () => {
    await expect(
      prisma.user.create({
        data: {
          email: `bad-role-${Date.now()}@mateka.dev`,
          passwordHash: 'some-bcrypt-hash',
          displayName: 'Bad Role User',
          role: 'teacher',
        },
      }),
    ).rejects.toThrow()
  })
})

describe('sessions.expires_in_future', () => {
  it('rejects expires_at before created_at', async () => {
    const createdAt = new Date()
    const expiresAt = new Date(createdAt.getTime() - 60 * 60 * 1000)

    await expect(
      prisma.session.create({
        data: {
          userId,
          tokenHash: `expired-session-${Date.now()}`,
          createdAt,
          expiresAt,
        },
      }),
    ).rejects.toThrow()
  })
})

describe('verification_tokens.purpose_valid', () => {
  it('rejects purpose=account_deletion (not in email_verify/password_reset)', async () => {
    await expect(
      prisma.verificationToken.create({
        data: {
          userId,
          tokenHash: `bad-purpose-${Date.now()}`,
          purpose: 'account_deletion',
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      }),
    ).rejects.toThrow()
  })
})

describe('subjects.level_valid', () => {
  it('rejects level=fundamental (not in ensino_medio/universitario)', async () => {
    await expect(
      prisma.subject.create({
        data: {
          slug: `bad-level-${Date.now()}`,
          title: 'Bad Level Subject',
          level: 'fundamental',
          orderIndex: 998,
        },
      }),
    ).rejects.toThrow()
  })
})

describe('lesson_tags.tag_valid', () => {
  it('rejects tag=quiz (not in video/interactive/exercise)', async () => {
    await expect(
      prisma.lessonTag.create({
        data: { lessonId, tag: 'quiz' },
      }),
    ).rejects.toThrow()
  })
})

describe('exercises.difficulty_valid', () => {
  it('rejects difficulty=impossible (not in easy/medium/hard)', async () => {
    await expect(
      prisma.exercise.create({
        data: {
          unitId,
          iconSymbol: '#',
          difficulty: 'impossible',
          title: 'Invalid Difficulty Exercise',
          description: 'Should be rejected by difficulty_valid.',
          durationMin: 5,
          questionCount: 0,
          points: 40,
          orderIndex: 3,
        },
      }),
    ).rejects.toThrow()
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

describe('lesson_progress.status_valid', () => {
  it('rejects status=paused (not in not_started/in-progress/done)', async () => {
    await expect(
      prisma.lessonProgress.create({
        data: {
          userId,
          lessonId,
          status: 'paused',
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

describe('lesson_progress.accuracy_range', () => {
  it('rejects accuracy=150 (outside 0–100)', async () => {
    await expect(
      prisma.lessonProgress.create({
        data: {
          userId,
          lessonId,
          accuracy: 150,
        },
      }),
    ).rejects.toThrow()
  })
})

describe('emy_appearance_log.context_valid', () => {
  it('rejects context=random_event (not in the closed set of known contexts)', async () => {
    await expect(
      prisma.emyAppearanceLog.create({
        data: { userId, context: 'random_event' },
      }),
    ).rejects.toThrow()
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
