"use client";
import { useState } from "react";
type Kind = "email" | "telegram";
export function ContactLinks() {
  const [revealed, setRevealed] = useState<
    Partial<Record<Kind, { href: string; label: string }>>
  >({});
  const [error, setError] = useState("");
  async function reveal(type: Kind) {
    setError("");
    const response = await fetch("/api/contact/reveal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    const body = await response.json();
    if (response.ok) setRevealed((v) => ({ ...v, [type]: body }));
    else setError(body.error ?? "Contact option unavailable");
  }
  return (
    <div className="contact-links" aria-label="Direct contact options">
      {(["email", "telegram"] as const).map((type) =>
        revealed[type] ? (
          <a
            className="button"
            key={type}
            href={revealed[type]!.href}
            rel="noreferrer"
          >
            {revealed[type]!.label}
          </a>
        ) : (
          <button
            className="button"
            type="button"
            key={type}
            onClick={() => reveal(type)}
          >
            Show {type}
          </button>
        ),
      )}
      <p role="status">{error}</p>
    </div>
  );
}
