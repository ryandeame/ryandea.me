import Hero from "@/components/Hero";
import ServiceOfferings from "@/components/ServiceOfferings";
import Projects from "@/components/Projects";
import ClientContactForm from "@/components/ClientContactForm";
import Footer from "@/components/Footer";
import ThreeBackground from "@/components/new-3d/ThreeBackground";

export default function MergePage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] font-[family-name:var(--font-geist-sans)]">
      <main className="relative flex-grow">
        <section className="relative isolate">
          <ThreeBackground />
          <div className="relative z-10">
            <Hero showFloatingIcon={false} showBackgroundImage={false} />
            <ServiceOfferings showSectionBackground={false} />
            <Projects showBackground={false} />
          </div>
        </section>

        <div className="relative z-10 bg-[#0a0a0a]">
          <ClientContactForm />
        </div>
      </main>

      <div className="relative z-10 bg-[#0a0a0a]">
        <Footer />
      </div>
    </div>
  );
}
