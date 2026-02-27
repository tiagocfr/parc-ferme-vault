import { Car, Activity, DollarSign, Shield, ArrowUpRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp, scaleIn, slideInRight, chartReveal, glowPulse } from "@/lib/animations";

const mockTelemetry = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  rpm: 3000 + Math.random() * 5000,
  temp: 80 + Math.random() * 30,
  boost: 0.5 + Math.random() * 1.8,
}));

const vehicles = [
  {
    id: "1",
    name: "Porsche 911 GT3 RS",
    year: 2024,
    chassis: "WP0ZZZ99ZRS123456",
    status: "healthy",
    assetValue: "R$ 1.850.000",
    buildValue: "R$ 420.000",
    lastSession: "12 Feb 2026",
    alerts: 0,
  },
  {
    id: "2",
    name: "BMW M3 E30 Restomod",
    year: 1990,
    chassis: "WBAAK0301LAE76543",
    status: "warning",
    assetValue: "R$ 980.000",
    buildValue: "R$ 650.000",
    lastSession: "08 Feb 2026",
    alerts: 2,
  },
  {
    id: "3",
    name: "Nissan GT-R R35 Track",
    year: 2017,
    chassis: "JN1TBNT30Z0012345",
    status: "healthy",
    assetValue: "R$ 1.200.000",
    buildValue: "R$ 380.000",
    lastSession: "20 Feb 2026",
    alerts: 0,
  },
];

const StatCard = ({ icon: Icon, label, value, sub, index }: { icon: any; label: string; value: string; sub?: string; index: number }) => (
  <motion.div
    variants={fadeUp}
    className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors"
    whileHover={{ y: -2, transition: { duration: 0.2 } }}
  >
    <div className="flex items-center justify-between mb-3">
      <span className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">{label}</span>
      <motion.div
        initial={{ rotate: -20, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
      >
        <Icon className="w-4 h-4 text-primary" />
      </motion.div>
    </div>
    <p className="text-2xl font-bold font-mono-data">{value}</p>
    {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
  </motion.div>
);

const Dashboard = () => {
  return (
    <motion.div
      className="space-y-6 max-w-7xl"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral dos seus ativos automotivos</p>
      </motion.div>

      {/* Stats */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={staggerContainer}>
        <StatCard icon={Car} label="Veículos" value="3" sub="Ativos no vault" index={0} />
        <StatCard icon={DollarSign} label="Total Asset Value" value="R$ 4.03M" sub="+12.4% vs. aquisição" index={1} />
        <StatCard icon={Activity} label="Sessões Telemetria" value="47" sub="Últimos 90 dias" index={2} />
        <StatCard icon={Shield} label="Health Score" value="94%" sub="Média da frota" index={3} />
      </motion.div>

      {/* Chart + Alerts */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-4" variants={staggerContainer}>
        <motion.div className="lg:col-span-2 bg-card border border-border rounded-lg p-4" variants={chartReveal} style={{ transformOrigin: "left" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Telemetria Agregada</h3>
              <p className="text-xs text-muted-foreground font-mono">Últimos 30 dias — Boost Pressure (bar)</p>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTelemetry}>
                <defs>
                  <linearGradient id="boostGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(145, 100%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(145, 100%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 15%)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(220, 10%, 45%)" }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(220, 10%, 45%)" }} axisLine={false} domain={[0, 3]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220, 18%, 7%)",
                    border: "1px solid hsl(220, 15%, 15%)",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontFamily: "JetBrains Mono",
                  }}
                />
                <Area type="monotone" dataKey="boost" stroke="hsl(145, 100%, 50%)" fill="url(#boostGrad)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div className="bg-card border border-border rounded-lg p-4" variants={slideInRight}>
          <h3 className="text-sm font-semibold mb-4">Alertas Recentes</h3>
          <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="flex items-start gap-3 p-3 rounded bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium">Mistura Pobre Detectada</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">BMW M3 E30 · AFR 15.2 @ 6800rpm</p>
                <p className="text-[10px] text-muted-foreground">08 Feb 2026 · Track Day Interlagos</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="flex items-start gap-3 p-3 rounded bg-neon-green/5 border border-primary/20">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium">Óleo Próximo ao Limite</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">BMW M3 E30 · 42h desde troca</p>
                <p className="text-[10px] text-muted-foreground">Recomendação: trocar em 8h de uso</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="flex items-start gap-3 p-3 rounded bg-secondary border border-border">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium">Health Check Aprovado</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">GT-R R35 · Score 97/100</p>
                <p className="text-[10px] text-muted-foreground">20 Feb 2026 · Log #1847</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Vehicle Cards */}
      <motion.div variants={fadeUp}>
        <h3 className="text-sm font-semibold mb-4">Seus Veículos</h3>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" variants={staggerContainer}>
          {vehicles.map((v, i) => (
            <motion.div
              key={v.id}
              variants={scaleIn}
              className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-all group cursor-pointer"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-3">
                <motion.div
                  className={`w-2 h-2 rounded-full ${v.status === "healthy" ? "bg-primary" : "bg-yellow-500"}`}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                />
                <span className="font-mono text-[10px] text-muted-foreground">{v.chassis.slice(0, 11)}...</span>
              </div>
              <h4 className="font-semibold text-sm mb-1">{v.name}</h4>
              <p className="text-xs text-muted-foreground mb-4">{v.year}</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground">Asset Value</p>
                  <p className="text-sm font-mono-data font-semibold">{v.assetValue}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground">Build Value</p>
                  <p className="text-sm font-mono-data font-semibold">{v.buildValue}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-[10px] text-muted-foreground font-mono">
                  Última sessão: {v.lastSession}
                </span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
