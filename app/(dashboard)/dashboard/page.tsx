import { createServerSupabase } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { MatchResult } from "@/lib/types";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { FileText, Clock, TrendingUp } from "lucide-react";

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
      label: "NEUE HEUTE",
      value: todayCount ?? 0,
      icon: FileText,
    },
    {
      label: "AKTIVE GESAMT",
      value: totalCount ?? 0,
      icon: TrendingUp,
    },
    {
      label: "FRIST IN 3 TAGEN",
      value: expiringCount ?? 0,
      icon: Clock,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1E293B] mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-100 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <stat.icon className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
            <p className="text-3xl font-semibold text-[#1E293B]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Latest matches */}
      <h2 className="text-lg font-semibold text-[#1E293B] mb-4">
        Neueste Treffer
      </h2>
      {matches.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-gray-500">
          Noch keine Treffer. Konfigurieren Sie Ihre Suchkriterien in den{" "}
          <Link
            href="/einstellungen"
            className="text-[#3B82F6] hover:underline cursor-pointer"
          >
            Einstellungen
          </Link>
          .
        </div>
      ) : (
        <div className="space-y-2">
          {matches.map((match) => (
            <Link key={match.id} href={`/ausschreibungen/${match.id}`}>
              <div className="bg-white border border-gray-100 rounded-xl px-5 py-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-[#1E293B] truncate">
                      {match.titel}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {match.auftraggeber_name}
                      {match.auftraggeber_ort
                        ? ` — ${match.auftraggeber_ort}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="secondary"
                      className="rounded-full text-xs bg-[#3B82F6]/10 text-[#3B82F6] border-0"
                    >
                      {Math.round(match.relevanz_score * 100)}%
                    </Badge>
                    {match.abgabefrist && (
                      <Badge
                        variant="outline"
                        className="rounded-full text-xs"
                      >
                        {format(new Date(match.abgabefrist), "dd.MM.yyyy", {
                          locale: de,
                        })}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
