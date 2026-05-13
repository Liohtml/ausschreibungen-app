import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Ausschreibung, Dokument } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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

  const fristAbgelaufen = item.abgabefrist && new Date(item.abgabefrist) < new Date();

  return (
    <div className="max-w-4xl">
      <Link
        href="/ausschreibungen"
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; Zurück zur Übersicht
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{item.titel}</h1>
          {item.auftraggeber_name && (
            <p className="text-gray-600 mt-1 text-lg">{item.auftraggeber_name}</p>
          )}
          <p className="text-gray-500 mt-1">
            {item.auftraggeber_ort || ""}
            {item.auftraggeber_plz ? ` (${item.auftraggeber_plz})` : ""}
            {item.auftraggeber_bundesland ? ` — ${item.auftraggeber_bundesland}` : ""}
          </p>
        </div>
        <MerkenButton ausschreibungId={id} />
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {item.auftragsart && <Badge>{item.auftragsart}</Badge>}
        {item.verfahrensart && <Badge variant="outline">{item.verfahrensart}</Badge>}
        {item.abgabefrist && (
          <Badge variant={fristAbgelaufen ? "destructive" : "default"}>
            {fristAbgelaufen ? "Abgelaufen: " : "Frist: "}
            {format(new Date(item.abgabefrist), "dd.MM.yyyy", { locale: de })}
          </Badge>
        )}
        {item.source_portal && (
          <Badge variant="secondary">{item.source_portal}</Badge>
        )}
      </div>

      {/* Zur Ausschreibung Button — immer sichtbar */}
      {item.source_url && (
        <div className="mb-6">
          <a href={item.source_url} target="_blank" rel="noopener noreferrer">
            <Button className="w-full sm:w-auto" size="lg">
              Zur Ausschreibung auf der Originalplattform &rarr;
            </Button>
          </a>
        </div>
      )}

      {/* KI-Zusammenfassung */}
      {item.ki_zusammenfassung && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base text-blue-800">KI-Zusammenfassung</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-900 whitespace-pre-wrap">{item.ki_zusammenfassung}</p>
          </CardContent>
        </Card>
      )}

      {/* Details-Grid */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            {item.auftraggeber_name && (
              <div>
                <dt className="font-medium text-gray-500">Auftraggeber</dt>
                <dd className="text-gray-900">{item.auftraggeber_name}</dd>
              </div>
            )}
            {item.auftraggeber_ort && (
              <div>
                <dt className="font-medium text-gray-500">Ort</dt>
                <dd className="text-gray-900">
                  {item.auftraggeber_plz ? `${item.auftraggeber_plz} ` : ""}
                  {item.auftraggeber_ort}
                </dd>
              </div>
            )}
            {item.auftraggeber_bundesland && (
              <div>
                <dt className="font-medium text-gray-500">Bundesland</dt>
                <dd className="text-gray-900">{item.auftraggeber_bundesland}</dd>
              </div>
            )}
            {item.auftragsart && (
              <div>
                <dt className="font-medium text-gray-500">Auftragsart</dt>
                <dd className="text-gray-900">{item.auftragsart}</dd>
              </div>
            )}
            {item.verfahrensart && (
              <div>
                <dt className="font-medium text-gray-500">Verfahrensart</dt>
                <dd className="text-gray-900">{item.verfahrensart}</dd>
              </div>
            )}
            {item.abgabefrist && (
              <div>
                <dt className="font-medium text-gray-500">Abgabefrist</dt>
                <dd className={fristAbgelaufen ? "text-red-600 font-medium" : "text-gray-900"}>
                  {format(new Date(item.abgabefrist), "dd.MM.yyyy HH:mm", { locale: de })}
                  {fristAbgelaufen && " (abgelaufen)"}
                </dd>
              </div>
            )}
            {item.veroeffentlicht_am && (
              <div>
                <dt className="font-medium text-gray-500">Veröffentlicht</dt>
                <dd className="text-gray-900">
                  {format(new Date(item.veroeffentlicht_am), "dd.MM.yyyy", { locale: de })}
                </dd>
              </div>
            )}
            {item.auftragswert_eur && (
              <div>
                <dt className="font-medium text-gray-500">Auftragswert</dt>
                <dd className="text-gray-900">
                  {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(item.auftragswert_eur)}
                </dd>
              </div>
            )}
            {item.kontakt_email && (
              <div>
                <dt className="font-medium text-gray-500">Kontakt</dt>
                <dd>
                  <a href={`mailto:${item.kontakt_email}`} className="text-blue-600 hover:underline">
                    {item.kontakt_email}
                  </a>
                </dd>
              </div>
            )}
            {item.source_portal && (
              <div>
                <dt className="font-medium text-gray-500">Quelle</dt>
                <dd className="text-gray-900">{item.source_portal}</dd>
              </div>
            )}
          </dl>

          {/* CPV-Codes */}
          {item.cpv_codes && item.cpv_codes.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-gray-500 mb-2">CPV-Codes</p>
              <div className="flex flex-wrap gap-1">
                {item.cpv_codes.map((cpv) => (
                  <Badge key={cpv} variant="secondary" className="text-xs">{cpv}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Beschreibung */}
      {item.beschreibung && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Beschreibung</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.beschreibung}</p>
          </CardContent>
        </Card>
      )}

      {/* Dokumente */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">
            Dokumente {docs.length > 0 ? `(${docs.length})` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {docs.length > 0 ? (
            <div className="space-y-2">
              {docs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.dateiname || "Dokument"}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {doc.dateityp && (
                        <Badge variant="secondary" className="text-xs">{doc.dateityp}</Badge>
                      )}
                      {doc.klassifikation && (
                        <Badge variant="outline" className="text-xs">{doc.klassifikation}</Badge>
                      )}
                    </div>
                  </div>
                  {doc.original_url && (
                    <a
                      href={doc.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 shrink-0"
                    >
                      <Button variant="outline" size="sm">Öffnen</Button>
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 mb-3">
                Keine Dokumente in der Datenbank.
              </p>
              {item.source_url && (
                <a href={item.source_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">
                    Dokumente auf der Originalplattform ansehen &rarr;
                  </Button>
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
