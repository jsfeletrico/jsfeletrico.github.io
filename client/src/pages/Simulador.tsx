/**
 * Página única do simulador (/simulador):
 * - Não logado: tela de login + aviso para novos usuários contatarem o admin.
 * - Logado (user): simulador em iframe fullscreen.
 * - Logado (admin): abas Simulador | Usuários | Auditoria.
 * Sempre com botão "Voltar ao site".
 */
import { useEffect, useMemo, useState } from "react";
import { useSeo } from "@/hooks/useSeo";
import VinhetaSimulador, { prepararAudioVinheta } from "@/components/VinhetaSimulador";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ArrowLeft,
  Zap,
  Mail,
  Lock,
  LogOut,
  Users,
  ScrollText,
  MonitorPlay,
  Plus,
  KeyRound,
  Trash2,
  Power,
  Loader2,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { ICONE_APP, EMAIL_SUPORTE } from "@/lib/assets";

/* ------------------------------------------------------------------ */
/* util                                                                */
/* ------------------------------------------------------------------ */

function fmtData(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

const EVENTO_LABEL: Record<string, { label: string; cor: string }> = {
  login_ok: { label: "Login realizado", cor: "text-emerald-400" },
  login_falha: { label: "Falha de login", cor: "text-red-400" },
  login_bloqueado: { label: "Login bloqueado (conta desativada)", cor: "text-amber-400" },
  logout: { label: "Logout", cor: "text-slate-400" },
  simulador_acesso: { label: "Abriu o simulador", cor: "text-sky-400" },
  simulador_carregado: { label: "Simulador carregado", cor: "text-sky-300" },
  admin_criar_usuario: { label: "Admin: criou usuário", cor: "text-violet-400" },
  admin_ativar_usuario: { label: "Admin: ativou usuário", cor: "text-emerald-400" },
  admin_desativar_usuario: { label: "Admin: desativou usuário", cor: "text-amber-400" },
  admin_redefinir_senha: { label: "Admin: redefiniu senha", cor: "text-violet-400" },
  admin_excluir_usuario: { label: "Admin: excluiu usuário", cor: "text-red-400" },
  admin_definir_expiracao: { label: "Admin: alterou expiração", cor: "text-violet-400" },
  solicitacao_acesso: { label: "Solicitou acesso", cor: "text-cyan-400" },
  admin_aprovar_solicitacao: { label: "Admin: aprovou solicitação", cor: "text-emerald-400" },
  admin_dispensar_solicitacao: { label: "Admin: dispensou solicitação", cor: "text-slate-400" },
  trocar_senha: { label: "Alterou a própria senha", cor: "text-violet-400" },
};

/* ------------------------------------------------------------------ */
/* Tela de login                                                       */
/* ------------------------------------------------------------------ */

function FormSolicitarAcesso({ onVoltar }: { onVoltar: () => void }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviado, setEnviado] = useState(false);

  const solicitar = trpc.sim.solicitarAcesso.useMutation({
    onSuccess: () => {
      setEnviado(true);
      toast.success("Solicitação enviada!");
    },
    onError: e => toast.error(e.message),
  });

  if (enviado) {
    return (
      <div className="jsf-panel-teal p-7 text-center sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
          <Mail className="h-7 w-7 text-emerald-400" />
        </div>
        <h2 className="font-display mt-4 text-xl font-bold text-white">Solicitação enviada!</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          O administrador recebeu seu pedido e vai criar seu acesso. Você será avisado
          pelo e-mail informado com a sua senha de entrada.
        </p>
        <button
          onClick={onVoltar}
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao login
        </button>
      </div>
    );
  }

  return (
    <div className="jsf-panel-teal p-7 sm:p-8">
      <h2 className="font-display text-xl font-bold text-white">Solicitar acesso</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Preencha seus dados. O administrador será notificado e criará seu acesso.
      </p>
      <form
        className="mt-5 space-y-4"
        onSubmit={e => {
          e.preventDefault();
          solicitar.mutate({ nome, email, mensagem: mensagem || undefined });
        }}
      >
        <div>
          <label htmlFor="sol-nome" className="mb-1.5 block text-sm font-medium text-white/85">Seu nome</label>
          <input
            id="sol-nome"
            required
            maxLength={160}
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Nome completo"
            className="w-full rounded-lg border border-border bg-background/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#38bdf8]"
          />
        </div>
        <div>
          <label htmlFor="sol-email" className="mb-1.5 block text-sm font-medium text-white/85">Seu e-mail</label>
          <input
            id="sol-email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full rounded-lg border border-border bg-background/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#38bdf8]"
          />
        </div>
        <div>
          <label htmlFor="sol-msg" className="mb-1.5 block text-sm font-medium text-white/85">Mensagem (opcional)</label>
          <textarea
            id="sol-msg"
            rows={3}
            maxLength={500}
            value={mensagem}
            onChange={e => setMensagem(e.target.value)}
            placeholder="Conte por que quer usar o simulador..."
            className="w-full resize-none rounded-lg border border-border bg-background/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#38bdf8]"
          />
        </div>
        <button
          type="submit"
          disabled={solicitar.isPending}
          className="glow-pulse flex w-full items-center justify-center gap-2 rounded-lg bg-[#166184] py-3 text-sm font-bold text-white transition hover:brightness-115 disabled:opacity-60"
        >
          {solicitar.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Enviar solicitação
        </button>
        <button
          type="button"
          onClick={onVoltar}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao login
        </button>
      </form>
    </div>
  );
}

function TelaLogin({ onLogged }: { onLogged: () => void }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [modoSolicitar, setModoSolicitar] = useState(false);
  const login = trpc.sim.login.useMutation({
    onSuccess: () => {
      toast.success("Login realizado!");
      onLogged();
    },
    onError: e => toast.error(e.message),
  });

  const mailHref = `mailto:${EMAIL_SUPORTE}?subject=${encodeURIComponent(
    "Solicitação de acesso ao simulador JSF Elétrico"
  )}&body=${encodeURIComponent(
    "Olá! Quero solicitar acesso ao simulador JSF Elétrico no site.\n\nMeu nome: \nMeu e-mail: "
  )}`;

  if (modoSolicitar) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <FormSolicitarAcesso onVoltar={() => setModoSolicitar(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="jsf-panel-teal p-7 sm:p-8">
          <div className="flex items-center gap-3">
            <img src={ICONE_APP} alt="" className="h-12 w-12 rounded-xl border border-white/15" />
            <div>
              <h1 className="font-display text-xl font-bold text-white">Acesso ao simulador</h1>
              <p className="text-xs text-muted-foreground">Entre com o e-mail e a senha fornecidos</p>
            </div>
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={e => {
              e.preventDefault();
              // Destrava o áudio da vinheta durante o gesto do usuário (clique/enter)
              prepararAudioVinheta();
              login.mutate({ email, password: senha });
            }}
          >
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/85">
                E-mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-lg border border-border bg-background/70 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-[#38bdf8]"
                />
              </div>
            </div>
            <div>
              <label htmlFor="senha" className="mb-1.5 block text-sm font-medium text-white/85">
                Senha
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-background/70 py-2.5 pl-10 pr-10 text-sm text-white outline-none transition focus:border-[#38bdf8]"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(v => !v)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-white"
                >
                  {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={login.isPending}
              className="glow-pulse flex w-full items-center justify-center gap-2 rounded-lg bg-[#166184] py-3 text-sm font-bold text-white transition hover:brightness-115 disabled:opacity-60"
            >
              {login.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              Entrar no simulador
            </button>
          </form>
        </div>

        <div className="jsf-panel mt-4 p-5 text-center">
          <p className="text-sm text-muted-foreground">
            Ainda não tem acesso? O cadastro é feito pelo administrador.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setModoSolicitar(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#166184] px-4 py-2 text-sm font-bold text-white transition hover:brightness-115"
            >
              <Plus className="h-4 w-4" />
              Solicitar acesso
            </button>
            <a
              href={mailHref}
              className="inline-flex items-center gap-2 rounded-lg border border-[#38bdf8]/40 bg-[#38bdf8]/10 px-4 py-2 text-sm font-semibold text-[#7dd3fc] transition hover:bg-[#38bdf8]/20"
            >
              <Mail className="h-4 w-4" />
              Ou por e-mail
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal: alterar a própria senha                                      */
/* ------------------------------------------------------------------ */

function ModalAlterarSenha({ onFechar }: { onFechar: () => void }) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mostrar, setMostrar] = useState(false);

  const alterar = trpc.sim.alterarMinhaSenha.useMutation({
    onSuccess: () => {
      toast.success("Senha alterada com sucesso!");
      onFechar();
    },
    onError: e => toast.error(e.message),
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onFechar}
      role="dialog"
      aria-modal="true"
      aria-label="Alterar minha senha"
    >
      <div className="jsf-panel-teal w-full max-w-sm p-6 sm:p-7" onClick={e => e.stopPropagation()}>
        <h2 className="font-display flex items-center gap-2 text-lg font-bold text-white">
          <KeyRound className="h-5 w-5 text-[#38bdf8]" /> Alterar minha senha
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Informe a senha atual e escolha a nova senha (mínimo 6 caracteres).
        </p>
        <form
          className="mt-5 space-y-3.5"
          onSubmit={e => {
            e.preventDefault();
            if (novaSenha.length < 6) {
              toast.error("A nova senha deve ter pelo menos 6 caracteres");
              return;
            }
            if (novaSenha !== confirmar) {
              toast.error("A confirmação não confere com a nova senha");
              return;
            }
            alterar.mutate({ senhaAtual, novaSenha });
          }}
        >
          <div>
            <label htmlFor="senha-atual" className="mb-1.5 block text-sm font-medium text-white/85">Senha atual</label>
            <input
              id="senha-atual"
              type={mostrar ? "text" : "password"}
              required
              autoComplete="current-password"
              value={senhaAtual}
              onChange={e => setSenhaAtual(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-background/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#38bdf8]"
            />
          </div>
          <div>
            <label htmlFor="senha-nova" className="mb-1.5 block text-sm font-medium text-white/85">Nova senha</label>
            <input
              id="senha-nova"
              type={mostrar ? "text" : "password"}
              required
              minLength={6}
              autoComplete="new-password"
              value={novaSenha}
              onChange={e => setNovaSenha(e.target.value)}
              placeholder="Mín. 6 caracteres"
              className="w-full rounded-lg border border-border bg-background/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#38bdf8]"
            />
          </div>
          <div>
            <label htmlFor="senha-confirma" className="mb-1.5 block text-sm font-medium text-white/85">Confirmar nova senha</label>
            <input
              id="senha-confirma"
              type={mostrar ? "text" : "password"}
              required
              minLength={6}
              autoComplete="new-password"
              value={confirmar}
              onChange={e => setConfirmar(e.target.value)}
              placeholder="Repita a nova senha"
              className="w-full rounded-lg border border-border bg-background/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#38bdf8]"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-white/70">
            <input type="checkbox" checked={mostrar} onChange={e => setMostrar(e.target.checked)} className="accent-[#38bdf8]" />
            Mostrar senhas
          </label>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onFechar}
              className="flex-1 rounded-lg border border-white/15 bg-white/5 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={alterar.isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#166184] py-2.5 text-sm font-bold text-white transition hover:brightness-115 disabled:opacity-60"
            >
              {alterar.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Simulador em iframe                                                 */
/* ------------------------------------------------------------------ */

function VisualizadorSimulador() {
  const registrar = trpc.sim.registrarAcesso.useMutation();
  useEffect(() => {
    registrar.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] w-full bg-[#0a0a0a]">
      <iframe
        src="/api/simulador"
        title="Simulador JSF Elétrico"
        className="h-full w-full border-0"
        allow="fullscreen"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Painel admin: usuários                                              */
/* ------------------------------------------------------------------ */

function PainelUsuarios() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.sim.admin.listarUsuarios.useQuery();
  const usuarios = data?.usuarios;

  const [novoEmail, setNovoEmail] = useState("");
  const [novoNome, setNovoNome] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [novaExpiracao, setNovaExpiracao] = useState("");

  const definirExpiracao = trpc.sim.admin.definirExpiracao.useMutation({
    onSuccess: () => {
      toast.success("Expiração atualizada!");
      utils.sim.admin.listarUsuarios.invalidate();
    },
    onError: e => toast.error(e.message),
  });

  const criar = trpc.sim.admin.criarUsuario.useMutation({
    onSuccess: (_d, vars) => {
      toast.success(`Usuário ${vars.email} criado!`);
      setNovoEmail("");
      setNovoNome("");
      setNovaSenha("");
      setNovaExpiracao("");
      utils.sim.admin.listarUsuarios.invalidate();
    },
    onError: e => toast.error(e.message),
  });
  const alternar = trpc.sim.admin.alternarAtivo.useMutation({
    onSuccess: () => utils.sim.admin.listarUsuarios.invalidate(),
    onError: e => toast.error(e.message),
  });
  const redefinir = trpc.sim.admin.redefinirSenha.useMutation({
    onSuccess: () => toast.success("Senha redefinida!"),
    onError: e => toast.error(e.message),
  });
  const excluir = trpc.sim.admin.excluirUsuario.useMutation({
    onSuccess: () => {
      toast.success("Usuário excluído");
      utils.sim.admin.listarUsuarios.invalidate();
    },
    onError: e => toast.error(e.message),
  });

  function gerarSenha() {
    const s = `jsf-${Math.random().toString(36).slice(2, 8)}`;
    setNovaSenha(s);
  }

  return (
    <div className="container max-w-5xl py-8">
      {/* Criar usuário */}
      <div className="jsf-panel-teal p-6">
        <h2 className="font-display flex items-center gap-2 text-lg font-bold text-white">
          <Plus className="h-5 w-5 text-[#38bdf8]" /> Cadastrar novo usuário
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Crie o acesso com o e-mail da pessoa e uma senha. Depois envie a senha para ela.
        </p>
        <form
          className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto]"
          onSubmit={e => {
            e.preventDefault();
            criar.mutate({
              email: novoEmail,
              nome: novoNome || undefined,
              password: novaSenha,
              expiraEm: novaExpiracao ? new Date(`${novaExpiracao}T23:59:59`) : null,
            });
          }}
        >
          <input
            type="email"
            required
            placeholder="E-mail do usuário"
            value={novoEmail}
            onChange={e => setNovoEmail(e.target.value)}
            className="rounded-lg border border-border bg-background/70 px-3 py-2.5 text-sm text-white outline-none focus:border-[#38bdf8]"
          />
          <input
            type="text"
            placeholder="Nome (opcional)"
            value={novoNome}
            onChange={e => setNovoNome(e.target.value)}
            className="rounded-lg border border-border bg-background/70 px-3 py-2.5 text-sm text-white outline-none focus:border-[#38bdf8]"
          />
          <div className="flex gap-2">
            <input
              type="text"
              required
              minLength={6}
              placeholder="Senha (mín. 6)"
              value={novaSenha}
              onChange={e => setNovaSenha(e.target.value)}
              className="w-full rounded-lg border border-border bg-background/70 px-3 py-2.5 text-sm text-white outline-none focus:border-[#38bdf8]"
            />
            <button
              type="button"
              onClick={gerarSenha}
              title="Gerar senha"
              className="shrink-0 rounded-lg border border-border bg-background/70 px-3 text-muted-foreground transition hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <div>
            <input
              type="date"
              title="Data de expiração do acesso (deixe vazio para acesso sem prazo)"
              value={novaExpiracao}
              onChange={e => setNovaExpiracao(e.target.value)}
              className="w-full rounded-lg border border-border bg-background/70 px-3 py-2.5 text-sm text-white outline-none focus:border-[#38bdf8] [color-scheme:dark]"
            />
            <p className="mt-1 text-[10px] text-muted-foreground">Expira em (opcional)</p>
          </div>
          <button
            type="submit"
            disabled={criar.isPending}
            className="flex h-fit items-center justify-center gap-2 rounded-lg bg-[#28a745] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {criar.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Criar
          </button>
        </form>
      </div>

      {/* Lista */}
      <div className="jsf-panel mt-6 overflow-hidden">
        <div className="border-b border-border/60 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display flex items-center gap-2 text-base font-bold text-white">
              <Users className="h-4.5 w-4.5 text-[#38bdf8]" /> Usuários cadastrados
            </h3>
            {data && (
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-[#166184]/40 px-2.5 py-1 font-semibold text-[#7dd3fc]">
                  Total: {data.total}
                </span>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 font-semibold text-emerald-400">
                  Ativos: {data.ativos}
                </span>
              </div>
            )}
          </div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando...
          </div>
        ) : !usuarios?.length ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Nenhum usuário cadastrado ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3">Usuário</th>
                  <th className="px-4 py-3">Situação</th>
                  <th className="px-4 py-3">Último acesso</th>
                  <th className="px-4 py-3">Expira em</th>
                  <th className="px-5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id} className="border-b border-border/40 last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-medium text-white">{u.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {u.nome || "—"} {u.role === "admin" && <span className="ml-1 rounded bg-[#166184]/50 px-1.5 py-0.5 text-[10px] font-bold text-[#7dd3fc]">ADMIN</span>}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          u.ativo ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${u.ativo ? "bg-emerald-400" : "bg-red-400"}`} />
                        {u.ativo ? "Ativo" : "Desativado"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{fmtData(u.lastLoginAt)}</td>
                    <td className="px-4 py-3">
                      {u.role === "admin" ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <button
                          title="Clique para alterar a data de expiração"
                          onClick={() => {
                            const atual = u.expiraEm ? new Date(u.expiraEm).toISOString().slice(0, 10) : "";
                            const nova = window.prompt(
                              `Data de expiração para ${u.email} (AAAA-MM-DD, vazio = sem expiração):`,
                              atual
                            );
                            if (nova === null) return;
                            const limpo = nova.trim();
                            if (limpo === "") {
                              definirExpiracao.mutate({ id: u.id, expiraEm: null });
                            } else if (/^\d{4}-\d{2}-\d{2}$/.test(limpo)) {
                              definirExpiracao.mutate({ id: u.id, expiraEm: new Date(`${limpo}T23:59:59`) });
                            } else {
                              toast.error("Formato inválido. Use AAAA-MM-DD, ex.: 2026-12-31");
                            }
                          }}
                          className={`rounded-md border border-border/60 px-2 py-1 text-xs transition hover:bg-white/5 ${
                            u.expirado ? "font-bold text-red-400" : u.expiraEm ? "text-amber-300" : "text-muted-foreground"
                          }`}
                        >
                          {u.expiraEm
                            ? `${new Date(u.expiraEm).toLocaleDateString("pt-BR")}${u.expirado ? " (expirado)" : ""}`
                            : "Sem prazo"}
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {u.role !== "admin" && (
                          <button
                            title={u.ativo ? "Desativar acesso" : "Ativar acesso"}
                            onClick={() => alternar.mutate({ id: u.id, ativo: !u.ativo })}
                            className={`rounded-md border border-border/60 p-2 transition hover:bg-white/5 ${
                              u.ativo ? "text-amber-400" : "text-emerald-400"
                            }`}
                          >
                            <Power className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          title="Redefinir senha"
                          onClick={() => {
                            const nova = window.prompt(`Nova senha para ${u.email} (mín. 6 caracteres):`, `jsf-${Math.random().toString(36).slice(2, 8)}`);
                            if (nova && nova.length >= 6) redefinir.mutate({ id: u.id, password: nova });
                            else if (nova) toast.error("A senha deve ter pelo menos 6 caracteres");
                          }}
                          className="rounded-md border border-border/60 p-2 text-[#38bdf8] transition hover:bg-white/5"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>
                        {u.role !== "admin" && (
                          <button
                            title="Excluir usuário"
                            onClick={() => {
                              if (window.confirm(`Excluir o usuário ${u.email}? Essa ação não pode ser desfeita.`)) {
                                excluir.mutate({ id: u.id });
                              }
                            }}
                            className="rounded-md border border-border/60 p-2 text-red-400 transition hover:bg-white/5"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Painel admin: auditoria                                             */
/* ------------------------------------------------------------------ */

function PainelAuditoria() {
  const { data: eventos, isLoading, refetch, isFetching } = trpc.sim.admin.auditoria.useQuery({ limit: 300 });

  return (
    <div className="container max-w-5xl py-8">
      <div className="jsf-panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <h3 className="font-display flex items-center gap-2 text-base font-bold text-white">
            <ScrollText className="h-4.5 w-4.5 text-[#38bdf8]" /> Auditoria de acessos
          </h3>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} /> Atualizar
          </button>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando...
          </div>
        ) : !eventos?.length ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Nenhum evento registrado ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3">Data/hora</th>
                  <th className="px-4 py-3">Usuário</th>
                  <th className="px-4 py-3">Evento</th>
                  <th className="px-5 py-3">Detalhe</th>
                </tr>
              </thead>
              <tbody>
                {eventos.map(ev => {
                  const info = EVENTO_LABEL[ev.evento] ?? { label: ev.evento, cor: "text-white" };
                  return (
                    <tr key={ev.id} className="border-b border-border/40 last:border-0">
                      <td className="whitespace-nowrap px-5 py-2.5 text-muted-foreground">{fmtData(ev.createdAt)}</td>
                      <td className="px-4 py-2.5 text-white">{ev.email || "—"}</td>
                      <td className={`whitespace-nowrap px-4 py-2.5 font-medium ${info.cor}`}>{info.label}</td>
                      <td className="px-5 py-2.5 text-xs text-muted-foreground">
                        {ev.detalhe || "—"}
                        {ev.ip ? <span className="ml-2 rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">{ev.ip}</span> : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Painel de solicitações (admin)                                      */
/* ------------------------------------------------------------------ */

const STATUS_SOLICITACAO: Record<string, { label: string; cls: string }> = {
  pendente: { label: "Pendente", cls: "bg-amber-500/15 text-amber-300 border-amber-500/40" },
  aprovada: { label: "Aprovada", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40" },
  dispensada: { label: "Dispensada", cls: "bg-slate-500/15 text-slate-300 border-slate-500/40" },
};

function PainelSolicitacoes() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.sim.admin.listarSolicitacoes.useQuery();
  const [aprovandoId, setAprovandoId] = useState<number | null>(null);
  const [senhaNova, setSenhaNova] = useState("");
  const [expira, setExpira] = useState("");

  const invalidar = () => {
    utils.sim.admin.listarSolicitacoes.invalidate();
    utils.sim.admin.listarUsuarios.invalidate();
  };

  const aprovar = trpc.sim.admin.aprovarSolicitacao.useMutation({
    onSuccess: (_d, vars) => {
      toast.success("Acesso criado! Informe a senha ao usuário.");
      setAprovandoId(null);
      setSenhaNova("");
      setExpira("");
      invalidar();
    },
    onError: e => toast.error(e.message),
  });

  const dispensar = trpc.sim.admin.dispensarSolicitacao.useMutation({
    onSuccess: () => {
      toast.success("Solicitação dispensada");
      invalidar();
    },
    onError: e => toast.error(e.message),
  });

  const gerarSenha = () => {
    const s = `JSF-${Math.random().toString(16).slice(2, 10)}`;
    setSenhaNova(s);
  };

  return (
    <div className="container py-8">
      <div className="jsf-panel p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-white">Solicitações de acesso</h2>
            <p className="text-xs text-muted-foreground">
              {data ? `${data.pendentes} pendente(s) · ${data.solicitacoes.length} no total` : "Carregando..."}
            </p>
          </div>
          <button
            onClick={() => utils.sim.admin.listarSolicitacoes.invalidate()}
            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Atualizar
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Carregando solicitações...
          </div>
        ) : !data || data.solicitacoes.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Nenhuma solicitação recebida ainda. Quando alguém pedir acesso na tela de login, aparecerá aqui e você receberá uma notificação.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {data.solicitacoes.map(s => (
              <div key={s.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white">{s.nome}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${STATUS_SOLICITACAO[s.status]?.cls ?? ""}`}>
                        {STATUS_SOLICITACAO[s.status]?.label ?? s.status}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-[#7dd3fc]">{s.email}</p>
                    {s.mensagem && (
                      <p className="mt-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs italic text-white/70">“{s.mensagem}”</p>
                    )}
                    <p className="mt-1.5 text-[11px] text-muted-foreground">Recebida em {fmtData(s.createdAt)}{s.ip ? ` · IP ${s.ip}` : ""}</p>
                  </div>
                  {s.status === "pendente" && (
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => {
                          setAprovandoId(aprovandoId === s.id ? null : s.id);
                          setSenhaNova("");
                          setExpira("");
                        }}
                        className="rounded-lg bg-emerald-600/80 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-600"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Dispensar a solicitação de ${s.email}?`)) dispensar.mutate({ id: s.id });
                        }}
                        disabled={dispensar.isPending}
                        className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10 disabled:opacity-60"
                      >
                        Dispensar
                      </button>
                    </div>
                  )}
                </div>

                {aprovandoId === s.id && (
                  <form
                    className="mt-3 flex flex-wrap items-end gap-3 rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-3"
                    onSubmit={e => {
                      e.preventDefault();
                      aprovar.mutate({
                        id: s.id,
                        password: senhaNova,
                        expiraEm: expira ? new Date(`${expira}T23:59:59`) : null,
                      });
                    }}
                  >
                    <div className="min-w-[180px] flex-1">
                      <label className="mb-1 block text-[11px] font-semibold text-white/75">Senha para o usuário</label>
                      <div className="flex gap-1.5">
                        <input
                          required
                          minLength={6}
                          value={senhaNova}
                          onChange={e => setSenhaNova(e.target.value)}
                          placeholder="Mín. 6 caracteres"
                          className="w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-xs text-white outline-none focus:border-[#38bdf8]"
                        />
                        <button
                          type="button"
                          onClick={gerarSenha}
                          title="Gerar senha"
                          className="shrink-0 rounded-lg border border-white/15 bg-white/5 px-2.5 text-white/80 transition hover:bg-white/10"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-white/75">Expira em (opcional)</label>
                      <input
                        type="date"
                        value={expira}
                        onChange={e => setExpira(e.target.value)}
                        className="rounded-lg border border-border bg-background/70 px-3 py-2 text-xs text-white outline-none focus:border-[#38bdf8]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={aprovar.isPending}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:brightness-110 disabled:opacity-60"
                    >
                      {aprovar.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Criar acesso"}
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Página principal                                                    */
/* ------------------------------------------------------------------ */

type Aba = "simulador" | "usuarios" | "solicitacoes" | "auditoria";

export default function Simulador() {
  useSeo({
    title: "Simulador Online — JSF Elétrico",
    description:
      "Acesse o simulador de comandos elétricos JSF Elétrico direto no navegador. Monte diagramas e simule partidas de motores com acesso liberado pelo administrador.",
    url: "https://jsfeletrico.com/simulador",
  });

  const utils = trpc.useUtils();
  const { data: sessao, isLoading } = trpc.sim.me.useQuery();
  const [aba, setAba] = useState<Aba>("simulador");
  const [mostrarVinheta, setMostrarVinheta] = useState(false);
  const [mostrarTrocaSenha, setMostrarTrocaSenha] = useState(false);

  const logout = trpc.sim.logout.useMutation({
    onSuccess: () => {
      utils.sim.me.invalidate();
      toast.success("Você saiu do simulador");
    },
  });

  const ehAdmin = sessao?.role === "admin";
  const { data: solicitacoesData } = trpc.sim.admin.listarSolicitacoes.useQuery(undefined, {
    enabled: ehAdmin,
    refetchInterval: 60_000,
  });
  const pendentes = solicitacoesData?.pendentes ?? 0;

  const abas = useMemo(
    () =>
      [
        { id: "simulador" as Aba, label: "Simulador", icon: MonitorPlay, badge: 0 },
        { id: "usuarios" as Aba, label: "Usuários", icon: Users, badge: 0 },
        { id: "solicitacoes" as Aba, label: "Solicitações", icon: Mail, badge: pendentes },
        { id: "auditoria" as Aba, label: "Auditoria", icon: ScrollText, badge: 0 },
      ] satisfies { id: Aba; label: string; icon: typeof Users; badge: number }[],
    [pendentes]
  );

  return (
    <div className="min-h-screen circuit-grid text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 jsf-toolbar-gradient border-b border-[#0e3f59] shadow-lg">
        <div className="container flex h-16 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <a
              href="/"
              className="flex shrink-0 items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar ao site</span>
            </a>
            <div className="flex min-w-0 items-center gap-2">
              <img src={ICONE_APP} alt="" className="h-8 w-8 shrink-0 rounded-lg border border-white/20" />
              <span className="font-display truncate text-base font-bold text-white">
                JSF <span className="text-[#7dd3fc]">Elétrico</span>
                <span className="ml-2 hidden text-xs font-normal text-white/60 md:inline">Simulador online</span>
              </span>
            </div>
          </div>

          {sessao && (
            <div className="flex items-center gap-2">
              {sessao.role === "admin" && (
                <nav className="mr-1 hidden items-center gap-1 rounded-lg border border-white/15 bg-black/20 p-1 sm:flex">
                  {abas.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setAba(t.id)}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                        aba === t.id ? "bg-[#166184] text-white" : "text-white/70 hover:text-white"
                      }`}
                    >
                      <t.icon className="h-3.5 w-3.5" />
                      {t.label}
                      {t.badge > 0 && (
                        <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-black">
                          {t.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              )}
              <span className="hidden max-w-[160px] truncate text-xs text-white/70 lg:inline">{sessao.email}</span>
              <button
                onClick={() => setMostrarTrocaSenha(true)}
                title="Alterar minha senha"
                className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <KeyRound className="h-4 w-4" />
                <span className="hidden md:inline">Alterar senha</span>
              </button>
              <button
                onClick={() => logout.mutate()}
                title="Sair"
                className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          )}
        </div>
        {/* Abas mobile (admin) */}
        {sessao?.role === "admin" && (
          <div className="flex items-center gap-1 border-t border-white/10 px-3 py-1.5 sm:hidden">
            {abas.map(t => (
              <button
                key={t.id}
                onClick={() => setAba(t.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold transition ${
                  aba === t.id ? "bg-[#166184] text-white" : "text-white/70"
                }`}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
                {t.badge > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-black">
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Conteúdo */}
      {isLoading ? (
        <div className="flex min-h-[60vh] items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Verificando acesso...
        </div>
      ) : !sessao ? (
        <TelaLogin
          onLogged={() => {
            setMostrarVinheta(true);
            utils.sim.me.invalidate();
          }}
        />
      ) : sessao.role === "admin" ? (
        aba === "simulador" ? (
          <VisualizadorSimulador />
        ) : aba === "usuarios" ? (
          <PainelUsuarios />
        ) : aba === "solicitacoes" ? (
          <PainelSolicitacoes />
        ) : (
          <PainelAuditoria />
        )
      ) : (
        <VisualizadorSimulador />
      )}

      {/* Vinheta de abertura após login bem-sucedido */}
      {mostrarVinheta && <VinhetaSimulador onFim={() => setMostrarVinheta(false)} />}

      {/* Modal de troca de senha do usuário logado */}
      {mostrarTrocaSenha && <ModalAlterarSenha onFechar={() => setMostrarTrocaSenha(false)} />}
    </div>
  );
}
