"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { Ausschreibung } from "@/lib/types";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Loader2, Trash2, Bookmark } from "lucide-react";

interface MerklisteItem {
  id: string;
  ausschreibung_id: string;
  ausschreibungen: Ausschreibung;
}

export default function MerklistePage() {
  const router = useRouter();
  const [items, setItems] = useState<MerklisteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchMerkliste = async () => {
      const supabase = createBrowserSupabase();
      const { data, error } = await supabase
        .from("user_merkliste")
        .select("id, ausschreibung_id, ausschreibungen(*)")
        .order("created_at", { ascending: false });

      if (!active) return;
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
      setItems((data as unknown as MerklisteItem[]) ?? []);
      setLoading(false);
    };

    fetchMerkliste();

    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    const supabase = createBrowserSupabase();
    await supabase.from("user_merkliste").delete().eq("id", id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-black text-zinc-950 tracking-tight leading-none">
          Merkliste
        </h1>
        <p className="text-[13px] text-zinc-400 mt-1.5">
          Gespeicherte Ausschreibungen.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-400">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          <span className="text-[13px]">Laden...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="border border-zinc-200 rounded-lg p-12 text-center bg-white">
          <Bookmark className="w-5 h-5 text-zinc-300 mx-auto mb-3" />
          <p className="text-[13px] text-zinc-500 font-medium mb-1">
            Merkliste ist leer.
          </p>
          <p className="text-[12px] text-zinc-400">
            Speichere Ausschreibungen, um sie hier wiederzufinden.
          </p>
        </div>
      ) : (
        <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
          {/* Head */}
          <div className="grid grid-cols-[1fr_160px_40px] gap-4 px-6 py-2.5 border-b border-zinc-100 bg-zinc-50/80">
            <span className="text-[9px] font-mono font-medium uppercase tracking-[0.14em] text-zinc-400">Titel</span>
            <span className="text-[9px] font-mono font-medium uppercase tracking-[0.14em] text-zinc-400">Abgabe</span>
            <span></span>
          </div>
          {items.map((entry, i) => {
            const item = entry.ausschreibungen;
            if (!item) return null;
            return (
              <div
                key={entry.id}
                className={`grid grid-cols-[1fr_160px_40px] gap-4 px-6 py-3.5 items-center ${i < items.length - 1 ? "border-b border-zinc-50" : ""} hover:bg-zinc-50/80 transition-colors duration-100`}
              >
                <div
                  className="min-w-0 cursor-pointer"
                  onClick={() => router.push(`/ausschreibungen/${entry.ausschreibung_id}`)}
                >
                  <p className="text-[13px] font-semibold text-zinc-900 truncate tracking-tight">
                    {item.titel}
                  </p>
                  {item.auftraggeber_name && (
                    <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                      {item.auftraggeber_name}
                      {item.auftraggeber_ort ? ` · ${item.auftraggeber_ort}` : ""}
                    </p>
                  )}
                </div>
                <p className="text-[11px] font-mono text-zinc-400">
                  {item.abgabefrist
                    ? format(new Date(item.abgabefrist), "dd.MM.yyyy", { locale: de })
                    : "-"}
                </p>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-1.5 rounded text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-colors duration-150"
                  title="Entfernen"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
