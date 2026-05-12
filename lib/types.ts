export interface Ausschreibung {
  id: string;
  source_portal: string;
  external_id: string;
  titel: string;
  beschreibung: string | null;
  auftraggeber_name: string | null;
  auftraggeber_ort: string | null;
  auftraggeber_bundesland: string | null;
  abgabefrist: string | null;
  cpv_codes: string[] | null;
  auftragsart: string | null;
  source_url: string | null;
  ki_zusammenfassung: string | null;
  ki_checkliste: string[] | null;
  created_at: string;
}

export interface Dokument {
  id: string;
  dateiname: string;
  original_url: string | null;
  storage_pfad: string | null;
  dateityp: string | null;
  klassifikation: string | null;
}

export interface UserProfile {
  id: string;
  firmenname: string | null;
  cpv_codes: string[] | null;
  keywords: string[] | null;
  bundeslaender: string[] | null;
  plz: string | null;
  radius_km: number | null;
  abo_status: string | null;
  abo_gueltig_bis: string | null;
}

export interface MatchResult extends Ausschreibung {
  relevanz_score: number;
}
