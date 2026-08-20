import MascotToast from './MascotToast'
import { LESSON_NARRATIONS } from '../../data/lessonNarrations'
import { useOneTimeFlag } from '../../state/useOneTimeFlag'

type Props = {
  lessonId: string
}

/**
 * Narrates a lesson's content once (per lesson id), the first time the
 * learner opens it. Not every lesson has narration — `LESSON_NARRATIONS` is
 * looked up by id, so lessons without an entry render nothing.
 *
 * Render with `key={lessonId}` from the caller: this component must remount
 * when the lesson changes so its one-time-seen flag re-reads for the new id.
 */
const LessonNarrator = ({ lessonId }: Props) => {
  const narration = LESSON_NARRATIONS[lessonId]
  const { hasSeen, markSeen } = useOneTimeFlag(`mateka:matrizes:lessonSeen:${lessonId}`)

  if (!narration || hasSeen) return null

  return <MascotToast reaction={narration} onDone={markSeen} />
}

export default LessonNarrator
