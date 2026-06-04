"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";

export function MerkenButton({
  ausschreibungId,
}: {
  ausschreibungId: string;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let active = true;

    const checkSaved = async () => {
      try {
        const supabase = createBrowserSupabase();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (active) setSaved(false);
          return;
        }

        // limit(1) instead of maybeSingle(): tolerant of any pre-existing
        // duplicate rows (maybeSingle throws when more than one row matches).
        const { data, error } = await supabase
          .from("user_merkliste")
          .select("id")
          .eq("ausschreibung_id", ausschreibungId)
          .eq("user_id", user.id)
          .limit(1);

        if (error) {
          console.error(error);
          return;
        }

        if (active) setSaved((data?.length ?? 0) > 0);
      } finally {
        if (active) setInitializing(false);
      }
    };

    checkSaved();

    return () => {
      active = false;
    };
  }, [ausschreibungId]);

  const handleMerken = async () => {
    setLoading(true);
    try {
      const supabase = createBrowserSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      if (saved) {
        const { error } = await supabase
          .from("user_merkliste")
          .delete()
          .eq("ausschreibung_id", ausschreibungId)
          .eq("user_id", user.id);

        if (error) {
          console.error(error);
          return;
        }

        setSaved(false);
      } else {
        const { error } = await supabase.from("user_merkliste").insert({
          user_id: user.id,
          ausschreibung_id: ausschreibungId,
        });

        if (error) {
          // Unique-constraint violation -> row already exists, treat as saved.
          if (error.code === "23505") {
            setSaved(true);
            return;
          }
          console.error(error);
          return;
        }

        setSaved(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={saved ? "secondary" : "outline"}
      onClick={handleMerken}
      disabled={loading || initializing}
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
