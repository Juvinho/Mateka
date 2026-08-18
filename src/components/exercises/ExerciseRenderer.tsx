import type { Exercise } from "../../data/types";
import type { ExerciseAnswer } from "../../lib/grading";
import { MatrixBuilderExercise } from "./MatrixBuilderExercise";
import { MatrixFillExercise } from "./MatrixFillExercise";
import { MultipleChoiceExercise } from "./MultipleChoiceExercise";
import { TrueFalseExercise } from "./TrueFalseExercise";

interface Props {
  exercise: Exercise;
  onAnswer: (answer: ExerciseAnswer) => void;
  disabled?: boolean;
}

export function ExerciseRenderer({ exercise, onAnswer, disabled }: Props) {
  switch (exercise.kind) {
    case "multiple-choice":
      return <MultipleChoiceExercise exercise={exercise} onSubmit={onAnswer} disabled={disabled} />;
    case "true-false":
      return <TrueFalseExercise exercise={exercise} onSubmit={onAnswer} disabled={disabled} />;
    case "matrix-fill":
      return <MatrixFillExercise exercise={exercise} onSubmit={onAnswer} disabled={disabled} />;
    case "matrix-builder":
      return <MatrixBuilderExercise exercise={exercise} onSubmit={onAnswer} disabled={disabled} />;
  }
}
