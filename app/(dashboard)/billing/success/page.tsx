"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const isCredits = params.get("credits") === "1";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center mb-6">
        <CheckCircle size={32} className="text-green-500" />
      </div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
        {isCredits ? "Credits added!" : "Subscription activated!"}
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm">
        {isCredits
          ? "10 extra jobs have been added to your account."
          : "Your plan is now active. Enjoy your new limits!"}
      </p>
      <Link
        href="/upload"
        className="px-6 py-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        Start uploading
      </Link>
    </div>
  );
}

export default function BillingSuccess() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
