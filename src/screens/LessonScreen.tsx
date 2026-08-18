import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExerciseRenderer } from "../components/exercises/ExerciseRenderer";
import { HeartsDisplay } from "../components/gamification/HeartsDisplay";
import { LessonProgressBar } from "../components/gamification/LessonProgressBar";
import { lessonById } from "../data/units";
import { gradeExercise, type ExerciseAnswer } from "../lib/grading";
import { useLessonSession } from "../state/useLessonSession";
import { useProgress } from "../state/useProgress";
import { LessonResults } from "./LessonResults";
import styles from "./LessonScreen.module.css";

export function LessonScreen() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = lessonId ? lessonById[lessonId] : undefined;
  const [attempt, setAttempt] = useState(0);

  if (!lesson) {
    return (
      <div className={styles.page}>
        <p>Lição não encontrada.</p>
      </div>
    );
  }

  return (
    <LessonScreenInner
      key={`${lesson.id}-${attempt}`}
      lessonId={lesson.id}
      onRetry={() => setAttempt((a) => a + 1)}
    />
  );
}

function LessonScreenInner({ lessonId, onRetry }: { lessonId: string; onRetry: () => void }) {
  const navigate = useNavigate();
  const progress = useProgress();
  const lesson = lessonById[lessonId];
  const session = useLessonSession(lesson, progress.hearts.current);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation?: string } | null>(null);
  const [resultRecorded, setResultRecorded] = useState(false);

  useEffect(() => {
    if (resultRecorded) return;
    if (session.status === "passed") {
      progress.recordLessonResult(lesson.id, session.score);
      progress.addXp(lesson.xpReward);
      progress.touchStreak();
      setResultRecorded(true);
    } else if (session.status === "failed") {
      setResultRecorded(true);
    }
    // Runs once per session status transition; progress dispatchers are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status]);

  const handleAnswer = useCallback(
    (answer: ExerciseAnswer) => {
      const exercise = session.currentExercise;
      if (!exercise) return;
      const correct = gradeExercise(exercise, answer);
      session.answer(answer);
      if (!correct) {
        progress.loseHeart();
      }
      setFeedback({ correct, explanation: exercise.explanation });
    },
    [session, progress],
  );

  const handleContinue = useCallback(() => {
    setFeedback(null);
    session.next();
  }, [session]);

  if (progress.hearts.current <= 0 && session.status === "intro") {
    return (
      <div className={styles.page}>
        <div className="card">
          <h2>Sem vidas 💔</h2>
          <p>Suas vidas recarregam a cada novo dia. Volte amanhã para continuar treinando!</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate("/")}>
            Voltar ao mapa
          </button>
        </div>
      </div>
    );
  }

  if (session.status === "intro") {
    return (
      <div className={styles.page}>
        <div className="card">
          <h2>{lesson.type === "boss" ? "Desafio Final da Unidade" : lesson.title}</h2>
          {lesson.type === "boss" && <p>Misturamos tudo que você aprendeu nesta unidade. Boa sorte!</p>}
          <button type="button" className="btn btn-primary" onClick={session.start}>
            Começar
          </button>
        </div>
      </div>
    );
  }

  if (session.status === "passed" || session.status === "failed") {
    return (
      <LessonResults
        passed={session.status === "passed"}
        correctCount={session.correctCount}
        total={session.exercises.length}
        xpEarned={lesson.xpReward}
        onRetry={onRetry}
      />
    );
  }

  const exercise = session.currentExercise;
  if (!exercise) return null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <LessonProgressBar current={session.currentIndex} total={session.exercises.length} />
        <HeartsDisplay current={session.livesRemaining} max={progress.hearts.max} />
      </header>
      <main className={styles.body}>
        <ExerciseRenderer exercise={exercise} onAnswer={handleAnswer} disabled={feedback !== null} />
      </main>
      {feedback && (
        <footer className={`${styles.feedback} ${feedback.correct ? styles.correct : styles.incorrect}`}>
          <p>{feedback.correct ? "Correto!" : "Não foi dessa vez."}</p>
          {feedback.explanation && <p className={styles.explanation}>{feedback.explanation}</p>}
          <button type="button" className="btn btn-primary" onClick={handleContinue}>
            Continuar
          </button>
        </footer>
      )}
    </div>
  );
}
