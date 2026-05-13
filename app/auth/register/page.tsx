"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createBrowserSupabase();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-lg font-semibold text-[#1E293B] cursor-pointer"
          >
            Ausschreibungen.de
          </Link>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-[#1E293B] text-center mb-2">
            Konto erstellen
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Starten Sie mit 7 Tagen kostenlosem Test
          </p>
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                E-Mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@firma.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-200 rounded-lg focus:border-[#3B82F6] focus:ring-0"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
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
                className="border-gray-200 rounded-lg focus:border-[#3B82F6] focus:ring-0"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg h-11 cursor-pointer transition-colors duration-150"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Wird registriert...
                </>
              ) : (
                "Kostenlos registrieren"
              )}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            Bereits ein Konto?{" "}
            <Link
              href="/auth/login"
              className="text-[#3B82F6] hover:underline cursor-pointer"
            >
              Anmelden
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
