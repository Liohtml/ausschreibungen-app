"use client";

import Link from "next/link";
import { motion, type Variants, type Easing } from "framer-motion";
import { AnimatedRoadmap } from "@/components/hero-section-5";
import { ArrowRight, Check } from "lucide-react";

const heroMatches = [
  {
    title: "IT-Infrastruktur Behörden",
    org: "Senatsverwaltung Berlin",
    location: "Berlin",
    deadline: "15.07.2026",
    score: 94,
  },
  {
    title: "Softwareentwicklung Portal",
    org: "Freistaat Bayern",
    location: "München",
    deadline: "22.07.2026",
    score: 87,
  },
  {
    title: "Strategieberatung Behörde",
    org: "Freie und Hansestadt Hamburg",
    location: "Hamburg",
    deadline: "01.08.2026",
    score: 81,
  },
  {
    title: "Cloud-Migration Landesbehörde",
    org: "Land Nordrhein-Westfalen",
    location: "Düsseldorf",
    deadline: "10.08.2026",
    score: 76,
  },
  {
    title: "Datenbankadministration",
    org: "Landratsamt Regensburg",
    location: "Regensburg",
    deadline: "20.08.2026",
    score: 61,
  },
  {
    title: "Netzwerkinfrastruktur Schule",
    org: "Stadtverwaltung Dresden",
    location: "Dresden",
    deadline: "28.08.2026",
    score: 58,
  },
];

const features = [
  {
    title: "23 Vergabeportale",
    description:
      "Ein Zugang zu allen deutschen Vergabeplattformen. Bundesweit, lückenlos, täglich aktuell.",
  },
  {
    title: "KI-Matching",
    description:
      "Automatische Analyse und Bewertung aller Ausschreibungen nach deinem Unternehmensprofil.",
  },
  {
    title: "Dokument-Klassifikation",
    description:
      "Vergabeunterlagen werden automatisch erkannt, kategorisiert und zusammengefasst.",
  },
  {
    title: "Umkreissuche",
    description:
      "Regionale Filterung nach PLZ und Radius. Nur relevante Aufträge aus deiner Region.",
  },
  {
    title: "Echtzeit-Benachrichtigungen",
    description:
      "Sofortige E-Mail-Benachrichtigung bei neuen Treffern. Keine Frist verpassen.",
  },
  {
    title: "Konkurrenz-Analyse",
    description:
      "Einblick in den Wettbewerb: welche Firmen bieten auf ähnliche Aufträge.",
  },
];

const pricingFeatures = [
  "Alle 23 Plattformen",
  "KI-Zusammenfassungen",
  "Dokument-Klassifikation",
  "E-Mail-Benachrichtigungen",
  "Umkreissuche",
  "Konkurrenz-Analyse",
];

const roadmapMilestones = [
  {
    id: 0,
    name: "Profil einrichten",
    description: "Branche, Standort und Umkreis angeben",
    status: "complete" as const,
    position: { top: "72%", left: "2%" },
  },
  {
    id: 1,
    name: "KI durchsucht 23 Portale",
    description: "Automatisch, täglich aktuell",
    status: "complete" as const,
    position: { top: "18%", left: "22%" },
  },
  {
    id: 2,
    name: "Passende Aufträge erhalten",
    description: "Gefiltert, zusammengefasst, bewertet",
    status: "in-progress" as const,
    position: { top: "38%", left: "48%" },
  },
  {
    id: 3,
    name: "Angebot abgeben",
    description: "Direkt zur Vergabestelle",
    status: "pending" as const,
    position: { top: "12%", right: "2%" },
  },
];

function ScorePill({ score }: { score: number }) {
  if (score >= 85)
    return (
      <span className="inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
        {score}%
      </span>
    );
  if (score >= 70)
    return (
      <span className="inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
        {score}%
      </span>
    );
  return (
    <span className="inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 border border-zinc-200">
      {score}%
    </span>
  );
}

const EASE: Easing = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.6,
      ease: EASE,
    },
  }),
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-8 h-[60px] flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-bold text-zinc-900 tracking-tight shrink-0"
          >
            Ausschreibungen.de
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-500 flex-1">
            <a
              href="#features"
              className="hover:text-zinc-900 transition-colors duration-150"
            >
              Plattformen
            </a>
            <a
              href="#pricing"
              className="hover:text-zinc-900 transition-colors duration-150"
            >
              Preise
            </a>
            <a
              href="#how"
              className="hover:text-zinc-900 transition-colors duration-150"
            >
              So funktioniert es
            </a>
          </nav>
          <div className="flex items-center gap-3 ml-auto">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors duration-150"
            >
              Einloggen
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-semibold bg-zinc-900 text-white px-4 py-2 rounded-md hover:bg-zinc-800 transition-colors duration-150"
            >
              Kostenlos testen
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — asymmetric 5/7 split */}
      <section className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] min-h-[calc(100dvh-60px)] border-b border-zinc-200">
        {/* Left: copy */}
        <div className="flex flex-col justify-between px-8 md:px-12 py-16 lg:border-r border-zinc-200">
          <div>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
              className="text-[10px] font-mono font-medium uppercase tracking-[0.16em] text-zinc-400 mb-6"
            >
              Öffentliche Vergabe · Deutschland
            </motion.p>
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="text-[52px] md:text-[64px] font-black text-zinc-950 tracking-tighter leading-none mb-6"
            >
              Kein Auftrag
              <br />
              entgeht dir.
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="text-[15px] text-zinc-500 leading-relaxed max-w-[300px] mb-10"
            >
              KI-Matching über 23 öffentliche Plattformen — täglich neue
              Treffer, automatisch gefiltert nach deinem Profil.
            </motion.p>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
              className="flex items-center gap-5"
            >
              <Link
                href="/auth/register"
                className="text-sm font-semibold bg-zinc-900 text-white px-5 py-2.5 rounded-md hover:bg-zinc-800 transition-colors duration-150"
              >
                7 Tage kostenlos
              </Link>
              <a
                href="#how"
                className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors duration-150 flex items-center gap-1"
              >
                Demo ansehen
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          </div>

          {/* Meta strip */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="flex gap-10 pt-8 border-t border-zinc-100 mt-16 lg:mt-0"
          >
            <div>
              <div className="text-2xl font-black text-zinc-950 tracking-tight leading-none">
                23
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-zinc-400 mt-1.5">
                Plattformen
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-zinc-950 tracking-tight leading-none">
                täglich
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-zinc-400 mt-1.5">
                Aktualisierung
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-zinc-950 tracking-tight leading-none">
                DE
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-zinc-400 mt-1.5">
                Bundesweit
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: product table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="hidden lg:flex flex-col overflow-hidden bg-white"
        >
          {/* Product header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-zinc-100">
            <span className="text-sm font-semibold text-zinc-900">
              Meine Treffer
            </span>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded">
              Heute · 14 neu
            </span>
          </div>
          {/* Filters */}
          <div className="flex gap-1.5 px-8 py-3 border-b border-zinc-100 bg-zinc-50/40">
            {["Alle", "IT", "Beratung", "Bayern", "Berlin"].map((f, i) => (
              <span
                key={f}
                className={`text-[10px] font-mono font-medium px-3 py-1 rounded-full border cursor-default select-none ${
                  i === 0
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
                }`}
              >
                {f}
              </span>
            ))}
          </div>
          {/* Table */}
          <div className="flex-1 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="text-left px-8 py-2.5 text-[9px] font-mono font-medium uppercase tracking-[0.14em] text-zinc-400">
                    Ausschreibung
                  </th>
                  <th className="text-left px-4 py-2.5 text-[9px] font-mono font-medium uppercase tracking-[0.14em] text-zinc-400">
                    Ort
                  </th>
                  <th className="text-left px-4 py-2.5 text-[9px] font-mono font-medium uppercase tracking-[0.14em] text-zinc-400">
                    Frist
                  </th>
                  <th className="text-right px-8 py-2.5 text-[9px] font-mono font-medium uppercase tracking-[0.14em] text-zinc-400">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {heroMatches.map((m) => (
                  <tr
                    key={m.title}
                    className="border-b border-zinc-50 hover:bg-zinc-50/80 transition-colors duration-100 cursor-default"
                  >
                    <td className="px-8 py-3.5">
                      <div className="text-[13px] font-semibold text-zinc-900 leading-tight tracking-tight">
                        {m.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {m.org}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[12px] text-zinc-600">
                      {m.location}
                    </td>
                    <td className="px-4 py-3.5 text-[11px] font-mono text-zinc-500">
                      {m.deadline}
                    </td>
                    <td className="px-8 py-3.5 text-right">
                      <ScorePill score={m.score} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 border-b border-zinc-100">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-start">
            {/* Section intro */}
            <div className="lg:sticky lg:top-24">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={fadeUp}
                custom={0}
              >
                <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-400 mb-4">
                  Funktionen
                </p>
                <h2 className="text-4xl font-black text-zinc-950 tracking-tighter leading-none mb-4">
                  Was du
                  <br />
                  bekommst.
                </h2>
                <p className="text-[15px] text-zinc-500 leading-relaxed max-w-[240px]">
                  Kein Feature-Bloat. Alles, was du für professionelle Vergabe
                  brauchst.
                </p>
              </motion.div>
            </div>

            {/* Feature grid */}
            <div className="border border-zinc-100 rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                  custom={i * 0.5}
                  className={[
                    "p-7",
                    i < features.length - 2 ? "border-b border-zinc-100" : "",
                    i % 2 === 0 ? "md:border-r md:border-zinc-100" : "",
                    // last row on odd count: no bottom border
                    i >= features.length - 2 && features.length % 2 === 0
                      ? ""
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <h3 className="text-[14px] font-semibold text-zinc-900 tracking-tight mb-2">
                    {f.title}
                  </h3>
                  <p className="text-[13px] text-zinc-500 leading-relaxed">
                    {f.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 border-b border-zinc-100">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-400 mb-4">
              So funktioniert es
            </p>
            <h2 className="text-4xl font-black text-zinc-950 tracking-tighter leading-none mb-12">
              Dein Weg
              <br />
              zum Auftrag.
            </h2>
          </motion.div>
          <AnimatedRoadmap milestones={roadmapMilestones} />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 border-b border-zinc-100">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              custom={0}
            >
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-400 mb-4">
                Preise
              </p>
              <h2 className="text-4xl font-black text-zinc-950 tracking-tighter leading-none mb-4">
                Ein Plan.
                <br />
                Alles drin.
              </h2>
              <p className="text-[15px] text-zinc-500 leading-relaxed max-w-[300px]">
                7 Tage kostenlos testen. Keine Kreditkarte erforderlich.
                Jederzeit kündbar.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              custom={1}
              className="border border-zinc-200 rounded-lg p-8 max-w-sm"
            >
              <div className="mb-6">
                <span className="text-[48px] font-black text-zinc-950 tracking-tighter leading-none">
                  9,99
                </span>
                <span className="text-base text-zinc-400 ml-2">
                  EUR / Woche
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {pricingFeatures.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-center gap-3 text-[13px] text-zinc-700"
                  >
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register"
                className="block w-full text-center text-sm font-semibold bg-zinc-900 text-white py-3 rounded-md hover:bg-zinc-800 transition-colors duration-150"
              >
                Jetzt kostenlos starten
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-[52px] font-black text-white tracking-tighter leading-none mb-6">
              Bereit loszulegen?
            </h2>
            <p className="text-[15px] text-zinc-400 mb-10 max-w-md leading-relaxed">
              Starte noch heute. Keine Kreditkarte, keine Bindung.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 text-sm font-semibold bg-white text-zinc-950 px-6 py-3 rounded-md hover:bg-zinc-100 transition-colors duration-150"
            >
              Kostenlos testen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-zinc-950 border-t border-zinc-800/60">
        <div className="max-w-[1400px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold text-zinc-500">
            Ausschreibungen.de
          </span>
          <div className="flex items-center gap-6 text-sm text-zinc-600">
            <a
              href="#"
              className="hover:text-zinc-400 transition-colors duration-150"
            >
              Impressum
            </a>
            <a
              href="#"
              className="hover:text-zinc-400 transition-colors duration-150"
            >
              Datenschutz
            </a>
            <a
              href="#"
              className="hover:text-zinc-400 transition-colors duration-150"
            >
              AGB
            </a>
          </div>
          <p className="text-sm text-zinc-600">&copy; 2026 Ausschreibungen.de</p>
        </div>
      </footer>
    </div>
  );
}
