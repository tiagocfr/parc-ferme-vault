import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DigitalChassis from "./pages/DigitalChassis";
import TelemetryVault from "./pages/TelemetryVault";
import ChainOfCustody from "./pages/ChainOfCustody";
import Settings from "./pages/Settings";
import PlatformLayout from "./components/platform/PlatformLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PlatformLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="chassis" element={<DigitalChassis />} />
            <Route path="telemetry" element={<TelemetryVault />} />
            <Route path="custody" element={<ChainOfCustody />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
