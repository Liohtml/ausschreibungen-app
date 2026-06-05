"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { SubscriptionState } from "@/lib/subscription";

/**
 * Soft subscription nudge. Informational only — never blocks access.
 * Renders nothing for active subscriptions.
 */
export function SubscriptionBanner({
  state,
  daysLeft,
}: {
  state: SubscriptionState;
  daysLeft: number | null;
}) {
  const [dismissed, setDismissed] = useState(false);

  // Only nudge users whose status is actually set to trial or expired.
  // "active" needs no banner; "none" (status not set) must not nag everyone.
  if (dismissed || state === "active" || state === "none") return null;

  const isTrial = state === "trialing";

  return (
    <div
      className={`flex items-center gap-3 px-8 py-2.5 border-b text-[12px] ${
        isTrial
          ? "bg-zinc-50 border-zinc-200 text-zinc-600"
          : "bg-amber-50 border-amber-200 text-amber-800"
      }`}
    >
      <span className="flex-1">
        {isTrial ? (
          <>
            <span className="font-medium">Testphase aktiv</span>
            {typeof daysLeft === "number" && daysLeft > 0 && (
              <> — noch {daysLeft} Tag{daysLeft === 1 ? "" : "e"}.</>
            )}
          </>
        ) : (
          <>
            <span className="font-medium">Dein Zugang ist abgelaufen.</span>{" "}
            Schalte alle Funktionen frei.
          </>
        )}
      </span>

      {!isTrial && (
        <Link
          href="/#pricing"
          className="font-semibold underline underline-offset-2 hover:opacity-80 shrink-0"
        >
          Tarife ansehen
        </Link>
      )}

      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Hinweis ausblenden"
        className="shrink-0 p-0.5 rounded hover:bg-black/5 transition-colors duration-150"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
