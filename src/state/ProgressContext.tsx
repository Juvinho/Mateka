import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import { PROGRESS_STORAGE_KEY, PROGRESS_STORAGE_VERSION } from "../lib/constants";
import {
  defaultProgressState,
  progressReducer,
  type ProgressAction,
  type ProgressState,
} from "./progressReducer";

function loadInitialState(): ProgressState {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return defaultProgressState;
    const parsed = JSON.parse(raw) as ProgressState;
    if (parsed.version !== PROGRESS_STORAGE_VERSION) return defaultProgressState;
    return parsed;
  } catch {
    return defaultProgressState;
  }
}

interface ProgressContextValue {
  state: ProgressState;
  dispatch: Dispatch<ProgressAction>;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(progressReducer, undefined, loadInitialState);

  useEffect(() => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgressContext(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgressContext must be used within a ProgressProvider");
  return ctx;
}
