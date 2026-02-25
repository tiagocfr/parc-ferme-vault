const SiteFooter = () => {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">
              Parc <span className="text-neon">Fermé</span>
            </h3>
            <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              The Automotive Asset Vault
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-x-16 gap-y-4">
            {["Plataforma", "Telemetria", "Certificados", "API Docs", "Oficinas Parceiras", "Contato"].map((link) => (
              <a
                key={link}
                href="#"
                className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[11px] text-muted-foreground/50">
            © 2026 Parc Fermé. Todos os direitos reservados.
          </p>
          <p className="font-mono text-[11px] tracking-[0.4em] text-muted-foreground/30 uppercase">
            Provenance · Performance · Permanence
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
