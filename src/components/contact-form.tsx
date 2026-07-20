"use client";

import { useState } from "react";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  async function submit(formData: FormData) {
    setState("sending");
    const response = await fetch("/api/contact", {
      method: "POST",
      body: formData,
    });
    setState(response.ok ? "sent" : "error");
  }
  return (
    <form action={submit} className="contact-form">
      <input
        aria-hidden="true"
        className="honeypot"
        name="companyWebsite"
        tabIndex={-1}
        autoComplete="off"
      />
      <label>
        Name
        <input required name="name" maxLength={80} />
      </label>
      <label>
        Email
        <input required name="email" type="email" maxLength={160} />
      </label>
      <label>
        Message
        <textarea required name="message" rows={5} maxLength={3000} />
      </label>
      <button className="button primary" disabled={state === "sending"}>
        {state === "sending" ? "Sending..." : "Send message"}
      </button>
      <p role="status">
        {state === "sent"
          ? "Thanks - your message was received."
          : state === "error"
            ? "Message could not be sent. Please try LinkedIn."
            : ""}
      </p>
    </form>
  );
}
