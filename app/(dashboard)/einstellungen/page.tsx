"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check } from "lucide-react";

const BUNDESLAENDER = [
  "Baden-Württemberg",
  "Bayern",
  "Berlin",
  "Brandenburg",
  "Bremen",
  "Hamburg",
  "Hessen",
  "Mecklenburg-Vorpommern",
  "Niedersachsen",
  "Nordrhein-Westfalen",
  "Rheinland-Pfalz",
  "Saarland",
  "Sachsen",
  "Sachsen-Anhalt",
  "Schleswig-Holstein",
  "Thüringen",
];

export default function EinstellungenPage() {
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [keywordsText, setKeywordsText] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [selectedBundeslaender, setSelectedBundeslaender] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createBrowserSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        const p = data as UserProfile;
        setProfile(p);
        setKeywordsText(p.keywords?.join(", ") ?? "");
        setSelectedBundeslaender(p.bundeslaender ?? []);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const supabase = createBrowserSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const keywords = keywordsText
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const { error } = await supabase.from("user_profiles").upsert({
      id: user.id,
      firmenname: profile.firmenname ?? null,
      keywords,
      bundeslaender: selectedBundeslaender,
      plz: profile.plz ?? null,
      radius_km: profile.radius_km ?? null,
    });

    if (error) {
      setMessage("Fehler beim Speichern: " + error.message);
    } else {
      setMessage("Einstellungen gespeichert.");
    }
    setSaving(false);
  };

  const toggleBundesland = (bl: string) => {
    setSelectedBundeslaender((prev) =>
      prev.includes(bl) ? prev.filter((b) => b !== bl) : [...prev, bl]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Laden...
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[#1E293B] mb-8">Einstellungen</h1>

      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <p className="text-lg font-semibold text-[#1E293B] mb-6">
          Firmenprofil
        </p>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="firmenname"
              className="text-sm font-medium text-gray-700"
            >
              Firmenname
            </Label>
            <Input
              id="firmenname"
              value={profile.firmenname ?? ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, firmenname: e.target.value }))
              }
              placeholder="Musterfirma GmbH"
              className="border-gray-200 rounded-lg focus:border-[#3B82F6] focus:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="beschreibung"
              className="text-sm font-medium text-gray-700"
            >
              Beschreibung
            </Label>
            <Textarea
              id="beschreibung"
              value={beschreibung}
              onChange={(e) => setBeschreibung(e.target.value)}
              placeholder="Kurze Beschreibung Ihres Unternehmens..."
              rows={3}
              className="border-gray-200 rounded-lg focus:border-[#3B82F6] focus:ring-0 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="keywords"
              className="text-sm font-medium text-gray-700"
            >
              Keywords (kommagetrennt)
            </Label>
            <Input
              id="keywords"
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              placeholder="Bauarbeiten, Elektroinstallation, Sanitär"
              className="border-gray-200 rounded-lg focus:border-[#3B82F6] focus:ring-0"
            />
            <p className="text-xs text-gray-400">
              Trennen Sie mehrere Suchbegriffe mit Kommas
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Bundesländer
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {BUNDESLAENDER.map((bl) => (
                <label
                  key={bl}
                  className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer py-1 px-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                >
                  <input
                    type="checkbox"
                    checked={selectedBundeslaender.includes(bl)}
                    onChange={() => toggleBundesland(bl)}
                    className="rounded border-gray-300 text-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                  {bl}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="plz"
                className="text-sm font-medium text-gray-700"
              >
                PLZ
              </Label>
              <Input
                id="plz"
                value={profile.plz ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, plz: e.target.value }))
                }
                placeholder="60311"
                maxLength={5}
                className="border-gray-200 rounded-lg focus:border-[#3B82F6] focus:ring-0"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="radius"
                className="text-sm font-medium text-gray-700"
              >
                Radius (km)
              </Label>
              <Input
                id="radius"
                type="number"
                value={profile.radius_km ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    radius_km: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder="50"
                className="border-gray-200 rounded-lg focus:border-[#3B82F6] focus:ring-0"
              />
            </div>
          </div>

          {message && (
            <div
              className={`flex items-center gap-2 text-sm ${
                message.startsWith("Fehler")
                  ? "text-red-500"
                  : "text-green-600"
              }`}
            >
              {!message.startsWith("Fehler") && (
                <Check className="w-4 h-4" />
              )}
              {message}
            </div>
          )}

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg h-11 cursor-pointer transition-colors duration-150"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Wird gespeichert...
              </>
            ) : (
              "Speichern"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
