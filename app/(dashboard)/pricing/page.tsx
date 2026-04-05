"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { pricingPageTranslations } from "@/lib/i18n";

export default function PricingPage() {
  const { locale } = useLocale();
  const p = pricingPageTranslations[locale];

  const plans = [
    { tier: "Free", price: "$0", features: p.freeFeatures, cta: null, highlight: false },
    { tier: "Basic", price: "$4.99 / mo", features: p.basicFeatures, cta: { label: p.subscribeBasic, href: "/billing/checkout?plan=basic" }, highlight: false },
    { tier: "Pro", price: "$9.99 / mo", features: p.proFeatures, cta: { label: p.subscribePro, href: "/billing/checkout?plan=pro" }, highlight: true },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{p.title}</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8">{p.subtitle}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
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
              <div className="text-center text-sm text-zinc-400 py-2">{p.currentPlan}</div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-400 mt-6 text-center">{p.addOn}</p>
    </div>
  );
}
