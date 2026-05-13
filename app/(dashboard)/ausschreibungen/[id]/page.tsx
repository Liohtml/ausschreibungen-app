import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Ausschreibung, Dokument } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { MerkenButton } from "@/components/merken-button";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";

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

  const fristAbgelaufen =
    item.abgabefrist && new Date(item.abgabefrist) < new Date();

  return (
    <div className="max-w-4xl">
      <Link
        href="/ausschreibungen"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#1E293B] transition-colors duration-150 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zur Übersicht
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#1E293B]">{item.titel}</h1>
          {item.auftraggeber_name && (
            <p className="text-lg text-gray-600 mt-1">
              {item.auftraggeber_name}
            </p>
          )}
          <p className="text-gray-400 mt-1 text-sm">
            {item.auftraggeber_ort || ""}
            {item.auftraggeber_plz ? ` (${item.auftraggeber_plz})` : ""}
            {item.auftraggeber_bundesland
              ? ` — ${item.auftraggeber_bundesland}`
              : ""}
          </p>
        </div>
        <MerkenButton ausschreibungId={id} />
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        {item.auftragsart && (
          <Badge className="rounded-full text-xs bg-[#3B82F6] text-white border-0">
            {item.auftragsart}
          </Badge>
        )}
        {item.verfahrensart && (
          <Badge
            variant="outline"
            className="rounded-full text-xs"
          >
            {item.verfahrensart}
          </Badge>
        )}
        {item.abgabefrist && (
          <Badge
            variant={fristAbgelaufen ? "destructive" : "secondary"}
            className="rounded-full text-xs"
          >
            {fristAbgelaufen ? "Abgelaufen: " : "Frist: "}
            {format(new Date(item.abgabefrist), "dd.MM.yyyy", { locale: de })}
          </Badge>
        )}
        {item.source_portal && (
          <Badge
            variant="secondary"
            className="rounded-full text-xs bg-gray-100 text-gray-600 border-0"
          >
            {item.source_portal}
          </Badge>
        )}
      </div>

      {/* CTA Button */}
      {item.source_url && (
        <div className="mb-8">
          <a href={item.source_url} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg h-12 px-8 text-sm cursor-pointer transition-colors duration-150"
            >
              Zur Originalplattform
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      )}

      {/* KI-Zusammenfassung */}
      {item.ki_zusammenfassung && (
        <div className="bg-[#3B82F6]/5 border border-[#3B82F6]/10 rounded-xl p-6 mb-6">
          <p className="text-sm font-medium text-[#3B82F6] mb-2">
            KI-Zusammenfassung
          </p>
          <p className="text-sm text-[#1E293B] whitespace-pre-wrap leading-relaxed">
            {item.ki_zusammenfassung}
          </p>
        </div>
      )}

      {/* Details-Grid */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
        <p className="text-sm font-semibold text-[#1E293B] mb-5">Details</p>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 text-sm">
          {item.auftraggeber_name && (
            <div>
              <dt className="text-gray-400 mb-0.5">Auftraggeber</dt>
              <dd className="text-[#1E293B]">{item.auftraggeber_name}</dd>
            </div>
          )}
          {item.auftraggeber_ort && (
            <div>
              <dt className="text-gray-400 mb-0.5">Ort</dt>
              <dd className="text-[#1E293B]">
                {item.auftraggeber_plz ? `${item.auftraggeber_plz} ` : ""}
                {item.auftraggeber_ort}
              </dd>
            </div>
          )}
          {item.auftraggeber_bundesland && (
            <div>
              <dt className="text-gray-400 mb-0.5">Bundesland</dt>
              <dd className="text-[#1E293B]">
                {item.auftraggeber_bundesland}
              </dd>
            </div>
          )}
          {item.auftragsart && (
            <div>
              <dt className="text-gray-400 mb-0.5">Auftragsart</dt>
              <dd className="text-[#1E293B]">{item.auftragsart}</dd>
            </div>
          )}
          {item.verfahrensart && (
            <div>
              <dt className="text-gray-400 mb-0.5">Verfahrensart</dt>
              <dd className="text-[#1E293B]">{item.verfahrensart}</dd>
            </div>
          )}
          {item.abgabefrist && (
            <div>
              <dt className="text-gray-400 mb-0.5">Abgabefrist</dt>
              <dd
                className={
                  fristAbgelaufen
                    ? "text-red-500 font-medium"
                    : "text-[#1E293B]"
                }
              >
                {format(new Date(item.abgabefrist), "dd.MM.yyyy HH:mm", {
                  locale: de,
                })}
                {fristAbgelaufen && " (abgelaufen)"}
              </dd>
            </div>
          )}
          {item.veroeffentlicht_am && (
            <div>
              <dt className="text-gray-400 mb-0.5">Veröffentlicht</dt>
              <dd className="text-[#1E293B]">
                {format(new Date(item.veroeffentlicht_am), "dd.MM.yyyy", {
                  locale: de,
                })}
              </dd>
            </div>
          )}
          {item.auftragswert_eur && (
            <div>
              <dt className="text-gray-400 mb-0.5">Auftragswert</dt>
              <dd className="text-[#1E293B]">
                {new Intl.NumberFormat("de-DE", {
                  style: "currency",
                  currency: "EUR",
                }).format(item.auftragswert_eur)}
              </dd>
            </div>
          )}
          {item.kontakt_email && (
            <div>
              <dt className="text-gray-400 mb-0.5">Kontakt</dt>
              <dd>
                <a
                  href={`mailto:${item.kontakt_email}`}
                  className="text-[#3B82F6] hover:underline cursor-pointer"
                >
                  {item.kontakt_email}
                </a>
              </dd>
            </div>
          )}
          {item.source_portal && (
            <div>
              <dt className="text-gray-400 mb-0.5">Quelle</dt>
              <dd className="text-[#1E293B]">{item.source_portal}</dd>
            </div>
          )}
        </dl>

        {/* CPV-Codes */}
        {item.cpv_codes && item.cpv_codes.length > 0 && (
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-gray-400 text-sm mb-2">CPV-Codes</p>
            <div className="flex flex-wrap gap-1.5">
              {item.cpv_codes.map((cpv) => (
                <Badge
                  key={cpv}
                  variant="secondary"
                  className="rounded-full text-xs bg-gray-100 text-gray-600 border-0"
                >
                  {cpv}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Beschreibung */}
      {item.beschreibung && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
          <p className="text-sm font-semibold text-[#1E293B] mb-3">
            Beschreibung
          </p>
          <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
            {item.beschreibung}
          </p>
        </div>
      )}

      {/* Dokumente */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
        <p className="text-sm font-semibold text-[#1E293B] mb-4">
          Dokumente {docs.length > 0 ? `(${docs.length})` : ""}
        </p>
        {docs.length > 0 ? (
          <div className="space-y-1">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1E293B] truncate">
                      {doc.dateiname || "Dokument"}
                    </p>
                    <div className="flex gap-1.5 mt-1">
                      {doc.dateityp && (
                        <Badge
                          variant="secondary"
                          className="rounded-full text-xs bg-gray-100 text-gray-500 border-0"
                        >
                          {doc.dateityp}
                        </Badge>
                      )}
                      {doc.klassifikation && (
                        <Badge
                          variant="outline"
                          className="rounded-full text-xs"
                        >
                          {doc.klassifikation}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                {doc.original_url && (
                  <a
                    href={doc.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 shrink-0"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm text-gray-500 hover:text-[#1E293B] cursor-pointer transition-colors duration-150"
                    >
                      Öffnen
                    </Button>
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <FileText className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-4">
              Keine Dokumente in der Datenbank.
            </p>
            {item.source_url && (
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  className="text-sm text-[#3B82F6] hover:text-[#2563EB] cursor-pointer transition-colors duration-150"
                >
                  Dokumente auf der Originalplattform ansehen
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
