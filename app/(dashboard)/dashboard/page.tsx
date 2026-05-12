import { createServerSupabase } from "@/lib/supabase/server";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { MatchResult } from "@/lib/types";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();

  // Fetch stats
  const today = new Date().toISOString().split("T")[0];

  const [{ count: todayCount }, { count: totalCount }, { data: matches }] =
    await Promise.all([
      supabase
        .from("ausschreibungen")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today),
      supabase
        .from("ausschreibungen")
        .select("*", { count: "exact", head: true })
        .gte("abgabefrist", today),
      supabase
        .rpc("match_ausschreibungen", {})
        .then((res) => ({
          data: (res.data as MatchResult[] | null)?.slice(0, 5) ?? [],
        }))
        .then(null, () => ({ data: [] as MatchResult[] })),
    ]);

  // Count expiring soon (next 3 days)
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  const { count: expiringCount } = await supabase
    .from("ausschreibungen")
    .select("*", { count: "exact", head: true })
    .gte("abgabefrist", today)
    .lte("abgabefrist", threeDaysFromNow.toISOString().split("T")[0]);

  const stats = [
    { label: "Neue Ausschreibungen heute", value: todayCount ?? 0 },
    { label: "Aktive Ausschreibungen gesamt", value: totalCount ?? 0 },
    { label: "Ablaufende Fristen (3 Tage)", value: expiringCount ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <p className="text-sm text-gray-500">{stat.label}</p>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Latest matches */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Neueste Treffer
      </h2>
      {matches.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            Noch keine Treffer. Konfigurieren Sie Ihre Suchkriterien in den{" "}
            <Link href="/einstellungen" className="text-blue-600 hover:underline">
              Einstellungen
            </Link>
            .
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => (
            <Link key={match.id} href={`/ausschreibungen/${match.id}`}>
              <Card className="hover:border-blue-300 transition-colors cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {match.titel}
                      </p>
                      <p className="text-sm text-gray-500">
                        {match.auftraggeber_name}
                        {match.auftraggeber_ort
                          ? ` - ${match.auftraggeber_ort}`
                          : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="secondary">
                        {Math.round(match.relevanz_score * 100)}%
                      </Badge>
                      {match.abgabefrist && (
                        <Badge variant="outline">
                          {format(new Date(match.abgabefrist), "dd.MM.yyyy", {
                            locale: de,
                          })}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
