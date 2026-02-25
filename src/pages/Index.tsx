import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import PillarsSection from "@/components/PillarsSection";
import ExclusiveSection from "@/components/ExclusiveSection";
import SiteFooter from "@/components/SiteFooter";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <PillarsSection />
      <ExclusiveSection />
      <SiteFooter />
    </main>
  );
};

export default Index;
