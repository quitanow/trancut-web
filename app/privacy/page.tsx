import Link from "next/link";
import Footer from "@/components/footer";

export const metadata = {
  title: "Privacy Policy — TranCut",
  description: "TranCut privacy policy",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <nav className="border-b border-zinc-100 dark:border-zinc-800 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold tracking-tight">TranCut</Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12 prose dark:prose-invert">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-zinc-500 mb-8">Last updated: April 4, 2026</p>

        <Section title="1. What We Collect">
          <p>When you use TranCut, we collect:</p>
          <ul>
            <li><strong>Account information</strong> — your email address when you sign up.</li>
            <li><strong>Video files</strong> — videos you upload for transcription and translation. Files are processed and then deleted from our servers within 24 hours.</li>
            <li><strong>Usage data</strong> — job history (file name, duration, status) associated with your account.</li>
            <li><strong>Payment information</strong> — handled entirely by Stripe. We never store your card details.</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Data">
          <ul>
            <li>To provide transcription, translation, and dubbing services.</li>
            <li>To manage your subscription and billing through Stripe.</li>
            <li>To send transactional emails (e.g., account confirmation). We do not send marketing email without consent.</li>
          </ul>
        </Section>

        <Section title="3. Data Sharing">
          <p>We do not sell your personal data. We share data only with:</p>
          <ul>
            <li><strong>Stripe</strong> — payment processing.</li>
            <li><strong>OpenAI / Whisper</strong> — audio is sent for transcription and is not retained by our AI providers beyond the API call.</li>
            <li><strong>Supabase</strong> — secure database and authentication hosting.</li>
          </ul>
        </Section>

        <Section title="4. Data Retention">
          <p>Uploaded video files are automatically deleted within 24 hours of processing. Account data is retained as long as your account is active. You may request deletion at any time by contacting us.</p>
        </Section>

        <Section title="5. Security">
          <p>All data is transmitted over HTTPS. We use industry-standard practices to protect your information.</p>
        </Section>

        <Section title="6. Your Rights">
          <p>You may request access to, correction of, or deletion of your personal data at any time by emailing <a href="mailto:support@trancut.com" className="text-blue-600">support@trancut.com</a>.</p>
        </Section>

        <Section title="7. Children">
          <p>TranCut is not directed at children under 13. We do not knowingly collect data from minors.</p>
        </Section>

        <Section title="8. Changes">
          <p>We may update this policy. Material changes will be communicated via the app or email. Continued use after changes constitutes acceptance.</p>
        </Section>

        <Section title="9. Contact">
          <p>Questions? Email us at <a href="mailto:support@trancut.com" className="text-blue-600">support@trancut.com</a>.</p>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">{title}</h2>
      <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2 leading-relaxed">{children}</div>
    </div>
  );
}
