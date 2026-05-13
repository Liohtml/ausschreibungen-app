import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const features = [
  {
    title: "KI-Zusammenfassungen",
    description:
      "Jede Ausschreibung wird automatisch von unserer KI analysiert und zusammengefasst. Sparen Sie Zeit bei der Sichtung.",
  },
  {
    title: "Dokument-Klassifikation",
    description:
      "Alle Vergabeunterlagen werden automatisch klassifiziert: Leistungsverzeichnisse, Vertragsbedingungen, Formulare.",
  },
  {
    title: "Konkurrenz-Analyse",
    description:
      "Sehen Sie, welche Unternehmen sich auf ähnliche Ausschreibungen bewerben. Behalten Sie den Markt im Blick.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
            Ausschreibungen.de
          </span>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <Button variant="ghost">Anmelden</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Kostenlos testen</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-24">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Alle deutschen Ausschreibungen.
            <br />
            Täglich aktuell.
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            23 Plattformen. KI-Zusammenfassungen. 9,99 EUR/Woche.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Kostenlos testen
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline">
                Mehr erfahren
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Warum Ausschreibungen.de?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-md mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Preise</h2>
          <Card className="border-2 border-blue-600">
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">9,99 EUR</span>
                <span className="text-gray-500"> / Woche</span>
              </div>
              <CardDescription className="mt-4 text-base">
                7 Tage kostenlos testen. Jederzeit kündbar.
              </CardDescription>
            </CardHeader>
            <div className="p-6 pt-0">
              <ul className="text-left space-y-2 mb-6 text-sm text-gray-700">
                <li>Alle 23 Plattformen</li>
                <li>KI-Zusammenfassungen</li>
                <li>Dokument-Klassifikation</li>
                <li>Konkurrenz-Analyse</li>
                <li>E-Mail-Benachrichtigungen</li>
              </ul>
              <Link href="/auth/register">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Jetzt starten
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          &copy; 2026 Ausschreibungen.de. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  );
}
