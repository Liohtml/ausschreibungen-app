"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { Ausschreibung } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { de } from "date-fns/locale";

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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Merkliste</h1>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Laden...</div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            Ihre Merkliste ist leer. Speichern Sie Ausschreibungen, um sie hier
            wiederzufinden.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((entry) => {
            const item = entry.ausschreibungen;
            if (!item) return null;
            return (
              <Card key={entry.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="min-w-0 flex-1 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/ausschreibungen/${entry.ausschreibung_id}`
                        )
                      }
                    >
                      <p className="font-medium text-gray-900">{item.titel}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.auftraggeber_name}
                        {item.auftraggeber_ort
                          ? ` - ${item.auftraggeber_ort}`
                          : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {item.abgabefrist && (
                        <Badge variant="outline">
                          {format(new Date(item.abgabefrist), "dd.MM.yyyy", {
                            locale: de,
                          })}
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Entfernen
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
