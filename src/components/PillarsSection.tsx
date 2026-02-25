import { Shield, Activity, Lock } from "lucide-react";

const pillars = [
  {
    icon: Shield,
    tag: "PILAR 01",
    title: "The Digital Chassis",
    subtitle: "Build Sheet & TCO",
    description:
      "Cada componente mapeado como um Digital Twin. Turbinas, bicos, suspensão — tudo rastreado com data de instalação, custo e vida útil em horas. O sistema calcula o Total Asset Value em tempo real.",
    metrics: [
      { label: "Componentes", value: "∞" },
      { label: "Precisão TCO", value: "99.7%" },
    ],
  },
  {
    icon: Activity,
    tag: "PILAR 02",
    title: "Cofre de Telemetria",
    subtitle: "Data Ingest & Health Check",
    description:
      "Upload direto de logs de ECU (FuelTech, MoTeC, Hondata). O algoritmo cruza RPM × Pressão de Óleo × Temperatura e dispara alertas críticos antes que o motor quebre.",
    metrics: [
      { label: "Variáveis", value: "200+" },
      { label: "Latência", value: "<50ms" },
    ],
  },
  {
    icon: Lock,
    tag: "PILAR 03",
    title: "Cadeia de Custódia",
    subtitle: "Ledger & Blockchain Light",
    description:
      "Histórico intocável com hash criptográfico. Serviços de oficinas homologadas ganham selo verificado. Na revenda, gere um Certificado de Procedência blindado que elimina o desconto de risco.",
    metrics: [
      { label: "Integridade", value: "SHA-256" },
      { label: "Verificação", value: "On-Chain" },
    ],
  },
];

const PillarsSection = () => {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <p className="font-mono text-sm tracking-[0.3em] text-primary mb-4 uppercase">
            Arquitetura
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Os 3 Pilares do Sistema
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cada pilar opera de forma independente, mas juntos formam a camada de confiança
            inquestionável para o seu ativo automotivo.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.tag}
              className="group relative bg-card border border-border rounded-lg p-8 hover:border-primary/30 transition-all duration-500"
            >
              {/* Tag */}
              <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                {pillar.tag}
              </span>

              {/* Icon */}
              <div className="mt-6 mb-4 w-12 h-12 rounded bg-secondary flex items-center justify-center group-hover:glow-green-sm transition-all duration-500">
                <pillar.icon className="w-5 h-5 text-primary" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-1">{pillar.title}</h3>
              <p className="font-mono text-xs text-primary mb-4">{pillar.subtitle}</p>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                {pillar.description}
              </p>

              {/* Metrics */}
              <div className="flex gap-6 pt-6 border-t border-border">
                {pillar.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="font-mono text-lg font-bold text-primary">{m.value}</p>
                    <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PillarsSection;
