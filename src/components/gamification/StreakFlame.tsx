import type { StreakStatus } from "../../state/useProgress";
import styles from "./StreakFlame.module.css";

export function StreakFlame({ count, status }: { count: number; status: StreakStatus }) {
  return (
    <div className={`${styles.flame} ${styles[status]}`}>
      <span>🔥</span>
      <span>{count}</span>
    </div>
  );
}
