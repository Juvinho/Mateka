import { describe, expect, it } from "vitest";
import { toLocalDateStr } from "../lib/dates";
import { defaultProgressState, getEffectiveHearts, progressReducer } from "./progressReducer";
import type { ProgressState } from "./progressReducer";

function daysAgoStr(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toLocalDateStr(date);
}

describe("progressReducer", () => {
  it("adds XP", () => {
    const next = progressReducer(defaultProgressState, { type: "ADD_XP", amount: 10 });
    expect(next.xpTotal).toBe(10);
  });

  it("loses a heart and stamps today's date", () => {
    const next = progressReducer(defaultProgressState, { type: "LOSE_HEART" });
    expect(next.hearts.current).toBe(defaultProgressState.hearts.max - 1);
    expect(next.hearts.lastLostAt).toBe(toLocalDateStr());
  });

  it("does not go below zero hearts", () => {
    const zeroHeartsState: ProgressState = {
      ...defaultProgressState,
      hearts: { ...defaultProgressState.hearts, current: 0, lastLostAt: toLocalDateStr() },
    };
    const next = progressReducer(zeroHeartsState, { type: "LOSE_HEART" });
    expect(next.hearts.current).toBe(0);
  });

  it("records a lesson result and keeps the best score", () => {
    const first = progressReducer(defaultProgressState, {
      type: "RECORD_LESSON_RESULT",
      lessonId: "u1-l1",
      score: 0.6,
    });
    const second = progressReducer(first, {
      type: "RECORD_LESSON_RESULT",
      lessonId: "u1-l1",
      score: 0.9,
    });
    const worse = progressReducer(second, {
      type: "RECORD_LESSON_RESULT",
      lessonId: "u1-l1",
      score: 0.5,
    });
    expect(worse.lessonResults["u1-l1"].completed).toBe(true);
    expect(worse.lessonResults["u1-l1"].bestScore).toBe(0.9);
  });

  describe("streak", () => {
    it("starts a streak at 1 from no prior practice", () => {
      const next = progressReducer(defaultProgressState, { type: "TOUCH_STREAK" });
      expect(next.streak.count).toBe(1);
    });

    it("increments the streak when the last practice was yesterday", () => {
      const state: ProgressState = {
        ...defaultProgressState,
        streak: { count: 4, lastPracticedISODate: daysAgoStr(1) },
      };
      const next = progressReducer(state, { type: "TOUCH_STREAK" });
      expect(next.streak.count).toBe(5);
    });

    it("resets the streak to 1 after a gap of 2+ days", () => {
      const state: ProgressState = {
        ...defaultProgressState,
        streak: { count: 7, lastPracticedISODate: daysAgoStr(3) },
      };
      const next = progressReducer(state, { type: "TOUCH_STREAK" });
      expect(next.streak.count).toBe(1);
    });

    it("does not double-increment on a second lesson the same day", () => {
      const state: ProgressState = {
        ...defaultProgressState,
        streak: { count: 3, lastPracticedISODate: toLocalDateStr() },
      };
      const next = progressReducer(state, { type: "TOUCH_STREAK" });
      expect(next.streak.count).toBe(3);
    });
  });

  describe("getEffectiveHearts", () => {
    it("returns stored hearts when they were last lost today", () => {
      const state: ProgressState = {
        ...defaultProgressState,
        hearts: { current: 2, max: 5, lastLostAt: toLocalDateStr() },
      };
      expect(getEffectiveHearts(state)).toBe(2);
    });

    it("refills to max once lastLostAt is a previous day", () => {
      const state: ProgressState = {
        ...defaultProgressState,
        hearts: { current: 1, max: 5, lastLostAt: daysAgoStr(1) },
      };
      expect(getEffectiveHearts(state)).toBe(5);
    });
  });
});
