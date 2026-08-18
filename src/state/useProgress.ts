import { useCallback } from "react";
import type { Lesson } from "../data/types";
import { getAllLessonsInOrder } from "../data/units";
import { isToday, isYesterday } from "../lib/dates";
import { useProgressContext } from "./ProgressContext";
import { getEffectiveHearts } from "./progressReducer";

export type StreakStatus = "active" | "at-risk" | "none";

export function useProgress() {
  const { state, dispatch } = useProgressContext();

  const hearts = { current: getEffectiveHearts(state), max: state.hearts.max };

  const streakStatus: StreakStatus = isToday(state.streak.lastPracticedISODate)
    ? "active"
    : isYesterday(state.streak.lastPracticedISODate)
      ? "at-risk"
      : "none";

  const isLessonUnlocked = useCallback(
    (lesson: Lesson): boolean => {
      const ordered = getAllLessonsInOrder();
      const idx = ordered.findIndex((l) => l.id === lesson.id);
      if (idx <= 0) return true;
      const prevLesson = ordered[idx - 1];
      return Boolean(state.lessonResults[prevLesson.id]?.completed);
    },
    [state.lessonResults],
  );

  const isLessonCompleted = useCallback(
    (lessonId: string) => Boolean(state.lessonResults[lessonId]?.completed),
    [state.lessonResults],
  );

  const addXp = useCallback((amount: number) => dispatch({ type: "ADD_XP", amount }), [dispatch]);
  const loseHeart = useCallback(() => dispatch({ type: "LOSE_HEART" }), [dispatch]);
  const recordLessonResult = useCallback(
    (lessonId: string, score: number) => dispatch({ type: "RECORD_LESSON_RESULT", lessonId, score }),
    [dispatch],
  );
  const touchStreak = useCallback(() => dispatch({ type: "TOUCH_STREAK" }), [dispatch]);

  return {
    xpTotal: state.xpTotal,
    streakCount: state.streak.count,
    streakStatus,
    hearts,
    lessonResults: state.lessonResults,
    isLessonUnlocked,
    isLessonCompleted,
    addXp,
    loseHeart,
    recordLessonResult,
    touchStreak,
  };
}
