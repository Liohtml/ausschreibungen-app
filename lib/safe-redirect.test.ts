import { describe, it, expect } from "vitest";
import { safeRedirectPath } from "./safe-redirect";

describe("safeRedirectPath", () => {
  it("falls back to /dashboard for empty/missing input", () => {
    expect(safeRedirectPath(null)).toBe("/dashboard");
    expect(safeRedirectPath(undefined)).toBe("/dashboard");
    expect(safeRedirectPath("")).toBe("/dashboard");
  });

  it("allows clean same-site paths", () => {
    expect(safeRedirectPath("/dashboard")).toBe("/dashboard");
    expect(safeRedirectPath("/ausschreibungen/abc-123")).toBe(
      "/ausschreibungen/abc-123"
    );
    expect(safeRedirectPath("/einstellungen?tab=profil#top")).toBe(
      "/einstellungen?tab=profil#top"
    );
  });

  it("rejects protocol-relative URLs (//host)", () => {
    expect(safeRedirectPath("//evil.com")).toBe("/dashboard");
    expect(safeRedirectPath("//evil.com/path")).toBe("/dashboard");
  });

  it("rejects absolute URLs and @host userinfo payloads", () => {
    expect(safeRedirectPath("https://evil.com")).toBe("/dashboard");
    expect(safeRedirectPath("http://evil.com")).toBe("/dashboard");
    expect(safeRedirectPath("@evil.com")).toBe("/dashboard");
    expect(safeRedirectPath("evil.com")).toBe("/dashboard");
  });

  it("rejects backslash tricks the browser rewrites to //", () => {
    expect(safeRedirectPath("/\\evil.com")).toBe("/dashboard");
    expect(safeRedirectPath("/path\\to")).toBe("/dashboard");
  });

  it("rejects control characters / CRLF header injection", () => {
    expect(safeRedirectPath("/foo\r\nSet-Cookie: x=1")).toBe("/dashboard");
    expect(safeRedirectPath("/foo\nbar")).toBe("/dashboard");
    expect(safeRedirectPath("/foo\x00bar")).toBe("/dashboard");
    expect(safeRedirectPath("/foo\tbar")).toBe("/dashboard");
    expect(safeRedirectPath("/foo\u0085bar")).toBe("/dashboard");
    expect(safeRedirectPath("/foo\u2028bar")).toBe("/dashboard");
    expect(safeRedirectPath("/foo\u2029bar")).toBe("/dashboard");
  });
});
