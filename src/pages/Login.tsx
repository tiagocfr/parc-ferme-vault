import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, ArrowRight, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - branding */}
      <motion.div
        className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center bg-grid"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-transparent" />
        <motion.div
          className="relative z-10 max-w-md px-12"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.h1 variants={fadeUp} className="text-4xl font-bold mb-4">
            Parc <span className="text-neon">Fermé</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-muted-foreground text-sm leading-relaxed mb-8">
            The Automotive Asset Vault. Gerencie, certifique e monitore seus ativos automotivos de altíssima performance.
          </motion.p>
          <motion.div className="space-y-4" variants={staggerContainer}>
            {[
              { label: "Digital Chassis", desc: "Build Sheet & TCO em tempo real" },
              { label: "Telemetry Vault", desc: "Análise preditiva de dados de ECU" },
              { label: "Chain of Custody", desc: "Certificado de procedência blindado" },
            ].map((item) => (
              <motion.div key={item.label} className="flex items-start gap-3" variants={fadeUp}>
                <div className="w-1 h-8 bg-primary/60 rounded-full mt-0.5" />
                <div>
                  <span className="font-mono text-xs text-primary tracking-wider">{item.label}</span>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scan-line" />
        </div>
      </motion.div>

      {/* Right panel - form */}
      <motion.div
        className="flex-1 flex items-center justify-center p-8"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1], delay: 0.2 }}
      >
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <h1 className="text-2xl font-bold">
              Parc <span className="text-neon">Fermé</span>
            </h1>
          </div>

          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-mono text-[10px] text-primary tracking-[0.2em] uppercase">
                {isRegister ? "Comissionamento" : "Secure Access"}
              </span>
            </div>
            <h2 className="text-2xl font-bold">
              {isRegister ? "Solicitar Acesso" : "Entrar na Plataforma"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isRegister
                ? "Acesso exclusivo via convite de membros ativos."
                : "Acesse seu vault automotivo."}
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <AnimatePresence mode="popLayout">
              {isRegister && (
                <motion.div
                  key="invite"
                  className="space-y-1.5"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">
                    Código de Convite
                  </label>
                  <Input
                    placeholder="PF-XXXX-XXXX"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="bg-secondary border-border font-mono text-sm h-11"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="seu@email.com" className="bg-secondary border-border pl-10 font-mono text-sm h-11" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" placeholder="••••••••" className="bg-secondary border-border pl-10 font-mono text-sm h-11" />
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {isRegister && (
                <motion.div
                  key="name"
                  className="space-y-1.5"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">Nome Completo</label>
                  <Input placeholder="Seu nome" className="bg-secondary border-border font-mono text-sm h-11" />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" className="w-full h-11 font-mono text-xs tracking-wider gap-2">
                {isRegister ? "Solicitar Acesso" : "Acessar Vault"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.form>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {isRegister ? "Já possui acesso? Entrar" : "Solicitar acesso via convite"}
            </button>
          </motion.div>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="font-mono text-[10px] text-muted-foreground text-center leading-relaxed">
              Plataforma restrita. Acesso apenas por convite de membros ativos ou comissionamento por oficinas credenciadas.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
