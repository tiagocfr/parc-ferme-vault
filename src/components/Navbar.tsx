import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">
            Parc <span className="text-neon">Fermé</span>
          </span>
        </a>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {["Plataforma", "Telemetria", "Certificados"].map((link) => (
            <a
              key={link}
              href="#"
              className="font-mono text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground uppercase transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA */}
        <Button variant="heroOutline" size="sm" className="text-xs">
          Solicitar Acesso
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
