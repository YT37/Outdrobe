import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { AIAgentPage } from "./pages/AIAgentPage";
import { HomePage } from "./pages/HomePage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { WardrobePage } from "./pages/WardrobePage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="size-full bg-background">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/kloset" element={<AIAgentPage />} />
          <Route path="/wardrobe" element={<WardrobePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
