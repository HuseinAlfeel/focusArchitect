"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "Anmeldung fehlgeschlagen.");
      setSubmitting(false);
      return;
    }

    router.push("/study");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs space-y-4 rounded-lg border border-black/10 p-6 dark:border-white/15"
      >
        <h1 className="text-lg font-medium">Anmelden</h1>

        <div className="space-y-1">
          <label htmlFor="code" className="block text-sm opacity-70">
            Code
          </label>
          <input
            id="code"
            name="code"
            type="text"
            autoComplete="username"
            autoCapitalize="characters"
            autoFocus
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="w-full rounded border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm opacity-70">
            Passwort
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
            required
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-neutral-800 px-3 py-2 text-sm text-white transition-opacity disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {submitting ? "Anmelden …" : "Anmelden"}
        </button>
      </form>
    </main>
  );
}
