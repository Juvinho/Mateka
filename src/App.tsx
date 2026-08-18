import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { ProgressProvider } from "./state/ProgressContext";

export function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ProgressProvider>
  );
}
