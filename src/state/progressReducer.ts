import { MAX_HEARTS, PROGRESS_STORAGE_VERSION } from "../lib/constants";
import { isToday, isYesterday, toLocalDateStr } from "../lib/dates";

export interface LessonResult {
  completed: boolean;
  bestScore: number;
  lastCompletedISODate: string;
}

export interface ProgressState {
  version: number;
  xpTotal: number;
  streak: { count: number; lastPracticedISODate: string | null };
  hearts: { current: number; max: number; lastLostAt: string | null };
  lessonResults: Record<string, LessonResult>;
}

export const defaultProgressState: ProgressState = {
  version: PROGRESS_STORAGE_VERSION,
  xpTotal: 0,
  streak: { count: 0, lastPracticedISODate: null },
  hearts: { current: MAX_HEARTS, max: MAX_HEARTS, lastLostAt: null },
  lessonResults: {},
};

export type ProgressAction =
  | { type: "ADD_XP"; amount: number }
  | { type: "LOSE_HEART" }
  | { type: "RECORD_LESSON_RESULT"; lessonId: string; score: number }
  | { type: "TOUCH_STREAK" };

export function getEffectiveHearts(state: ProgressState): number {
  if (state.hearts.lastLostAt && !isToday(state.hearts.lastLostAt)) {
    return state.hearts.max;
  }
  return state.hearts.current;
}

export function progressReducer(state: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case "ADD_XP":
      return { ...state, xpTotal: state.xpTotal + action.amount };

    case "LOSE_HEART": {
      const effective = getEffectiveHearts(state);
      return {
        ...state,
        hearts: {
          ...state.hearts,
          current: Math.max(0, effective - 1),
          lastLostAt: toLocalDateStr(),
        },
      };
    }

    case "RECORD_LESSON_RESULT": {
      const prev = state.lessonResults[action.lessonId];
      const bestScore = Math.max(prev?.bestScore ?? 0, action.score);
      return {
        ...state,
        lessonResults: {
          ...state.lessonResults,
          [action.lessonId]: {
            completed: true,
            bestScore,
            lastCompletedISODate: toLocalDateStr(),
          },
        },
      };
    }

    case "TOUCH_STREAK": {
      const { lastPracticedISODate, count } = state.streak;
      if (isToday(lastPracticedISODate)) return state;
      const nextCount = isYesterday(lastPracticedISODate) ? count + 1 : 1;
      return {
        ...state,
        streak: { count: nextCount, lastPracticedISODate: toLocalDateStr() },
      };
    }
  }
}
