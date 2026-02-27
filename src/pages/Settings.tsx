import { User, Bell, Shield, Key, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/animations";

const Settings = () => {
  return (
    <motion.div className="space-y-6 max-w-3xl" variants={staggerContainer} initial="hidden" animate="show">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie seu perfil e preferências</p>
      </motion.div>

      {/* Profile */}
      <motion.div className="bg-card border border-border rounded-lg p-5" variants={fadeUp}>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Perfil</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">Nome</label>
            <Input defaultValue="Ricardo Silva" className="bg-secondary border-border font-mono text-sm h-10" />
          </div>
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">Email</label>
            <Input defaultValue="ricardo@parcferme.com" className="bg-secondary border-border font-mono text-sm h-10" />
          </div>
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">Telefone</label>
            <Input defaultValue="+55 11 99999-0000" className="bg-secondary border-border font-mono text-sm h-10" />
          </div>
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">Tier</label>
            <div className="h-10 bg-secondary border border-border rounded flex items-center px-3">
              <span className="font-mono text-sm text-primary">Owner</span>
            </div>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
          <Button variant="outline" size="sm" className="mt-4 font-mono text-xs">Salvar Alterações</Button>
        </motion.div>
      </motion.div>

      {/* Notifications */}
      <motion.div className="bg-card border border-border rounded-lg p-5" variants={fadeUp}>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Notificações</h3>
        </div>
        <motion.div className="space-y-3" variants={staggerContainer}>
          {[
            { label: "Alertas de Telemetria", desc: "Receba alertas quando anomalias forem detectadas", enabled: true },
            { label: "Manutenção Preditiva", desc: "Notificação quando componentes estiverem próximos do limite", enabled: true },
            { label: "Novos Eventos no Ledger", desc: "Quando oficinas registrarem serviços no seu veículo", enabled: true },
            { label: "Newsletter Parc Fermé", desc: "Atualizações mensais da plataforma e eventos exclusivos", enabled: false },
          ].map((n) => (
            <motion.div
              key={n.label}
              variants={fadeUp}
              className="flex items-center justify-between p-3 rounded bg-secondary/50 border border-border"
              whileHover={{ x: 2, transition: { duration: 0.15 } }}
            >
              <div>
                <p className="text-xs font-medium">{n.label}</p>
                <p className="text-[10px] text-muted-foreground">{n.desc}</p>
              </div>
              <div className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${n.enabled ? "bg-primary" : "bg-muted"}`}>
                <motion.div
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-background"
                  animate={{ left: n.enabled ? 16 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Security */}
      <motion.div className="bg-card border border-border rounded-lg p-5" variants={fadeUp}>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Segurança</h3>
        </div>
        <div className="space-y-4">
          <motion.div className="flex items-center justify-between p-3 rounded bg-secondary/50 border border-border" whileHover={{ x: 2 }}>
            <div className="flex items-center gap-3">
              <Key className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium">Alterar Senha</p>
                <p className="text-[10px] text-muted-foreground">Última alteração: 15 Jan 2026</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="font-mono text-xs">Alterar</Button>
          </motion.div>
          <motion.div className="flex items-center justify-between p-3 rounded bg-secondary/50 border border-border" whileHover={{ x: 2 }}>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium">Códigos de Convite</p>
                <p className="text-[10px] text-muted-foreground">2 convites disponíveis</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="font-mono text-xs">Gerenciar</Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
