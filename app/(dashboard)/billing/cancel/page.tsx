"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function BillingCancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6">
        <XCircle size={32} className="text-zinc-400" />
      </div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
        Checkout cancelled
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8">
        No charge was made. You can upgrade anytime.
      </p>
      <Link
        href="/upload"
        className="px-6 py-3 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
