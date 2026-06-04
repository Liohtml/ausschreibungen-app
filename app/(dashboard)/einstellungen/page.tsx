"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { UserProfile } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check } from "lucide-react";

const BUNDESLAENDER = [
  "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen",
  "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen",
  "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen",
  "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen",
];

export default function EinstellungenPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [keywordsText, setKeywordsText] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [selectedBundeslaender, setSelectedBundeslaender] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createBrowserSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }

        const { data } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          const p = data as UserProfile;
          setProfile(p);
          setKeywordsText(p.keywords?.join(", ") ?? "");
          setBeschreibung(p.beschreibung ?? "");
          setSelectedBundeslaender(p.bundeslaender ?? []);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const supabase = createBrowserSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const keywords = keywordsText.split(",").map((k) => k.trim()).filter(Boolean);

      const { error } = await supabase.from("user_profiles").upsert({
        id: user.id,
        firmenname: profile.firmenname ?? null,
        beschreibung: beschreibung || null,
        keywords,
        bundeslaender: selectedBundeslaender,
        plz: profile.plz ?? null,
        radius_km: profile.radius_km ?? null,
      });

      setMessage(error
        ? { text: "Fehler: " + error.message, error: true }
        : { text: "Einstellungen gespeichert.", error: false }
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleBundesland = (bl: string) => {
    setSelectedBundeslaender((prev) =>
      prev.includes(bl) ? prev.filter((b) => b !== bl) : [...prev, bl]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-400">
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        <span className="text-[13px]">Laden...</span>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-[22px] font-black text-zinc-950 tracking-tight leading-none">
          Einstellungen
        </h1>
        <p className="text-[13px] text-zinc-400 mt-1.5">
          Profil und Suchkriterien konfigurieren.
        </p>
      </div>

      <div className="space-y-px">
        {/* Firmenprofil */}
        <section className="border border-zinc-200 rounded-t-lg bg-white overflow-hidden">
          <div className="px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/80">
            <p className="text-[10px] font-mono font-medium uppercase tracking-[0.12em] text-zinc-400">
              Firmenprofil
            </p>
          </div>
          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="firmenname" className="text-[12px] font-medium text-zinc-600">
                Firmenname
              </Label>
              <Input
                id="firmenname"
                value={profile.firmenname ?? ""}
                onChange={(e) => setProfile((p) => ({ ...p, firmenname: e.target.value }))}
                placeholder="Musterfirma GmbH"
                className="h-9 text-[13px] border-zinc-200 rounded-md bg-white focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="beschreibung" className="text-[12px] font-medium text-zinc-600">
                Beschreibung
              </Label>
              <Textarea
                id="beschreibung"
                value={beschreibung}
                onChange={(e) => setBeschreibung(e.target.value)}
                placeholder="Kurze Beschreibung Ihres Unternehmens..."
                rows={3}
                className="text-[13px] border-zinc-200 rounded-md bg-white focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 resize-none"
              />
            </div>
          </div>
        </section>

        {/* Suchkriterien */}
        <section className="border border-zinc-200 border-t-0 bg-white overflow-hidden">
          <div className="px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/80">
            <p className="text-[10px] font-mono font-medium uppercase tracking-[0.12em] text-zinc-400">
              Suchkriterien
            </p>
          </div>
          <div className="p-5 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="keywords" className="text-[12px] font-medium text-zinc-600">
                Keywords
              </Label>
              <Input
                id="keywords"
                value={keywordsText}
                onChange={(e) => setKeywordsText(e.target.value)}
                placeholder="Bauarbeiten, Elektroinstallation, Sanitär"
                className="h-9 text-[13px] border-zinc-200 rounded-md bg-white focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900"
              />
              <p className="text-[11px] text-zinc-400">Kommagetrennte Suchbegriffe</p>
            </div>

            <div className="space-y-2">
              <p className="text-[12px] font-medium text-zinc-600">Bundesländer</p>
              <div className="grid grid-cols-2 gap-1">
                {BUNDESLAENDER.map((bl) => {
                  const active = selectedBundeslaender.includes(bl);
                  return (
                    <label
                      key={bl}
                      className={`flex items-center gap-2.5 text-[12px] cursor-pointer py-2 px-3 rounded-md transition-colors duration-100 ${
                        active
                          ? "bg-zinc-900 text-white"
                          : "text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${
                        active ? "border-white bg-white" : "border-zinc-300"
                      }`}>
                        {active && <Check className="w-2.5 h-2.5 text-zinc-900" />}
                      </div>
                      {bl}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Standort */}
        <section className="border border-zinc-200 border-t-0 rounded-b-lg bg-white overflow-hidden">
          <div className="px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/80">
            <p className="text-[10px] font-mono font-medium uppercase tracking-[0.12em] text-zinc-400">
              Standort & Umkreis
            </p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="plz" className="text-[12px] font-medium text-zinc-600">PLZ</Label>
                <Input
                  id="plz"
                  value={profile.plz ?? ""}
                  onChange={(e) => setProfile((p) => ({ ...p, plz: e.target.value }))}
                  placeholder="60311"
                  maxLength={5}
                  className="h-9 text-[13px] border-zinc-200 rounded-md bg-white focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="radius" className="text-[12px] font-medium text-zinc-600">Radius (km)</Label>
                <Input
                  id="radius"
                  type="number"
                  value={profile.radius_km ?? ""}
                  onChange={(e) => setProfile((p) => ({
                    ...p,
                    radius_km: e.target.value ? Number(e.target.value) : null,
                  }))}
                  placeholder="50"
                  className="h-9 text-[13px] border-zinc-200 rounded-md bg-white focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Save */}
      <div className="mt-4 space-y-3">
        {message && (
          <div className={`flex items-center gap-2 text-[12px] px-4 py-2.5 rounded-md border ${
            message.error
              ? "text-red-600 bg-red-50 border-red-200"
              : "text-emerald-700 bg-emerald-50 border-emerald-200"
          }`}>
            {!message.error && <Check className="w-3.5 h-3.5" />}
            {message.text}
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-zinc-900 text-white h-9 rounded-md hover:bg-zinc-800 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Wird gespeichert...
            </>
          ) : (
            "Einstellungen speichern"
          )}
        </button>
      </div>
    </div>
  );
}
