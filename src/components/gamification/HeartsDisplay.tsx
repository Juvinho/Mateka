import styles from "./HeartsDisplay.module.css";

export function HeartsDisplay({ current, max }: { current: number; max: number }) {
  return (
    <div className={styles.row} aria-label={`${current} de ${max} vidas`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={styles.heart}>
          {i < current ? "❤️" : "🖤"}
        </span>
      ))}
    </div>
  );
}
