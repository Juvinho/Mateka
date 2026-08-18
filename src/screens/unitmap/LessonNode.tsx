import { Link } from "react-router-dom";
import type { Lesson } from "../../data/types";
import styles from "./LessonNode.module.css";

type NodeState = "locked" | "available" | "completed";

export function LessonNode({ lesson, state }: { lesson: Lesson; state: NodeState }) {
  const isBoss = lesson.type === "boss";
  const classNames = [
    styles.node,
    isBoss ? styles.boss : "",
    state === "locked" ? styles.locked : "",
    state === "completed" ? styles.completed : "",
  ]
    .filter(Boolean)
    .join(" ");

  const icon = state === "locked" ? "🔒" : isBoss ? "👑" : state === "completed" ? "⭐" : "▶️";

  if (state === "locked") {
    return (
      <div className={classNames} aria-disabled="true">
        <span className={styles.icon}>{icon}</span>
        <span className={styles.title}>{lesson.title}</span>
      </div>
    );
  }

  return (
    <Link to={`/lesson/${lesson.id}`} className={classNames}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.title}>{lesson.title}</span>
    </Link>
  );
}
