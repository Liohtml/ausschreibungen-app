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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="px-6 py-6">
          <Link
            href="/dashboard"
            className="text-lg font-semibold text-[#1E293B]"
          >
            Ausschreibungen.de
          </Link>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-[#1E293B] hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 truncate mb-3">{user.email}</p>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-[#F8FAFC]/50 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
