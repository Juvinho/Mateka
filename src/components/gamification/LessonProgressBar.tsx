import styles from "./LessonProgressBar.module.css";

export function LessonProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0;

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      <div className={styles.fill} style={{ width: `${pct}%` }} />
    </div>
  );
}
