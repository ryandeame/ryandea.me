import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)] bg-[#0a0a0a] relative">
      <main className="flex-grow relative">
        <Hero />
        <Projects />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
