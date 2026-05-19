import { createServerSupabase } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { MatchResult } from "@/lib/types";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  FileText,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();

  // Fetch stats
  const today = new Date().toISOString().split("T")[0];

  const [{ count: todayCount }, { count: totalCount }, { data: matches }] =
    await Promise.all([
      supabase
        .from("ausschreibungen")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today),
      supabase
        .from("ausschreibungen")
        .select("*", { count: "exact", head: true })
        .gte("abgabefrist", today),
      supabase
        .rpc("match_ausschreibungen", {})
        .then((res) => ({
          data: (res.data as MatchResult[] | null)?.slice(0, 5) ?? [],
        }))
        .then(null, () => ({ data: [] as MatchResult[] })),
    ]);

  // Count expiring soon (next 3 days)
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  const { count: expiringCount } = await supabase
    .from("ausschreibungen")
    .select("*", { count: "exact", head: true })
    .gte("abgabefrist", today)
    .lte("abgabefrist", threeDaysFromNow.toISOString().split("T")[0]);

  const stats = [
    {
      label: "Neue heute",
      value: todayCount ?? 0,
      icon: FileText,
      color: "text-[#3B82F6]",
      bg: "bg-blue-50",
    },
    {
      label: "Aktive gesamt",
      value: totalCount ?? 0,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "Frist in 3 Tagen",
      value: expiringCount ?? 0,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#1E293B]">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Willkommen zurück. Hier ist Ihr Überblick.
          </p>
        </div>
        <Link
          href="/ausschreibungen"
          className="inline-flex items-center gap-1.5 text-sm text-[#3B82F6] hover:text-[#2563EB] font-medium transition-colors duration-200 cursor-pointer"
        >
          Alle Ausschreibungen
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-100/80 rounded-2xl p-6 hover:shadow-sm transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-3xl font-heading font-bold text-[#1E293B]">
              {stat.value}
            </p>
            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Latest matches */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-[#1E293B]">
          Neueste Treffer
        </h2>
        {matches.length > 0 && (
          <Link
            href="/ausschreibungen"
            className="text-sm text-gray-400 hover:text-[#1E293B] transition-colors duration-200 cursor-pointer"
          >
            Alle anzeigen
          </Link>
        )}
      </div>
      {matches.length === 0 ? (
        <div className="bg-white border border-gray-100/80 rounded-2xl p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-gray-500 mb-1">Noch keine Treffer.</p>
          <p className="text-sm text-gray-400">
            Konfigurieren Sie Ihre Suchkriterien in den{" "}
            <Link
              href="/einstellungen"
              className="text-[#3B82F6] hover:underline cursor-pointer"
            >
              Einstellungen
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100/80 rounded-2xl divide-y divide-gray-50 overflow-hidden">
          {matches.map((match) => (
            <Link key={match.id} href={`/ausschreibungen/${match.id}`}>
              <div className="px-6 py-4 hover:bg-gray-50/50 transition-colors duration-200 cursor-pointer flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[#1E293B] truncate text-sm">
                    {match.titel}
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {match.auftraggeber_name}
                    {match.auftraggeber_ort
                      ? ` — ${match.auftraggeber_ort}`
                      : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant="secondary"
                    className="rounded-full text-xs bg-blue-50 text-[#3B82F6] border-0 font-medium"
                  >
                    {Math.round(match.relevanz_score * 100)}%
                  </Badge>
                  {match.abgabefrist && (
                    <Badge
                      variant="outline"
                      className="rounded-full text-xs text-gray-400 border-gray-200"
                    >
                      {format(new Date(match.abgabefrist), "dd.MM.yyyy", {
                        locale: de,
                      })}
                    </Badge>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
