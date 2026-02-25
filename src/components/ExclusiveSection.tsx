import { Button } from "@/components/ui/button";
import { Crown, Users, Building2 } from "lucide-react";

const tiers = [
  {
    icon: Crown,
    name: "Owner",
    price: "R$ 5.000",
    period: "/ano por veículo",
    features: [
      "Digital Chassis completo",
      "Upload ilimitado de telemetria",
      "Certificado de Procedência",
      "Alertas preditivos",
      "Suporte 24/7 prioritário",
    ],
  },
  {
    icon: Users,
    name: "Collector",
    price: "R$ 15.000",
    period: "/ano — até 5 veículos",
    features: [
      "Tudo do plano Owner",
      "Dashboard consolidado de coleção",
      "Relatórios de portfolio",
      "Instância dedicada",
      "Account Manager exclusivo",
    ],
    highlighted: true,
  },
  {
    icon: Building2,
    name: "Workshop",
    price: "Sob consulta",
    period: "para oficinas homologadas",
    features: [
      "Selo de Oficina Verificada",
      "Emissão de hashes por serviço",
      "Painel de clientes conectados",
      "API de integração",
      "Co-branding no certificado",
    ],
  },
];

const ExclusiveSection = () => {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="font-mono text-sm tracking-[0.3em] text-primary mb-4 uppercase">
            Acesso
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Exclusividade por Design
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Acesso apenas por convite de membros atuais ou via comissionamento
            por Oficinas de Elite credenciadas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-card border rounded-lg p-8 transition-all duration-500 ${
                tier.highlighted
                  ? "border-primary/40 glow-green-sm"
                  : "border-border hover:border-border/80"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="font-mono text-[10px] tracking-[0.2em] bg-primary text-primary-foreground px-3 py-1 rounded-full uppercase">
                    Recomendado
                  </span>
                </div>
              )}

              <tier.icon className="w-6 h-6 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
              <div className="mb-6">
                <span className="font-mono text-3xl font-bold text-neon">{tier.price}</span>
                <span className="font-mono text-xs text-muted-foreground ml-1">{tier.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-secondary-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.highlighted ? "hero" : "heroOutline"}
                className="w-full"
              >
                Solicitar Convite
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExclusiveSection;
