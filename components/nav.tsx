"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useLocale } from "@/components/locale-provider";
import { Upload, Clock, LogOut } from "lucide-react";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLocale();

  const links = [
    { href: "/upload", label: t.nav.upload, icon: Upload },
    { href: "/jobs", label: t.nav.history, icon: Clock },
  ];

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
      <button
        onClick={handleSignOut}
        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
      >
        <LogOut size={14} />
        {t.nav.signOut}
      </button>
    </nav>
  );
}
