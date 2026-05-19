import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Ausschreibung, Dokument } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { MerkenButton } from "@/components/merken-button";
import { ArrowLeft, ExternalLink, FileText, Sparkles } from "lucide-react";

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
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#1E293B] transition-colors duration-200 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zur Übersicht
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-heading font-bold text-[#1E293B]">
            {item.titel}
          </h1>
          {item.auftraggeber_name && (
            <p className="text-lg text-gray-500 mt-1">
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
            className="rounded-full text-xs border-gray-200"
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
            className="rounded-full text-xs bg-gray-50 text-gray-500 border-0"
          >
            {item.source_portal}
          </Badge>
        )}
      </div>

      {/* CTA Button */}
      {item.source_url && (
        <div className="mb-8">
          <a href={item.source_url} target="_blank" rel="noopener noreferrer">
            <Button className="w-full sm:w-auto bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl h-12 px-8 text-sm font-medium cursor-pointer transition-all duration-200 shadow-sm shadow-blue-500/10">
              Zur Originalplattform
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      )}

      {/* KI-Zusammenfassung */}
      {item.ki_zusammenfassung && (
        <div className="bg-gradient-to-br from-blue-50/80 to-blue-50/30 border border-blue-100/60 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <p className="text-sm font-semibold text-[#3B82F6]">
              KI-Zusammenfassung
            </p>
          </div>
          <p className="text-sm text-[#1E293B] whitespace-pre-wrap leading-relaxed">
            {item.ki_zusammenfassung}
          </p>
        </div>
      )}

      {/* Details-Grid */}
      <div className="bg-white border border-gray-100/80 rounded-2xl p-6 mb-6">
        <p className="text-sm font-heading font-semibold text-[#1E293B] mb-5">
          Details
        </p>
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
              <dd className="text-[#1E293B] font-medium">
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
          <div className="mt-6 pt-5 border-t border-gray-100/80">
            <p className="text-gray-400 text-sm mb-2">CPV-Codes</p>
            <div className="flex flex-wrap gap-1.5">
              {item.cpv_codes.map((cpv) => (
                <Badge
                  key={cpv}
                  variant="secondary"
                  className="rounded-full text-xs bg-gray-50 text-gray-500 border-0"
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
        <div className="bg-white border border-gray-100/80 rounded-2xl p-6 mb-6">
          <p className="text-sm font-heading font-semibold text-[#1E293B] mb-3">
            Beschreibung
          </p>
          <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
            {item.beschreibung}
          </p>
        </div>
      )}

      {/* Dokumente */}
      <div className="bg-white border border-gray-100/80 rounded-2xl p-6 mb-6">
        <p className="text-sm font-heading font-semibold text-[#1E293B] mb-4">
          Dokumente {docs.length > 0 ? `(${docs.length})` : ""}
        </p>
        {docs.length > 0 ? (
          <div className="space-y-1">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1E293B] truncate">
                      {doc.dateiname || "Dokument"}
                    </p>
                    <div className="flex gap-1.5 mt-1">
                      {doc.dateityp && (
                        <Badge
                          variant="secondary"
                          className="rounded-full text-xs bg-gray-50 text-gray-500 border-0"
                        >
                          {doc.dateityp}
                        </Badge>
                      )}
                      {doc.klassifikation && (
                        <Badge
                          variant="outline"
                          className="rounded-full text-xs border-gray-200"
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
                      className="text-sm text-gray-400 hover:text-[#3B82F6] cursor-pointer transition-colors duration-200"
                    >
                      Öffnen
                    </Button>
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-gray-300" />
            </div>
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
                  className="text-sm text-[#3B82F6] hover:text-[#2563EB] cursor-pointer transition-colors duration-200"
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
