import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, FileText, TrendingUp, Check } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "KI-Zusammenfassungen",
    description:
      "Jede Ausschreibung wird automatisch von unserer KI analysiert und zusammengefasst. Sparen Sie Zeit bei der Sichtung.",
  },
  {
    icon: FileText,
    title: "Dokument-Klassifikation",
    description:
      "Alle Vergabeunterlagen werden automatisch klassifiziert: Leistungsverzeichnisse, Vertragsbedingungen, Formulare.",
  },
  {
    icon: TrendingUp,
    title: "Konkurrenz-Analyse",
    description:
      "Sehen Sie, welche Unternehmen sich auf ähnliche Ausschreibungen bewerben. Behalten Sie den Markt im Blick.",
  },
];

const pricingFeatures = [
  "Alle 23 Plattformen",
  "KI-Zusammenfassungen",
  "Dokument-Klassifikation",
  "Konkurrenz-Analyse",
  "E-Mail-Benachrichtigungen",
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-[#1E293B]">
            Ausschreibungen.de
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-sm text-gray-600 hover:text-[#1E293B] cursor-pointer transition-colors duration-150"
              >
                Anmelden
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="text-sm bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg cursor-pointer transition-colors duration-150">
                Kostenlos testen
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1E293B] leading-[1.1]">
            Alle deutschen
            <br />
            Ausschreibungen.
          </h1>
          <p className="text-xl text-gray-500 mt-6 max-w-xl mx-auto">
            23 Plattformen. KI-Zusammenfassungen. Täglich aktuell.
          </p>
          <div className="flex gap-4 justify-center mt-10">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg px-8 h-12 text-base cursor-pointer transition-colors duration-150"
              >
                Kostenlos testen
              </Button>
            </Link>
            <a href="#features">
              <Button
                size="lg"
                variant="ghost"
                className="text-gray-600 hover:text-[#1E293B] rounded-lg px-8 h-12 text-base cursor-pointer transition-colors duration-150"
              >
                Mehr erfahren
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#1E293B] mb-16">
            Warum Ausschreibungen.de?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#3B82F6]/10 mb-5">
                  <feature.icon className="w-6 h-6 text-[#3B82F6]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1E293B] mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-white">
        <div className="max-w-md mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#1E293B] mb-12">Preise</h2>
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <p className="text-sm font-medium text-[#3B82F6] uppercase tracking-wide mb-2">
              Pro
            </p>
            <div className="mt-2">
              <span className="text-5xl font-bold text-[#1E293B]">9,99 EUR</span>
              <span className="text-gray-500 ml-1">/ Woche</span>
            </div>
            <p className="text-gray-500 mt-3 text-sm">
              7 Tage kostenlos testen. Jederzeit kündbar.
            </p>
            <ul className="text-left space-y-3 mt-8 mb-8">
              {pricingFeatures.map((feat) => (
                <li key={feat} className="flex items-center gap-3 text-sm text-[#1E293B]">
                  <Check className="w-4 h-4 text-[#3B82F6] shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
            <Link href="/auth/register">
              <Button className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg h-11 text-sm cursor-pointer transition-colors duration-150">
                Jetzt starten
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#F8FAFC] border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-400">
          &copy; 2026 Ausschreibungen.de
        </div>
      </footer>
    </div>
  );
}
