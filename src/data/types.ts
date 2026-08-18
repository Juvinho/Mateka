export type Matrix = number[][];

export interface ContextItem {
  label: string;
  matrix: Matrix;
}

export interface Choice {
  id: string;
  label?: string;
  matrix?: Matrix;
}

interface ExerciseBase {
  id: string;
  prompt: string;
  explanation?: string;
  xp?: number;
  context?: ContextItem[];
}

export interface MultipleChoiceExercise extends ExerciseBase {
  kind: "multiple-choice";
  choices: Choice[];
  correctChoiceId: string;
}

export interface TrueFalseExercise extends ExerciseBase {
  kind: "true-false";
  operandA?: Matrix;
  operandALabel?: string;
  operatorLabel?: string;
  operandB?: Matrix;
  operandBLabel?: string;
  claimedResult: Matrix;
  isCorrect: boolean;
}

export interface MatrixFillExercise extends ExerciseBase {
  kind: "matrix-fill";
  template: Array<Array<number | null>>;
  solution: Matrix;
}

export interface MatrixBuilderExercise extends ExerciseBase {
  kind: "matrix-builder";
  operandA: Matrix;
  operandALabel?: string;
  operatorLabel: string;
  operandB: Matrix;
  operandBLabel?: string;
  solution: Matrix;
}

export type Exercise =
  | MultipleChoiceExercise
  | TrueFalseExercise
  | MatrixFillExercise
  | MatrixBuilderExercise;

export type LessonType = "lesson" | "boss";

export interface Lesson {
  id: string;
  unitId: string;
  order: number;
  title: string;
  type: LessonType;
  xpReward: number;
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  order: number;
  title: string;
  description: string;
  lessons: Lesson[];
}
