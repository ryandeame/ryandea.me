import Image from "next/image";
import Link from "next/link";

import ClayContactForm from "@/components/claymation/ClayContactForm";
import ClayNewsletterForm from "@/components/claymation/ClayNewsletterForm";
import ClayNavbar from "@/components/claymation/ClayNavbar";
import { productDetails } from "@/data/products";

const navLinks = ["Products", "FAQ", "Contact"];
const faqItems = [
  "What size should I order?",
  "How long does shipping take?",
  "What is your return policy?",
];
const featuredProductSlug = "been-to-box";
const externalProductUrls: Partial<Record<(typeof productDetails)[number]["slug"], string>> = {
  [featuredProductSlug]: "https://ryandeame--been-to-box.us-central1.hosted.app",
};
const orderedProductDetails = [...productDetails].sort((a, b) => {
  if (a.slug === featuredProductSlug) return -1;
  if (b.slug === featuredProductSlug) return 1;
  return 0;
});

export default function ClaymationPage() {
  return (
    <main className="min-h-screen bg-[#f6eec9] text-[#161314]">
      <ClayNavbar />
      <ClayHero />
      <ClayProducts />
      <ClayContact />
      <ClayFooter />
    </main>
  );
}

function ClayHero() {
  return (
    <section className="relative min-h-[650px] overflow-hidden bg-[#bfe9ff]">
      <Image
        src="/claymation/hero-banner-waterfall-clay.png"
        alt="Whimsical claymation waterfall hero with a traveler in a green hat"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[62%_50%] md:object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#fff3b8]/42 via-[#87e7ff]/10 to-transparent" />

      <div className="relative mx-auto flex min-h-[650px] w-full max-w-[1500px] items-end justify-end px-6 py-9 md:items-center md:justify-start md:px-16 md:py-16">
        <div className="w-full md:w-auto">
          <div className="ml-auto max-w-[18rem] text-right md:ml-0 md:max-w-3xl md:text-left">
            <h1 className="max-w-4xl font-serif text-[48px] font-black leading-[0.96] tracking-[-0.04em] text-[#fff7d8] drop-shadow-[0_5px_16px_rgba(14,45,66,0.72)] sm:text-[78px] sm:leading-[0.95]">
              Join Ryan Deame in the Land of Software.
            </h1>

            <p className="mt-5 text-sm font-black uppercase leading-6 tracking-[0.08em] text-[#fff7d8] drop-shadow-[0_3px_8px_rgba(14,45,66,0.74)] sm:text-lg sm:leading-7">
              <span>Bold experiences.</span>
              <br className="md:hidden" />
              <span className="hidden md:inline"> </span>
              <span className="whitespace-nowrap">Tactile worlds.</span>
              <br />
              Bright ideas built to shine.
            </p>
          </div>

          <div className="mt-7 flex justify-start">
            <a
              href="#products"
              className="inline-flex min-h-[58px] min-w-[250px] items-center justify-between gap-6 rounded-full border border-[#fff7d8]/60 bg-[#ffcf4d] px-6 text-base font-black uppercase tracking-[0.13em] text-[#161314] shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-transform hover:-translate-y-1 hover:bg-[#70d779]"
            >
              <span>Start exploring</span>
              <svg
                aria-hidden="true"
                className="h-6 w-6 shrink-0 self-center"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 5l7 7-7 7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClayProducts() {
  return (
    <section id="products" className="relative overflow-hidden bg-[#fff7d8] px-6 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,207,77,0.45),transparent_26%),radial-gradient(circle_at_88%_8%,rgba(135,231,255,0.45),transparent_28%),radial-gradient(circle_at_52%_100%,rgba(112,215,121,0.24),transparent_34%)]" />
      <div className="relative mx-auto max-w-[1500px]">
        <SectionHeading
          eyebrow="Software Offerings"
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {orderedProductDetails.map((product) => {
            const externalUrl = externalProductUrls[product.slug];
            const href = externalUrl ?? `/products/${product.slug}`;
            const isFeatured = product.slug === featuredProductSlug;

            return (
              <Link
                key={product.slug}
                href={href}
                target={externalUrl ? "_blank" : undefined}
                rel={externalUrl ? "noreferrer" : undefined}
                className={`group relative overflow-hidden rounded-[2rem] border-2 bg-[#f6eec9] p-5 shadow-[0_18px_45px_rgba(43,34,24,0.12)] transition-transform hover:-translate-y-2 ${
                  isFeatured ? "border-[#ffcf4d]" : "border-[#5c9958]/25"
                }`}
              >
                {isFeatured ? (
                  <span className="absolute right-5 top-5 z-10 rounded-full bg-[#ffcf4d] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#161314]">
                    Featured
                  </span>
                ) : null}
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#87e7ff]/55 blur-2xl transition-transform group-hover:scale-125" />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-6 grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-[#161314]/15 bg-[#fff7d8]">
                    <Image src={product.icon} alt={`${product.name} icon`} width={44} height={44} className="rounded-xl" />
                  </div>

                  {product.previewImage ? (
                    <div className="relative mb-6 h-36 overflow-hidden rounded-[1.35rem] border border-[#161314]/15 bg-[#87e7ff]/25">
                      <Image
                        src={product.previewImage}
                        alt={`${product.name} preview`}
                        fill
                        sizes="(min-width: 768px) 28vw, 90vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ) : null}

                  <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#3f7f4b]">
                    {product.eyebrow}
                  </p>
                  <h3 className="font-serif text-3xl font-black tracking-tight text-[#161314]">
                    {product.name}
                  </h3>
                  <p className="mt-4 flex-grow text-sm font-semibold leading-6 text-[#2b2218]/80">
                    {product.summary}
                  </p>
                  <span className="mt-7 inline-flex items-center justify-between rounded-full border border-[#161314]/15 bg-[#161314] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#fff7d8] transition-colors group-hover:bg-[#3f7f4b]">
                    {externalUrl ? "Open app" : "View product"}
                    <span className="text-lg">›</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ClayContact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-[#f6eec9]">
      <Image
        src="/claymation/contact-tropical-birds-bg.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#f6eec9]/20 via-[#fff7d8]/34 to-[#fff7d8]/60" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fff7d8] to-transparent" />
      <ClayContactForm />
    </section>
  );
}

function SectionHeading({ eyebrow }: { eyebrow: string }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <p className="mb-4 text-2xl font-black uppercase tracking-[0.16em] text-[#3f7f4b] sm:text-3xl">
        {eyebrow}
      </p>
      <div className="relative mx-auto mt-2 h-44 w-full max-w-sm sm:h-56">
        <Image
          src="/claymation/coati-floppy-downward-v2.webp"
          alt="Claymation coati pinning the corner of a floppy disk"
          fill
          sizes="(min-width: 640px) 384px, 90vw"
          className="object-contain"
        />
      </div>
      <p className="mx-auto mt-6 max-w-3xl text-lg font-semibold leading-8 text-[#2b2218]/78">
        These are my personal software offerings: practical products, playful
        interfaces, and focused tools shaped by the way I like to build. If you
        want to create something of your own,{" "}
        <a href="#contact" className="font-black text-[#3f7f4b] underline decoration-[#ffcf4d] decoration-4 underline-offset-4 transition-colors hover:text-[#161314]">
          contact me
        </a>
        .
      </p>
    </div>
  );
}

function ClayFooter() {
  const email = process.env.NEXT_PUBLIC_FOOTER_EMAIL;
  const phone = process.env.NEXT_PUBLIC_FOOTER_PHONE;
  const socialLinks = [
    { name: "GitHub", url: process.env.NEXT_PUBLIC_GITHUB_URL },
    { name: "LinkedIn", url: process.env.NEXT_PUBLIC_LINKEDIN_URL },
    { name: "Instagram", url: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
    { name: "YouTube", url: process.env.NEXT_PUBLIC_YOUTUBE_URL },
  ].filter((link) => link.url);

  return (
    <footer className="relative overflow-hidden border-t border-[#70d779]/45 bg-[#fff7d8] text-[#201c1c]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(112,215,121,0.34),transparent_28%),radial-gradient(circle_at_86%_22%,rgba(255,207,77,0.5),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(96,165,250,0.25),transparent_36%)]" />
      <div className="relative mx-auto grid max-w-[1500px] gap-8 px-6 py-9 lg:grid-cols-[minmax(280px,420px)_1fr] lg:items-start lg:px-12 lg:py-12">
        <section className="rounded-[1.75rem] border border-[#5c9958]/35 bg-[#87e7ff]/40 p-6 text-[#201c1c] shadow-[0_18px_50px_rgba(96,165,250,0.18)]">
          <h2 className="font-serif text-2xl font-black leading-tight text-[#2d6b3c]">
            Join the adventure.
            <br />
            Sign up for my newsletter.
          </h2>
          <ClayNewsletterForm />
        </section>

        <section id="faq" className="rounded-[1.75rem] border border-[#5c9958]/25 bg-[#fff7d8]/70 p-6 shadow-[0_18px_50px_rgba(43,34,24,0.1)]">
          <h2 className="font-serif text-3xl font-black tracking-tight">FAQ</h2>
          <div className="mt-3 border-t border-[#3e312a]/50">
            {faqItems.map((item) => (
              <button
                key={item}
                className="flex min-h-11 w-full items-center justify-between gap-3 border-b border-[#3e312a]/35 text-left text-xs font-black uppercase tracking-[0.04em] transition-colors hover:text-[#3f7f4b]"
                type="button"
              >
                {item}
                <span className="text-2xl font-medium">+</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="relative border-t border-[#70d779]/45 bg-[#fff3b8]">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-6 py-8 sm:px-12 lg:grid-cols-3">
          <div>
            <h3 className="font-serif text-2xl font-black tracking-tight">Navigation</h3>
            <div className="mt-3 flex flex-col items-start gap-2 text-sm font-bold text-[#2b2218]/75">
              {navLinks.map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} className="transition-colors hover:text-[#3f7f4b]">
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-2xl font-black tracking-tight">Social Links</h3>
            <ul className="mt-3 space-y-2">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#2b2218]/75 transition-colors hover:text-[#3f7f4b]">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-2xl font-black tracking-tight">Contact Info</h3>
            <div className="mt-3 space-y-2 text-sm font-bold text-[#2b2218]/75">
              {email ? <a href={`mailto:${email}`} className="block transition-colors hover:text-[#3f7f4b]">{email}</a> : null}
              {phone ? <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="block transition-colors hover:text-[#3f7f4b]">{phone}</a> : null}
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.08em] text-[#3f7f4b]">
              © Ryan Deame 2026
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
