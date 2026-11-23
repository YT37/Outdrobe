import { Hero3D } from "../components/Hero3D";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { Stats } from "../components/Stats";
import { CTA } from "../components/CTA";

export function HomePage() {
  return (
    <>
      <Hero3D />
      <Features />
      <Stats />
      <HowItWorks />
      <CTA />
    </>
  );
}
