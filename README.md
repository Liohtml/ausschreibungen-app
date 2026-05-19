<p align="center">
  <strong>ausschreibungen.de</strong>
</p>

<p align="center">
  Alle deutschen Ausschreibungen. 23 Plattformen. KI-Zusammenfassungen. Täglich aktuell.
</p>

<p align="center">
  <a href="https://ausschreibungen-app.vercel.app">Live Demo</a> &middot;
  <a href="#funktionen">Funktionen</a> &middot;
  <a href="#tech-stack">Tech Stack</a> &middot;
  <a href="#setup">Setup</a>
</p>

---

## Überblick

**ausschreibungen.de** ist eine SaaS-Plattform, die alle deutschen Vergabeportale an einem Ort bündelt. Mit KI-gestützter Analyse, Umkreissuche und Echtzeit-Benachrichtigungen finden Unternehmen relevante öffentliche Aufträge in Sekunden statt Stunden.

## Funktionen

- **23 Vergabeportale** -- Alle deutschen Plattformen in einer Suche
- **KI-Zusammenfassungen** -- Automatische Analyse und Zusammenfassung jeder Ausschreibung
- **Umkreissuche** -- PLZ + Radius für standortbezogene Ergebnisse
- **Dokument-Klassifikation** -- Automatische Sortierung von Vergabeunterlagen
- **Konkurrenz-Analyse** -- Überblick über Mitbewerber bei ähnlichen Ausschreibungen
- **Echtzeit-Benachrichtigungen** -- E-Mail-Alerts bei neuen passenden Aufträgen
- **Merkliste** -- Ausschreibungen speichern und verwalten
- **Personalisiertes Dashboard** -- Statistiken, Treffer und Fristübersicht

## Tech Stack

| Kategorie | Technologie |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) |
| **UI** | [React 19](https://react.dev), [Tailwind CSS v4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) |
| **Animationen** | [Framer Motion](https://www.framer.com/motion/) |
| **Backend** | [Supabase](https://supabase.com) (Auth, Postgres, RPC) |
| **Typografie** | Poppins (Headings), Open Sans (Body) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Deployment** | [Vercel](https://vercel.com) |
| **Sprache** | TypeScript |

## Projektstruktur

```
app/
├── page.tsx                          # Landing Page
├── layout.tsx                        # Root Layout (Fonts, Metadata)
├── globals.css                       # Tailwind v4 Theme
├── auth/
│   ├── login/page.tsx                # Login
│   ├── register/page.tsx             # Registrierung
│   └── callback/route.ts            # OAuth Callback
└── (dashboard)/
    ├── layout.tsx                    # Sidebar + Auth Guard
    ├── dashboard/page.tsx            # Dashboard (Stats, Treffer)
    ├── ausschreibungen/
    │   ├── page.tsx                  # Suche + Filter
    │   └── [id]/page.tsx             # Detail-Ansicht
    ├── merkliste/page.tsx            # Gespeicherte Ausschreibungen
    └── einstellungen/page.tsx        # Profil & Suchkriterien

components/
├── ui/                               # shadcn/ui Komponenten
├── hero-section-5.tsx                # Animated Roadmap
├── logout-button.tsx                 # Client-Side Logout
└── merken-button.tsx                 # Ausschreibung merken

lib/
├── types.ts                          # TypeScript Interfaces
├── utils.ts                          # cn() Utility
└── supabase/
    ├── client.ts                     # Browser Supabase Client
    └── server.ts                     # Server Supabase Client
```

## Setup

### Voraussetzungen

- Node.js 20+
- npm
- Supabase-Projekt mit konfigurierter Datenbank

### Installation

```bash
# Repository klonen
git clone https://github.com/Liohtml/ausschreibungen-app.git
cd ausschreibungen-app

# Dependencies installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env.local
```

`.env.local` konfigurieren:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Development

```bash
npm run dev
```

App läuft auf [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Datenbank

Die App verwendet Supabase mit folgenden Haupttabellen:

- `ausschreibungen` -- Alle Ausschreibungen mit Metadaten, CPV-Codes, KI-Zusammenfassungen
- `ausschreibung_dokumente` -- Vergabeunterlagen pro Ausschreibung
- `user_profiles` -- Firmenprofil, Keywords, Standort, Radius
- `user_merkliste` -- Gespeicherte Ausschreibungen pro User

RPC-Funktion `match_ausschreibungen()` liefert personalisierte Treffer basierend auf dem Nutzerprofil.

## Deployment

Die App ist für Vercel optimiert:

```bash
npm i -g vercel
vercel deploy
```

Oder per Git-Push auf `main` mit verbundenem Vercel-Projekt.

## Lizenz

Proprietär. Alle Rechte vorbehalten.
