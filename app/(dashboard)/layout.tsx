import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import {
  LayoutDashboard,
  Search,
  Bookmark,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ausschreibungen", label: "Ausschreibungen", icon: Search },
  { href: "/merkliste", label: "Merkliste", icon: Bookmark },
  { href: "/einstellungen", label: "Einstellungen", icon: Settings },
];

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
    <div className="flex min-h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-[220px] bg-white border-r border-zinc-200 flex flex-col shrink-0">
        <div className="px-5 h-[60px] flex items-center border-b border-zinc-200">
          <Link
            href="/dashboard"
            className="text-sm font-bold text-zinc-900 tracking-tight"
          >
            Ausschreibungen.de
          </Link>
        </div>

        <nav className="flex-1 px-3 pt-3 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors duration-150"
            >
              <item.icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-zinc-100">
          <p className="text-[11px] font-mono text-zinc-400 truncate px-3 mb-2">
            {user.email}
          </p>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
