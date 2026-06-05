import type { UserProfile } from "@/lib/types";

export type SubscriptionState = "active" | "trialing" | "expired" | "none";

export interface SubscriptionInfo {
  state: SubscriptionState;
  validUntil: Date | null;
  /** Whole days until `validUntil` (>= 0), or null if there is no end date. */
  daysLeft: number | null;
}

const DAY_MS = 1000 * 60 * 60 * 24;

type ProfileLike = Pick<UserProfile, "abo_status" | "abo_gueltig_bis"> | null | undefined;

/**
 * Parse `abo_gueltig_bis` robustly. A Postgres `timestamp` (without time zone)
 * serializes with no offset and would otherwise be read as *local* time, which
 * shifts the expiry boundary off UTC on non-UTC machines. Force UTC for datetime
 * values that carry no offset; date-only strings are already UTC midnight per spec.
 */
function parseValidUntil(value: string | null | undefined): Date | null {
  if (!value) return null;
  const hasTime = value.includes("T") || value.includes(" ");
  const hasTz = /[zZ]$/.test(value) || /[+-]\d{2}:?\d{2}$/.test(value);
  let iso = value;
  if (hasTime) {
    iso = value.replace(" ", "T");
    if (!hasTz) iso += "Z";
  }
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Derive the subscription state from a user profile.
 *
 * Pure and deterministic — `now` is injectable for testing. This is the
 * **soft** model: it informs the UI (trial/expiry banner) but never blocks
 * access. `hasActiveAccess()` is provided so a future hard gate can reuse the
 * exact same logic once a billing/upgrade flow exists.
 */
export function getSubscriptionInfo(
  profile: ProfileLike,
  now: Date = new Date()
): SubscriptionInfo {
  const validUntil = parseValidUntil(profile?.abo_gueltig_bis);

  const status = (profile?.abo_status ?? "").trim().toLowerCase();
  const hasValidUntil = validUntil !== null;
  const expired = hasValidUntil && validUntil.getTime() < now.getTime();

  let state: SubscriptionState;
  if (status === "active") {
    state = expired ? "expired" : "active";
  } else if (status === "trialing" || status === "trial") {
    state = expired ? "expired" : "trialing";
  } else if (
    status === "expired" ||
    status === "canceled" ||
    status === "cancelled" ||
    status === "inactive"
  ) {
    state = "expired";
  } else {
    state = "none";
  }

  const daysLeft = hasValidUntil
    ? Math.max(0, Math.ceil((validUntil.getTime() - now.getTime()) / DAY_MS))
    : null;

  return { state, validUntil, daysLeft };
}

/**
 * Whether the user currently has active access (paid or in trial).
 * Soft-gate helper — not yet enforced; ready for a future hard gate.
 */
export function hasActiveAccess(profile: ProfileLike, now: Date = new Date()): boolean {
  const { state } = getSubscriptionInfo(profile, now);
  return state === "active" || state === "trialing";
}
