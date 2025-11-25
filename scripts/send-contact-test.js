// Simple helper to POST to the contact API with a fake corporate inquiry.

const url = process.env.CONTACT_URL || "http://localhost:3000/api/contact";

const payload = {
  name: "Casey Leland",
  email: "projects@orion-dynamics.com",
  message:
    "Hello Ryan,\n\nOur innovation team wants to pitch a joint project and would like to schedule a call next week. Please let us know a time that works for you.\n\nThanks,\nCasey",
};

(async () => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log("status:", res.status);
  console.log("response:", data);
})().catch((err) => {
  console.error("Failed to send test contact:", err);
  process.exitCode = 1;
});
