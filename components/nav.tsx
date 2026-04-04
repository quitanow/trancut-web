"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { getMe, createPortalSession, type Me } from "@/lib/api";
import { useLocale } from "@/components/locale-provider";
import { Upload, Clock, LogOut, CreditCard, Sparkles } from "lucide-react";

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

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      try { setMe(await getMe(session.access_token)); } catch { /* ignore */ }
    })();
  }, []);

  const links = [
    { href: "/upload", label: t.nav.upload, icon: Upload },
    { href: "/jobs", label: t.nav.history, icon: Clock },
    { href: "/pricing", label: "Pricing", icon: Sparkles },
  ];

  async function handleManageBilling() {
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
    <nav className="border-b border-zinc-100 dark:border-zinc-800 px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <Link href="/upload" className="font-bold tracking-tight">
          TranCut
        </Link>
        <div className="flex gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
                pathname === href
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {me && (
          <>
            {!me.has_billing && (
              <Link
                href="/pricing"
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Upgrade
              </Link>
            )}
            <button
              onClick={handleManageBilling}
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${TIER_COLORS[me.tier] ?? TIER_COLORS.free}`}
              title={me.has_billing ? "Manage billing" : "Upgrade to Basic or Pro"}
            >
              <CreditCard size={11} />
              {TIER_LABELS[me.tier] ?? me.tier}
              {!me.has_billing && <span className="opacity-70">· Upgrade ↑</span>}
            </button>
          </>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
        >
          <LogOut size={14} />
          {t.nav.signOut}
        </button>
      </div>
    </nav>
  );
}
