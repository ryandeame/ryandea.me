import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)] bg-[#0a0a0a]">
      <main className="flex-grow">
        <Hero />
        <Products />
        <Testimonials />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
