import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Ausschreibung, Dokument } from "@/lib/types";
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

  if (!ausschreibung) notFound();

  const item = ausschreibung as Ausschreibung;

  const { data: dokumente } = await supabase
    .from("ausschreibung_dokumente")
    .select("*")
    .eq("ausschreibung_id", id);

  const docs = (dokumente as Dokument[] | null) ?? [];
  const fristAbgelaufen = item.abgabefrist && new Date(item.abgabefrist) < new Date();

  return (
    <div className="max-w-3xl">
      {/* Back */}
      <Link
        href="/ausschreibungen"
        className="inline-flex items-center gap-1.5 text-[12px] font-mono text-zinc-400 hover:text-zinc-700 transition-colors duration-150 mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Zurück zur Übersicht
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-[22px] font-black text-zinc-950 tracking-tight leading-tight mb-1">
            {item.titel}
          </h1>
          {item.auftraggeber_name && (
            <p className="text-[14px] text-zinc-500">{item.auftraggeber_name}</p>
          )}
          {(item.auftraggeber_ort || item.auftraggeber_bundesland) && (
            <p className="text-[13px] text-zinc-400 mt-0.5">
              {[item.auftraggeber_plz, item.auftraggeber_ort, item.auftraggeber_bundesland]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
        <MerkenButton ausschreibungId={id} />
      </div>

      {/* Meta pills */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {item.auftragsart && (
          <span className="text-[10px] font-mono font-medium px-2.5 py-1 rounded bg-zinc-900 text-white">
            {item.auftragsart}
          </span>
        )}
        {item.verfahrensart && (
          <span className="text-[10px] font-mono font-medium px-2.5 py-1 rounded border border-zinc-200 text-zinc-600">
            {item.verfahrensart}
          </span>
        )}
        {item.abgabefrist && (
          <span className={`text-[10px] font-mono font-medium px-2.5 py-1 rounded border ${
            fristAbgelaufen
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-zinc-200 text-zinc-600"
          }`}>
            {fristAbgelaufen ? "Abgelaufen: " : "Frist: "}
            {format(new Date(item.abgabefrist), "dd.MM.yyyy", { locale: de })}
          </span>
        )}
        {item.source_portal && (
          <span className="text-[10px] font-mono font-medium px-2.5 py-1 rounded border border-zinc-100 bg-zinc-50 text-zinc-400">
            {item.source_portal}
          </span>
        )}
      </div>

      {/* CTA */}
      {item.source_url && (
        <div className="mb-8">
          <a href={item.source_url} target="_blank" rel="noopener noreferrer">
            <button className="inline-flex items-center gap-2 text-sm font-semibold bg-zinc-900 text-white px-5 py-2.5 rounded-md hover:bg-zinc-800 transition-colors duration-150">
              Zur Originalplattform
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </a>
        </div>
      )}

      {/* KI-Zusammenfassung */}
      {item.ki_zusammenfassung && (
        <div className="border border-zinc-200 rounded-lg p-5 mb-5 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <p className="text-[10px] font-mono font-medium uppercase tracking-[0.12em] text-zinc-400">
              KI-Zusammenfassung
            </p>
          </div>
          <p className="text-[13px] text-zinc-700 whitespace-pre-wrap leading-relaxed">
            {item.ki_zusammenfassung}
          </p>
        </div>
      )}

      {/* Details */}
      <div className="border border-zinc-200 rounded-lg overflow-hidden mb-5 bg-white">
        <div className="px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/80">
          <p className="text-[10px] font-mono font-medium uppercase tracking-[0.12em] text-zinc-400">
            Details
          </p>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 divide-y divide-zinc-50 sm:divide-y-0">
          {[
            item.auftraggeber_name && { label: "Auftraggeber", value: item.auftraggeber_name },
            item.auftraggeber_ort && {
              label: "Ort",
              value: `${item.auftraggeber_plz ? item.auftraggeber_plz + " " : ""}${item.auftraggeber_ort}`,
            },
            item.auftraggeber_bundesland && { label: "Bundesland", value: item.auftraggeber_bundesland },
            item.auftragsart && { label: "Auftragsart", value: item.auftragsart },
            item.verfahrensart && { label: "Verfahrensart", value: item.verfahrensart },
            item.abgabefrist && {
              label: "Abgabefrist",
              value: format(new Date(item.abgabefrist), "dd.MM.yyyy HH:mm", { locale: de }) + (fristAbgelaufen ? " (abgelaufen)" : ""),
              className: fristAbgelaufen ? "text-red-600" : undefined,
            },
            item.veroeffentlicht_am && {
              label: "Veröffentlicht",
              value: format(new Date(item.veroeffentlicht_am), "dd.MM.yyyy", { locale: de }),
            },
            item.auftragswert_eur && {
              label: "Auftragswert",
              value: new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(item.auftragswert_eur),
            },
            item.source_portal && { label: "Quelle", value: item.source_portal },
          ]
            .filter(Boolean)
            .map((field, i) => {
              const f = field as { label: string; value: string; className?: string };
              return (
                <div key={i} className={`px-5 py-3.5 ${i % 2 === 0 ? "sm:border-r sm:border-zinc-50" : ""} border-b border-zinc-50 last:border-b-0`}>
                  <dt className="text-[10px] font-mono uppercase tracking-[0.1em] text-zinc-400 mb-1">
                    {f.label}
                  </dt>
                  <dd className={`text-[13px] font-medium text-zinc-800 ${f.className ?? ""}`}>
                    {f.value}
                  </dd>
                </div>
              );
            })}

          {/* Kontakt */}
          {item.kontakt_email && (
            <div className="px-5 py-3.5 border-b border-zinc-50 last:border-b-0">
              <dt className="text-[10px] font-mono uppercase tracking-[0.1em] text-zinc-400 mb-1">Kontakt</dt>
              <dd>
                <a href={`mailto:${item.kontakt_email}`} className="text-[13px] font-medium text-zinc-800 underline underline-offset-2 hover:text-zinc-600">
                  {item.kontakt_email}
                </a>
              </dd>
            </div>
          )}
        </dl>

        {/* CPV-Codes */}
        {item.cpv_codes && item.cpv_codes.length > 0 && (
          <div className="px-5 py-3.5 border-t border-zinc-100">
            <p className="text-[10px] font-mono uppercase tracking-[0.1em] text-zinc-400 mb-2">CPV-Codes</p>
            <div className="flex flex-wrap gap-1.5">
              {item.cpv_codes.map((cpv) => (
                <span key={cpv} className="text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-100 bg-zinc-50 text-zinc-500">
                  {cpv}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Beschreibung */}
      {item.beschreibung && (
        <div className="border border-zinc-200 rounded-lg overflow-hidden mb-5 bg-white">
          <div className="px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/80">
            <p className="text-[10px] font-mono font-medium uppercase tracking-[0.12em] text-zinc-400">Beschreibung</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-[13px] text-zinc-600 whitespace-pre-wrap leading-relaxed">
              {item.beschreibung}
            </p>
          </div>
        </div>
      )}

      {/* Dokumente */}
      <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
        <div className="px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/80 flex items-center justify-between">
          <p className="text-[10px] font-mono font-medium uppercase tracking-[0.12em] text-zinc-400">Dokumente</p>
          {docs.length > 0 && (
            <span className="text-[10px] font-mono text-zinc-400">{docs.length}</span>
          )}
        </div>
        {docs.length > 0 ? (
          <div>
            {docs.map((doc, i) => (
              <div
                key={doc.id}
                className={`flex items-center justify-between px-5 py-3.5 ${i < docs.length - 1 ? "border-b border-zinc-50" : ""} hover:bg-zinc-50/80 transition-colors duration-100`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-zinc-800 truncate">
                      {doc.dateiname || "Dokument"}
                    </p>
                    <div className="flex gap-1.5 mt-0.5">
                      {doc.dateityp && (
                        <span className="text-[10px] font-mono text-zinc-400">{doc.dateityp}</span>
                      )}
                      {doc.klassifikation && (
                        <span className="text-[10px] font-mono text-zinc-400">· {doc.klassifikation}</span>
                      )}
                    </div>
                  </div>
                </div>
                {doc.original_url && (
                  <a
                    href={doc.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 text-[12px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors duration-150 shrink-0"
                  >
                    Öffnen
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-10 text-center">
            <p className="text-[13px] text-zinc-400 mb-3">Keine Dokumente in der Datenbank.</p>
            {item.source_url && (
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-600 hover:text-zinc-900 underline underline-offset-2 transition-colors duration-150"
              >
                Auf der Originalplattform ansehen
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
