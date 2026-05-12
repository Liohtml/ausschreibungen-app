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
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { de } from "date-fns/locale";

const BUNDESLAENDER = [
  "Baden-Wuerttemberg",
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
  "Thueringen",
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Ausschreibungen
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <Input
          placeholder="Suche nach Titel..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="md:max-w-sm"
        />
        <Select
          value={bundesland}
          onValueChange={(val) => {
            setBundesland(!val || val === "all" ? "" : val);
            setPage(0);
          }}
        >
          <SelectTrigger className="md:w-52">
            <SelectValue placeholder="Bundesland" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Bundeslaender</SelectItem>
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
          <SelectTrigger className="md:w-52">
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
      <p className="text-sm text-gray-500 mb-4">
        {totalCount} Ergebnis{totalCount !== 1 ? "se" : ""} gefunden
      </p>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Laden...</div>
      ) : results.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            Keine Ausschreibungen gefunden.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {results.map((item) => (
            <Card
              key={item.id}
              className="hover:border-blue-300 transition-colors cursor-pointer"
              onClick={() => router.push(`/ausschreibungen/${item.id}`)}
            >
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900">{item.titel}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.auftraggeber_name}
                      {item.auftraggeber_ort
                        ? ` - ${item.auftraggeber_ort}`
                        : ""}
                      {item.auftraggeber_bundesland
                        ? ` (${item.auftraggeber_bundesland})`
                        : ""}
                    </p>
                    {item.cpv_codes && item.cpv_codes.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {item.cpv_codes.slice(0, 3).map((cpv) => (
                          <Badge key={cpv} variant="secondary" className="text-xs">
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
                      >
                        {format(new Date(item.abgabefrist), "dd.MM.yyyy", {
                          locale: de,
                        })}
                      </Badge>
                    )}
                    {item.auftragsart && (
                      <p className="text-xs text-gray-400 mt-1">
                        {item.auftragsart}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Zurueck
          </Button>
          <span className="text-sm text-gray-600">
            Seite {page + 1} von {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Weiter
          </Button>
        </div>
      )}
    </div>
  );
}
