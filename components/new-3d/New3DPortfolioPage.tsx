"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Send,
} from "lucide-react";

import ThreeBackground from "@/components/new-3d/ThreeBackground";

import styles from "./new-3d-portfolio.module.css";

type New3DPortfolioPageProps = {
  className?: string;
};

const featuredProjects = [
  {
    title: "Ethereal Worlds",
    category: "3D Experience",
    image: "https://picsum.photos/seed/3d1/800/600",
    description:
      "A procedural universe explorer built with Three.js and custom GLSL shaders.",
    tags: ["Three.js", "GLSL", "React"],
  },
  {
    title: "Quantum Dashboard",
    category: "Data Visualization",
    image: "https://picsum.photos/seed/3d2/800/600",
    description:
      "Real-time 3D data visualization for complex financial systems.",
    tags: ["D3.js", "WebGL", "TypeScript"],
  },
  {
    title: "Lumina Studio",
    category: "E-commerce",
    image: "https://picsum.photos/seed/3d3/800/600",
    description:
      "Interactive 3D product configurator for high-end furniture.",
    tags: ["R3F", "Zustand", "Tailwind"],
  },
  {
    title: "Nebula UI",
    category: "Design System",
    image: "https://picsum.photos/seed/3d4/800/600",
    description:
      "A component library focused on glassmorphism and 3D interactions.",
    tags: ["React", "Framer Motion", "CSS"],
  },
] as const;

const skills = [
  { name: "Three.js", level: 95 },
  { name: "React / R3F", level: 90 },
  { name: "WebGL / GLSL", level: 85 },
  { name: "TypeScript", level: 92 },
  { name: "Blender", level: 75 },
  { name: "UI/UX Design", level: 80 },
] as const;

const principleCards = ["Performance", "Accessibility", "Scalability", "Innovation"] as const;

const socialLinks = [
  {
    label: "GitHub",
    href: "#projects",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "#contact",
    icon: Linkedin,
  },
  {
    label: "Email",
    href: "#contact",
    icon: Mail,
  },
] as const;

const footerLinks = [
  { label: "Twitter", href: "#contact" },
  { label: "Instagram", href: "#projects" },
  { label: "Dribbble", href: "#skills" },
  { label: "Behance", href: "#about" },
] as const;

export default function New3DPortfolioPage({
  className,
}: New3DPortfolioPageProps) {
  return (
    <main className={`${styles.page} relative isolate ${className ?? ""}`}>
      <ThreeBackground />

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-8 mix-blend-difference md:px-12"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <div className="h-4 w-4 rotate-45 rounded-sm bg-black" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">
            RYAN DEAME
          </span>
        </div>

        <nav className="hidden items-center gap-12 md:flex">
          {["About", "Projects", "Skills", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-xs font-medium uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
            >
              {item}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className={`${styles.glass} rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-widest transition-all hover:bg-white hover:text-black`}
        >
          Let&apos;s Talk
        </a>
      </motion.header>

      <div className="relative z-10">
        <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 md:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 max-w-4xl"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.7, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`${styles.accentText} mb-4 block text-sm font-medium uppercase tracking-[0.2em]`}
            >
              Creative 3D Developer
            </motion.span>

            <h1
              className={`${styles.serif} ${styles.textGradient} mb-8 text-6xl leading-[0.9] font-bold md:text-8xl`}
            >
              Ryan Deame <br />
              <span className={`${styles.accentText} italic`}>
                3D Developer
              </span>
            </h1>

            <p className={`${styles.fadedText} mb-10 max-w-xl text-lg leading-relaxed md:text-xl`}>
              I specialize in building high-performance, interactive 3D
              experiences using React, Three.js, and WebGL. Transforming complex
              ideas into beautiful, fluid realities.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-black transition-all hover:bg-[var(--new-3d-accent)] hover:text-white"
              >
                View Projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.a>

              <div className="flex gap-4">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    whileHover={{ y: -4, color: "#f27d26" }}
                    className={`${styles.glass} ${styles.fadedText} rounded-full p-3 transition-colors`}
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1, duration: 2 }}
            className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-widest">
              Scroll to explore
            </span>
            <div className="h-12 w-px bg-gradient-to-b from-white to-transparent" />
          </motion.div>
        </section>

        <section
          id="about"
          className="px-6 py-32 md:px-24"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className={`${styles.serif} mb-8 text-4xl font-bold md:text-5xl`}>
                I&apos;m Ryan Deame, <br />
                <span className={`${styles.accentText} italic`}>Art &amp; Code</span>
              </h2>
              <div className={`${styles.fadedText} space-y-6 text-lg leading-relaxed`}>
                <p>
                  With over 5 years of experience in creative development,
                  I&apos;ve dedicated my career to pushing the boundaries of what&apos;s
                  possible in the browser.
                </p>
                <p>
                  My approach combines technical rigor with artistic sensibility.
                  I don&apos;t just write code; I choreograph pixels and geometry to
                  create emotional connections.
                </p>
                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div>
                    <h4 className="mb-1 text-3xl font-bold text-white">50+</h4>
                    <p className="text-sm uppercase tracking-wider opacity-50">
                      Projects Completed
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-3xl font-bold text-white">12</h4>
                    <p className="text-sm uppercase tracking-wider opacity-50">
                      Design Awards
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className={`${styles.glass} group relative aspect-square overflow-hidden rounded-2xl`}
            >
              <img
                src="https://picsum.photos/seed/developer/800/800"
                alt="Developer working"
                className="h-full w-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <p className="mb-2 text-xs uppercase tracking-widest opacity-50">
                  Based in
                </p>
                <p className="text-xl font-medium">San Francisco, CA</p>
              </div>
            </motion.div>
          </div>
        </section>

        <section
          id="projects"
          className="bg-white/5 px-6 py-32 md:px-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <span className={`${styles.accentText} mb-4 block text-sm font-medium uppercase tracking-[0.2em]`}>
                  Selected Work
                </span>
                <h2 className={`${styles.serif} text-5xl font-bold md:text-6xl`}>
                  Featured Projects
                </h2>
              </div>
              <p className={`${styles.mutedText} max-w-md`}>
                A collection of experiments and client work focusing on
                immersive web technologies and interactive design.
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-2">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className={`${styles.glass} relative mb-6 aspect-[16/10] overflow-hidden rounded-2xl`}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <a
                        href="#contact"
                        className="rounded-full bg-white p-3 text-black transition-colors hover:bg-[var(--new-3d-accent)] hover:text-white"
                        aria-label={`Open ${project.title}`}
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                      <a
                        href="#skills"
                        className="rounded-full bg-white p-3 text-black transition-colors hover:bg-[var(--new-3d-accent)] hover:text-white"
                        aria-label={`See skills behind ${project.title}`}
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`${styles.accentText} mb-2 text-xs uppercase tracking-widest`}>
                        {project.category}
                      </p>
                      <h3 className="mb-3 text-2xl font-bold">{project.title}</h3>
                      <p className={`${styles.fadedText} mb-4 line-clamp-2`}>
                        {project.description}
                      </p>
                      <div className="flex gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-wider text-white/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="skills"
          className="px-6 py-32 md:px-24"
        >
          <div className="mx-auto mb-20 max-w-4xl text-center">
            <h2 className={`${styles.serif} mb-6 text-4xl font-bold md:text-5xl`}>
              Technical Expertise
            </h2>
            <p className={`${styles.mutedText} text-lg`}>
              Mastering the tools that bridge the gap between imagination and
              reality.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-x-20 gap-y-12 md:grid-cols-2">
            {skills.map((skill, index) => (
              <div key={skill.name}>
                <div className="mb-4 flex items-end justify-between">
                  <span className="text-lg font-medium">{skill.name}</span>
                  <span className={`${styles.softText} font-mono text-sm`}>
                    {skill.level}%
                  </span>
                </div>
                <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                    className="h-full"
                    style={{ backgroundColor: "var(--new-3d-accent)" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-32 grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
            {principleCards.map((item, index) => (
              <motion.div
                key={item}
                whileHover={{ y: -10 }}
                className={`${styles.glass} rounded-2xl p-8 text-center`}
              >
                <div className={`${styles.accentText} ${styles.serif} mb-2 text-2xl italic`}>
                  0{index + 1}
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest">
                  {item}
                </h4>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="bg-white/5 px-6 py-32 md:px-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-20 md:grid-cols-2">
              <div>
                <h2 className={`${styles.serif} mb-8 text-5xl font-bold md:text-6xl`}>
                  Let&apos;s build <br />
                  <span className={`${styles.accentText} italic`}>
                    something great
                  </span>
                </h2>
                <p className={`${styles.fadedText} mb-12 max-w-md text-lg`}>
                  Have a project in mind or just want to say hi? I&apos;m always
                  open to new opportunities and collaborations.
                </p>

                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className={`${styles.glass} ${styles.accentText} rounded-full p-4`}>
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest opacity-50">
                        Email
                      </p>
                      <p className="text-lg font-medium">hello@lumina3d.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className={`${styles.glass} ${styles.accentText} rounded-full p-4`}>
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest opacity-50">
                        Location
                      </p>
                      <p className="text-lg font-medium">San Francisco, CA</p>
                    </div>
                  </div>
                </div>
              </div>

              <motion.form
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`${styles.glass} space-y-6 rounded-3xl p-10`}
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="ml-1 text-xs uppercase tracking-widest opacity-50">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors focus:border-[var(--new-3d-accent)] focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="ml-1 text-xs uppercase tracking-widest opacity-50">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors focus:border-[var(--new-3d-accent)] focus:outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-xs uppercase tracking-widest opacity-50">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors focus:border-[var(--new-3d-accent)] focus:outline-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <button
                  type="button"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 font-bold text-black transition-all hover:bg-[var(--new-3d-accent)] hover:text-white"
                >
                  Send Message
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </motion.form>
            </div>

            <footer className="mt-32 flex flex-col items-center justify-between gap-8 border-t border-white/10 pt-12 md:flex-row">
              <p className={`${styles.caption} text-sm`}>
                © 2026 Ryan Deame. All rights reserved.
              </p>
              <div className="flex gap-8">
                {footerLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className={`${styles.softText} text-xs uppercase tracking-widest transition-colors hover:text-[var(--new-3d-accent)]`}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
