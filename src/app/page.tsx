import HeroSection from "@/components/home/HeroSection";
import IntroSection from "@/components/home/IntroSection";
import TeamPreview from "@/components/home/TeamPreview";
import CTASection from "@/components/home/CTASection";
import FlashNewsTicker from "@/components/home/FlashNewsTicker";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FlashNewsTicker />
      <IntroSection />
      <TeamPreview />
      <CTASection />
    </>
  );
}
