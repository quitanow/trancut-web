import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/footer";

export const metadata = {
  title: "Support — TranCut",
  description: "Get help with TranCut",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <nav className="border-b border-zinc-100 dark:border-zinc-800 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="TranCut" width={28} height={28} className="rounded-md" />
          <span className="font-bold tracking-tight">TranCut</span>
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Support</h1>
        <p className="text-sm text-zinc-500 mb-10">We&apos;re here to help. Find answers below or reach out directly.</p>

        <div className="space-y-8">
          <FAQ
            q="How do I get started?"
            a="Sign up for a free account, then go to Upload and drag in your video. Select your source and target languages and we'll handle the rest."
          />
          <FAQ
            q="What video formats are supported?"
            a="We accept MP4, MOV, and M4V files. The free plan supports videos up to 2 minutes. Basic supports up to 10 minutes, and Pro up to 20 minutes."
          />
          <FAQ
            q="What languages are supported?"
            a="TranCut supports transcription and translation in 57 languages, including English, Spanish, French, German, Japanese, Korean, Chinese (Simplified & Traditional), Arabic, Hindi, and more."
          />
          <FAQ
            q="How long does processing take?"
            a="Most videos are ready in 1–3 minutes depending on length. Pro plan jobs are prioritized."
          />
          <FAQ
            q="What output formats do I get?"
            a="You can download an SRT subtitle file, a video with burned-in subtitles, or an AI-dubbed MP4."
          />
          <FAQ
            q="How do I delete my account?"
            a="Open the Account page inside the app and use the Delete account option. If you need help, contact support and we can assist."
          />
          <FAQ
            q="My video failed to process. What should I do?"
            a="Try re-uploading. If the issue persists, email us with the job ID (visible on the History page) and we'll investigate."
          />
        </div>

        <div className="mt-12 p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold text-zinc-900 dark:text-white mb-1">Still need help?</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Send us an email and we'll get back to you within 24 hours.</p>
          <a
            href="mailto:support@trancut.com"
            className="inline-block text-sm font-medium px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
          >
            Email support@trancut.com
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <h3 className="font-medium text-zinc-900 dark:text-white mb-1">{q}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{a}</p>
    </div>
  );
}
