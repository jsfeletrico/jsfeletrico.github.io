/**
 * JSF Elétrico — landing page oficial do simulador (estilo "Painel de Comando").
 * Regras: tema escuro do simulador (#166184), prints REAIS do app, informações
 * oficiais da Play Store, tom para hobbyistas/aprendizes, acesso gerenciado pelo
 * administrador. Contatos: jsfeletrico@gmail.com.
 */
import { useEffect, useState } from "react";
import { useSeo } from "@/hooks/useSeo";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Play,
  Zap,
  Timer,
  Gauge,
  AlertTriangle,
  Volume2,
  Cable,
  FolderDown,
  Printer,
  ShieldCheck,
  Mail,
  ChevronRight,
  Smartphone,
  BookOpen,
  Lock,
  User,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import {
  ICONE_APP,
  BANNER_PRINCIPAL,
  PRINT_DIAGRAMA_COMPLETO,
  PRINT_SOFTSTART_RODANDO,
  PRINT_MOTOR_PLACA,
  PRINT_INVERSOR_RODANDO,
  PRINT_RELE_SOBRECARGA,
  PRINT_EMERGENCIA,
  PRINT_SINALEIRA_VERDE,
  PRINT_BIBLIOTECA,
  PRINT_TEMPORIZADOR,
  PLAY_STORE_URL,
  EMAIL_SUPORTE,
  POLITICA_PRIVACIDADE_URL,
} from "@/lib/assets";

/* ---------------- dados ---------------- */

const RECURSOS = [
  {
    icon: Cable,
    titulo: "Biblioteca completa",
    desc: "Contatores, relés térmicos, temporizadores, botoeiras, sinalizadores e motores trifásicos prontos para arrastar e soltar.",
  },
  {
    icon: Gauge,
    titulo: "Controle de velocidade",
    desc: "Inversores de frequência e soft-starters com ajuste de rampas de aceleração e desaceleração.",
  },
  {
    icon: AlertTriangle,
    titulo: "Simulação de falhas",
    desc: "Curto-circuito, falta de fase, sobrecarga e erros de inversor, com ajuste de corrente nos disjuntores e relés térmicos.",
  },
  {
    icon: Volume2,
    titulo: "Efeitos sonoros",
    desc: "Sons realistas dos motores na partida, em funcionamento, nas rampas e até em falhas como travamento ou queima.",
  },
  {
    icon: Timer,
    titulo: "Ajustes precisos",
    desc: "Temporizadores com precisão decimal e fios coloridos com função jumper para montar diagramas organizados.",
  },
  {
    icon: FolderDown,
    titulo: "Tudo offline",
    desc: "Salve seus projetos no aparelho, exporte em JSON ou PNG de alta resolução, sem depender de internet.",
  },
  {
    icon: Printer,
    titulo: "Impressão com cabeçalho",
    desc: "Imprima diagramas com cabeçalho personalizado: nome do projeto, data e o seu nome.",
  },
  {
    icon: ShieldCheck,
    titulo: "Privacidade total",
    desc: "Nenhum dado é coletado e nada é compartilhado com terceiros, conforme declarado na Play Store.",
  },
];

const GALERIA = [
  {
    src: PRINT_DIAGRAMA_COMPLETO,
    titulo: "Diagrama de comando em simulação",
    desc: "Contatores (KM), temporizadores (KT) e sinaleiros (H) energizados em tempo real.",
    wide: true,
  },
  {
    src: PRINT_SOFTSTART_RODANDO,
    titulo: "Soft-starter em funcionamento",
    desc: "Partida suave com leitura de corrente, tensão e porcentagem da rampa.",
  },
  {
    src: PRINT_INVERSOR_RODANDO,
    titulo: "Inversor de frequência",
    desc: "Motor girando a 60 Hz com leitura de corrente e RPM no display.",
  },
  {
    src: PRINT_MOTOR_PLACA,
    titulo: "Motor trifásico com placa",
    desc: "Toque na placa para ver e ajustar os dados do motor.",
  },
  {
    src: PRINT_RELE_SOBRECARGA,
    titulo: "Relé térmico em sobrecarga",
    desc: "A proteção atua e mostra o alerta piscando, como na vida real.",
  },
  {
    src: PRINT_EMERGENCIA,
    titulo: "Botoeira de emergência",
    desc: "Acionamento de emergência com destaque visual no diagrama.",
  },
  {
    src: PRINT_SINALEIRA_VERDE,
    titulo: "Sinalização luminosa",
    desc: "Sinaleiros acendem conforme o circuito é energizado.",
  },
  {
    src: PRINT_TEMPORIZADOR,
    titulo: "Relé de tempo KT1",
    desc: "Temporizador com ajuste de tempo em segundos e precisão decimal.",
  },
  {
    src: PRINT_BIBLIOTECA,
    titulo: "Biblioteca de componentes",
    desc: "Categorias organizadas: proteção, contatores, temporizadores, motores e mais.",
  },
];

const SIMBOLOGIA = [
  { sigla: "Q", nome: "Disjuntores", desc: "Proteção e seccionamento do circuito. Ex.: Q1." },
  { sigla: "F", nome: "Relés de proteção", desc: "Proteção contra sobrecarga e curto. Ex.: F1 (relé térmico)." },
  { sigla: "KM", nome: "Contatores", desc: "Ligam e desligam o motor pela bobina. Ex.: KM1, KM2." },
  { sigla: "KT", nome: "Temporizadores", desc: "Comandam ações após um tempo ajustado. Ex.: KT1, KT2." },
  { sigla: "S", nome: "Botoeiras e chaves", desc: "Comandos do operador: liga, desliga, emergência." },
  { sigla: "M", nome: "Motores", desc: "A carga acionada. Ex.: M1 (motor trifásico M3~)." },
  { sigla: "H", nome: "Sinaleiros", desc: "Lâmpadas de sinalização de estado. Ex.: H1, H2, H3." },
  { sigla: "SS", nome: "Soft-starter", desc: "Faz a partida suave do motor. Ex.: SS1." },
  { sigla: "INV", nome: "Inversor de frequência", desc: "Controla a velocidade do motor pela frequência." },
  { sigla: "X", nome: "Bornes", desc: "Pontos de conexão numerados. Ex.: X1, X2." },
  { sigla: "PE / N", nome: "Terra e neutro", desc: "PE é o aterramento de proteção; N é o neutro." },
  { sigla: "R S T", nome: "Fases da rede", desc: "As três fases de alimentação (L1, L2, L3)." },
];

const PASSOS = [
  {
    num: "1",
    titulo: "Monte",
    desc: "Arraste os componentes da biblioteca para a bancada e ligue os fios coloridos: fase, neutro, terra e jumper.",
  },
  {
    num: "2",
    titulo: "Simule",
    desc: "Toque em Simular e veja o circuito ganhar vida: contatores acionam, motores giram e sinaleiros acendem.",
  },
  {
    num: "3",
    titulo: "Aprenda",
    desc: "Provoque falhas, ajuste proteções e entenda na prática como cada componente se comporta.",
  },
];

const waHref = `https://wa.me/?text=${encodeURIComponent(
  "Olá! Conheça o JSF Elétrico, simulador de comandos elétricos: https://jsfeletrico.com"
)}`;

const mailHref = `mailto:${EMAIL_SUPORTE}?subject=${encodeURIComponent(
  "Contato pelo site jsfeletrico.com"
)}&body=${encodeURIComponent("Olá, Joelson!\n\n")}`;

/* ---------------- animações ---------------- */

const FAQ = [
  {
    pergunta: "O JSF Elétrico é gratuito?",
    resposta:
      "Sim. O aplicativo está disponível gratuitamente na Play Store para Android. Você baixa, instala e já começa a montar seus primeiros comandos elétricos sem pagar nada.",
  },
  {
    pergunta: "Preciso de internet para usar o aplicativo?",
    resposta:
      "Não. O simulador funciona 100% offline: você monta, simula e salva seus projetos direto no aparelho, sem depender de conexão. A internet só é necessária para baixar o app ou usar o simulador online aqui do site.",
  },
  {
    pergunta: "Quais componentes estão disponíveis no simulador?",
    resposta:
      "A biblioteca inclui contatores, relés térmicos, temporizadores, botoeiras, sinaleiros, disjuntores, motores trifásicos, soft-starters e inversores de frequência — tudo com comportamento e sons realistas, incluindo simulação de falhas como curto-circuito, falta de fase e sobrecarga.",
  },
  {
    pergunta: "Como funciona o acesso ao simulador online do site?",
    resposta:
      "O simulador online é liberado pelo administrador. Você solicita o acesso pelo formulário da página do simulador ou pelo e-mail jsfeletrico@gmail.com, e recebe um e-mail e senha para entrar. Já o aplicativo da Play Store não precisa de cadastro.",
  },
  {
    pergunta: "O simulador serve para estudar para provas e cursos técnicos?",
    resposta:
      "Sim. Ele foi criado justamente para quem está aprendendo comandos elétricos: estudantes de cursos técnicos, eletricistas em formação e curiosos. Você pratica partidas de motores (direta, estrela-triângulo, com reversão e mais) sem risco de choque e sem custo de componentes.",
  },
  {
    pergunta: "Posso salvar e imprimir meus diagramas?",
    resposta:
      "Pode. Os projetos ficam salvos no aparelho e podem ser exportados em JSON ou PNG de alta resolução. Também é possível imprimir com cabeçalho personalizado, incluindo nome do projeto, data e o seu nome.",
  },
  {
    pergunta: "O aplicativo coleta meus dados?",
    resposta:
      "Não. Conforme declarado na Play Store, nenhum dado é coletado e nada é compartilhado com terceiros. Sua privacidade é total.",
  },
  {
    pergunta: "O JSF Elétrico está disponível para iPhone (iOS)?",
    resposta:
      "Por enquanto o aplicativo está disponível apenas para Android, na Play Store. No iPhone, você pode usar o simulador online aqui do site solicitando acesso ao administrador.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] as const },
};

/* ---------------- componentes ---------------- */

function FiosDecorativos() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hidden lg:block">
      <svg width="100%" height="220" className="opacity-40">
        <path
          d="M -10 40 H 300 V 120 H 640 V 60 H 1000 V 140 H 1600"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.5"
          className="current-flow"
        />
        <path
          d="M -10 80 H 220 V 170 H 560 V 100 H 940 V 190 H 1600"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
          className="current-flow"
          style={{ animationDelay: "0.5s" }}
        />
      </svg>
    </div>
  );
}

function Divisor({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center gap-2 ${className}`}>
      <span className="terminal-dot" />
      <span className="fio fio-fase flex-1" />
      <span className="terminal-dot dot-cyan" />
      <span className="fio fio-neutro flex-1" />
      <span className="terminal-dot dot-green" />
    </div>
  );
}

/* ---------------- página ---------------- */

function useFaqJsonLd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "faq-jsonld";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map(f => ({
        "@type": "Question",
        name: f.pergunta,
        acceptedAnswer: { "@type": "Answer", text: f.resposta },
      })),
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById("faq-jsonld")?.remove();
    };
  }, []);
}

export default function Home() {
  useFaqJsonLd();
  useSeo({
    title: "JSF Elétrico — Simulador de Comandos Elétricos",
    description:
      "Simulador de comandos elétricos para Android: monte diagramas, simule partidas de motores e aprenda na prática. Baixe grátis o JSF Elétrico na Play Store.",
    url: "https://jsfeletrico.com/",
  });

  const [imgAmpliada, setImgAmpliada] = useState<null | { src: string; titulo: string }>(null);

  return (
    <div className="min-h-screen circuit-grid text-foreground">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-40 jsf-toolbar-gradient border-b border-[#0e3f59] shadow-lg">
        <div className="container flex h-16 items-center justify-between">
          <a href="#inicio" className="flex items-center gap-3">
            <img
              src={ICONE_APP}
              alt="Ícone do app JSF Elétrico"
              className="h-10 w-10 rounded-xl border border-white/20 shadow-md"
            />
            <span className="font-display text-lg font-bold tracking-wide text-white">
              JSF <span className="text-[#7dd3fc]">Elétrico</span>
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium text-white/85 md:flex">
            <a href="#recursos" className="transition hover:text-white">Recursos</a>
            <a href="#galeria" className="transition hover:text-white">Simulador</a>
            <a href="#simbologia" className="transition hover:text-white">Simbologia</a>
            <a href="#faq" className="transition hover:text-white">FAQ</a>
            <a href="/sobre" className="transition hover:text-white">Sobre</a>
            <a href="#contato" className="transition hover:text-white">Contato</a>
            <a href="/simulador" className="flex items-center gap-1.5 rounded-lg border border-[#38bdf8]/50 bg-[#38bdf8]/10 px-3 py-1.5 font-semibold text-[#7dd3fc] transition hover:bg-[#38bdf8]/20">
              <Zap className="h-3.5 w-3.5" />
              Simulador online
            </a>
          </nav>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#28a745] px-4 py-2 text-sm font-bold text-white shadow-md transition hover:brightness-110"
          >
            <Play className="h-4 w-4 fill-current" />
            <span className="hidden sm:inline">Baixar na Play Store</span>
            <span className="sm:hidden">Baixar</span>
          </a>
        </div>
      </header>

      <main id="inicio">
        {/* ===== Hero ===== */}
        <section className="relative overflow-hidden jsf-splash-gradient">
          <FiosDecorativos />
          <div className="container relative grid gap-10 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14 lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-white/90 backdrop-blur">
                <Smartphone className="h-3.5 w-3.5" />
                Disponível na Play Store para Android
              </div>
              <h1 className="font-display mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Monte, ligue e veja{" "}
                <span className="text-[#38bdf8]">funcionar</span>.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#b0c4de] sm:text-lg">
                O <strong className="text-white">JSF Elétrico</strong> é um simulador
                interativo de comandos elétricos para quem quer aprender e praticar
                montagens no celular. Arraste componentes, ligue os fios e simule
                partidas de motores com realismo — inclusive as falhas.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glow-pulse inline-flex items-center gap-2.5 rounded-xl bg-[#28a745] px-7 py-3.5 text-base font-bold text-white shadow-xl transition hover:brightness-110"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Baixar grátis na Play Store
                </a>
                <a
                  href="/simulador"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#38bdf8]/60 bg-[#38bdf8]/15 px-6 py-3.5 text-base font-bold text-[#7dd3fc] shadow-lg backdrop-blur transition hover:bg-[#38bdf8]/25"
                >
                  <Zap className="h-5 w-5" />
                  Acesse o simulador online
                </a>
                <a
                  href="#galeria"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  Ver o simulador
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#b0c4de]">
                <span className="flex items-center gap-2">
                  <span className="terminal-dot dot-green" /> 100% offline
                </span>
                <span className="flex items-center gap-2">
                  <span className="terminal-dot dot-cyan" /> Nenhum dado coletado
                </span>
                <span className="flex items-center gap-2">
                  <span className="terminal-dot" /> Simulação em tempo real
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="relative"
            >
              <div className="jsf-panel-teal overflow-hidden">
                <div className="jsf-toolbar-gradient flex items-center gap-2 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28a745]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ffc107]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
                  <span className="ml-2 font-display text-xs font-semibold tracking-wide text-white/80">
                    JSF Elétrico — Simulação
                  </span>
                </div>
                <img
                  src={PRINT_SOFTSTART_RODANDO}
                  alt="Print real do simulador: soft-starter em funcionamento com leituras de corrente e tensão"
                  className="w-full bg-[#0a0a0a] object-contain"
                  loading="eager"
                />
              </div>
              <p className="mt-3 text-center text-xs text-[#b0c4de]/80">
                Captura de tela real do simulador em funcionamento
              </p>
            </motion.div>
          </div>
        </section>

        <Divisor className="container -mt-1 py-2" />

        {/* ===== Banner de marca ===== */}
        <section className="container py-10">
          <motion.img
            {...fadeUp}
            src={BANNER_PRINCIPAL}
            alt="Banner do JSF Elétrico com celular mostrando o simulador"
            className="w-full rounded-2xl border border-[#166184]/60 shadow-2xl"
            loading="lazy"
          />
        </section>

        {/* ===== Conheça o desenvolvedor ===== */}
        <section className="container py-12">
          <motion.a
            {...fadeUp}
            href="/sobre"
            className="jsf-panel group relative block overflow-hidden transition duration-200 hover:border-[#38bdf8]/60 hover:shadow-[0_0_24px_rgba(56,189,248,0.18)]"
          >
            <div className="grid items-center gap-6 p-6 sm:p-8 md:grid-cols-[auto_1fr_auto]">
              <div className="mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-[#38bdf8]/50 shadow-[0_0_18px_rgba(56,189,248,0.25)] sm:h-32 sm:w-32">
                <img
                  src="/manus-storage/foto_joelson_retrato_alinhado_8892e133.png"
                  alt="Joelson da Silva Francisco, criador do JSF Elétrico, com capacete e equipamentos de segurança"
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <div className="text-center md:text-left">
                <p className="font-display inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#38bdf8]">
                  <User className="h-4 w-4" />
                  Conheça o desenvolvedor
                </p>
                <h2 className="font-display mt-2 text-2xl font-bold text-white sm:text-3xl">
                  Quem criou o JSF Elétrico?
                </h2>
                <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base md:mx-0">
                  Por trás do simulador existe uma história real: Joelson da Silva
                  Francisco, formado em eletrotécnica e apaixonado por manutenção
                  elétrica, transformou a vivência de campo em uma ferramenta de
                  aprendizado. Descubra a trajetória que deu origem ao app.
                </p>
                <blockquote className="mx-auto mt-4 max-w-2xl border-l-2 border-[#38bdf8] pl-4 text-left md:mx-0">
                  <p className="font-display text-base font-semibold italic text-[#7dd3fc] sm:text-lg">
                    “Criei o app que eu queria ter quando comecei.”
                  </p>
                  <footer className="mt-1 text-xs text-muted-foreground">
                    — Joelson da Silva Francisco, criador do JSF Elétrico
                  </footer>
                </blockquote>
              </div>
              <span className="mx-auto inline-flex items-center gap-2 rounded-xl border border-[#38bdf8]/50 bg-[#38bdf8]/10 px-5 py-3 text-sm font-bold text-[#7dd3fc] transition group-hover:bg-[#38bdf8]/20 md:mx-0">
                Ver a história
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </div>
          </motion.a>
        </section>

        {/* ===== Como funciona ===== */}
        <section className="container py-14">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-[#38bdf8]">
              Como funciona
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold text-white sm:text-4xl">
              Três passos para energizar seu primeiro circuito
            </h2>
          </motion.div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PASSOS.map((p, i) => (
              <motion.div
                key={p.num}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="jsf-panel relative p-6"
              >
                <span className="font-display absolute -top-4 left-6 flex h-9 w-9 items-center justify-center rounded-lg bg-[#166184] text-lg font-bold text-white shadow-lg">
                  {p.num}
                </span>
                <h3 className="font-display mt-4 text-xl font-bold text-white">{p.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== Recursos ===== */}
        <section id="recursos" className="border-y border-[#166184]/30 bg-[#0f172a]/60 py-16">
          <div className="container">
            <motion.div {...fadeUp} className="max-w-2xl">
              <p className="font-display text-sm font-semibold uppercase tracking-widest text-[#38bdf8]">
                Recursos
              </p>
              <h2 className="font-display mt-2 text-3xl font-bold text-white sm:text-4xl">
                Tudo o que o simulador oferece
              </h2>
              <p className="mt-3 text-muted-foreground">
                Recursos oficiais do aplicativo, direto da página na Play Store.
              </p>
            </motion.div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {RECURSOS.map((r, i) => (
                <motion.div
                  key={r.titulo}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: (i % 4) * 0.06 }}
                  className="jsf-panel group p-5 transition duration-200 hover:border-[#38bdf8]/60 hover:shadow-[0_0_18px_rgba(56,189,248,0.15)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#166184]/40 text-[#38bdf8] transition group-hover:bg-[#166184]/70">
                    <r.icon className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="font-display mt-4 text-base font-bold text-white">{r.titulo}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Galeria ===== */}
        <section id="galeria" className="container py-16">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-[#38bdf8]">
              Dentro do simulador
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold text-white sm:text-4xl">
              Capturas de tela reais do app
            </h2>
            <p className="mt-3 text-muted-foreground">
              Erros que ensinam: curto, sobrecarga e falta de fase simulados de verdade.
              Toque em uma imagem para ampliar.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {GALERIA.map((g, i) => (
              <motion.button
                key={g.src}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: (i % 3) * 0.06 }}
                onClick={() => setImgAmpliada({ src: g.src, titulo: g.titulo })}
                className={`jsf-panel group overflow-hidden text-left transition duration-200 hover:border-[#38bdf8]/60 hover:shadow-[0_0_18px_rgba(56,189,248,0.15)] ${
                  g.wide ? "sm:col-span-2 lg:col-span-3" : ""
                }`}
              >
                <div className={`flex items-center justify-center bg-[#0a0a0a] p-3 ${g.wide ? "" : "h-64"}`}>
                  <img
                    src={g.src}
                    alt={g.titulo}
                    className={`${g.wide ? "w-full" : "max-h-full"} object-contain transition duration-300 group-hover:scale-[1.02]`}
                    loading="lazy"
                  />
                </div>
                <div className="border-t border-border/60 px-4 py-3">
                  <p className="font-display text-sm font-bold text-white">{g.titulo}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{g.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Legenda de simbologia */}
          <motion.div
            {...fadeUp}
            id="simbologia"
            className="jsf-panel-teal mt-12 scroll-mt-24 p-6 md:p-8"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-[#38bdf8]" />
              <h3 className="font-display text-xl font-bold text-white">Legenda da simbologia</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              O que significam as letras que aparecem nos diagramas: a letra indica o tipo
              de componente e o número diferencia cada um (KM1, KM2, KM3...).
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SIMBOLOGIA.map((s) => (
                <div
                  key={s.sigla}
                  className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/60 p-4"
                >
                  <span className="shrink-0 rounded-md bg-[#166184]/40 px-2.5 py-1 font-mono text-sm font-bold text-[#38bdf8]">
                    {s.sigla}
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-tight text-white">{s.nome}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ===== Acesso gerenciado ===== */}
        <section className="border-y border-[#166184]/30 bg-[#0f172a]/60 py-14">
          <div className="container">
            <motion.div {...fadeUp} className="jsf-panel-teal mx-auto max-w-3xl p-7 md:p-9">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ffc107]/15 text-[#ffc107]">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    Acesso ao simulador
                  </h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    Agora você pode usar o simulador direto aqui no site! O acesso é
                    liberado pelo administrador: se você ainda não tem e-mail e senha
                    cadastrados, solicite pelo e-mail abaixo.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href="/simulador"
                      className="glow-pulse inline-flex items-center gap-2 rounded-lg bg-[#166184] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-115"
                    >
                      <Zap className="h-4 w-4" />
                      Entrar no simulador online
                    </a>
                    <a
                      href={`mailto:${EMAIL_SUPORTE}?subject=${encodeURIComponent("Solicitação de acesso ao simulador JSF Elétrico")}&body=${encodeURIComponent("Olá, quero solicitar acesso ao simulador JSF Elétrico.\n\nMeu nome: \nMeu e-mail: ")}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#38bdf8]/40 bg-[#38bdf8]/10 px-5 py-2.5 text-sm font-bold text-[#7dd3fc] transition hover:bg-[#38bdf8]/20"
                    >
                      <Mail className="h-4 w-4" />
                      Solicitar acesso por e-mail
                    </a>
                    <a
                      href={PLAY_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#28a745]/60 bg-[#28a745]/10 px-5 py-2.5 text-sm font-bold text-[#4ade80] transition hover:bg-[#28a745]/20"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      Instalar o app primeiro
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="container py-16">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <p className="font-display inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#38bdf8]">
              <HelpCircle className="h-4 w-4" />
              Perguntas frequentes
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold text-white sm:text-4xl">
              Dúvidas comuns sobre o simulador
            </h2>
            <p className="mt-3 text-muted-foreground">
              Não achou a resposta que procurava? Escreva para{" "}
              <a href={mailHref} className="text-[#7dd3fc] underline-offset-4 hover:underline">
                {EMAIL_SUPORTE}
              </a>
              .
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="mx-auto mt-10 max-w-3xl">
            <Accordion type="single" collapsible className="space-y-3">
              {FAQ.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="jsf-panel border-b-0 px-5"
                >
                  <AccordionTrigger className="py-4 text-left font-display text-base font-semibold text-white hover:no-underline">
                    {f.pergunta}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                    {f.resposta}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </section>

        {/* ===== CTA final / Contato ===== */}
        <section id="contato" className="relative overflow-hidden jsf-splash-gradient py-20">
          <div className="container relative text-center">
            <motion.div {...fadeUp} className="mx-auto max-w-2xl">
              <img
                src={ICONE_APP}
                alt="Ícone do JSF Elétrico"
                className="mx-auto h-20 w-20 rounded-2xl border border-white/20 shadow-2xl"
              />
              <h2 className="font-display mt-6 text-3xl font-bold text-white sm:text-4xl">
                Pronto para energizar seus estudos?
              </h2>
              <p className="mt-4 text-[#b0c4de]">
                Baixe o JSF Elétrico na Play Store e comece a montar seus primeiros
                comandos elétricos hoje mesmo.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glow-pulse inline-flex items-center gap-2.5 rounded-xl bg-[#28a745] px-8 py-4 text-base font-bold text-white shadow-xl transition hover:brightness-110"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Baixar na Play Store
                </a>
                <a
                  href={mailHref}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  <Mail className="h-5 w-5" />
                  {EMAIL_SUPORTE}
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ===== Footer ===== */}
      <footer className="border-t border-[#166184]/40 bg-[#07131d]">
        <Divisor className="container pt-6" />
        <div className="container flex flex-col items-center gap-6 py-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <img src={ICONE_APP} alt="Logotipo do JSF Elétrico" className="h-9 w-9 rounded-lg" />
            <div>
              <p className="font-display text-sm font-bold text-white">JSF Elétrico</p>
              <p className="text-xs text-muted-foreground">
                Simulador de comandos elétricos · www.jsfeletrico.com
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <a href="/sobre" className="transition hover:text-white">
              Sobre
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              Play Store
            </a>
            <a href={mailHref} className="transition hover:text-white">
              {EMAIL_SUPORTE}
            </a>
            <a
              href={POLITICA_PRIVACIDADE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              Política de privacidade
            </a>
          </div>
        </div>
        <div className="border-t border-white/5 py-4 text-center text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} JSF Elétrico · Desenvolvido por Joelson da Silva Francisco
        </div>
      </footer>

      {/* ===== Lightbox ===== */}
      {imgAmpliada && (
        <div
          role="dialog"
          aria-label={imgAmpliada.titulo}
          onClick={() => setImgAmpliada(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
        >
          <div className="max-h-full max-w-5xl">
            <img
              src={imgAmpliada.src}
              alt={imgAmpliada.titulo}
              className="max-h-[82vh] w-auto rounded-xl border border-[#166184] shadow-2xl"
            />
            <p className="mt-3 text-center text-sm text-white/80">
              {imgAmpliada.titulo} — toque para fechar
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
