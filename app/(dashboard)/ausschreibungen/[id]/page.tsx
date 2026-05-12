import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Ausschreibung, Dokument } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { MerkenButton } from "@/components/merken-button";

export default async function AusschreibungDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: ausschreibung } = await supabase
    .from("ausschreibungen")
    .select("*")
    .eq("id", id)
    .single();

  if (!ausschreibung) {
    notFound();
  }

  const item = ausschreibung as Ausschreibung;

  const { data: dokumente } = await supabase
    .from("ausschreibung_dokumente")
    .select("*")
    .eq("ausschreibung_id", id);

  const docs = (dokumente as Dokument[] | null) ?? [];

  return (
    <div className="max-w-4xl">
      {/* Back link */}
      <Link
        href="/ausschreibungen"
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; Zurueck zur Uebersicht
      </Link>

      {/* Title and meta */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{item.titel}</h1>
          <p className="text-gray-500 mt-1">
            {item.auftraggeber_name}
            {item.auftraggeber_ort ? ` - ${item.auftraggeber_ort}` : ""}
            {item.auftraggeber_bundesland
              ? ` (${item.auftraggeber_bundesland})`
              : ""}
          </p>
        </div>
        <MerkenButton ausschreibungId={id} />
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap gap-2 mb-6">
        {item.auftragsart && <Badge>{item.auftragsart}</Badge>}
        {item.abgabefrist && (
          <Badge
            variant={
              new Date(item.abgabefrist) < new Date()
                ? "destructive"
                : "outline"
            }
          >
            Frist: {format(new Date(item.abgabefrist), "dd.MM.yyyy", { locale: de })}
          </Badge>
        )}
        {item.source_portal && (
          <Badge variant="secondary">{item.source_portal}</Badge>
        )}
        {item.cpv_codes?.map((cpv) => (
          <Badge key={cpv} variant="secondary">
            {cpv}
          </Badge>
        ))}
      </div>

      {/* KI-Zusammenfassung */}
      {item.ki_zusammenfassung && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base text-blue-800">
              KI-Zusammenfassung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-900 whitespace-pre-wrap">
              {item.ki_zusammenfassung}
            </p>
            {item.ki_checkliste && item.ki_checkliste.length > 0 && (
              <>
                <Separator className="my-4" />
                <p className="text-sm font-medium text-blue-800 mb-2">
                  Checkliste:
                </p>
                <ul className="list-disc list-inside text-sm text-blue-900 space-y-1">
                  {item.ki_checkliste.map((punkt, i) => (
                    <li key={i}>{punkt}</li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Beschreibung */}
      {item.beschreibung && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Beschreibung</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {item.beschreibung}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dokumente */}
      {docs.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">
              Dokumente ({docs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {doc.dateiname}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {doc.dateityp && (
                        <Badge variant="secondary" className="text-xs">
                          {doc.dateityp}
                        </Badge>
                      )}
                      {doc.klassifikation && (
                        <Badge variant="outline" className="text-xs">
                          {doc.klassifikation}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {doc.original_url && (
                    <a
                      href={doc.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline shrink-0"
                    >
                      Herunterladen
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* External link */}
      {item.source_url && (
        <a
          href={item.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          Zur Originalquelle &rarr;
        </a>
      )}
    </div>
  );
}
