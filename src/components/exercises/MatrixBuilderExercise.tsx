import { useState } from "react";
import type { MatrixBuilderExercise as BuilderExercise } from "../../data/types";
import { colCount, rowCount } from "../../lib/matrixMath";
import { ContextMatrices } from "../matrix/ContextMatrices";
import { MatrixGrid } from "../matrix/MatrixGrid";
import styles from "./Exercise.module.css";

interface Props {
  exercise: BuilderExercise;
  onSubmit: (answer: { kind: "matrix-builder"; matrix: number[][] }) => void;
  disabled?: boolean;
}

export function MatrixBuilderExercise({ exercise, onSubmit, disabled }: Props) {
  const resultRows = rowCount(exercise.operandA);
  const resultCols = colCount(exercise.operandB);
  const [values, setValues] = useState<Array<Array<number | null>>>(() =>
    Array.from({ length: resultRows }, () => Array.from({ length: resultCols }, () => null)),
  );
  const [focusedCell, setFocusedCell] = useState<{ r: number; c: number } | null>(null);

  const isComplete = values.every((row) => row.every((v) => v !== null));

  return (
    <div>
      <ContextMatrices items={exercise.context} />
      <p className={styles.prompt}>{exercise.prompt}</p>
      <div className={styles.builderRow}>
        <div className={styles.operand}>
          <span className={styles.label}>{exercise.operandALabel ?? "A"} =</span>
          <MatrixGrid values={exercise.operandA} readOnly highlightRow={focusedCell?.r ?? null} />
        </div>
        <span className={styles.operator}>{exercise.operatorLabel}</span>
        <div className={styles.operand}>
          <span className={styles.label}>{exercise.operandBLabel ?? "B"} =</span>
          <MatrixGrid values={exercise.operandB} readOnly highlightCol={focusedCell?.c ?? null} />
        </div>
        <span className={styles.operator}>=</span>
        <MatrixGrid
          values={values}
          editableMask={values.map((row) => row.map(() => true))}
          disabled={disabled}
          onFocusCell={(r, c) => setFocusedCell({ r, c })}
          onChange={(r, c, v) => {
            setValues((prev) => {
              const next = prev.map((row) => row.slice());
              next[r][c] = v;
              return next;
            });
          }}
        />
      </div>
      <p className={styles.hint}>Toque em uma célula do resultado para destacar a linha e a coluna usadas.</p>
      <button
        type="button"
        className="btn btn-primary"
        disabled={!isComplete || disabled}
        onClick={() => onSubmit({ kind: "matrix-builder", matrix: values as number[][] })}
      >
        Verificar
      </button>
    </div>
  );
}
