import Nav from "@/components/nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <Nav />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
