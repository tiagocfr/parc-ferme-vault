import heroCar from "@/assets/hero-car.png";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroCar}
          alt="High-performance vehicle in pit lane"
          className="w-full h-full object-cover opacity-40"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="w-full h-px bg-primary/10 animate-scan-line" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-1.5 mb-10">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-neon" />
          <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Invite Only — Acesso Restrito
          </span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
          <span className="block">Parc</span>
          <span className="block text-neon">Fermé</span>
        </h1>

        {/* Tagline */}
        <p className="font-mono text-sm md:text-base tracking-[0.15em] text-muted-foreground uppercase mb-4">
          The Automotive Asset Vault
        </p>

        {/* Description */}
        <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-2xl mx-auto mb-12 leading-relaxed">
          Private Banking automotivo para veículos de altíssima performance.
          Gestão de ativos, telemetria preditiva e certificação de procedência
          com rastreabilidade inquestionável.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" className="px-10 py-6 text-sm">
            Solicitar Acesso
          </Button>
          <Button variant="heroOutline" size="lg" className="px-10 py-6 text-sm">
            Ver Documentação
          </Button>
        </div>

        {/* Signature */}
        <p className="mt-20 font-mono text-xs tracking-[0.4em] text-muted-foreground/50 uppercase">
          Provenance · Performance · Permanence
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
