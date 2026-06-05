import { describe, it, expect } from "vitest";
import { getSubscriptionInfo, hasActiveAccess } from "./subscription";

const NOW = new Date("2026-06-05T12:00:00Z");
const future = "2026-06-20T12:00:00Z"; // +15 days
const past = "2026-06-01T12:00:00Z"; // -4 days

describe("getSubscriptionInfo", () => {
  it("returns 'none' for a missing profile", () => {
    expect(getSubscriptionInfo(null, NOW).state).toBe("none");
    expect(getSubscriptionInfo(undefined, NOW).state).toBe("none");
    expect(getSubscriptionInfo({ abo_status: null, abo_gueltig_bis: null }, NOW).state).toBe("none");
  });

  it("treats a valid 'active' subscription as active", () => {
    const info = getSubscriptionInfo({ abo_status: "active", abo_gueltig_bis: future }, NOW);
    expect(info.state).toBe("active");
    expect(info.daysLeft).toBe(15);
  });

  it("treats a valid trial as trialing", () => {
    expect(getSubscriptionInfo({ abo_status: "trialing", abo_gueltig_bis: future }, NOW).state).toBe("trialing");
    expect(getSubscriptionInfo({ abo_status: "trial", abo_gueltig_bis: future }, NOW).state).toBe("trialing");
  });

  it("marks active/trial as expired once the end date has passed", () => {
    expect(getSubscriptionInfo({ abo_status: "active", abo_gueltig_bis: past }, NOW).state).toBe("expired");
    expect(getSubscriptionInfo({ abo_status: "trialing", abo_gueltig_bis: past }, NOW).state).toBe("expired");
    expect(getSubscriptionInfo({ abo_status: "active", abo_gueltig_bis: past }, NOW).daysLeft).toBe(0);
  });

  it("maps canceled/inactive statuses to expired", () => {
    expect(getSubscriptionInfo({ abo_status: "canceled", abo_gueltig_bis: null }, NOW).state).toBe("expired");
    expect(getSubscriptionInfo({ abo_status: "inactive", abo_gueltig_bis: null }, NOW).state).toBe("expired");
  });

  it("is case-insensitive and trims status", () => {
    expect(getSubscriptionInfo({ abo_status: "  Active ", abo_gueltig_bis: future }, NOW).state).toBe("active");
  });

  it("active with no end date stays active with null daysLeft", () => {
    const info = getSubscriptionInfo({ abo_status: "active", abo_gueltig_bis: null }, NOW);
    expect(info.state).toBe("active");
    expect(info.daysLeft).toBeNull();
    expect(info.validUntil).toBeNull();
  });

  it("ignores an unparseable end date", () => {
    const info = getSubscriptionInfo({ abo_status: "active", abo_gueltig_bis: "not-a-date" }, NOW);
    expect(info.state).toBe("active");
    expect(info.daysLeft).toBeNull();
  });
});

describe("hasActiveAccess", () => {
  it("is true for active and trialing, false otherwise", () => {
    expect(hasActiveAccess({ abo_status: "active", abo_gueltig_bis: future }, NOW)).toBe(true);
    expect(hasActiveAccess({ abo_status: "trialing", abo_gueltig_bis: future }, NOW)).toBe(true);
    expect(hasActiveAccess({ abo_status: "active", abo_gueltig_bis: past }, NOW)).toBe(false);
    expect(hasActiveAccess(null, NOW)).toBe(false);
  });
});
