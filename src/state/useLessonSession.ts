import { useMemo, useReducer } from "react";
import type { Exercise, Lesson } from "../data/types";
import { gradeExercise, type ExerciseAnswer } from "../lib/grading";

export type LessonSessionStatus = "intro" | "active" | "failed" | "passed";

interface LessonSessionState {
  exercises: Exercise[];
  currentIndex: number;
  livesRemaining: number;
  correctCount: number;
  status: LessonSessionStatus;
  lastAnswerCorrect: boolean | null;
}

type LessonSessionAction =
  | { type: "START" }
  | { type: "ANSWER"; answer: ExerciseAnswer }
  | { type: "NEXT" };

function makeInitialState(exercises: Exercise[], startingLives: number): LessonSessionState {
  return {
    exercises,
    currentIndex: 0,
    livesRemaining: startingLives,
    correctCount: 0,
    status: "intro",
    lastAnswerCorrect: null,
  };
}

function reducer(state: LessonSessionState, action: LessonSessionAction): LessonSessionState {
  switch (action.type) {
    case "START":
      return { ...state, status: "active" };

    case "ANSWER": {
      const exercise = state.exercises[state.currentIndex];
      const correct = gradeExercise(exercise, action.answer);
      const livesRemaining = correct ? state.livesRemaining : state.livesRemaining - 1;
      return {
        ...state,
        lastAnswerCorrect: correct,
        correctCount: correct ? state.correctCount + 1 : state.correctCount,
        livesRemaining,
        status: livesRemaining <= 0 ? "failed" : state.status,
      };
    }

    case "NEXT": {
      if (state.status === "failed") return state;
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.exercises.length) {
        return { ...state, status: "passed" };
      }
      return { ...state, currentIndex: nextIndex, lastAnswerCorrect: null };
    }
  }
}

export function useLessonSession(lesson: Lesson, startingLives: number) {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    makeInitialState(lesson.exercises, startingLives),
  );

  const currentExercise = state.exercises[state.currentIndex] ?? null;
  const score = useMemo(
    () => (state.exercises.length > 0 ? state.correctCount / state.exercises.length : 0),
    [state.correctCount, state.exercises.length],
  );

  return {
    ...state,
    currentExercise,
    score,
    start: () => dispatch({ type: "START" }),
    answer: (a: ExerciseAnswer) => dispatch({ type: "ANSWER", answer: a }),
    next: () => dispatch({ type: "NEXT" }),
  };
}
