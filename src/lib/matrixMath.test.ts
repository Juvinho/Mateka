import { describe, expect, it } from "vitest";
import {
  det2,
  det3,
  identity,
  inverse2,
  matricesEqual,
  multiply,
  scalarMul,
  sub,
  sum,
  transpose,
  zeros,
} from "./matrixMath";

describe("matrixMath", () => {
  it("sums matrices element-wise", () => {
    expect(sum([[1, 2], [3, 4]], [[5, 6], [7, 8]])).toEqual([[6, 8], [10, 12]]);
  });

  it("subtracts matrices element-wise", () => {
    expect(sub([[5, 6], [7, 8]], [[1, 2], [3, 4]])).toEqual([[4, 4], [4, 4]]);
  });

  it("multiplies by a scalar", () => {
    expect(scalarMul(2, [[1, 2], [3, 4]])).toEqual([[2, 4], [6, 8]]);
  });

  it("multiplies matrices (row by column)", () => {
    expect(multiply([[1, 2], [3, 4]], [[5, 6], [7, 8]])).toEqual([
      [19, 22],
      [43, 50],
    ]);
  });

  it("multiplies non-square matrices", () => {
    expect(multiply([[1, 2, 3]], [[1], [1], [1]])).toEqual([[6]]);
  });

  it("transposes a matrix", () => {
    expect(transpose([[1, 2, 3], [4, 5, 6]])).toEqual([
      [1, 4],
      [2, 5],
      [3, 6],
    ]);
  });

  it("builds an identity matrix", () => {
    expect(identity(3)).toEqual([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]);
  });

  it("builds a zero matrix", () => {
    expect(zeros(2, 3)).toEqual([
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  it("computes a 2x2 determinant", () => {
    expect(det2([[3, 8], [4, 6]])).toBe(3 * 6 - 8 * 4);
  });

  it("computes a 3x3 determinant", () => {
    expect(
      det3([
        [6, 1, 1],
        [4, -2, 5],
        [2, 8, 7],
      ]),
    ).toBe(-306);
  });

  it("computes a 2x2 inverse", () => {
    expect(inverse2([[4, 7], [2, 6]])).toEqual([
      [0.6, -0.7],
      [-0.2, 0.4],
    ]);
  });

  it("returns null for a singular matrix inverse", () => {
    expect(inverse2([[2, 4], [1, 2]])).toBeNull();
  });

  it("compares matrices for equality", () => {
    expect(matricesEqual([[1, 2]], [[1, 2]])).toBe(true);
    expect(matricesEqual([[1, 2]], [[1, 3]])).toBe(false);
    expect(matricesEqual([[1, 2]], [[1, 2, 3]])).toBe(false);
  });
});
