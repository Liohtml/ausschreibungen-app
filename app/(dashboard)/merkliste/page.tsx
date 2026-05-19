"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { Ausschreibung } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Bookmark, Loader2, ChevronRight, Trash2 } from "lucide-react";

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
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-[#1E293B]">
          Merkliste
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Ihre gespeicherten Ausschreibungen.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Laden...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-100/80 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium mb-1">
            Ihre Merkliste ist leer.
          </p>
          <p className="text-sm text-gray-400">
            Speichern Sie Ausschreibungen, um sie hier wiederzufinden.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100/80 rounded-2xl divide-y divide-gray-50 overflow-hidden">
          {items.map((entry) => {
            const item = entry.ausschreibungen;
            if (!item) return null;
            return (
              <div
                key={entry.id}
                className="px-6 py-4 hover:bg-gray-50/50 transition-colors duration-200 flex items-center gap-4"
              >
                <div
                  className="min-w-0 flex-1 cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/ausschreibungen/${entry.ausschreibung_id}`
                    )
                  }
                >
                  <p className="font-medium text-[#1E293B] text-sm">
                    {item.titel}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
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
                      className="rounded-full text-xs text-gray-400 border-gray-200"
                    >
                      {format(new Date(item.abgabefrist), "dd.MM.yyyy", {
                        locale: de,
                      })}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(entry.id)}
                    className="text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <ChevronRight
                    className="w-4 h-4 text-gray-300 cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/ausschreibungen/${entry.ausschreibung_id}`
                      )
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
