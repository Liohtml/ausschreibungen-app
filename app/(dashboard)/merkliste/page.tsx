"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { Ausschreibung } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Bookmark, Loader2 } from "lucide-react";

interface MerklisteItem {
  id: string;
  ausschreibung_id: string;
  ausschreibungen: Ausschreibung;
}

export default function MerklistePage() {
  const router = useRouter();
  const [items, setItems] = useState<MerklisteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMerkliste = async () => {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("user_merkliste")
      .select("id, ausschreibung_id, ausschreibungen(*)")
      .order("created_at", { ascending: false });

    setItems((data as unknown as MerklisteItem[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMerkliste();
  }, []);

  const handleDelete = async (id: string) => {
    const supabase = createBrowserSupabase();
    await supabase.from("user_merkliste").delete().eq("id", id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1E293B] mb-8">Merkliste</h1>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Laden...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <Bookmark className="w-10 h-10 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-1">Ihre Merkliste ist leer.</p>
          <p className="text-sm text-gray-400">
            Speichern Sie Ausschreibungen, um sie hier wiederzufinden.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((entry) => {
            const item = entry.ausschreibungen;
            if (!item) return null;
            return (
              <div
                key={entry.id}
                className="bg-white border border-gray-100 rounded-xl px-5 py-4 hover:border-blue-200 transition-colors duration-150"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="min-w-0 flex-1 cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/ausschreibungen/${entry.ausschreibung_id}`
                      )
                    }
                  >
                    <p className="font-medium text-[#1E293B]">{item.titel}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.auftraggeber_name}
                      {item.auftraggeber_ort
                        ? ` — ${item.auftraggeber_ort}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.abgabefrist && (
                      <Badge
                        variant="outline"
                        className="rounded-full text-xs"
                      >
                        {format(new Date(item.abgabefrist), "dd.MM.yyyy", {
                          locale: de,
                        })}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      className="text-sm text-red-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-150"
                    >
                      Entfernen
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
