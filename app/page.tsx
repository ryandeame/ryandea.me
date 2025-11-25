import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)] bg-[#0a0a0a]">
      <main className="flex-grow">
        <Hero />
        <Products />
        <Testimonials />

        {/* Contact Section */}
        <section id="contact" className="py-32 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none" />

          <ContactForm />
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-gray-600 text-sm border-t border-white/5 bg-black/40">
          <p>© {new Date().getFullYear()} SaaS Vendor Inc. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
