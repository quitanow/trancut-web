import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 dark:border-zinc-800 px-6 py-5 text-center text-xs text-zinc-400 flex justify-center gap-4">
      <span>© {new Date().getFullYear()} TranCut</span>
      <Link href="/privacy" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Privacy Policy</Link>
      <Link href="/support" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Support</Link>
    </footer>
  );
}
