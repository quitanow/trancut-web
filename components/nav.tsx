"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { getMe, createPortalSession, type Me } from "@/lib/api";
import { useLocale } from "@/components/locale-provider";
import LanguageSwitcher from "@/components/language-switcher";
import { isNativeApp } from "@/lib/platform";
import { LogOut } from "lucide-react";

const TIER_LABELS: Record<string, string> = { free: "Free", basic: "Basic", pro: "Pro" };
const TIER_COLORS: Record<string, string> = {
  free: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500",
  basic: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
  pro: "bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400",
};

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLocale();
  const [me, setMe] = useState<Me | null>(null);
  const [native, setNative] = useState(false);

  useEffect(() => {
    setNative(isNativeApp());

    (async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      try { setMe(await getMe(session.access_token)); } catch { /* ignore */ }
    })();
  }, []);

  const links = [
    { href: "/upload", label: t.nav.upload },
    { href: "/jobs", label: t.nav.history },
    ...(native ? [] : [{ href: "/pricing", label: "Pricing" }]),
    { href: "/account", label: "Account" },
  ];

  async function handleManageBilling() {
    if (native) {
      router.push("/account");
      return;
    }

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    if (me?.has_billing) {
      const { url } = await createPortalSession(session.access_token);
      window.location.href = url;
    } else {
      router.push("/#pricing");
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <nav className="border-b border-zinc-100 dark:border-zinc-800 px-3 py-3 flex justify-center items-center gap-1">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`text-sm px-2.5 py-1.5 rounded-lg transition-colors ${
            pathname === href
              ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          {label}
        </Link>
      ))}
      <span className="text-zinc-200 dark:text-zinc-700 px-1">·</span>
      {me && (
        <button
          onClick={handleManageBilling}
          className={`text-xs font-medium px-2 py-1 rounded-full transition-colors ${TIER_COLORS[me.tier] ?? TIER_COLORS.free}`}
          title={native ? "Account settings" : me.has_billing ? "Manage billing" : "Upgrade to Basic or Pro"}
        >
          {TIER_LABELS[me.tier] ?? me.tier}
        </button>
      )}
      <LanguageSwitcher />
      <button
        onClick={handleSignOut}
        className="text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
      >
        {t.nav.signOut}
      </button>
    </nav>
  );
}
