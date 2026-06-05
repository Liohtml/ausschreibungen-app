import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { SidebarNav } from "@/components/sidebar-nav";
import { SubscriptionBanner } from "@/components/subscription-banner";
import { getSubscriptionInfo } from "@/lib/subscription";

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

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("abo_status, abo_gueltig_bis")
    .eq("id", user.id)
    .maybeSingle();

  const { state, daysLeft } = getSubscriptionInfo(profile);

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-zinc-50">
      {/* Sidebar (desktop) + top bar (mobile) */}
      <SidebarNav userEmail={user.email} />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Soft subscription nudge — informational only, never blocks access */}
        <SubscriptionBanner state={state} daysLeft={daysLeft} />
        <div className="max-w-5xl mx-auto px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
