import { useState } from "react";
import { Upload, FileText, Activity, ThermometerSun, Gauge, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

// Mock telemetry session data (simulating ~60 seconds of log)
const generateSession = () =>
  Array.from({ length: 60 }, (_, i) => ({
    time: i,
    rpm: 2000 + Math.sin(i * 0.3) * 3000 + Math.random() * 500 + (i > 30 ? 1500 : 0),
    boost: 0.3 + Math.sin(i * 0.25) * 1.2 + Math.random() * 0.2,
    oilTemp: 90 + i * 0.5 + Math.random() * 5,
    oilPressure: 5.5 - (i > 40 ? (i - 40) * 0.08 : 0) + Math.random() * 0.3,
    afr: 11.5 + Math.sin(i * 0.15) * 1.5 + (i > 45 && i < 50 ? 3 : 0),
    egt: 750 + i * 3 + Math.random() * 30,
  }));

const sessionData = generateSession();

const sessions = [
  { id: "LOG-1847", date: "20 Feb 2026", vehicle: "GT-R R35", track: "Interlagos", duration: "18:42", status: "ok" },
  { id: "LOG-1846", date: "15 Feb 2026", vehicle: "GT-R R35", track: "Goiânia", duration: "22:15", status: "ok" },
  { id: "LOG-1845", date: "08 Feb 2026", vehicle: "BMW M3 E30", track: "Interlagos", duration: "14:33", status: "warning" },
  { id: "LOG-1844", date: "02 Feb 2026", vehicle: "911 GT3 RS", track: "Curvelo", duration: "26:10", status: "ok" },
];

const chartStyle = {
  backgroundColor: "hsl(220, 18%, 7%)",
  border: "1px solid hsl(220, 15%, 15%)",
  borderRadius: "4px",
  fontSize: "10px",
  fontFamily: "JetBrains Mono",
};

const TelemetryVault = () => {
  const [activeSession] = useState(sessions[0]);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Telemetry Vault</h1>
          <p className="text-sm text-muted-foreground mt-1">Upload, analise e monitore dados de ECU</p>
        </div>
        <Button variant="outline" size="sm" className="font-mono text-xs gap-2">
          <Upload className="w-3 h-3" /> Upload Log
        </Button>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center hover:border-primary/30 transition-colors cursor-pointer group">
        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
          <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <p className="text-sm font-medium mb-1">Arraste arquivos de log aqui</p>
        <p className="text-xs text-muted-foreground font-mono">.dat .csv .ld (FuelTech, MoTeC, Hondata)</p>
        <p className="text-[10px] text-muted-foreground mt-2">Máximo 100MB por arquivo</p>
      </div>

      {/* Session List + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sessions list */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-3 border-b border-border">
            <h3 className="text-sm font-semibold">Sessões</h3>
          </div>
          <div className="divide-y divide-border/50">
            {sessions.map((s) => (
              <div
                key={s.id}
                className={`p-3 cursor-pointer transition-colors hover:bg-secondary/50 ${
                  s.id === activeSession.id ? "bg-secondary border-l-2 border-l-primary" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-medium">{s.id}</span>
                  {s.status === "warning" ? (
                    <AlertTriangle className="w-3 h-3 text-yellow-500" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">{s.vehicle} · {s.track}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground font-mono">{s.duration}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">{s.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Telemetry Charts */}
        <div className="lg:col-span-3 space-y-4">
          {/* Health Score Banner */}
          <div className="bg-card border border-primary/30 rounded-lg p-4 glow-green-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Health Check Score</p>
                <p className="text-[10px] text-muted-foreground font-mono">{activeSession.id} · {activeSession.vehicle}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold font-mono-data text-neon">97<span className="text-lg">/100</span></p>
              <p className="text-[10px] text-muted-foreground">Nenhuma anomalia crítica</p>
            </div>
          </div>

          {/* RPM + Boost */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Gauge className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">RPM & Boost</h3>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sessionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 15%)" />
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(220, 10%, 45%)" }} axisLine={false} />
                  <YAxis yAxisId="rpm" tick={{ fontSize: 9, fill: "hsl(220, 10%, 45%)" }} axisLine={false} domain={[0, 9000]} />
                  <YAxis yAxisId="boost" orientation="right" tick={{ fontSize: 9, fill: "hsl(220, 10%, 45%)" }} axisLine={false} domain={[0, 3]} />
                  <Tooltip contentStyle={chartStyle} />
                  <Line yAxisId="rpm" type="monotone" dataKey="rpm" stroke="hsl(145, 100%, 50%)" strokeWidth={1} dot={false} />
                  <Line yAxisId="boost" type="monotone" dataKey="boost" stroke="hsl(200, 100%, 60%)" strokeWidth={1} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Oil & AFR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <ThermometerSun className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-semibold">Óleo — Temp & Pressão</h3>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sessionData}>
                    <defs>
                      <linearGradient id="oilGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(30, 100%, 50%)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="hsl(30, 100%, 50%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 15%)" />
                    <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(220, 10%, 45%)" }} axisLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "hsl(220, 10%, 45%)" }} axisLine={false} />
                    <Tooltip contentStyle={chartStyle} />
                    <Area type="monotone" dataKey="oilTemp" stroke="hsl(30, 100%, 50%)" fill="url(#oilGrad)" strokeWidth={1} />
                    <Line type="monotone" dataKey="oilPressure" stroke="hsl(0, 85%, 55%)" strokeWidth={1} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">AFR (Air-Fuel Ratio)</h3>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sessionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 15%)" />
                    <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(220, 10%, 45%)" }} axisLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "hsl(220, 10%, 45%)" }} axisLine={false} domain={[10, 16]} />
                    <Tooltip contentStyle={chartStyle} />
                    <ReferenceLine y={14.7} stroke="hsl(220, 10%, 30%)" strokeDasharray="5 5" label={{ value: "Stoich", fontSize: 9, fill: "hsl(220, 10%, 45%)" }} />
                    <ReferenceLine y={11} stroke="hsl(0, 85%, 55%)" strokeDasharray="3 3" label={{ value: "Rich Limit", fontSize: 9, fill: "hsl(0, 85%, 55%)" }} />
                    <Line type="monotone" dataKey="afr" stroke="hsl(145, 100%, 50%)" strokeWidth={1} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemetryVault;
