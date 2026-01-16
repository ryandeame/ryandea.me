import Hero from "@/components/Hero";
import ServiceOfferings from "@/components/ServiceOfferings";
import Projects from "@/components/Projects";
import ClientContactForm from "@/components/ClientContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)] bg-[#0a0a0a] relative">
      <main className="flex-grow relative">
        <Hero />
        <ServiceOfferings />
        <Projects />
        <ClientContactForm />
      </main>
      <Footer />
    </div>
  );
}
