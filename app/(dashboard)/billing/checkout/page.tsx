"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase";
import { createCheckoutSession } from "@/lib/api";
import { Loader2 } from "lucide-react";

function CheckoutRedirect() {
  const params = useSearchParams();
  const router = useRouter();
  const plan = (params.get("plan") ?? "basic") as "basic" | "pro";
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/login?redirect=/billing/checkout?plan=${plan}`);
        return;
      }
      try {
        const { url } = await createCheckoutSession(session.access_token, plan);
        window.location.href = url;
      } catch (err) {
        setError((err as Error).message);
      }
    })();
  }, [plan, router]);

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={() => router.push("/upload")} className="text-sm text-zinc-500 underline">
        Back to dashboard
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-zinc-400">
      <Loader2 size={24} className="animate-spin" />
      <p className="text-sm">Redirecting to checkout…</p>
    </div>
  );
}

export default function BillingCheckout() {
  return (
    <Suspense>
      <CheckoutRedirect />
    </Suspense>
  );
}
