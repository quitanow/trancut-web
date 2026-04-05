"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Image from "next/image";
import Footer from "@/components/footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/upload");
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your TranCut account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
            <Link href="/forgot-password" className="text-xs text-zinc-400 hover:text-blue-600 transition-colors">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-zinc-500">
        No account?{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Sign up free
        </Link>
      </p>
    </AuthLayout>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <Image src="/logo.png" alt="TranCut" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-lg tracking-tight">TranCut</span>
          </Link>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">{title}</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
