"use client";

import dynamic from "next/dynamic";

// Dynamic import with SSR disabled to prevent hydration mismatch
// caused by browser extensions (e.g., password managers) modifying form inputs
const ContactForm = dynamic(() => import("@/components/ContactForm"), {
    ssr: false,
});

export default function ClientContactForm() {
    return <ContactForm />;
}
