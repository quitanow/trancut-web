"use client";

import Link from "next/link";
import Image from "next/image";
import { Subtitles, Zap, Globe, Download } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import LanguageSwitcher from "@/components/language-switcher";
import Footer from "@/components/footer";

export default function LandingPage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
      {/* Nav */}
      <nav className="border-b border-zinc-100 dark:border-zinc-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="TranCut" width={26} height={26} className="rounded-md" />
          <span className="font-bold tracking-tight">TranCut</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="text-sm px-3 py-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            {t.nav.login}
          </Link>
          <Link
            href="/signup"
            className="hidden sm:inline-flex text-sm px-3 py-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors whitespace-nowrap"
          >
            {t.nav.getStarted}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="px-5 py-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full mb-3">
            <Zap size={12} />
            {t.hero.badge}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2 leading-tight">
            {t.hero.title1}
            <br />
            <span className="text-blue-600">{t.hero.title2}</span>
          </h1>

          <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="flex gap-2 justify-center flex-wrap">
            <Link
              href="/signup"
              className="px-5 py-2.5 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
            >
              {t.hero.ctaPrimary}
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>

          <p className="text-xs text-zinc-400 mt-3">{t.hero.freeNote}</p>
        </div>
      </main>

      {/* Features */}
      <section className="border-t border-zinc-100 dark:border-zinc-800 px-5 py-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <Feature icon={<Subtitles size={20} />} {...t.features.items[0]} />
          <Feature icon={<Globe size={20} />} {...t.features.items[1]} />
          <Feature icon={<Download size={20} />} {...t.features.items[2]} />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-zinc-100 dark:border-zinc-800 px-5 py-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
            {t.pricing.title}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{t.pricing.subtitle}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
            <PricingCard
              tier="Free"
              price="$0"
              features={["2 min / video", "5 videos / month", "All output formats"]}
              cta={{ label: "Get started", href: "/signup" }}
            />
            <PricingCard
              tier="Basic"
              price="$4.99 / mo"
              features={["10 min / video", "30 videos / month", "All output formats", "Add-on credits available"]}
              cta={{ label: "Subscribe", href: "/billing/checkout?plan=basic" }}
            />
            <PricingCard
              tier="Pro"
              price="$9.99 / mo"
              features={["20 min / video", "Unlimited videos", "All output formats", "Priority processing"]}
              cta={{ label: "Subscribe", href: "/billing/checkout?plan=pro" }}
              highlight
            />
          </div>
          <p className="text-xs text-zinc-400 mt-4">
            Need more? Buy 10 extra videos for $2.99 anytime — no plan change needed.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 md:flex-col md:gap-3">
      <div className="w-9 h-9 shrink-0 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function PricingCard({
  tier,
  price,
  features,
  cta,
  highlight = false,
}: {
  tier: string;
  price: string;
  features: string[];
  cta: { label: string; href: string };
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 border flex flex-col ${
        highlight
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
          : "border-zinc-200 dark:border-zinc-700"
      }`}
    >
      <div className="flex items-baseline justify-between mb-2">
        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{tier}</div>
        <div className="font-bold text-zinc-900 dark:text-white">{price}</div>
      </div>
      <ul className="space-y-1.5 flex-1 mb-4">
        {features.map((f) => (
          <li key={f} className="text-xs text-zinc-600 dark:text-zinc-400 flex gap-2">
            <span className="text-green-500">✓</span> {f}
          </li>
        ))}
      </ul>
      <Link
        href={cta.href}
        className={`text-center text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
          highlight
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90"
        }`}
      >
        {cta.label}
      </Link>
    </div>
  );
}
