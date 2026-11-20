"use client";

import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSending(true);
    setFeedback("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        form.reset();
        setFeedback("Thanks. Your message was sent.");
      } else {
        setFeedback(
          response.status === 429
            ? "Too many attempts. Please try again later."
            : "Your message could not be sent. Please try again or use another contact option.",
        );
      }
    } catch {
      setFeedback("Connection interrupted. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      action="/api/contact"
      method="post"
      onSubmit={submit}
      className="contact-form"
    >
      <input
        aria-hidden="true"
        className="honeypot"
        name="companyWebsite"
        tabIndex={-1}
        autoComplete="off"
      />
      <div className="contact-fields">
        <label>
          Name
          <input
            required
            name="name"
            autoComplete="name"
            maxLength={80}
            readOnly={sending}
          />
        </label>
        <label>
          Email
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            maxLength={160}
            readOnly={sending}
          />
        </label>
      </div>
      <label>
        Message
        <textarea
          required
          name="message"
          rows={5}
          maxLength={3000}
          readOnly={sending}
        />
      </label>
      <div className="contact-submit">
        <button className="button primary" disabled={sending}>
          {sending ? "Sending…" : "Send message"}
        </button>
        <p role="status">{feedback}</p>
      </div>
    </form>
  );
}
