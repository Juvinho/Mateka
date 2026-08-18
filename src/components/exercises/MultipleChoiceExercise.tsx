import { useState } from "react";
import type { MultipleChoiceExercise as MCExercise } from "../../data/types";
import { ContextMatrices } from "../matrix/ContextMatrices";
import { MatrixGrid } from "../matrix/MatrixGrid";
import styles from "./Exercise.module.css";

interface Props {
  exercise: MCExercise;
  onSubmit: (answer: { kind: "multiple-choice"; choiceId: string }) => void;
  disabled?: boolean;
}

export function MultipleChoiceExercise({ exercise, onSubmit, disabled }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <ContextMatrices items={exercise.context} />
      <p className={styles.prompt}>{exercise.prompt}</p>
      <div className={styles.choices}>
        {exercise.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            className={`${styles.choice} ${selected === choice.id ? styles.choiceSelected : ""}`}
            onClick={() => setSelected(choice.id)}
            disabled={disabled}
          >
            {choice.matrix ? <MatrixGrid values={choice.matrix} readOnly /> : choice.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-primary"
        disabled={!selected || disabled}
        onClick={() => selected && onSubmit({ kind: "multiple-choice", choiceId: selected })}
      >
        Verificar
      </button>
    </div>
  );
}
