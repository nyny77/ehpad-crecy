import HeroSection from "@/components/home/HeroSection";
import IntroSection from "@/components/home/IntroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TeamPreview from "@/components/home/TeamPreview";
import CTASection from "@/components/home/CTASection";
import fs from "fs";
import path from "path";

export default async function Home() {
  let eventFiles: string[] = [];
  try {
    const eventsDir = path.join(process.cwd(), "public", "evenements");
    if (fs.existsSync(eventsDir)) {
      eventFiles = fs.readdirSync(eventsDir).filter(file => 
        file.toLowerCase().endsWith('.jpg') || 
        file.toLowerCase().endsWith('.jpeg') || 
        file.toLowerCase().endsWith('.png') || 
        file.toLowerCase().endsWith('.pdf')
      );
    }
  } catch (error) {
    console.error("Error reading events directory", error);
  }

  return (
    <main>
      <HeroSection eventFiles={eventFiles} />
      <FeaturesSection />
      <IntroSection />
      <TeamPreview />
      <CTASection />
    </main>
  );
}
