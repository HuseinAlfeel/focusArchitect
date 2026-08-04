"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded border border-black/15 px-3 py-1.5 text-sm opacity-70 hover:opacity-100 dark:border-white/20"
    >
      Abmelden
    </button>
  );
}
