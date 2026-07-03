import Image from "next/image";
import Link from "next/link";

import ClayContactForm from "@/components/claymation/ClayContactForm";
import ClayNewsletterForm from "@/components/claymation/ClayNewsletterForm";
import ClayNavbar from "@/components/claymation/ClayNavbar";
import ClayShopCatalog from "@/components/claymation/ClayShopCatalog";
import { productDetails } from "@/data/products";

const navLinks = ["Shop", "Products", "Contact"];
const featuredProductSlug = "been-to-box";
const hiddenProductSlugs = new Set(["ontrack", "reach"]);
const externalProductUrls: Partial<Record<(typeof productDetails)[number]["slug"], string>> = {
  [featuredProductSlug]: "https://ryandeame--been-to-box.us-central1.hosted.app",
};
const orderedProductDetails = [...productDetails]
  .filter((product) => !hiddenProductSlugs.has(product.slug))
  .sort((a, b) => {
    if (a.slug === featuredProductSlug) return -1;
    if (b.slug === featuredProductSlug) return 1;
    return 0;
  });

export default function ClaymationPage() {
  return (
    <main className="min-h-screen bg-[#f6eec9] text-[#161314]">
      <ClayNavbar />
      <ClayHero />
      <ClayShop />
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
        src="/claymation/hero-banner-waterfall-clay.webp"
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
              href="#shop"
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

function ClayShop() {
  return (
    <section id="shop" className="relative overflow-hidden bg-[#f6eec9] px-6 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(135,231,255,0.52),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(255,207,77,0.46),transparent_24%),radial-gradient(circle_at_52%_92%,rgba(112,215,121,0.28),transparent_36%)]" />
      <div className="relative mx-auto grid max-w-[1500px] items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative mx-auto h-[420px] w-full max-w-xl sm:h-[540px] lg:order-2">
          <Image
            src="/claymation/shop-bird-bag-clean-v2-chroma-better.webp"
            alt="Claymation bird carrying a designer shopping bag with the Ryan Deame face logo"
            fill
            priority
            sizes="(min-width: 1024px) 46vw, 92vw"
            className="object-contain drop-shadow-[0_24px_42px_rgba(43,34,24,0.18)]"
          />
        </div>

        <div className="mx-auto max-w-2xl text-center lg:text-left">
          <p className="text-2xl font-black uppercase tracking-[0.16em] text-[#3f7f4b] sm:text-3xl">
            Shop
          </p>
          <h2 className="mt-5 font-serif text-5xl font-black leading-[0.95] tracking-[-0.04em] text-[#161314] sm:text-7xl">
            Software you can put to work.
          </h2>
          <p className="mt-6 text-lg font-semibold leading-8 text-[#2b2218]/78">
            Purchase software, tools, and digital experiences to solve real
            world problems with a little more color and personality than the
            usual dashboard.
          </p>
          <ClayShopCatalog />
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

        <div className="mx-auto mt-14 grid max-w-xl gap-6">
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
        className="object-cover object-[25%_50%] md:object-center"
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
        <div className="relative mx-auto max-w-[1500px] px-6 py-9 lg:px-12 lg:py-12">
          <section className="mx-auto flex justify-center text-center text-[#201c1c]">
            <div
              className="relative flex min-h-[618px] w-full max-w-xs flex-col items-center justify-end gap-4 overflow-hidden rounded-[1.75rem] border border-[#5c9958]/35 bg-cover bg-top px-5 py-7 shadow-[0_18px_50px_rgba(96,165,250,0.18)] sm:max-w-sm sm:px-8 lg:py-9"
              style={{
                backgroundImage: "url('/claymation/newsletter-ibis-scroll-bg.webp')",
                backgroundPosition: "top center",
              }}
            >
              <div className="absolute inset-0 animate-[newsletterShimmer_9s_ease-in-out_infinite] bg-[linear-gradient(115deg,rgba(135,231,255,0.42),rgba(255,207,77,0.24),rgba(255,132,189,0.34),rgba(112,215,121,0.32),rgba(135,231,255,0.42))] bg-[length:240%_240%] mix-blend-screen" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(255,255,255,0.48),transparent_30%),radial-gradient(circle_at_78%_14%,rgba(255,244,173,0.34),transparent_28%),linear-gradient(180deg,transparent_45%,rgba(255,247,216,0.58))]" />
              <h2 className="relative z-10 font-serif text-4xl font-black leading-[1.04] tracking-[0.02em] text-white drop-shadow-[0_5px_14px_rgba(22,19,20,0.82)] sm:text-5xl">
                <span className="block">Sign up</span>
                <span className="block">for my</span>
                <span className="block">newsletter.</span>
              </h2>
              <div className="relative z-10 w-full max-w-sm">
                <ClayNewsletterForm />
              </div>
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
