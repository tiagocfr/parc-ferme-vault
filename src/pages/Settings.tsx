import { User, Bell, Shield, Key, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Settings = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie seu perfil e preferências</p>
      </div>

      {/* Profile */}
      <div className="bg-card border border-border rounded-lg p-5">
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
        <Button variant="outline" size="sm" className="mt-4 font-mono text-xs">
          Salvar Alterações
        </Button>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Notificações</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: "Alertas de Telemetria", desc: "Receba alertas quando anomalias forem detectadas", enabled: true },
            { label: "Manutenção Preditiva", desc: "Notificação quando componentes estiverem próximos do limite", enabled: true },
            { label: "Novos Eventos no Ledger", desc: "Quando oficinas registrarem serviços no seu veículo", enabled: true },
            { label: "Newsletter Parc Fermé", desc: "Atualizações mensais da plataforma e eventos exclusivos", enabled: false },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between p-3 rounded bg-secondary/50 border border-border">
              <div>
                <p className="text-xs font-medium">{n.label}</p>
                <p className="text-[10px] text-muted-foreground">{n.desc}</p>
              </div>
              <div className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${n.enabled ? "bg-primary" : "bg-muted"}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-background transition-transform ${n.enabled ? "left-4" : "left-0.5"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Segurança</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded bg-secondary/50 border border-border">
            <div className="flex items-center gap-3">
              <Key className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium">Alterar Senha</p>
                <p className="text-[10px] text-muted-foreground">Última alteração: 15 Jan 2026</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="font-mono text-xs">
              Alterar
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded bg-secondary/50 border border-border">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium">Códigos de Convite</p>
                <p className="text-[10px] text-muted-foreground">2 convites disponíveis</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="font-mono text-xs">
              Gerenciar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
