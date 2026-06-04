"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmEmailSent, setConfirmEmailSent] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createBrowserSupabase();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (!data.session) {
      // Email confirmation is required: no session yet.
      // Show a confirmation panel instead of redirecting.
      setConfirmEmailSent(true);
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
          {confirmEmailSent ? (
            <>
              <div className="mb-8">
                <h1 className="text-[28px] font-black text-zinc-950 tracking-tight leading-none mb-2">
                  Fast geschafft
                </h1>
                <p className="text-[13px] text-zinc-400">
                  Wir haben dir eine Bestätigungs-E-Mail an{" "}
                  <span className="text-zinc-700 font-medium">{email}</span>{" "}
                  geschickt. Bitte bestätige deine Adresse, um fortzufahren.
                </p>
              </div>

              <div className="text-[13px] text-zinc-600 bg-white border border-zinc-200 px-3 py-3 rounded-md leading-relaxed">
                Keine E-Mail erhalten? Sieh in deinem Spam-Ordner nach oder
                versuche es in wenigen Minuten erneut.
              </div>

              <Link
                href="/auth/login"
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-zinc-900 text-white h-9 rounded-md hover:bg-zinc-800 transition-colors duration-150 mt-4"
              >
                Zur Anmeldung
              </Link>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-[28px] font-black text-zinc-950 tracking-tight leading-none mb-2">
                  Konto erstellen
                </h1>
                <p className="text-[13px] text-zinc-400">
                  7 Tage kostenlos testen. Bereits ein Konto?{" "}
                  <Link href="/auth/login" className="text-zinc-700 font-medium hover:text-zinc-900 underline underline-offset-2">
                    Anmelden
                  </Link>
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
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
                    placeholder="Mindestens 6 Zeichen"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
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
                      Wird registriert...
                    </>
                  ) : (
                    "Kostenlos registrieren"
                  )}
                </button>

                <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
                  Mit der Registrierung akzeptierst du unsere{" "}
                  <a href="#" className="underline underline-offset-2 hover:text-zinc-600">AGB</a>{" "}
                  und{" "}
                  <a href="#" className="underline underline-offset-2 hover:text-zinc-600">Datenschutzrichtlinien</a>.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
