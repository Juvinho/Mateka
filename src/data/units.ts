import type { Lesson, Unit } from "./types";
import { unit1 } from "./content/unit1";

export const units: Unit[] = [unit1].sort((a, b) => a.order - b.order);

export const unitById: Record<string, Unit> = Object.fromEntries(
  units.map((unit) => [unit.id, unit]),
);

export const lessonById: Record<string, Lesson> = Object.fromEntries(
  units.flatMap((unit) => unit.lessons.map((lesson) => [lesson.id, lesson])),
);

export function getAllLessonsInOrder(): Lesson[] {
  return units.flatMap((unit) => unit.lessons.slice().sort((a, b) => a.order - b.order));
}
