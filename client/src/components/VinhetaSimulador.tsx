/**
 * Vinheta de abertura do simulador — 100% em código (sem vídeo/imagem).
 * Estilo do vídeo de referência: fundo azul-marinho quase preto, raios elétricos
 * azuis/brancos, "JSF Elétrico" com glow neon, diagrama ladder animado
 * (KM1, KT1 1.5s, KT2 2.5s, H1-H3 acendendo em sequência) e "Seja bem-vindo".
 * Som de descarga elétrica + pulso grave gerado com Web Audio API.
 * Dura ~3s e chama onFim automaticamente.
 */
import { useEffect, useRef } from "react";

const DURACAO_MS = 3200;

/* ---------- Som: descarga elétrica + pulso grave (Web Audio) ---------- */
let ctxPreparado: AudioContext | null = null;

/**
 * Deve ser chamado dentro do handler de clique (user activation) para o
 * navegador permitir o áudio. Cria e "destrava" o AudioContext na hora do gesto.
 */
export function prepararAudioVinheta() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    if (!ctxPreparado || ctxPreparado.state === "closed") {
      ctxPreparado = new Ctx();
    }
    if (ctxPreparado.state === "suspended") {
      void ctxPreparado.resume();
    }
  } catch {
    /* sem áudio */
  }
}

function tocarSomVinheta(): (() => void) | undefined {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = ctxPreparado && ctxPreparado.state !== "closed" ? ctxPreparado : new Ctx();
    if (ctx.state === "suspended") void ctx.resume();
    const master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);

    // 1) Estalo de descarga elétrica (ruído branco filtrado, 0 → 0.35s)
    const dur = 0.4;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.8);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const bp = ctx.createBiquadFilter();
    bp.type = "highpass";
    bp.frequency.value = 1800;
    const gNoise = ctx.createGain();
    gNoise.gain.setValueAtTime(0.9, ctx.currentTime);
    gNoise.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    noise.connect(bp).connect(gNoise).connect(master);
    noise.start();

    // 2) Zap descendente (oscilador sawtooth rápido, simula o raio)
    const zap = ctx.createOscillator();
    zap.type = "sawtooth";
    zap.frequency.setValueAtTime(2600, ctx.currentTime);
    zap.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.3);
    const gZap = ctx.createGain();
    gZap.gain.setValueAtTime(0.25, ctx.currentTime);
    gZap.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
    zap.connect(gZap).connect(master);
    zap.start();
    zap.stop(ctx.currentTime + 0.35);

    // 3) Pulsos graves rítmicos (estilo synthwave) em 0.5s, 1.1s, 1.7s, 2.3s
    [0.5, 1.1, 1.7, 2.3].forEach(t => {
      const kick = ctx.createOscillator();
      kick.type = "sine";
      kick.frequency.setValueAtTime(150, ctx.currentTime + t);
      kick.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + t + 0.18);
      const gK = ctx.createGain();
      gK.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      gK.gain.exponentialRampToValueAtTime(0.55, ctx.currentTime + t + 0.015);
      gK.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.22);
      kick.connect(gK).connect(master);
      kick.start(ctx.currentTime + t);
      kick.stop(ctx.currentTime + t + 0.25);
    });

    // 4) Hum elétrico de fundo (60Hz + harmônico), fade in/out
    const hum = ctx.createOscillator();
    hum.type = "triangle";
    hum.frequency.value = 120;
    const gHum = ctx.createGain();
    gHum.gain.setValueAtTime(0.0001, ctx.currentTime);
    gHum.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.4);
    gHum.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + DURACAO_MS / 1000);
    hum.connect(gHum).connect(master);
    hum.start();
    hum.stop(ctx.currentTime + DURACAO_MS / 1000 + 0.1);

    return () => {
      try {
        void ctx.close();
        if (ctx === ctxPreparado) ctxPreparado = null;
      } catch {
        /* noop */
      }
    };
  } catch {
    return;
  }
}

/* ---------- Diagrama ladder animado (SVG) ---------- */
function DiagramaAnimado() {
  return (
    <svg
      viewBox="0 0 320 150"
      className="mx-auto w-full max-w-[340px]"
      aria-hidden="true"
    >
      {/* Barramentos A1 / A2 */}
      <line x1="20" y1="15" x2="300" y2="15" stroke="#22c55e" strokeWidth="2" />
      <line x1="20" y1="135" x2="300" y2="135" stroke="#22c55e" strokeWidth="2" />
      <text x="6" y="19" fill="#7dd3fc" fontSize="9" fontFamily="monospace">A1</text>
      <text x="6" y="139" fill="#7dd3fc" fontSize="9" fontFamily="monospace">A2</text>

      {/* Ramais verticais */}
      {[60, 130, 200, 270].map(x => (
        <line key={x} x1={x} y1="15" x2={x} y2="135" stroke="#22c55e" strokeWidth="1.5" />
      ))}

      {/* Contator KM1 */}
      <rect x="48" y="60" width="24" height="24" rx="3" fill="#0b2436" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="60" y="76" fill="#e2f4ff" fontSize="8" fontFamily="monospace" textAnchor="middle">KM1</text>

      {/* Temporizadores KT1 / KT2 (blocos amarelos) */}
      <rect x="118" y="58" width="24" height="16" rx="2" fill="#facc15" className="vin-kt" />
      <text x="130" y="69" fill="#1a1a00" fontSize="7" fontFamily="monospace" textAnchor="middle">1.5s</text>
      <text x="130" y="52" fill="#facc15" fontSize="8" fontFamily="monospace" textAnchor="middle">KT1</text>

      <rect x="188" y="58" width="24" height="16" rx="2" fill="#facc15" className="vin-kt vin-kt2" />
      <text x="200" y="69" fill="#1a1a00" fontSize="7" fontFamily="monospace" textAnchor="middle">2.5s</text>
      <text x="200" y="52" fill="#facc15" fontSize="8" fontFamily="monospace" textAnchor="middle">KT2</text>

      {/* Sinaleiros H1 H2 H3 acendendo em sequência */}
      {[
        { cx: 130, delay: "0.6s", label: "H1" },
        { cx: 200, delay: "1.3s", label: "H2" },
        { cx: 270, delay: "2.0s", label: "H3" },
      ].map(h => (
        <g key={h.label}>
          <circle
            cx={h.cx}
            cy="105"
            r="10"
            fill="#1c1c1c"
            stroke="#666"
            strokeWidth="1.5"
            className="vin-lampada"
            style={{ animationDelay: h.delay }}
          />
          <text x={h.cx} y="128" fill="#9fb9cc" fontSize="8" fontFamily="monospace" textAnchor="middle">
            {h.label}
          </text>
        </g>
      ))}
      {/* Sinaleiro do ramal KM1 */}
      <circle cx="60" cy="105" r="10" fill="#1c1c1c" stroke="#666" strokeWidth="1.5" className="vin-lampada" style={{ animationDelay: "0.2s" }} />
      <text x="60" y="128" fill="#9fb9cc" fontSize="8" fontFamily="monospace" textAnchor="middle">M1</text>

      {/* Pontos de corrente percorrendo o barramento superior */}
      {[0, 1, 2].map(i => (
        <circle key={i} r="2.5" fill="#7dd3fc" className="vin-eletron">
          <animateMotion
            dur="1.6s"
            begin={`${i * 0.5}s`}
            repeatCount="indefinite"
            path="M 20 15 L 300 15"
          />
        </circle>
      ))}
      {/* Pontos de corrente no barramento inferior (sentido contrário) */}
      {[0, 1].map(i => (
        <circle key={i} r="2.5" fill="#7dd3fc" className="vin-eletron">
          <animateMotion
            dur="1.8s"
            begin={`${0.3 + i * 0.7}s`}
            repeatCount="indefinite"
            path="M 300 135 L 20 135"
          />
        </circle>
      ))}
    </svg>
  );
}

/* ---------- Raios (SVG fullscreen) ---------- */
function Raios() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points="10,0 22,28 14,30 34,62 26,64 48,100"
        fill="none"
        stroke="#e0f2ff"
        strokeWidth="0.7"
        className="vin-raio"
      />
      <polyline
        points="88,0 74,25 82,27 60,58 70,60 46,100"
        fill="none"
        stroke="#7dd3fc"
        strokeWidth="0.5"
        className="vin-raio vin-raio2"
      />
      <polyline
        points="55,0 50,18 56,20 44,45"
        fill="none"
        stroke="#bae6fd"
        strokeWidth="0.4"
        className="vin-raio vin-raio3"
      />
    </svg>
  );
}

/* ---------- Componente principal ---------- */
export default function VinhetaSimulador({ onFim }: { onFim: () => void }) {
  const fimRef = useRef(onFim);
  fimRef.current = onFim;

  useEffect(() => {
    const pararSom = tocarSomVinheta();
    const t = setTimeout(() => fimRef.current(), DURACAO_MS);
    return () => {
      clearTimeout(t);
      pararSom?.();
    };
  }, []);

  return (
    <div className="vin-overlay fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#020a14]">
      {/* Trilhas de circuito de fundo */}
      <div className="vin-grid absolute inset-0" aria-hidden="true" />
      {/* Bordas pulsantes: vermelha à esquerda, azul à direita */}
      <div className="vin-borda-esq absolute inset-y-0 left-0 w-1" aria-hidden="true" />
      <div className="vin-borda-dir absolute inset-y-0 right-0 w-1" aria-hidden="true" />
      {/* Flash inicial + raios */}
      <div className="vin-flash absolute inset-0" aria-hidden="true" />
      <Raios />

      <div className="relative flex flex-col items-center px-6 text-center">
        <h1 className="vin-titulo font-display italic font-extrabold leading-none">
          <span className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">JSF</span>{" "}
          <span className="vin-eletrico">Elétrico</span>
        </h1>

        <div className="vin-diagrama mt-6 w-full rounded-xl border border-[#38bdf8]/30 bg-[#04121f]/80 p-4 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
          <DiagramaAnimado />
        </div>

        <p className="vin-bemvindo mt-6 text-lg font-semibold tracking-[0.25em] text-[#7dd3fc] sm:text-xl">
          SEJA BEM-VINDO
        </p>
      </div>
    </div>
  );
}
