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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Search, Loader2, ChevronRight, SlidersHorizontal } from "lucide-react";

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
  const [bundesland, setBundesland] = useState<string>("");
  const [auftragsart, setAuftragsart] = useState<string>("");
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = createBrowserSupabase();

    let query = supabase
      .from("ausschreibungen")
      .select("*", { count: "exact" });

    if (search.trim()) {
      query = query.textSearch("titel", search.trim(), {
        type: "websearch",
        config: "german",
      });
    }

    if (bundesland) {
      query = query.eq("auftraggeber_bundesland", bundesland);
    }

    if (auftragsart) {
      query = query.eq("auftragsart", auftragsart);
    }

    query = query
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    const { data, count } = await query;
    setResults((data as Ausschreibung[]) ?? []);
    setTotalCount(count ?? 0);
    setLoading(false);
  }, [search, bundesland, auftragsart, page]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timeout);
  }, [fetchData]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-[#1E293B]">
          Ausschreibungen
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Durchsuchen Sie alle verfügbaren Ausschreibungen.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100/80 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-500">Filter</span>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative md:max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <Input
              placeholder="Suche nach Titel..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="pl-10 border-gray-200 rounded-xl focus:border-[#3B82F6] focus:ring-0 bg-gray-50/50"
            />
          </div>
          <Select
            value={bundesland}
            onValueChange={(val) => {
              setBundesland(!val || val === "all" ? "" : val);
              setPage(0);
            }}
          >
            <SelectTrigger className="md:w-52 border-gray-200 rounded-xl bg-gray-50/50">
              <SelectValue placeholder="Bundesland" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Bundesländer</SelectItem>
              {BUNDESLAENDER.map((bl) => (
                <SelectItem key={bl} value={bl}>
                  {bl}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={auftragsart}
            onValueChange={(val) => {
              setAuftragsart(!val || val === "all" ? "" : val);
              setPage(0);
            }}
          >
            <SelectTrigger className="md:w-52 border-gray-200 rounded-xl bg-gray-50/50">
              <SelectValue placeholder="Auftragsart" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Auftragsarten</SelectItem>
              {AUFTRAGSARTEN.map((art) => (
                <SelectItem key={art} value={art}>
                  {art}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-400 mb-4">
        {totalCount} Ergebnis{totalCount !== 1 ? "se" : ""} gefunden
      </p>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Laden...
        </div>
      ) : results.length === 0 ? (
        <div className="bg-white border border-gray-100/80 rounded-2xl p-10 text-center">
          <Search className="w-10 h-10 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">Keine Ausschreibungen gefunden.</p>
          <p className="text-sm text-gray-400 mt-1">
            Versuchen Sie andere Suchbegriffe oder Filter.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100/80 rounded-2xl divide-y divide-gray-50 overflow-hidden">
          {results.map((item) => (
            <div
              key={item.id}
              className="px-6 py-4 hover:bg-gray-50/50 transition-colors duration-200 cursor-pointer flex items-center gap-4"
              onClick={() => router.push(`/ausschreibungen/${item.id}`)}
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[#1E293B] text-sm">
                  {item.titel}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {item.auftraggeber_name}
                  {item.auftraggeber_ort
                    ? ` — ${item.auftraggeber_ort}`
                    : ""}
                  {item.auftraggeber_bundesland
                    ? ` (${item.auftraggeber_bundesland})`
                    : ""}
                </p>
                {item.cpv_codes && item.cpv_codes.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {item.cpv_codes.slice(0, 3).map((cpv) => (
                      <Badge
                        key={cpv}
                        variant="secondary"
                        className="rounded-full text-xs bg-gray-50 text-gray-500 border-0"
                      >
                        {cpv}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <div className="text-right">
                  {item.abgabefrist && (
                    <Badge
                      variant={
                        new Date(item.abgabefrist) < new Date()
                          ? "destructive"
                          : "outline"
                      }
                      className="rounded-full text-xs border-gray-200"
                    >
                      {format(new Date(item.abgabefrist), "dd.MM.yyyy", {
                        locale: de,
                      })}
                    </Badge>
                  )}
                  {item.auftragsart && (
                    <p className="text-xs text-gray-400 mt-1.5">
                      {item.auftragsart}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="text-sm rounded-xl border-gray-200 cursor-pointer transition-colors duration-200"
          >
            Zurück
          </Button>
          <span className="text-sm text-gray-400">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="text-sm rounded-xl border-gray-200 cursor-pointer transition-colors duration-200"
          >
            Weiter
          </Button>
        </div>
      )}
    </div>
  );
}
