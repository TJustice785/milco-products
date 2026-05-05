import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/stakeholders")({
  component: Stakeholders,
  head: () => ({
    meta: [
      { title: "Our Stakeholders — MILCO" },
      { name: "description", content: "Meet the partners and stakeholders behind MILCO — including NUL Innovation Hub, Limkokwing University and Basotho artisan cooperatives." },
    ],
  }),
});

const partners = [
  { name: "NUL Innovation Hub", url: "https://www.nul.ls/", role: "Founding partner & incubator", logo: "🎓" },
  { name: "Limkokwing University Lesotho", url: "https://www.limkokwing.net/lesotho/", role: "Digital platform partner", logo: "💻" },
  { name: "Maluti Honey Co-operative", url: "https://example.com", role: "Honey supplier", logo: "🍯" },
  { name: "Rosehip Lesotho", url: "https://example.com", role: "Skincare supplier", logo: "🌹" },
  { name: "Thaba-Bosiu Crafts", url: "https://example.com", role: "Artisan crafts", logo: "🧺" },
  { name: "Berea Farmers Association", url: "https://example.com", role: "Fresh produce", logo: "🥬" },
  { name: "Maseru Textiles", url: "https://example.com", role: "Basotho blankets & textiles", logo: "🧵" },
  { name: "Lesotho Ministry of Trade", url: "https://www.gov.ls/", role: "Government supporter", logo: "🏛️" },
];

function Stakeholders() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-display text-4xl font-bold">Our stakeholders</h1>
        <p className="mt-3 text-muted-foreground">
          MILCO is powered by a community of universities, cooperatives, farmers, artisans and government partners — all working to celebrate Basotho craftsmanship.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {partners.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-elegant)]"
          >
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-secondary text-3xl">
              {p.logo}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 font-display text-lg font-semibold group-hover:text-primary">
                {p.name} <ExternalLink className="h-3.5 w-3.5 opacity-60" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{p.role}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
