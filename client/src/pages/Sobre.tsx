/**
 * Página "Sobre" — a história de Joelson da Silva Francisco e a trajetória
 * de desenvolvimento do JSF Elétrico. Mesmo estilo "Painel de Comando" do site.
 */
import { motion } from "framer-motion";
import { useSeo } from "@/hooks/useSeo";
import { LightboxImage } from "@/components/Lightbox";
import {
  ArrowLeft,
  GraduationCap,
  Heart,
  Lightbulb,
  Play,
  Rocket,
  Smartphone,
  Wrench,
  Zap,
} from "lucide-react";
import {
  ICONE_APP,
  BANNER_PRINCIPAL,
  PRINT_BIBLIOTECA,
  PLAY_STORE_URL,
  EMAIL_SUPORTE,
} from "@/lib/assets";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] as const },
};

const MARCOS = [
  {
    icon: GraduationCap,
    titulo: "A formação",
    texto:
      "Formado em eletrotécnica, Joelson construiu sua base entendendo na teoria e na prática como a energia elétrica move a indústria: circuitos de comando, partidas de motores, proteções e automação.",
  },
  {
    icon: Wrench,
    titulo: "A paixão pela manutenção",
    texto:
      "No dia a dia da manutenção elétrica, ficou clara uma dificuldade comum: praticar comandos elétricos exige bancada, componentes e supervisão — recursos que nem todo estudante ou profissional tem à disposição.",
  },
  {
    icon: Lightbulb,
    titulo: "A ideia",
    texto:
      "E se fosse possível montar, ligar e ver um circuito funcionar direto no celular? Dessa pergunta nasceu o JSF Elétrico: um simulador que transforma qualquer smartphone em uma bancada de comandos elétricos.",
  },
  {
    icon: Smartphone,
    titulo: "O desenvolvimento",
    texto:
      "Unindo o conhecimento técnico de eletrotécnica à dedicação de aprender desenvolvimento de aplicativos, cada componente foi recriado com fidelidade: contatores, relés térmicos, temporizadores, inversores de frequência, soft-starters e motores trifásicos com sons e comportamentos realistas.",
  },
  {
    icon: Rocket,
    titulo: "O lançamento",
    texto:
      "O aplicativo foi publicado na Play Store e segue em evolução constante, recebendo novos recursos e melhorias a cada versão — sempre ouvindo quem usa o simulador para estudar e ensinar.",
  },
  {
    icon: Heart,
    titulo: "A missão",
    texto:
      "Democratizar o aprendizado de comandos elétricos: permitir que estudantes, eletricistas e curiosos pratiquem montagens com segurança, sem risco de choque e sem custo de componentes, em qualquer lugar.",
  },
];

export default function Sobre() {
  useSeo({
    title: "Sobre — JSF Elétrico",
    description:
      "Conheça Joelson da Silva Francisco, técnico em eletrotécnica, e a história do JSF Elétrico, o simulador de comandos elétricos para Android.",
    url: "https://jsfeletrico.com/sobre",
  });

  return (
    <div className="min-h-screen circuit-grid text-foreground">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-40 jsf-toolbar-gradient border-b border-[#0e3f59] shadow-lg">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-3">
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
            <a href="/" className="transition hover:text-white">Início</a>
            <a href="/#recursos" className="transition hover:text-white">Recursos</a>
            <a href="/#contato" className="transition hover:text-white">Contato</a>
            <a
              href="/simulador"
              className="flex items-center gap-1.5 rounded-lg border border-[#38bdf8]/50 bg-[#38bdf8]/10 px-3 py-1.5 font-semibold text-[#7dd3fc] transition hover:bg-[#38bdf8]/20"
            >
              <Zap className="h-3.5 w-3.5" />
              Simulador online
            </a>
          </nav>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 md:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </a>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-lg bg-[#28a745] px-4 py-2 text-sm font-bold text-white shadow-md transition hover:brightness-110 md:inline-flex"
          >
            <Play className="h-4 w-4 fill-current" />
            Baixar na Play Store
          </a>
        </div>
      </header>

      <main>
        {/* ===== Hero ===== */}
        <section className="relative overflow-hidden border-b border-[#166184]/30">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage: `url(${BANNER_PRINCIPAL})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="container relative py-16 md:py-24">
            <motion.div {...fadeUp} className="max-w-3xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/40 bg-[#38bdf8]/10 px-4 py-1.5 text-xs font-semibold text-[#7dd3fc]">
                <Zap className="h-3.5 w-3.5" />
                Sobre o criador e o projeto
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
                Uma paixão pela elétrica que virou{" "}
                <span className="text-[#38bdf8]">ferramenta de aprendizado</span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-white/80">
                O JSF Elétrico nasceu da vivência real de quem conhece o chão de
                fábrica, os painéis de comando e a dificuldade de praticar sem uma
                bancada por perto. Esta é a história por trás do simulador.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ===== Quem é Joelson ===== */}
        <section className="container py-14 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div {...fadeUp}>
              <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                Quem é <span className="text-[#38bdf8]">Joelson da Silva Francisco</span>
              </h2>
              <div className="mt-5 space-y-4 leading-relaxed text-white/80">
                <p>
                  Joelson da Silva Francisco é <strong className="text-white">formado em
                  eletrotécnica</strong> e, desde cedo, apaixonado pela área de{" "}
                  <strong className="text-white">manutenção e elétrica</strong>. Entre
                  diagramas de comando, contatores e motores, encontrou não apenas uma
                  profissão, mas uma vocação: entender como as coisas funcionam — e
                  ajudar outras pessoas a entenderem também.
                </p>
                <p>
                  Ao longo da sua trajetória na área elétrica, percebeu que a teoria dos
                  livros só se fixa de verdade quando o circuito ganha vida: quando o
                  contator fecha, o motor gira e a sinaleira acende. Mas nem todo mundo
                  tem acesso a uma bancada de treinamento, componentes industriais ou um
                  laboratório equipado.
                </p>
                <p>
                  Foi dessa inquietação que surgiu o projeto que hoje leva suas
                  iniciais: o <strong className="text-white">JSF Elétrico</strong>, um
                  simulador de comandos elétricos pensado para colocar a prática na
                  palma da mão de estudantes, eletricistas e entusiastas.
                </p>
              </div>
            </motion.div>
            <motion.div {...fadeUp} className="jsf-panel mx-auto w-full max-w-md overflow-hidden p-3">
              <LightboxImage
                src="/manus-storage/foto_joelson_retrato_alinhado_8892e133.png"
                alt="Joelson da Silva Francisco com capacete e equipamentos de segurança durante treinamento de eletricista"
                caption="Joelson em treinamento prático: capacete, óculos e cinto de segurança — a vivência de campo que inspirou o simulador"
              />
              <p className="px-2 py-3 text-center text-xs text-muted-foreground">
                Joelson em treinamento prático: capacete, óculos e cinto de segurança —
                a vivência de campo que inspirou o simulador
              </p>
            </motion.div>
          </div>
        </section>

        {/* ===== Linha do tempo ===== */}
        <section className="border-y border-[#166184]/30 bg-[#0a1929]/60 py-14 md:py-20">
          <div className="container">
            <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                A trajetória do <span className="text-[#38bdf8]">JSF Elétrico</span>
              </h2>
              <p className="mt-3 text-white/70">
                Da formação técnica ao aplicativo publicado na Play Store, uma jornada
                movida a estudo, prática e muita dedicação.
              </p>
            </motion.div>

            <div className="mx-auto mt-10 grid max-w-6xl items-start gap-8 lg:grid-cols-[0.62fr_1.38fr]">
              <div className="mx-auto flex w-full max-w-sm flex-col gap-5 lg:sticky lg:top-24">
                <motion.div {...fadeUp} className="jsf-panel overflow-hidden p-3">
                  <LightboxImage
                    src="/manus-storage/foto_joelson_sala_controle_real_5935c9ec.png"
                    alt="Joelson da Silva Francisco em uma sala de controle com múltiplos monitores exibindo telas de supervisão elétrica"
                    caption="Joelson na sala de controle: a supervisão de sistemas elétricos no dia a dia da operação industrial"
                  />
                  <p className="px-2 py-3 text-center text-xs text-muted-foreground">
                    Joelson na sala de controle: a supervisão de sistemas elétricos
                    no dia a dia da operação industrial
                  </p>
                </motion.div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {MARCOS.map((m, i) => (
                  <motion.div
                    key={m.titulo}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                    className="jsf-panel flex gap-4 p-5"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#38bdf8]/40 bg-[#38bdf8]/10">
                      <m.icon className="h-5 w-5 text-[#7dd3fc]" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-white">
                        {m.titulo}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/75">
                        {m.texto}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== O app hoje ===== */}
        <section className="container py-14 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div {...fadeUp} className="jsf-panel order-2 overflow-hidden p-3 lg:order-1">
              <LightboxImage
                src={PRINT_BIBLIOTECA}
                alt="Biblioteca de componentes do simulador JSF Elétrico"
                caption="Biblioteca de componentes: cada item recriado com fidelidade ao mundo real"
              />
              <p className="px-2 py-3 text-center text-xs text-muted-foreground">
                Biblioteca de componentes: cada item recriado com fidelidade ao mundo real
              </p>
            </motion.div>
            <motion.div {...fadeUp} className="order-1 lg:order-2">
              <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                O aplicativo <span className="text-[#38bdf8]">hoje</span>
              </h2>
              <div className="mt-5 space-y-4 leading-relaxed text-white/80">
                <p>
                  Disponível gratuitamente na Play Store, o JSF Elétrico permite montar
                  diagramas completos de comandos elétricos com contatores, relés
                  térmicos, temporizadores, botoeiras, sinaleiros, inversores de
                  frequência, soft-starters e motores trifásicos — tudo com sons
                  realistas e simulação de falhas como curto-circuito, falta de fase e
                  sobrecarga.
                </p>
                <p>
                  O projeto continua em desenvolvimento ativo, com atualizações
                  frequentes guiadas pelo retorno dos usuários. Cada nova versão nasce
                  do mesmo propósito que deu origem ao app: tornar o aprendizado de
                  comandos elétricos mais acessível, prático e seguro para todos.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#28a745] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-110"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Baixar grátis na Play Store
                </a>
                <a
                  href="/simulador"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#38bdf8]/50 bg-[#38bdf8]/10 px-5 py-2.5 text-sm font-semibold text-[#7dd3fc] transition hover:bg-[#38bdf8]/20"
                >
                  <Zap className="h-4 w-4" />
                  Acessar o simulador online
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== CTA contato ===== */}
        <section className="border-t border-[#166184]/30 bg-[#0a1929]/60">
          <div className="container py-12 text-center">
            <motion.div {...fadeUp}>
              <h2 className="font-display text-xl font-bold text-white md:text-2xl">
                Quer falar com o Joelson?
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-white/70">
                Dúvidas, sugestões ou parcerias: entre em contato pelo e-mail oficial do
                projeto.
              </p>
              <a
                href={`mailto:${EMAIL_SUPORTE}?subject=${encodeURIComponent("Contato pelo site jsfeletrico.com")}&body=${encodeURIComponent("Olá, Joelson!\n\n")}`}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#166184] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-110"
              >
                {EMAIL_SUPORTE}
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ===== Footer ===== */}
      <footer className="border-t border-[#166184]/40 bg-[#07131d]">
        <div className="container flex flex-col items-center gap-6 py-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <img src={ICONE_APP} alt="" className="h-9 w-9 rounded-lg" />
            <div>
              <p className="font-display text-sm font-bold text-white">JSF Elétrico</p>
              <p className="text-xs text-muted-foreground">
                Simulador de comandos elétricos · www.jsfeletrico.com
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <a href="/" className="transition hover:text-white">Início</a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              Play Store
            </a>
            <a href={`mailto:${EMAIL_SUPORTE}`} className="transition hover:text-white">
              {EMAIL_SUPORTE}
            </a>
          </div>
        </div>
        <div className="border-t border-white/5 py-4 text-center text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} JSF Elétrico · Desenvolvido por Joelson da Silva Francisco
        </div>
      </footer>
    </div>
  );
}
