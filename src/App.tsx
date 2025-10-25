import { HashRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./pages/HomePage";
import { AIAgentPage } from "./pages/AIAgentPage";
import { WardrobePage } from "./pages/WardrobePage";
import { MarketplacePage } from "./pages/MarketplacePage";

export default function App() {
  return (
    <HashRouter>
      <div className="size-full bg-background">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ai-agent" element={<AIAgentPage />} />
          <Route path="/wardrobe" element={<WardrobePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
