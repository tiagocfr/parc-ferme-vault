import { Shield, ExternalLink, CheckCircle2, Wrench, Activity, FileText, Hash, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

const events = [
  {
    id: "EVT-0042",
    type: "service",
    title: "Troca de Óleo + Filtros",
    workshop: "RS Performance",
    verified: true,
    date: "10 Feb 2026",
    hash: "0x7a3f...e91b",
    details: "Motul 300V 10W-60, filtro K&N. 42h de uso desde última troca.",
  },
  {
    id: "EVT-0041",
    type: "telemetry",
    title: "Health Check — Score 97/100",
    workshop: "Sistema Automático",
    verified: true,
    date: "20 Feb 2026",
    hash: "0x1b2c...d4e5",
    details: "Log #1847 processado. Nenhuma anomalia crítica detectada.",
  },
  {
    id: "EVT-0040",
    type: "build",
    title: "Instalação — Pastilhas Pagid RSL29",
    workshop: "RS Performance",
    verified: true,
    date: "10 Feb 2026",
    hash: "0x9e8d...c7f6",
    details: "Par dianteiro. Pastilhas anteriores com 72h de uso (90% desgaste).",
  },
  {
    id: "EVT-0039",
    type: "service",
    title: "Sangria do Sistema de Freio",
    workshop: "RS Performance",
    verified: true,
    date: "10 Feb 2026",
    hash: "0x3d4e...a2b1",
    details: "Fluido Motul RBF 660. Sangria completa nos 4 cantos.",
  },
  {
    id: "EVT-0038",
    type: "telemetry",
    title: "Alerta — Mistura Pobre Detectada",
    workshop: "Sistema Automático",
    verified: true,
    date: "08 Feb 2026",
    hash: "0x5f6a...b3c2",
    details: "AFR 15.2 @ 6800rpm por 2.1s. Log #1845. Requer revisão do mapa.",
  },
  {
    id: "EVT-0037",
    type: "build",
    title: "Instalação — Turbo Garrett GTX3582R",
    workshop: "Elite Motorsport",
    verified: true,
    date: "15 Jan 2025",
    hash: "0x8c9d...e0f1",
    details: "Kit completo com wastegate TiAL MVS e BOV TiAL QR.",
  },
  {
    id: "EVT-0036",
    type: "custody",
    title: "Veículo Comissionado no Parc Fermé",
    workshop: "Parc Fermé HQ",
    verified: true,
    date: "01 Dec 2024",
    hash: "0x0a1b...2c3d",
    details: "BMW M3 E30 Restomod registrado. Chassi: WBAAK0301LAE76543.",
  },
];

const typeIcons: Record<string, any> = {
  service: Wrench,
  telemetry: Activity,
  build: Wrench,
  custody: Shield,
};

const typeLabels: Record<string, string> = {
  service: "Serviço",
  telemetry: "Telemetria",
  build: "Build",
  custody: "Custódia",
};

const ChainOfCustody = () => {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Chain of Custody</h1>
          <p className="text-sm text-muted-foreground mt-1">Ledger de eventos verificados — BMW M3 E30 Restomod</p>
        </div>
        <Button variant="outline" size="sm" className="font-mono text-xs gap-2">
          <ExternalLink className="w-3 h-3" /> Gerar Certificado Público
        </Button>
      </div>

      {/* Certificate Preview Card */}
      <div className="bg-card border border-primary/30 rounded-lg p-5 glow-green-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">Certificado de Procedência</p>
              <p className="text-[10px] text-muted-foreground font-mono">BMW M3 E30 Restomod · WBAAK0301LAE76543</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-primary">7 eventos verificados</p>
            <p className="text-[10px] text-muted-foreground">Última atualização: 20 Feb 2026</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Health Score</p>
            <p className="text-lg font-bold font-mono-data text-neon">97/100</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Build Value</p>
            <p className="text-lg font-bold font-mono-data">R$ 146.5k</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Sessões</p>
            <p className="text-lg font-bold font-mono-data">12</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Oficinas</p>
            <p className="text-lg font-bold font-mono-data">3</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-1">
          {events.map((evt, i) => {
            const Icon = typeIcons[evt.type] || FileText;
            return (
              <div key={evt.id} className="relative pl-12">
                {/* Dot */}
                <div className="absolute left-3.5 top-4 w-3 h-3 rounded-full bg-card border-2 border-primary flex items-center justify-center z-10">
                  {evt.verified && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </div>

                <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/20 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center">
                        <Icon className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold">{evt.title}</p>
                        <p className="text-[10px] text-muted-foreground">{evt.workshop}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {evt.verified && (
                        <div className="flex items-center gap-1 text-primary">
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="font-mono text-[10px]">Verificado</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{evt.details}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        {typeLabels[evt.type]}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                      <Hash className="w-3 h-3" />
                      <span className="font-mono text-[10px]">{evt.hash}</span>
                      <Copy className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChainOfCustody;
