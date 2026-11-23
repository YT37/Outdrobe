import { AnimatePresence, motion } from "motion/react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { AIAgentPage } from "./pages/AIAgentPage";
import { HomePage } from "./pages/HomePage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { WardrobePage } from "./pages/WardrobePage";

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

const AnimatedPage = ({ children }: { children: React.ReactNode }) => (
  <motion.div {...pageTransition}>{children}</motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <AnimatedPage>
              <HomePage />
            </AnimatedPage>
          }
        />
        <Route
          path="/kloset"
          element={
            <AnimatedPage>
              <AIAgentPage />
            </AnimatedPage>
          }
        />
        <Route
          path="/wardrobe"
          element={
            <AnimatedPage>
              <WardrobePage />
            </AnimatedPage>
          }
        />
        <Route
          path="/marketplace"
          element={
            <AnimatedPage>
              <MarketplacePage />
            </AnimatedPage>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="size-full bg-background">
        <Navigation />
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}
