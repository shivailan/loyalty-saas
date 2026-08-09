import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { CardShowcase } from "@/components/landing/CardShowcase";
import { ScrollStory } from "@/components/landing/ScrollStory";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";
import { ScrollProgressBar } from "@/components/landing/ScrollProgressBar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ScrollProgressBar />
      <Header />
      <main className="flex-1">
        <Hero />
        <CardShowcase />
        <ScrollStory />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
