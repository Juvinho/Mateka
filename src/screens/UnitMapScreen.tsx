import { HeartsDisplay } from "../components/gamification/HeartsDisplay";
import { StreakFlame } from "../components/gamification/StreakFlame";
import { units } from "../data/units";
import { useProgress } from "../state/useProgress";
import { UnitSection } from "./unitmap/UnitSection";
import styles from "./UnitMapScreen.module.css";

export function UnitMapScreen() {
  const { hearts, streakCount, streakStatus, xpTotal } = useProgress();

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <h1 className={styles.brand}>MatrizGO</h1>
        <div className={styles.stats}>
          <StreakFlame count={streakCount} status={streakStatus} />
          <span className={styles.xp}>⭐ {xpTotal} XP</span>
          <HeartsDisplay current={hearts.current} max={hearts.max} />
        </div>
      </header>
      <main className={styles.path}>
        {units.map((unit) => (
          <UnitSection key={unit.id} unit={unit} />
        ))}
      </main>
    </div>
  );
}
