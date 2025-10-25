import { lazy, Suspense } from "react";
import { Hero3D } from "../components/Hero3D";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { Stats } from "../components/Stats";
import { CTA } from "../components/CTA";

// Lazy load the InteractiveWardrobe to avoid Three.js being bundled multiple times
const InteractiveWardrobe = lazy(() => 
  import("../components/InteractiveWardrobe").then(module => ({
    default: module.InteractiveWardrobe
  }))
);

export function HomePage() {
  return (
    <>
      <Hero3D />
      <Stats />
      <Features />
      <Suspense fallback={<div className="h-screen" />}>
        <InteractiveWardrobe />
      </Suspense>
      <HowItWorks />
      <CTA />
    </>
  );
}
