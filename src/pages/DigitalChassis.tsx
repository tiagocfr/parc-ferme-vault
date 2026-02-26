import { useState } from "react";
import { Car, Wrench, DollarSign, Clock, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Component {
  name: string;
  brand: string;
  installed: string;
  cost: string;
  hoursUsed: number;
  maxHours: number;
  children?: Component[];
}

const buildTree: { category: string; icon: any; components: Component[] }[] = [
  {
    category: "Motor",
    icon: Wrench,
    components: [
      {
        name: "Turbo Kit",
        brand: "Garrett GTX3582R Gen II",
        installed: "15 Jan 2025",
        cost: "R$ 28.000",
        hoursUsed: 120,
        maxHours: 500,
        children: [
          { name: "Wastegate", brand: "TiAL MVS 38mm", installed: "15 Jan 2025", cost: "R$ 4.200", hoursUsed: 120, maxHours: 1000 },
          { name: "Blow-Off Valve", brand: "TiAL QR", installed: "15 Jan 2025", cost: "R$ 2.800", hoursUsed: 120, maxHours: 2000 },
        ],
      },
      { name: "Bicos Injetores (x6)", brand: "Injector Dynamics ID1700x", installed: "15 Jan 2025", cost: "R$ 9.600", hoursUsed: 120, maxHours: 2000 },
      { name: "ECU", brand: "FuelTech FT600", installed: "10 Dec 2024", cost: "R$ 12.500", hoursUsed: 180, maxHours: 5000 },
      { name: "Óleo Motor", brand: "Motul 300V 10W-60", installed: "01 Feb 2026", cost: "R$ 980", hoursUsed: 12, maxHours: 50 },
    ],
  },
  {
    category: "Suspensão",
    icon: Car,
    components: [
      { name: "Coilovers", brand: "KW Clubsport 3-Way", installed: "20 Nov 2024", cost: "R$ 42.000", hoursUsed: 200, maxHours: 1500 },
      { name: "Buchas Dianteiras", brand: "SuperPro Polyurethane", installed: "20 Nov 2024", cost: "R$ 3.200", hoursUsed: 200, maxHours: 1000 },
    ],
  },
  {
    category: "Freios",
    icon: Wrench,
    components: [
      { name: "Kit Freio Dianteiro", brand: "Brembo GT 6-Piston", installed: "05 Jan 2025", cost: "R$ 38.000", hoursUsed: 150, maxHours: 800 },
      { name: "Pastilhas Dianteiras", brand: "Pagid RSL29", installed: "10 Feb 2026", cost: "R$ 4.800", hoursUsed: 8, maxHours: 80 },
      { name: "Fluido de Freio", brand: "Motul RBF 660", installed: "10 Feb 2026", cost: "R$ 420", hoursUsed: 8, maxHours: 100 },
    ],
  },
];

const LifeBar = ({ used, max }: { used: number; max: number }) => {
  const pct = Math.min((used / max) * 100, 100);
  const color = pct > 80 ? "bg-destructive" : pct > 60 ? "bg-yellow-500" : "bg-primary";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[10px] text-muted-foreground w-14 text-right">{used}/{max}h</span>
    </div>
  );
};

const ComponentRow = ({ comp, depth = 0 }: { comp: Component; depth?: number }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = comp.children && comp.children.length > 0;

  return (
    <>
      <tr className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
        <td className="py-2.5 px-3" style={{ paddingLeft: `${12 + depth * 24}px` }}>
          <div className="flex items-center gap-2">
            {hasChildren ? (
              <button onClick={() => setOpen(!open)} className="text-muted-foreground hover:text-foreground">
                {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
            ) : (
              <span className="w-3" />
            )}
            <span className="text-xs font-medium">{comp.name}</span>
          </div>
        </td>
        <td className="py-2.5 px-3 text-xs text-muted-foreground font-mono">{comp.brand}</td>
        <td className="py-2.5 px-3 text-xs text-muted-foreground font-mono">{comp.installed}</td>
        <td className="py-2.5 px-3 text-xs font-mono-data">{comp.cost}</td>
        <td className="py-2.5 px-3 w-40">
          <LifeBar used={comp.hoursUsed} max={comp.maxHours} />
        </td>
      </tr>
      {open && comp.children?.map((child, i) => (
        <ComponentRow key={i} comp={child} depth={depth + 1} />
      ))}
    </>
  );
};

const DigitalChassis = () => {
  const totalBuild = "R$ 146.500";
  const chassisValue = "R$ 980.000";
  const totalAsset = "R$ 1.126.500";

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Digital Chassis</h1>
          <p className="text-sm text-muted-foreground mt-1">BMW M3 E30 Restomod · WBA-AK03-01L-AE76543</p>
        </div>
        <Button variant="outline" size="sm" className="font-mono text-xs gap-2">
          <Plus className="w-3 h-3" /> Adicionar Componente
        </Button>
      </div>

      {/* TCO Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Car className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">Valor do Chassi</span>
          </div>
          <p className="text-xl font-bold font-mono-data">{chassisValue}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Valor de mercado base</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="w-4 h-4 text-primary" />
            <span className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">Build Value</span>
          </div>
          <p className="text-xl font-bold font-mono-data text-neon">{totalBuild}</p>
          <p className="text-[10px] text-muted-foreground mt-1">23 componentes rastreados</p>
        </div>
        <div className="bg-card border border-primary/30 rounded-lg p-4 glow-green-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="font-mono text-[10px] text-primary tracking-wider uppercase">Total Asset Value</span>
          </div>
          <p className="text-xl font-bold font-mono-data">{totalAsset}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Chassi + Hardware investido</p>
        </div>
      </div>

      {/* Build Tree */}
      {buildTree.map((section) => (
        <div key={section.category} className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <section.icon className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold">{section.category}</h3>
            <span className="font-mono text-[10px] text-muted-foreground ml-auto">
              {section.components.length} itens
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 px-3 font-mono text-[10px] text-muted-foreground tracking-wider uppercase font-normal">Componente</th>
                  <th className="py-2 px-3 font-mono text-[10px] text-muted-foreground tracking-wider uppercase font-normal">Marca / Modelo</th>
                  <th className="py-2 px-3 font-mono text-[10px] text-muted-foreground tracking-wider uppercase font-normal">Instalação</th>
                  <th className="py-2 px-3 font-mono text-[10px] text-muted-foreground tracking-wider uppercase font-normal">Custo</th>
                  <th className="py-2 px-3 font-mono text-[10px] text-muted-foreground tracking-wider uppercase font-normal">Vida Útil</th>
                </tr>
              </thead>
              <tbody>
                {section.components.map((comp, i) => (
                  <ComponentRow key={i} comp={comp} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DigitalChassis;
