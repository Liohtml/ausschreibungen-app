"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Bookmark,
  Settings,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/logout-button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ausschreibungen", label: "Ausschreibungen", icon: Search },
  { href: "/merkliste", label: "Merkliste", icon: Bookmark },
  { href: "/einstellungen", label: "Einstellungen", icon: Settings },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors duration-150",
              active
                ? "bg-zinc-100 text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
            )}
          >
            <item.icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function SidebarNav({ userEmail }: { userEmail?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[220px] bg-white border-r border-zinc-200 flex-col shrink-0">
        <div className="px-5 h-[60px] flex items-center border-b border-zinc-200">
          <Link
            href="/dashboard"
            className="text-sm font-bold text-zinc-900 tracking-tight"
          >
            Ausschreibungen.de
          </Link>
        </div>

        <nav className="flex-1 px-3 pt-3 space-y-0.5">
          <NavLinks />
        </nav>

        <div className="px-3 py-4 border-t border-zinc-100">
          <p className="text-[11px] font-mono text-zinc-400 truncate px-3 mb-2">
            {userEmail}
          </p>
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 h-[60px] flex items-center justify-between bg-white border-b border-zinc-200 px-5">
        <Link
          href="/dashboard"
          className="text-sm font-bold text-zinc-900 tracking-tight"
        >
          Ausschreibungen.de
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Menü öffnen"
            className="inline-flex items-center justify-center rounded-md p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors duration-150"
          >
            <Menu className="w-5 h-5" strokeWidth={1.75} />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-[260px] bg-white p-0 flex flex-col"
          >
            <SheetTitle className="px-5 h-[60px] flex items-center border-b border-zinc-200 text-sm font-bold text-zinc-900 tracking-tight">
              Ausschreibungen.de
            </SheetTitle>

            <nav className="flex-1 px-3 pt-3 space-y-0.5">
              <NavLinks onNavigate={() => setOpen(false)} />
            </nav>

            <div className="px-3 py-4 border-t border-zinc-100">
              <p className="text-[11px] font-mono text-zinc-400 truncate px-3 mb-2">
                {userEmail}
              </p>
              <LogoutButton />
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
