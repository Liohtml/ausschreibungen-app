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
import { Search, Loader2 } from "lucide-react";

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
      <h1 className="text-2xl font-bold text-[#1E293B] mb-8">
        Ausschreibungen
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative md:max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Suche nach Titel..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="pl-10 border-gray-200 rounded-lg focus:border-[#3B82F6] focus:ring-0"
          />
        </div>
        <Select
          value={bundesland}
          onValueChange={(val) => {
            setBundesland(!val || val === "all" ? "" : val);
            setPage(0);
          }}
        >
          <SelectTrigger className="md:w-52 border-gray-200 rounded-lg">
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
          <SelectTrigger className="md:w-52 border-gray-200 rounded-lg">
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

      {/* Results count */}
      <p className="text-sm text-gray-400 mb-4">
        {totalCount} Ergebnis{totalCount !== 1 ? "se" : ""} gefunden
      </p>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Laden...
        </div>
      ) : results.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-gray-500">
          Keine Ausschreibungen gefunden.
        </div>
      ) : (
        <div className="space-y-2">
          {results.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-xl px-5 py-4 hover:border-blue-200 transition-colors duration-150 cursor-pointer"
              onClick={() => router.push(`/ausschreibungen/${item.id}`)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[#1E293B]">{item.titel}</p>
                  <p className="text-sm text-gray-500 mt-1">
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
                          className="rounded-full text-xs bg-gray-100 text-gray-600 border-0"
                        >
                          {cpv}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  {item.abgabefrist && (
                    <Badge
                      variant={
                        new Date(item.abgabefrist) < new Date()
                          ? "destructive"
                          : "outline"
                      }
                      className="rounded-full text-xs"
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="ghost"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="text-sm text-gray-500 hover:text-[#1E293B] cursor-pointer transition-colors duration-150"
          >
            Zurück
          </Button>
          <span className="text-sm text-gray-400">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="text-sm text-gray-500 hover:text-[#1E293B] cursor-pointer transition-colors duration-150"
          >
            Weiter
          </Button>
        </div>
      )}
    </div>
  );
}
