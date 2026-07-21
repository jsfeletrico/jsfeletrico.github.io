/**
 * Página do simulador sem autenticação
 * Acesso direto ao simulador em fullscreen
 */
import { useEffect, useState } from "react";
import { useSeo } from "@/hooks/useSeo";
import VinhetaSimulador, { prepararAudioVinheta } from "@/components/VinhetaSimulador";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function SimuladorSemLogin() {
  useSeo({
    title: "Simulador Online - JSF Elétrico",
    description: "Acesse o simulador de comandos elétricos online",
  });

  const [, navigate] = useLocation();
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    prepararAudioVinheta();
    // Usar URL do simulador hospedado
    setIframeUrl("/api/simulador");
    setLoading(false);
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#0a0f1a]">
      {/* Header fixo */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#0f1419]/80 px-4 py-3 backdrop-blur-sm">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao site
        </button>
        <h1 className="font-display text-lg font-bold text-white">Simulador JSF Elétrico</h1>
        <div className="w-24" /> {/* Espaço para balancear layout */}
      </div>

      {/* Simulador */}
      <div className="relative flex-1 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#38bdf8]" />
              <p className="text-sm text-white/70">Carregando simulador...</p>
            </div>
          </div>
        )}
        {iframeUrl && (
          <iframe
            src={iframeUrl}
            title="Simulador JSF Elétrico"
            className="h-full w-full border-none"
            allowFullScreen
          />
        )}
      </div>

      <VinhetaSimulador />
    </div>
  );
}
