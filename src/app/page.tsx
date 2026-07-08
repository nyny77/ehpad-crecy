import HeroSection from "@/components/home/HeroSection";
import IntroSection from "@/components/home/IntroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TeamPreview from "@/components/home/TeamPreview";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <IntroSection />
      <TeamPreview />
      <CTASection />
    </main>
  )
}
