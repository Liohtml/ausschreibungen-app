import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import type { MatchResult } from "@/lib/types";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { ArrowUpRight } from "lucide-react";

function ScorePill({ score }: { score: number }) {
  if (score >= 85)
    return (
      <span className="inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
        {score}%
      </span>
    );
  if (score >= 70)
    return (
      <span className="inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
        {score}%
      </span>
    );
  return (
    <span className="inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 border border-zinc-200">
      {score}%
    </span>
  );
}

export default async function DashboardPage() {
  const supabase = await createServerSupabase();

  const today = new Date().toISOString().split("T")[0];
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  const [{ count: todayCount }, { count: totalCount }, { data: matches }, { count: expiringCount }] =
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
          data: (res.data as MatchResult[] | null)?.slice(0, 8) ?? [],
        }))
        .then(null, () => ({ data: [] as MatchResult[] })),
      supabase
        .from("ausschreibungen")
        .select("*", { count: "exact", head: true })
        .gte("abgabefrist", today)
        .lte("abgabefrist", threeDaysFromNow.toISOString().split("T")[0]),
    ]);

  const stats = [
    { label: "Neue heute", value: todayCount ?? 0 },
    { label: "Aktive gesamt", value: totalCount ?? 0 },
    { label: "Frist in 3 Tagen", value: expiringCount ?? 0 },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-black text-zinc-950 tracking-tight leading-none">
            Dashboard
          </h1>
          <p className="text-[13px] text-zinc-400 mt-1.5">
            Willkommen zurück. Ihr aktueller Überblick.
          </p>
        </div>
        <Link
          href="/ausschreibungen"
          className="inline-flex items-center gap-1 text-[13px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors duration-150"
        >
          Alle Ausschreibungen
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 rounded-lg overflow-hidden mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white px-6 py-5">
            <div className="text-[32px] font-black text-zinc-950 tracking-tighter leading-none">
              {stat.value}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-zinc-400 mt-2">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Matches */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[13px] font-semibold text-zinc-900 tracking-tight">
          Neueste Treffer
        </h2>
        {matches.length > 0 && (
          <Link
            href="/ausschreibungen"
            className="text-[12px] text-zinc-400 hover:text-zinc-700 transition-colors duration-150"
          >
            Alle anzeigen
          </Link>
        )}
      </div>

      {matches.length === 0 ? (
        <div className="border border-zinc-200 rounded-lg p-10 text-center bg-white">
          <p className="text-[13px] text-zinc-500">Noch keine Treffer.</p>
          <p className="text-[12px] text-zinc-400 mt-1">
            Konfigurieren Sie Ihre Suchkriterien in den{" "}
            <Link
              href="/einstellungen"
              className="text-zinc-700 hover:text-zinc-900 underline underline-offset-2"
            >
              Einstellungen
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
          {/* Table head */}
          <div className="grid grid-cols-[1fr_160px_96px_72px] gap-4 px-6 py-2.5 border-b border-zinc-100 bg-zinc-50/80">
            <span className="text-[9px] font-mono font-medium uppercase tracking-[0.14em] text-zinc-400">
              Titel
            </span>
            <span className="text-[9px] font-mono font-medium uppercase tracking-[0.14em] text-zinc-400">
              Auftraggeber
            </span>
            <span className="text-[9px] font-mono font-medium uppercase tracking-[0.14em] text-zinc-400">
              Abgabe
            </span>
            <span className="text-[9px] font-mono font-medium uppercase tracking-[0.14em] text-zinc-400 text-right">
              Score
            </span>
          </div>
          {/* Rows */}
          {matches.map((match) => (
            <Link key={match.id} href={`/ausschreibungen/${match.id}`}>
              <div className="grid grid-cols-[1fr_160px_96px_72px] gap-4 px-6 py-3.5 border-b border-zinc-50 hover:bg-zinc-50/80 transition-colors duration-100 items-center">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-zinc-900 truncate tracking-tight">
                    {match.titel}
                  </p>
                  {match.auftraggeber_ort && (
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {match.auftraggeber_ort}
                    </p>
                  )}
                </div>
                <p className="text-[12px] text-zinc-500 truncate">
                  {match.auftraggeber_name ?? "-"}
                </p>
                <p className="text-[11px] font-mono text-zinc-400">
                  {match.abgabefrist
                    ? format(new Date(match.abgabefrist), "dd.MM.yyyy", {
                        locale: de,
                      })
                    : "-"}
                </p>
                <div className="flex justify-end">
                  <ScorePill score={Math.round(match.relevanz_score * 100)} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
