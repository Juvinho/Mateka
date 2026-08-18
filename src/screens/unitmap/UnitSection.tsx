import type { Unit } from "../../data/types";
import { useProgress } from "../../state/useProgress";
import { LessonNode } from "./LessonNode";
import styles from "./UnitSection.module.css";

export function UnitSection({ unit }: { unit: Unit }) {
  const { isLessonUnlocked, isLessonCompleted } = useProgress();

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2>{unit.title}</h2>
        <p>{unit.description}</p>
      </header>
      <div className={styles.path}>
        {unit.lessons
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((lesson) => {
            const completed = isLessonCompleted(lesson.id);
            const unlocked = isLessonUnlocked(lesson);
            const state = completed ? "completed" : unlocked ? "available" : "locked";
            return <LessonNode key={lesson.id} lesson={lesson} state={state} />;
          })}
      </div>
    </section>
  );
}
