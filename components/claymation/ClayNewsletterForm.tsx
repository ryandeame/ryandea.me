"use client";

import { type FormEvent, useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ClayNewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: null, message: "" });

    if (!emailPattern.test(email.trim())) {
      setStatus({ type: "error", message: "Enter a valid email address." });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to sign up.");
      }

      setEmail("");
      setStatus({ type: "success", message: "Thanks for joining!" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to sign up. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        aria-label="Email address"
        className="mt-4 h-11 w-full rounded-full border border-[#5c9958]/35 bg-[#fff7d8] px-4 text-sm text-[#161314] outline-none placeholder:text-[#6e765e] focus:border-[#3f7f4b]"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email address"
        required
        suppressHydrationWarning
        type="email"
        value={email}
      />
      <button
        className="mt-3 h-11 w-full rounded-full bg-[#ffcf4d] text-sm font-black uppercase tracking-[0.1em] text-[#161314] transition-colors hover:bg-[#70d779] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Signing up..." : "Sign up"}
      </button>
      {status.type ? (
        <p className={`mt-3 text-center text-xs font-black ${status.type === "success" ? "text-[#2d6b3c]" : "text-[#c2410c]"}`}>
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
