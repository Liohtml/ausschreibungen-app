import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { SidebarNav } from "@/components/sidebar-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-zinc-50">
      {/* Sidebar (desktop) + top bar (mobile) */}
      <SidebarNav userEmail={user.email} />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
