import { describe, expect, it } from "vitest";
import type {
  MatrixBuilderExercise,
  MatrixFillExercise,
  MultipleChoiceExercise,
  TrueFalseExercise,
} from "../data/types";
import { gradeExercise } from "./grading";

describe("gradeExercise", () => {
  it("grades multiple-choice by choice id", () => {
    const exercise: MultipleChoiceExercise = {
      id: "e1",
      kind: "multiple-choice",
      prompt: "?",
      choices: [{ id: "a" }, { id: "b" }],
      correctChoiceId: "b",
    };
    expect(gradeExercise(exercise, { kind: "multiple-choice", choiceId: "b" })).toBe(true);
    expect(gradeExercise(exercise, { kind: "multiple-choice", choiceId: "a" })).toBe(false);
  });

  it("grades true-false by boolean value", () => {
    const exercise: TrueFalseExercise = {
      id: "e2",
      kind: "true-false",
      prompt: "?",
      claimedResult: [[1, 2]],
      isCorrect: false,
    };
    expect(gradeExercise(exercise, { kind: "true-false", value: false })).toBe(true);
    expect(gradeExercise(exercise, { kind: "true-false", value: true })).toBe(false);
  });

  it("grades matrix-fill by comparing to the solution", () => {
    const exercise: MatrixFillExercise = {
      id: "e3",
      kind: "matrix-fill",
      prompt: "?",
      template: [[1, null]],
      solution: [[1, 2]],
    };
    expect(gradeExercise(exercise, { kind: "matrix-fill", matrix: [[1, 2]] })).toBe(true);
    expect(gradeExercise(exercise, { kind: "matrix-fill", matrix: [[1, 3]] })).toBe(false);
  });

  it("grades matrix-builder by comparing to the solution", () => {
    const exercise: MatrixBuilderExercise = {
      id: "e4",
      kind: "matrix-builder",
      prompt: "?",
      operandA: [[1, 2]],
      operandB: [[1], [1]],
      operatorLabel: "×",
      solution: [[3]],
    };
    expect(gradeExercise(exercise, { kind: "matrix-builder", matrix: [[3]] })).toBe(true);
    expect(gradeExercise(exercise, { kind: "matrix-builder", matrix: [[4]] })).toBe(false);
  });
});
