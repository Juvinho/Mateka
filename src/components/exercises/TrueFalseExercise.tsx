import type { TrueFalseExercise as TFExercise } from "../../data/types";
import { ContextMatrices } from "../matrix/ContextMatrices";
import { MatrixGrid } from "../matrix/MatrixGrid";
import styles from "./Exercise.module.css";

interface Props {
  exercise: TFExercise;
  onSubmit: (answer: { kind: "true-false"; value: boolean }) => void;
  disabled?: boolean;
}

export function TrueFalseExercise({ exercise, onSubmit, disabled }: Props) {
  return (
    <div>
      <ContextMatrices items={exercise.context} />
      <p className={styles.prompt}>{exercise.prompt}</p>
      <div className={styles.claim}>
        {exercise.operandA && (
          <div className={styles.operand}>
            <span className={styles.label}>{exercise.operandALabel ?? "A"} =</span>
            <MatrixGrid values={exercise.operandA} readOnly />
          </div>
        )}
        {exercise.operatorLabel && <span className={styles.operator}>{exercise.operatorLabel}</span>}
        {exercise.operandB && (
          <div className={styles.operand}>
            <span className={styles.label}>{exercise.operandBLabel ?? "B"} =</span>
            <MatrixGrid values={exercise.operandB} readOnly />
          </div>
        )}
        <span className={styles.operator}>=</span>
        <MatrixGrid values={exercise.claimedResult} readOnly />
      </div>
      <div className={styles.tfButtons}>
        <button
          type="button"
          className="btn btn-primary"
          disabled={disabled}
          onClick={() => onSubmit({ kind: "true-false", value: true })}
        >
          Verdadeiro
        </button>
        <button
          type="button"
          className="btn btn-outline"
          disabled={disabled}
          onClick={() => onSubmit({ kind: "true-false", value: false })}
        >
          Falso
        </button>
      </div>
    </div>
  );
}
