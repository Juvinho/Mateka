import { describe, expect, it } from "vitest";
import { isToday, isYesterday, toLocalDateStr } from "./dates";

describe("dates", () => {
  it("formats a date as local YYYY-MM-DD", () => {
    const date = new Date(2026, 0, 5); // Jan 5 2026, local time
    expect(toLocalDateStr(date)).toBe("2026-01-05");
  });

  it("detects today", () => {
    expect(isToday(toLocalDateStr())).toBe(true);
    expect(isToday(null)).toBe(false);
    expect(isToday("2000-01-01")).toBe(false);
  });

  it("detects yesterday", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isYesterday(toLocalDateStr(yesterday))).toBe(true);
    expect(isYesterday(toLocalDateStr())).toBe(false);
    expect(isYesterday(null)).toBe(false);
  });
});
