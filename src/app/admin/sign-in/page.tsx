"use client";
import { signIn } from "next-auth/react";
export default function SignIn() {
  return (
    <main className="admin-shell">
      <section className="admin-card">
        <p className="eyebrow">Private workspace</p>
        <h1 className="admin-title">CV administration</h1>
        <p>Sign in with the authorized Google account.</p>
        <button
          className="button primary"
          onClick={() => signIn("google", { callbackUrl: "/admin" })}
        >
          Sign in with Google
        </button>
      </section>
    </main>
  );
}
