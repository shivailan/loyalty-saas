import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { CardShowcase } from "@/components/landing/CardShowcase";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { CommandeSection } from "@/components/landing/CommandeSection";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";
import { ScrollProgressBar } from "@/components/landing/ScrollProgressBar";
import { ScrollToTopButton } from "@/components/landing/ScrollToTopButton";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollProgressBar />
      <Header />
      <main className="flex-1">
        <Hero />
        <CardShowcase />
        <HowItWorks />
        <Features />
        <CommandeSection />
        <Pricing />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
