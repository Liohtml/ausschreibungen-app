"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

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
      className="shrink-0"
    >
      {saved ? "Gemerkt" : "Merken"}
    </Button>
  );
}
