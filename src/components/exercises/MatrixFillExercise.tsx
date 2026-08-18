import { useState } from "react";
import type { MatrixFillExercise as FillExercise } from "../../data/types";
import { ContextMatrices } from "../matrix/ContextMatrices";
import { MatrixGrid } from "../matrix/MatrixGrid";
import styles from "./Exercise.module.css";

interface Props {
  exercise: FillExercise;
  onSubmit: (answer: { kind: "matrix-fill"; matrix: number[][] }) => void;
  disabled?: boolean;
}

export function MatrixFillExercise({ exercise, onSubmit, disabled }: Props) {
  const [values, setValues] = useState<Array<Array<number | null>>>(() =>
    exercise.template.map((row) => row.slice()),
  );

  const isComplete = values.every((row) => row.every((v) => v !== null));

  return (
    <div>
      <ContextMatrices items={exercise.context} />
      <p className={styles.prompt}>{exercise.prompt}</p>
      <MatrixGrid
        values={values}
        editableMask={exercise.template.map((row) => row.map((v) => v === null))}
        disabled={disabled}
        onChange={(r, c, v) => {
          setValues((prev) => {
            const next = prev.map((row) => row.slice());
            next[r][c] = v;
            return next;
          });
        }}
      />
      <button
        type="button"
        className="btn btn-primary"
        disabled={!isComplete || disabled}
        onClick={() => onSubmit({ kind: "matrix-fill", matrix: values as number[][] })}
      >
        Verificar
      </button>
    </div>
  );
}
