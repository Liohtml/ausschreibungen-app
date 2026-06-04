/**
 * Resolve a post-auth redirect target safely.
 *
 * Only clean, same-site absolute paths are allowed. Anything that could send the
 * user to another origin (absolute URLs, protocol-relative `//host`, backslash
 * tricks the browser normalises to `//`, `@host` userinfo payloads) or inject
 * response headers (control characters / CRLF) falls back to `/dashboard`.
 *
 * Guards against the open-redirect / header-injection class of bugs in the
 * OAuth callback (issues #1, #9, #34).
 */
export function safeRedirectPath(next: string | null | undefined): string {
  const fallback = "/dashboard";

  if (!next) return fallback;
  // Must be a path on our own site …
  if (!next.startsWith("/")) return fallback; // relative, absolute URL, or `@host`
  // … but not protocol-relative `//evil.com` …
  if (next.startsWith("//")) return fallback;
  // … nor a backslash variant the browser rewrites to `//` (e.g. `/\evil.com`) …
  if (next.includes("\\")) return fallback;
  // … nor carrying control chars / CRLF for header injection.
  if (/[\x00-\x1f\x7f]/.test(next)) return fallback;

  return next;
}
