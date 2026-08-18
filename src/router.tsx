import { Route, Routes } from "react-router-dom";
import { LessonScreen } from "./screens/LessonScreen";
import { UnitMapScreen } from "./screens/UnitMapScreen";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UnitMapScreen />} />
      <Route path="/lesson/:lessonId" element={<LessonScreen />} />
    </Routes>
  );
}
