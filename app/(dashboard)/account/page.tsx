"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Delete your TranCut account? This permanently removes your account and access to your jobs."
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Failed to delete account.");
      }

      await supabase.auth.signOut();
      setDone(true);
      router.push("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Account</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
        Manage your account and privacy settings.
      </p>

      <section className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 p-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Delete account</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
          Deleting your account permanently removes your TranCut account. This action cannot be undone.
        </p>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
        )}

        {done ? (
          <p className="text-sm text-green-700 dark:text-green-400">
            Your account has been deleted.
          </p>
        ) : (
          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60 transition-colors"
          >
            {loading ? "Deleting account..." : "Delete account"}
          </button>
        )}
      </section>
    </div>
  );
}
