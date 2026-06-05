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
  const validUntil = profile?.abo_gueltig_bis
    ? new Date(profile.abo_gueltig_bis)
    : null;

  const status = (profile?.abo_status ?? "").trim().toLowerCase();
  const hasValidUntil = validUntil !== null && !Number.isNaN(validUntil.getTime());
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

  return { state, validUntil: hasValidUntil ? validUntil : null, daysLeft };
}

/**
 * Whether the user currently has active access (paid or in trial).
 * Soft-gate helper — not yet enforced; ready for a future hard gate.
 */
export function hasActiveAccess(profile: ProfileLike, now: Date = new Date()): boolean {
  const { state } = getSubscriptionInfo(profile, now);
  return state === "active" || state === "trialing";
}
