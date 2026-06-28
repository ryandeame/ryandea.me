import Image from "next/image";
import Link from "next/link";

import ClientContactForm from "@/components/ClientContactForm";
import { productDetails } from "@/data/products";
import { projects } from "@/data/projects";

const navLinks = ["Products", "Projects", "FAQ", "Contact"];
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
      <ClayProjects />
      <ClayContact />
      <ClayFooter />
    </main>
  );
}

function ClayNavbar() {
  return (
    <header className="border-b border-[#6fd37a]/40 bg-[#fff7d8]">
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1500px] items-center justify-between gap-4 px-4 sm:min-h-[94px] sm:px-11">
        <Link href="/claymation" className="group inline-flex items-center gap-3">
          <span className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-[#161314] bg-[#ffcf4d] shadow-[0_8px_28px_rgba(92,153,88,0.24)] transition-transform group-hover:-rotate-3 group-hover:scale-105">
            <Image
              src="/claymation/ryan-silhouette-logo-transparent.webp"
              alt=""
              fill
              sizes="56px"
              className="absolute inset-0 scale-[1.16] object-cover object-center"
            />
          </span>
          <span className="relative h-[72px] w-[250px] sm:h-[88px] sm:w-[340px]">
            <Image
              src="/claymation/ryandea-bird-wordmark.webp"
              alt="ryandea.me"
              fill
              priority
              sizes="(min-width: 640px) 340px, 250px"
              className="object-contain object-left"
            />
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="py-3 text-[13px] font-black uppercase tracking-[0.16em] text-[#2b2218] transition-colors hover:text-[#3f7f4b]"
            >
              {link}
            </a>
          ))}
        </nav>

        <button className="ml-auto min-h-11 text-xs font-black uppercase tracking-[0.14em] text-[#2b2218] md:hidden">
          Menu
        </button>

        <button className="inline-flex min-h-11 items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#2b2218]">
          Cart
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#5c9958] text-xs text-[#161314]">
            0
          </span>
        </button>
      </div>
    </header>
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

      <div className="relative mx-auto flex min-h-[650px] w-full max-w-[1500px] items-end px-6 py-9 md:items-center md:px-16 md:py-16">
        <div className="max-w-3xl">
          <h1 className="max-w-4xl font-serif text-[48px] font-black leading-[0.96] tracking-[-0.04em] text-[#fff7d8] drop-shadow-[0_5px_16px_rgba(14,45,66,0.72)] sm:text-[78px] sm:leading-[0.95]">
            Join Ryan Deame in the Land of Software.
          </h1>

          <p className="mt-5 text-sm font-black uppercase leading-6 tracking-[0.08em] text-[#fff7d8] drop-shadow-[0_3px_8px_rgba(14,45,66,0.74)] sm:text-lg sm:leading-7">
            Bold experiences. Tactile worlds.
            <br />
            Bright ideas built to shine.
          </p>

          <a
            href="#products"
            className="mt-7 inline-flex min-h-[58px] min-w-[250px] items-center justify-between gap-6 rounded-full border border-[#fff7d8]/60 bg-[#ffcf4d] px-6 text-base font-black uppercase tracking-[0.13em] text-[#161314] shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-transform hover:-translate-y-1 hover:bg-[#70d779]"
          >
            Start exploring
            <span className="text-3xl leading-none">›</span>
          </a>
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
          eyebrow="Products"
          title="Featured Products"
          body="Apps and product concepts with a little more character: practical workflows, bright interfaces, and ideas that feel memorable before they feel corporate."
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

function ClayProjects() {
  return (
    <section id="projects" className="relative overflow-hidden bg-[#bfe9ff] px-6 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,247,216,0.7),transparent_30%),radial-gradient(circle_at_84%_72%,rgba(255,207,77,0.42),transparent_30%)]" />
      <div className="relative mx-auto max-w-[1500px]">
        <SectionHeading
          eyebrow="Work"
          title="Featured Projects"
          body="A few practical builds from the archive, reframed inside the brighter claymation direction so the work feels less sterile and more alive."
        />

        <div className="mt-14 grid gap-7 md:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project.title}
              className="group overflow-hidden rounded-[2rem] border-2 border-[#161314]/15 bg-[#fff7d8] shadow-[0_18px_45px_rgba(43,34,24,0.14)] transition-transform hover:-translate-y-2"
            >
              <div className="relative aspect-video overflow-hidden bg-[#161314]">
                <Image
                  src={project.image}
                  alt={`${project.title} thumbnail`}
                  fill
                  sizes="(min-width: 768px) 45vw, 90vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 rounded-full bg-[#ffcf4d] px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#161314]">
                  {project.date}
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#70d779] font-serif text-lg font-black text-[#161314]">
                    {index + 1}
                  </span>
                  <h3 className="font-serif text-2xl font-black tracking-tight text-[#161314]">
                    {project.title}
                  </h3>
                </div>
                <p className="text-sm font-semibold leading-6 text-[#2b2218]/80">
                  {project.description}
                </p>
                {project.tags.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-[#161314]/10 bg-[#f6eec9] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-[#3f7f4b]">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-4 border-t border-[#161314]/10 pt-5 text-sm font-black text-[#2b2218]">
                  {project.github ? (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#3f7f4b]">
                      View code
                    </a>
                  ) : null}
                  {project.videoId ? (
                    <a href={`https://www.youtube.com/watch?v=${project.videoId}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#3f7f4b]">
                      Watch demo
                    </a>
                  ) : null}
                  {project.datasource ? (
                    <a href={project.datasource} target="_blank" rel="noopener noreferrer" className="hover:text-[#3f7f4b]">
                      Data source
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClayContact() {
  return (
    <section className="relative overflow-hidden bg-[#f6eec9]">
      <div className="px-6 pt-20">
        <SectionHeading
          eyebrow="Contact"
          title="Start The Conversation"
          body="Keeping the working contact form here for now, with the claymation direction framing it above the current production form."
        />
      </div>
      <ClientContactForm />
    </section>
  );
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#3f7f4b]">
        {eyebrow}
      </p>
      <h2 className="font-serif text-5xl font-black tracking-[-0.04em] text-[#161314] md:text-7xl">
        {title}
      </h2>
      <p className="mx-auto mt-6 max-w-3xl text-lg font-semibold leading-8 text-[#2b2218]/78">
        {body}
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
      <div className="relative mx-auto grid max-w-[1500px] gap-8 px-6 py-9 lg:grid-cols-[1.35fr_1fr_270px] lg:px-12 lg:py-12">
        <section className="flex flex-col gap-6 border-[#3e312a]/35 lg:flex-row lg:items-center lg:border-r lg:pr-9">
          <div className="grid h-32 w-44 shrink-0 place-items-center rounded-[2rem] border border-[#5c9958]/35 bg-[#87e7ff]/45 shadow-[inset_0_0_0_8px_rgba(255,247,216,0.6),0_18px_42px_rgba(96,165,250,0.2)]">
            <div className="h-20 w-20 rounded-full bg-[#ffcf4d] shadow-[inset_-14px_-12px_0_rgba(92,153,88,0.28),0_12px_28px_rgba(92,153,88,0.22)]" />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-black tracking-tight">The Direction</h2>
            <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-[#2b2218]">
              We are not here to blend in. We are here to build a page with texture,
              character, and a little weirdness. This route is the sunny trailhead for a
              more personal software world.
            </p>
            <p className="mt-3 font-serif text-base font-black tracking-wide text-[#3f7f4b]">
              Color over chrome.
            </p>
          </div>
        </section>

        <section id="faq">
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

        <section className="rounded-[1.75rem] border border-[#5c9958]/35 bg-[#87e7ff]/40 p-6 text-[#201c1c] shadow-[0_18px_50px_rgba(96,165,250,0.18)]">
          <h2 className="font-serif text-2xl font-black leading-tight text-[#2d6b3c]">
            Join the adventure
          </h2>
          <p className="mt-3 text-sm leading-5">Get updates when this visual direction starts blooming.</p>
          <input
            aria-label="Email address"
            className="mt-4 h-11 w-full rounded-full border border-[#5c9958]/35 bg-[#fff7d8] px-4 text-sm text-[#161314] outline-none placeholder:text-[#6e765e]"
            placeholder="Email address"
            type="email"
          />
          <button className="mt-3 h-11 w-full rounded-full bg-[#ffcf4d] text-sm font-black uppercase tracking-[0.1em] text-[#161314] transition-colors hover:bg-[#70d779]" type="button">
            Sign up
          </button>
        </section>
      </div>

      <div className="relative mx-auto max-w-[1500px] px-6 pb-10 lg:px-12">
        <div className="rounded-[2rem] border border-[#161314]/10 bg-[#f6eec9]/80 p-6 shadow-[0_18px_45px_rgba(43,34,24,0.1)]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#3f7f4b]">
            Regular index footer info
          </p>
          <div className="mt-5 grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="font-serif text-2xl font-black">Social Links</h3>
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
              <h3 className="font-serif text-2xl font-black">Contact Info</h3>
              <div className="mt-3 space-y-2 text-sm font-bold text-[#2b2218]/75">
                {email ? <a href={`mailto:${email}`} className="block transition-colors hover:text-[#3f7f4b]">{email}</a> : null}
                {phone ? <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="block transition-colors hover:text-[#3f7f4b]">{phone}</a> : null}
              </div>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-black">Copyright</h3>
              <p className="mt-3 text-sm font-bold text-[#2b2218]/75">© Ryan Deame 2025</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-[#70d779]/45 bg-[#fff3b8]">
        <div className="mx-auto flex min-h-[72px] max-w-[1500px] flex-col items-center justify-between gap-4 px-6 py-5 text-center sm:flex-row sm:px-12">
          <p className="font-serif text-sm font-black tracking-[0.1em] text-[#2d6b3c]">
            ★ RYANDEA.ME ★
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-[11px] font-black uppercase tracking-[0.1em] text-[#2b2218]">
            {navLinks.map((link) => (
              <span key={link}>{link}</span>
            ))}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#3f7f4b]">
            © 2026 Direction Study
          </p>
        </div>
      </div>
    </footer>
  );
}
