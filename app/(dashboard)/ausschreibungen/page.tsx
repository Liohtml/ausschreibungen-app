"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { Ausschreibung } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Search, Loader2, ChevronRight } from "lucide-react";

const BUNDESLAENDER = [
  "Baden-Württemberg",
  "Bayern",
  "Berlin",
  "Brandenburg",
  "Bremen",
  "Hamburg",
  "Hessen",
  "Mecklenburg-Vorpommern",
  "Niedersachsen",
  "Nordrhein-Westfalen",
  "Rheinland-Pfalz",
  "Saarland",
  "Sachsen",
  "Sachsen-Anhalt",
  "Schleswig-Holstein",
  "Thüringen",
];

const AUFTRAGSARTEN = [
  "Bauauftrag",
  "Lieferauftrag",
  "Dienstleistungsauftrag",
];

const PAGE_SIZE = 20;

export default function AusschreibungenPage() {
  const router = useRouter();
  const [results, setResults] = useState<Ausschreibung[]>([]);
  const [search, setSearch] = useState("");
  const [bundesland, setBundesland] = useState<string>("all");
  const [auftragsart, setAuftragsart] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createBrowserSupabase();

    let query = supabase
      .from("ausschreibungen")
      .select("*", { count: "exact" });

    if (search.trim()) {
      // ilike works on a plain text column; escape LIKE wildcards so the
      // user's input is matched literally.
      const term = search.trim().replace(/[\\%_]/g, "\\$&");
      query = query.ilike("titel", `%${term}%`);
    }
    if (bundesland !== "all") query = query.eq("auftraggeber_bundesland", bundesland);
    if (auftragsart !== "all") query = query.eq("auftragsart", auftragsart);

    query = query
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    const { data, count, error } = await query;

    if (error) {
      console.error(error);
      setError("Die Ausschreibungen konnten nicht geladen werden. Bitte versuche es erneut.");
      setResults([]);
      setTotalCount(0);
      setLoading(false);
      return;
    }

    setResults((data as Ausschreibung[]) ?? []);
    setTotalCount(count ?? 0);
    setLoading(false);
  }, [search, bundesland, auftragsart, page]);

  useEffect(() => {
    const timeout = setTimeout(fetchData, 300);
    return () => clearTimeout(timeout);
  }, [fetchData]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-black text-zinc-950 tracking-tight leading-none">
          Ausschreibungen
        </h1>
        <p className="text-[13px] text-zinc-400 mt-1.5">
          Alle verfügbaren Ausschreibungen durchsuchen.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-2 mb-5">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <Input
            placeholder="Titel suchen..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-9 h-9 text-[13px] border-zinc-200 bg-white rounded-md focus-visible:ring-zinc-900 focus-visible:ring-1 focus-visible:border-zinc-900"
          />
        </div>
        <Select
          value={bundesland}
          onValueChange={(val) => { setBundesland(val ?? "all"); setPage(0); }}
        >
          <SelectTrigger className="md:w-48 h-9 text-[13px] border-zinc-200 bg-white rounded-md">
            <SelectValue placeholder="Bundesland" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Bundesländer</SelectItem>
            {BUNDESLAENDER.map((bl) => (
              <SelectItem key={bl} value={bl}>{bl}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={auftragsart}
          onValueChange={(val) => { setAuftragsart(val ?? "all"); setPage(0); }}
        >
          <SelectTrigger className="md:w-48 h-9 text-[13px] border-zinc-200 bg-white rounded-md">
            <SelectValue placeholder="Auftragsart" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Auftragsarten</SelectItem>
            {AUFTRAGSARTEN.map((art) => (
              <SelectItem key={art} value={art}>{art}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Count */}
      {!error && (
        <p className="text-[11px] font-mono text-zinc-400 mb-3">
          {totalCount} Ergebnis{totalCount !== 1 ? "se" : ""}
        </p>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-400">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          <span className="text-[13px]">Laden...</span>
        </div>
      ) : error ? (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-2.5 text-[13px]">
          {error}
        </div>
      ) : results.length === 0 ? (
        <div className="border border-zinc-200 rounded-lg p-10 text-center bg-white">
          <p className="text-[13px] text-zinc-500">Keine Ausschreibungen gefunden.</p>
          <p className="text-[12px] text-zinc-400 mt-1">
            Andere Suchbegriffe oder Filter probieren.
          </p>
        </div>
      ) : (
        <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
          {/* Head */}
          <div className="grid grid-cols-[1fr_180px_100px] gap-4 px-6 py-2.5 border-b border-zinc-100 bg-zinc-50/80">
            <span className="text-[9px] font-mono font-medium uppercase tracking-[0.14em] text-zinc-400">Titel</span>
            <span className="text-[9px] font-mono font-medium uppercase tracking-[0.14em] text-zinc-400">Auftraggeber</span>
            <span className="text-[9px] font-mono font-medium uppercase tracking-[0.14em] text-zinc-400 text-right">Abgabe</span>
          </div>
          {results.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_180px_100px] gap-4 px-6 py-3.5 border-b border-zinc-50 hover:bg-zinc-50/80 transition-colors duration-100 cursor-pointer items-center"
              onClick={() => router.push(`/ausschreibungen/${item.id}`)}
            >
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-zinc-900 truncate tracking-tight">
                  {item.titel}
                </p>
                {item.auftraggeber_bundesland && (
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {item.auftraggeber_bundesland}
                    {item.auftragsart ? ` · ${item.auftragsart}` : ""}
                  </p>
                )}
              </div>
              <p className="text-[12px] text-zinc-500 truncate">
                {item.auftraggeber_name ?? "-"}
              </p>
              <div className="flex items-center justify-end gap-2">
                {item.abgabefrist ? (
                  <span className={`text-[11px] font-mono ${new Date(item.abgabefrist) < new Date() ? "text-red-500" : "text-zinc-400"}`}>
                    {format(new Date(item.abgabefrist), "dd.MM.yyyy", { locale: de })}
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-zinc-300">-</span>
                )}
                <ChevronRight className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="text-[12px] font-medium text-zinc-500 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 px-3 py-1.5 border border-zinc-200 rounded-md bg-white"
          >
            Zurück
          </button>
          <span className="text-[12px] font-mono text-zinc-400">
            {page + 1} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="text-[12px] font-medium text-zinc-500 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 px-3 py-1.5 border border-zinc-200 rounded-md bg-white"
          >
            Weiter
          </button>
        </div>
      )}
    </div>
  );
}
