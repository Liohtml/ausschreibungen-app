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
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-gray-100/80 flex flex-col shrink-0">
        <div className="px-6 h-16 flex items-center border-b border-gray-100/80">
          <Link
            href="/dashboard"
            className="text-lg font-heading font-semibold text-[#1E293B] tracking-tight"
          >
            ausschreibungen
            <span className="text-[#3B82F6]">.de</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 pt-4 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-[#1E293B] hover:bg-gray-50 transition-all duration-200 cursor-pointer"
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-100/80 mx-2">
          <p className="text-xs text-gray-400 truncate mb-3 px-1">
            {user.email}
          </p>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 lg:p-10 overflow-auto">
        <div className="max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
