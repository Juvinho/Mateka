import { Link } from "react-router-dom";
import styles from "./LessonResults.module.css";

interface Props {
  passed: boolean;
  correctCount: number;
  total: number;
  xpEarned: number;
  onRetry: () => void;
}

export function LessonResults({ passed, correctCount, total, xpEarned, onRetry }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={`card ${styles.card}`}>
        <h2>{passed ? "Lição concluída! 🎉" : "Sem vidas! 💔"}</h2>
        <p className={styles.score}>
          {correctCount} de {total} corretas
        </p>
        {passed && <p className={styles.xp}>+{xpEarned} XP</p>}
        <div className={styles.actions}>
          {!passed && (
            <button type="button" className="btn btn-primary" onClick={onRetry}>
              Tentar novamente
            </button>
          )}
          <Link to="/" className="btn btn-outline">
            Voltar ao mapa
          </Link>
        </div>
      </div>
    </div>
  );
}
