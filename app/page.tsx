"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Search,
  FileText,
  TrendingUp,
  Check,
  MapPin,
  Zap,
  Shield,
  ArrowRight,
  Star,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedRoadmap } from "@/components/hero-section-5";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

const features = [
  {
    icon: MapPin,
    title: "Umkreissuche",
    description:
      "Finden Sie Ausschreibungen in Ihrer Region. PLZ eingeben, Radius wählen -- fertig.",
  },
  {
    icon: Search,
    title: "KI-Zusammenfassungen",
    description:
      "Jede Ausschreibung wird automatisch von unserer KI analysiert und zusammengefasst.",
  },
  {
    icon: FileText,
    title: "Dokument-Klassifikation",
    description:
      "Alle Vergabeunterlagen werden automatisch klassifiziert und sortiert.",
  },
  {
    icon: TrendingUp,
    title: "Konkurrenz-Analyse",
    description:
      "Sehen Sie, welche Unternehmen sich auf ähnliche Ausschreibungen bewerben.",
  },
  {
    icon: Zap,
    title: "Echtzeit-Benachrichtigungen",
    description:
      "Neue passende Ausschreibungen direkt per E-Mail. Nie wieder eine Frist verpassen.",
  },
  {
    icon: Shield,
    title: "Alle 23 Plattformen",
    description:
      "Ein Zugang zu allen deutschen Vergabeportalen. Kein mühsames Durchsuchen mehr.",
  },
];

const pricingFeatures = [
  "Alle 23 Plattformen",
  "KI-Zusammenfassungen",
  "Dokument-Klassifikation",
  "Konkurrenz-Analyse",
  "E-Mail-Benachrichtigungen",
  "Umkreissuche",
];

const roadmapMilestones = [
  {
    id: 0,
    name: "Profil einrichten",
    description: "Branche, Standort & Umkreis angeben",
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

const stats = [
  { value: "23", label: "Plattformen" },
  { value: "10k+", label: "Ausschreibungen" },
  { value: "500+", label: "Unternehmen" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-heading font-semibold text-[#1E293B] tracking-tight"
          >
            ausschreibungen
            <span className="text-[#3B82F6]">.de</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <a
              href="#features"
              className="hover:text-[#1E293B] transition-colors duration-200 cursor-pointer"
            >
              Funktionen
            </a>
            <a
              href="#pricing"
              className="hover:text-[#1E293B] transition-colors duration-200 cursor-pointer"
            >
              Preise
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-sm text-gray-600 hover:text-[#1E293B] cursor-pointer"
              >
                Anmelden
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="text-sm bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-full px-5 cursor-pointer transition-colors duration-200">
                Kostenlos starten
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-32 md:pb-40">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#3B82F6]/[0.04] rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#3B82F6] text-sm font-medium rounded-full mb-8">
              <Zap className="w-3.5 h-3.5" />
              23 Vergabeportale, eine Suche
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="font-heading text-[2.75rem] md:text-[4rem] lg:text-[4.5rem] font-bold tracking-tight text-[#1E293B] leading-[1.08]"
          >
            Ausschreibungen
            <br />
            <span className="text-[#3B82F6]">im Umkreis</span> gefunden.
            <br />
            <span className="text-gray-400 font-medium text-[2rem] md:text-[2.75rem] lg:text-[3rem]">
              Schnell und einfach.
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-lg md:text-xl text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            Alle deutschen Vergabeportale an einem Ort. Mit KI-Analyse,
            Umkreissuche und Echtzeit-Benachrichtigungen finden Sie relevante
            Aufträge in Sekunden.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row gap-3 justify-center mt-10"
          >
            <Link href="/auth/register">
              <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full px-8 h-12 text-base font-medium cursor-pointer transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30">
                7 Tage kostenlos testen
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <a href="#features">
              <Button
                variant="outline"
                className="rounded-full px-8 h-12 text-base text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all duration-200"
              >
                So funktioniert es
              </Button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="flex items-center justify-center gap-8 md:gap-16 mt-16 pt-10 border-t border-gray-100"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-heading font-bold text-[#1E293B]">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-6 bg-gray-50/80 border-y border-gray-100/80">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <span>Vertraut von 500+ Unternehmen in Deutschland</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-medium text-[#3B82F6] uppercase tracking-wider">
              Funktionen
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1E293B] mt-3">
              Alles, was Sie brauchen.
              <br />
              <span className="text-gray-400">Nichts, was Sie nicht brauchen.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="group p-6 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <h3 className="font-heading text-base font-semibold text-[#1E293B] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - Animated Roadmap */}
      <section className="py-24 md:py-32 bg-gray-50/60 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <span className="text-sm font-medium text-[#3B82F6] uppercase tracking-wider">
              So einfach geht es
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1E293B] mt-3">
              Ihr Weg zum Auftrag
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">
              Von der Einrichtung bis zur Angebotsabgabe -- alles in wenigen Minuten.
            </p>
          </div>
          <AnimatedRoadmap milestones={roadmapMilestones} />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 md:py-32 bg-white">
        <div className="max-w-md mx-auto px-6 text-center">
          <span className="text-sm font-medium text-[#3B82F6] uppercase tracking-wider">
            Preise
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1E293B] mt-3 mb-12">
            Ein Plan. Alles drin.
          </h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm"
          >
            <p className="text-sm font-medium text-[#3B82F6] uppercase tracking-wide mb-4">
              Pro
            </p>
            <div>
              <span className="text-5xl font-heading font-bold text-[#1E293B]">
                9,99&thinsp;EUR
              </span>
              <span className="text-gray-400 ml-2 text-base">/ Woche</span>
            </div>
            <p className="text-gray-400 mt-3 text-sm">
              7 Tage kostenlos testen. Jederzeit kündbar.
            </p>
            <ul className="text-left space-y-3 mt-8 mb-8">
              {pricingFeatures.map((feat) => (
                <li
                  key={feat}
                  className="flex items-center gap-3 text-sm text-[#1E293B]"
                >
                  <div className="w-5 h-5 rounded-full bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#3B82F6]" />
                  </div>
                  {feat}
                </li>
              ))}
            </ul>
            <Link href="/auth/register" className="block">
              <Button className="w-full bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-full h-12 text-sm font-medium cursor-pointer transition-colors duration-200">
                Jetzt kostenlos starten
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32 bg-[#1E293B]">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight">
            Bereit, Ausschreibungen
            <br />
            schneller zu finden?
          </h2>
          <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">
            Starten Sie jetzt Ihre kostenlose Testphase. Keine Kreditkarte
            erforderlich.
          </p>
          <div className="mt-10">
            <Link href="/auth/register">
              <Button className="bg-white text-[#1E293B] hover:bg-gray-100 rounded-full px-8 h-12 text-base font-medium cursor-pointer transition-colors duration-200">
                Kostenlos testen
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-[#0F172A]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-heading font-semibold text-white/80"
          >
            ausschreibungen<span className="text-[#3B82F6]">.de</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a
              href="#"
              className="hover:text-gray-300 transition-colors duration-200 cursor-pointer"
            >
              Impressum
            </a>
            <a
              href="#"
              className="hover:text-gray-300 transition-colors duration-200 cursor-pointer"
            >
              Datenschutz
            </a>
            <a
              href="#"
              className="hover:text-gray-300 transition-colors duration-200 cursor-pointer"
            >
              AGB
            </a>
          </div>
          <p className="text-sm text-gray-600">
            &copy; 2026 Ausschreibungen.de
          </p>
        </div>
      </footer>
    </div>
  );
}
