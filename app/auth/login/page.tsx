"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createBrowserSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      {/* Nav */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 h-[60px] flex items-center">
          <Link href="/" className="text-sm font-bold text-zinc-900 tracking-tight">
            Ausschreibungen.de
          </Link>
        </div>
      </header>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[360px]">
          <div className="mb-8">
            <h1 className="text-[28px] font-black text-zinc-950 tracking-tight leading-none mb-2">
              Anmelden
            </h1>
            <p className="text-[13px] text-zinc-400">
              Noch kein Konto?{" "}
              <Link href="/auth/register" className="text-zinc-700 font-medium hover:text-zinc-900 underline underline-offset-2">
                Kostenlos registrieren
              </Link>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[12px] font-medium text-zinc-600">
                E-Mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@firma.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 text-[13px] border-zinc-200 rounded-md bg-white focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[12px] font-medium text-zinc-600">
                Passwort
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-9 text-[13px] border-zinc-200 rounded-md bg-white focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900"
              />
            </div>

            {error && (
              <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-zinc-900 text-white h-9 rounded-md hover:bg-zinc-800 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Wird angemeldet...
                </>
              ) : (
                "Anmelden"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
