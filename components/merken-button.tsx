"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";

export function MerkenButton({
  ausschreibungId,
}: {
  ausschreibungId: string;
}) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMerken = async () => {
    setLoading(true);
    const supabase = createBrowserSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("user_merkliste").insert({
      user_id: user.id,
      ausschreibung_id: ausschreibungId,
    });

    if (!error) {
      setSaved(true);
    }
    setLoading(false);
  };

  return (
    <Button
      variant={saved ? "secondary" : "outline"}
      onClick={handleMerken}
      disabled={loading || saved}
      className={`shrink-0 rounded-xl gap-2 cursor-pointer transition-all duration-200 ${
        saved
          ? "bg-blue-50 text-[#3B82F6] border-blue-100"
          : "border-gray-200 hover:border-[#3B82F6] hover:text-[#3B82F6]"
      }`}
    >
      {saved ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
      {saved ? "Gemerkt" : "Merken"}
    </Button>
  );
}
