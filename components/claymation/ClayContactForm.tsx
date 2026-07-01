"use client";

import { type FormEvent, useEffect, useState } from "react";

export default function ClayContactForm() {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: null, message: "" });

    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: "error", message: "Fill out all three fields and I will take it from there." });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to send message.");
      }

      setStatus({ type: "success", message: "Message sent. I will be in touch soon." });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative mx-auto flex min-h-[760px] w-full max-w-[1500px] items-center px-6 py-20 lg:justify-end lg:px-12">
      {!isMounted ? (
        <div className="h-[560px] w-full max-w-xl rounded-[2rem] border-2 border-[#161314]/10 bg-[#fff7d8]/55 shadow-[0_24px_80px_rgba(43,34,24,0.18)] backdrop-blur-sm" />
      ) : (
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-[2rem] border-2 border-[#161314]/15 bg-[#fff7d8]/88 p-6 text-[#161314] shadow-[0_24px_80px_rgba(43,34,24,0.28)] backdrop-blur-md sm:p-8"
      >
        <div className="mb-7">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#3f7f4b]">
            Send a note
          </p>
          <h2 className="mt-3 font-serif text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Let&apos;s build something with color.
          </h2>
        </div>

        <div className="grid gap-5">
          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#2b2218]">
            Name
            <input
              value={formData.name}
              onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
              className="h-[52px] rounded-2xl border-2 border-[#161314]/15 bg-[#f6eec9] px-4 py-3 text-base font-bold normal-case tracking-normal text-[#161314] outline-none transition-colors placeholder:text-[#2b2218]/45 focus:border-[#5c9958]"
              placeholder="Ryan Deame"
              suppressHydrationWarning
              type="text"
            />
          </label>

          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#2b2218]">
            Email
            <input
              value={formData.email}
              onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
              className="h-[52px] rounded-2xl border-2 border-[#161314]/15 bg-[#f6eec9] px-4 py-3 text-base font-bold normal-case tracking-normal text-[#161314] outline-none transition-colors placeholder:text-[#2b2218]/45 focus:border-[#5c9958]"
              placeholder="you@example.com"
              suppressHydrationWarning
              type="email"
            />
          </label>

          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#2b2218]">
            Message
            <textarea
              value={formData.message}
              onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
              className="min-h-36 resize-none rounded-2xl border-2 border-[#161314]/15 bg-[#f6eec9] px-4 py-3 text-base font-bold normal-case tracking-normal text-[#161314] outline-none transition-colors placeholder:text-[#2b2218]/45 focus:border-[#5c9958]"
              placeholder="Tell me what you want to make..."
              suppressHydrationWarning
            />
          </label>
        </div>

        <button
          className="mt-7 inline-flex min-h-[58px] w-full items-center justify-center rounded-full border-2 border-[#161314] bg-[#ffcf4d] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#161314] shadow-[0_12px_28px_rgba(43,34,24,0.18)] transition-transform hover:-translate-y-1 hover:bg-[#70d779] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Sending..." : "Send message"}
        </button>

        {status.type ? (
          <p className={`mt-4 text-center text-sm font-black ${status.type === "success" ? "text-[#2d6b3c]" : "text-[#c2410c]"}`}>
            {status.message}
          </p>
        ) : null}
      </form>
      )}
    </div>
  );
}
