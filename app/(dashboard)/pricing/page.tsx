"use client";

import Link from "next/link";
import { Check } from "lucide-react";

const PLANS = [
  {
    tier: "Free",
    price: "$0",
    features: ["2 min / video", "5 videos / month", "All output formats"],
    cta: null,
  },
  {
    tier: "Basic",
    price: "$9.99 / mo",
    features: ["10 min / video", "30 videos / month", "All output formats", "Add-on credits available"],
    cta: { label: "Subscribe to Basic", href: "/billing/checkout?plan=basic" },
    highlight: false,
  },
  {
    tier: "Pro",
    price: "$19.99 / mo",
    features: ["20 min / video", "Unlimited videos", "All output formats", "Priority processing"],
    cta: { label: "Subscribe to Pro", href: "/billing/checkout?plan=pro" },
    highlight: true,
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Choose a plan</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8">
        Upgrade anytime. Cancel anytime.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <div
            key={plan.tier}
            className={`rounded-xl p-5 border flex flex-col ${
              plan.highlight
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          >
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">{plan.tier}</div>
            <div className="font-bold text-zinc-900 dark:text-white text-lg mb-4">{plan.price}</div>
            <ul className="space-y-2 flex-1 mb-5">
              {plan.features.map((f) => (
                <li key={f} className="text-xs text-zinc-600 dark:text-zinc-400 flex gap-2 items-start">
                  <Check size={13} className="text-green-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            {plan.cta ? (
              <Link
                href={plan.cta.href}
                className={`text-center text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                  plan.highlight
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90"
                }`}
              >
                {plan.cta.label}
              </Link>
            ) : (
              <div className="text-center text-sm text-zinc-400 py-2">Current free plan</div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-400 mt-6 text-center">
        Need more? Buy 10 extra videos for $4.99 anytime — no plan change needed.
      </p>
    </div>
  );
}
