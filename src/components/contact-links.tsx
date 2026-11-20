"use client";

import { useState } from "react";

type Kind = "email" | "telegram";
type DirectLink = { href: string; label: string };
const focusRevealedLink = (node: HTMLAnchorElement | null) => node?.focus();

export function ContactLinks({
  emailAvailable,
  telegramAvailable,
}: {
  emailAvailable: boolean;
  telegramAvailable: boolean;
}) {
  const [revealed, setRevealed] = useState<Partial<Record<Kind, DirectLink>>>(
    {},
  );
  const [pending, setPending] = useState<Kind | null>(null);
  const [error, setError] = useState("");

  async function reveal(type: Kind) {
    if (pending) return;
    setError("");
    setPending(type);
    try {
      const response = await fetch("/api/contact/reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (!response.ok) {
        setError(
          response.status === 429
            ? "Too many requests. Please try again later."
            : "This contact option is currently unavailable.",
        );
        return;
      }
      const link: DirectLink = await response.json();
      setRevealed((current) => ({ ...current, [type]: link }));
    } catch {
      setError("Connection interrupted. Please try again.");
    } finally {
      setPending(null);
    }
  }

  const options: Kind[] = [];
  if (emailAvailable) options.push("email");
  if (telegramAvailable) options.push("telegram");
  if (!options.length) return null;

  return (
    <div className="contact-links">
      {options.map((type) => {
        const link = revealed[type];
        return link ? (
          <a
            className="button"
            key={type}
            href={link.href}
            rel="noreferrer"
            ref={focusRevealedLink}
          >
            {link.label}
          </a>
        ) : (
          <button
            className="button"
            type="button"
            key={type}
            disabled={pending !== null}
            onClick={() => reveal(type)}
          >
            {pending === type
              ? "Revealing…"
              : type === "email"
                ? "Show email"
                : "Show Telegram"}
          </button>
        );
      })}
      <p role="status">{error}</p>
    </div>
  );
}
