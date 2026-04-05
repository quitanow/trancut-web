"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import Image from "next/image";
import Footer from "@/components/footer";
import { useLocale } from "@/components/locale-provider";

export default function ForgotPasswordPage() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://trancut.com/reset-password",
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Image src="/logo.png" alt="TranCut" width={32} height={32} className="rounded-lg" />
          <span className="font-bold text-lg tracking-tight">TranCut</span>
        </Link>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xl">✓</span>
              </div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{t.auth.checkEmail}</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                {t.auth.checkEmailMsg} <strong>{email}</strong>
              </p>
              <Link href="/login" className="text-sm text-blue-600 hover:underline">
                {t.auth.backToSignIn}
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">{t.auth.resetTitle}</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                {t.auth.resetSubtitle}
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    {t.auth.email}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {loading ? t.auth.sending : t.auth.sendResetLink}
                </button>
              </form>
              <p className="mt-5 text-center text-sm text-zinc-500">
                <Link href="/login" className="text-blue-600 hover:underline">
                  {t.auth.backToSignIn}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
