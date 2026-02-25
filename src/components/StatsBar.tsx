const stats = [
  { value: "R$ 2.4B+", label: "Em ativos sob gestão" },
  { value: "347", label: "Veículos certificados" },
  { value: "12M+", label: "Data points de telemetria" },
  { value: "99.97%", label: "Uptime do cofre" },
];

const StatsBar = () => {
  return (
    <section className="relative border-y border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-mono text-2xl md:text-3xl font-bold text-neon mb-2">
                {stat.value}
              </p>
              <p className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
