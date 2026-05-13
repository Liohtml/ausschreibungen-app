"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
      <div className="text-center py-12 text-gray-500">Laden...</div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Einstellungen</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Firmenprofil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="firmenname">Firmenname</Label>
            <Input
              id="firmenname"
              value={profile.firmenname ?? ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, firmenname: e.target.value }))
              }
              placeholder="Musterfirma GmbH"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="beschreibung">Beschreibung</Label>
            <Textarea
              id="beschreibung"
              value={beschreibung}
              onChange={(e) => setBeschreibung(e.target.value)}
              placeholder="Kurze Beschreibung Ihres Unternehmens..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (kommagetrennt)</Label>
            <Input
              id="keywords"
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              placeholder="Bauarbeiten, Elektroinstallation, Sanitär"
            />
            <p className="text-xs text-gray-500">
              Trennen Sie mehrere Suchbegriffe mit Kommas
            </p>
          </div>

          <div className="space-y-2">
            <Label>Bundesländer</Label>
            <div className="grid grid-cols-2 gap-2">
              {BUNDESLAENDER.map((bl) => (
                <label
                  key={bl}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedBundeslaender.includes(bl)}
                    onChange={() => toggleBundesland(bl)}
                    className="rounded border-gray-300"
                  />
                  {bl}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plz">PLZ</Label>
              <Input
                id="plz"
                value={profile.plz ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, plz: e.target.value }))
                }
                placeholder="60311"
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="radius">Radius (km)</Label>
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
              />
            </div>
          </div>

          {message && (
            <p
              className={`text-sm ${
                message.startsWith("Fehler")
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}

          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {saving ? "Wird gespeichert..." : "Speichern"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
