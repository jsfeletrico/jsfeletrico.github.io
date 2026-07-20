# TODO — Simulador integrado + login + painel admin

## Fase 1 — Backend e autenticação
- [x] Fazer upgrade do projeto para web-db-user (backend + banco)
- [x] Criar schema: tabela de usuários do simulador (email, senha hash, ativo) e tabela de auditoria (logins/acessos)
- [x] Implementar login próprio com e-mail/senha (sessão via cookie/JWT)
- [x] Semear conta do administrador (jsfeletrico@gmail.com) com senha inicial

## Fase 2 — Simulador protegido
- [x] Hospedar o HTML do simulador (arquivo enviado) servido apenas para autenticados
- [x] Página /simulador com verificação de login; iframe fullscreen do simulador
- [x] Tela de login no mesmo endereço, com aviso: novos usuários devem contatar o administrador (e-mail pré-preenchido)
- [x] Botão para voltar à tela inicial do site

## Fase 3 — Painel admin
- [x] Painel acessível pelo mesmo endereço (aba/rota interna), visível só para admin
- [x] Criar usuário (e-mail + senha definida pelo admin), ativar/desativar, redefinir senha, excluir
- [x] Auditoria: lista de acessos com data/hora, usuário, evento (login, acesso ao simulador, falha de login)
- [x] Botão de voltar à tela inicial do site
- [x] Contador de usuários (total/ativos) e ordenação por último acesso
- [x] Data de expiração de acesso por usuário (bloqueio automático no login)
- [x] Link "Simulador online" no header e na seção "Acesso ao simulador" da home

## Fase 4 — Testes
- [x] Testar login válido/inválido, usuário desativado
- [x] Testar criação de usuário pelo admin e acesso ao simulador
- [x] Testar registro de auditoria
- [x] Testes vitest (simAuth: senha + sessão JWT) — 9 testes passando
- [x] pnpm check + build + screenshots
- [x] Checkpoint (acce4479)

## Fase 5 — Entrega
- [x] Entregar com credenciais do admin e instruções de publicação

## Fase 6 — Solicitações de acesso com notificação
- [x] Tabela simAccessRequests no schema (nome, email, mensagem, status, createdAt)
- [x] Rota pública sim.solicitarAcesso (com proteção anti-spam simples) + notificação ao owner
- [x] Rotas admin: listar solicitações, aprovar (cria usuário com senha) e dispensar
- [x] Formulário "Solicitar acesso" na tela de login (nome + e-mail + mensagem)
- [x] Aba "Solicitações" no painel admin com badge de pendentes, aprovar/dispensar
- [x] Testes do fluxo completo + vitest + checkpoint

## Fase 7 — Página "Sobre"
- [x] Criar página Sobre.tsx com a história de Joelson e a trajetória do app (estilo do site)
- [x] Registrar rota /sobre no App.tsx
- [x] Adicionar link "Sobre" no menu do header e no rodapé da Home
- [x] Verificar visual (desktop e mobile), testes e checkpoint

## Fase 8 — Correções de SEO (página /)
- [x] Meta keywords com 6 palavras-chave relevantes
- [x] Meta description reescrita com 154 caracteres (entre 50 e 160)
- [x] Texto alternativo adicionado à imagem do rodapé (única sem alt)
- [x] Build validado e checkpoint salvo

## Fase 9 — Dados estruturados (SEO)
- [x] JSON-LD schema.org MobileApplication na página inicial (nome, Android, categoria educacional, Play Store, grátis, autor)
- [x] JSON validado, build ok e verificado na página servida

## Fase 10 — Open Graph / compartilhamento
- [x] Imagem OG 1200x630 gerada a partir do banner da marca e enviada ao storage
- [x] Meta tags og:title, og:description, og:image, og:url, og:locale na página inicial
- [x] Twitter Card (summary_large_image)
- [x] Build ok, 10 tags OG verificadas na página servida, imagem acessível (HTTP 200)

## Fase 11 — Open Graph nas páginas Sobre e Simulador
- [x] Hook useSeo (título, description, og:*, twitter:* dinâmicos por rota)
- [x] Aplicado em /sobre com título e descrição próprios
- [x] Aplicado em /simulador com título e descrição próprios
- [x] Aplicado em / para restaurar tags padrão na navegação SPA
- [x] Tipos, testes (9/9) e build ok; páginas verificadas visualmente

## Fase 12 — Sitemap e robots
- [x] sitemap.xml em client/public com as 3 páginas (/, /sobre, /simulador)
- [x] robots.txt com Allow /, Disallow /api/ e link do sitemap
- [x] XML validado, HTTP 200 no dev server e arquivos presentes no build

## Fase 13 — Favicon do eletricista de capacete
- [x] Gerar favicon.ico (16/32/48) e PNGs 48/96/192 + apple-touch-icon 180 a partir do icone_capacete.png
- [x] Tags de favicon completas no index.html (substituindo o link único do storage)
- [x] Build ok e todos os arquivos respondendo HTTP 200

## Fase 14 — Retrato alinhado na página Sobre
- [x] Editar retrato: alinhar capacete, óculos e pescoço, enquadramento centrado
- [x] Adicionar a foto na página Sobre (seção "Quem é Joelson")
- [x] Verificar visual, build e checkpoint

## Fase 15 — Foto de corpo inteiro na trajetória
- [x] Enviar foto de corpo inteiro HD ao storage
- [x] Inserir a foto na seção "A trajetória do JSF Elétrico" da página Sobre
- [x] Verificar visual, build e checkpoint

## Fase 16 — Foto da sala de controle na trajetória
- [x] Editar foto: remover marcas/logos, melhorar qualidade, cenário moderno de sala de controle mantendo Joelson
- [x] Enviar imagem final ao storage e inserir na seção "A trajetória do JSF Elétrico"
- [x] Verificar visual, build, checkpoint e entrega

## Fase 17 — Refazer foto da sala de controle (manter ambiente real)
- [x] Reeditar a foto original: manter sala/mesa/computadores reais, só limpar sujeira, remover logos/marcas e melhorar qualidade
- [x] Substituir a imagem no storage/página e verificar visual e build
- [x] Checkpoint e entrega

## Fase 18 — Lightbox nas fotos da página Sobre
- [x] Criar componente Lightbox (clique para ampliar, fechar com X/ESC/clique fora, zoom suave)
- [x] Aplicar nas fotos da página Sobre (retrato, sala de controle, biblioteca)
- [x] Verificar visual/build, checkpoint e entrega

## Fase 19 — Remover foto de corpo inteiro da trajetória
- [x] Retirar a foto de corpo inteiro da seção "A trajetória do JSF Elétrico" (manter só a da sala de controle)
- [x] Verificar visual/build, checkpoint e entrega

## Fase 20 — Destacar a página Sobre na home
- [x] Adicionar link "Sobre" no menu do header da home (desktop) — já existia no nav e rodapé
- [x] Criar seção "Conheça o desenvolvedor" no início da home (foto + convite + botão para /sobre)
- [x] Verificar visual/build, checkpoint e entrega

## Fase 21 — Seção FAQ na página inicial
- [x] Criar seção FAQ (accordion) na home com dúvidas comuns e link no menu
- [x] Adicionar marcação schema.org FAQPage (JSON-LD)
- [x] Verificar visual/build, checkpoint e entrega

## Fase 22 — Citação na seção "Conheça o desenvolvedor"
- [x] Adicionar citação "Criei o app que eu queria ter quando comecei" — Joelson, na seção da home
- [x] Verificar visual/build, checkpoint e entrega

## Fase 23 — Botão "Acesse o simulador online" no hero
- [x] Adicionar botão para /simulador ao lado do "Baixar grátis na Play Store" no início da home
- [x] Verificar visual/build, checkpoint e entrega

## Fase 24 — Atualizar o simulador do site (jsfeletrico1.html)
- [x] Ajustar referências internas do novo HTML (icone.png -> storage) e comparar com versão atual
- [x] Enviar novo HTML ao storage e atualizar a key em server/simuladorRoute.ts
- [x] Testar carregamento do simulador logado, checkpoint e entrega

## Fase 25 — Vinheta animada EM CÓDIGO após o login do simulador
- [x] Criar componente de vinheta (HTML/CSS/JS): raios/elétrons nas letras "JSF Elétrico", diagrama embaixo, "Seja bem-vindo" abaixo, ~2-3s, com som de energia (Web Audio)
- [x] Sem frase do desenvolvedor, sem Play Store, sem endereço do site
- [x] Exibir após login bem-sucedido no /simulador, depois abre o simulador normal
- [x] Testar fluxo de login, checkpoint e entrega
- [x] Testar login E2E no navegador: vinheta aparece ~3s e depois abre o iframe do simulador
- [x] Garantir áudio compatível com política de user-activation (tocar já no clique de Entrar)
- [x] Checkpoint após validação e entrega formal

## Fase 26 — Vinheta dentro do HTML do simulador (arquivo do usuário)
- [x] Implementar a vinheta (raios + JSF Elétrico + diagrama + Seja bem-vindo + som) dentro do jsfeletrico1.html, disparada pelo botão Entrar da splash do app
- [x] Testar o HTML no navegador e devolver o arquivo completo ao usuário
- [x] Saída gerada como novo arquivo derivado do original: entrega_vinheta/jsfeletrico_com_vinheta.html (original preservado)
- [x] Anexar o HTML final na mensagem de entrega (feito na entrega anterior)

## Fase 27 — Corrigir bug do áudio do motor no HTML com vinheta
- [x] Bug: vinheta cria window.audioContext antes do fluxo original; bloco que inicializa audioBuffers/audioSources/motorAudioStates é pulado -> TypeError 'constante' em gerenciarAudioMotor
- [x] Corrigir injeção: vinheta usa AudioContext próprio temporário; window.audioContext fica para o fluxo original criar com os buffers
- [x] Testar no navegador: audioBuffers['constante'] carregado corretamente após entrar
- [x] Reentregar formalmente o HTML corrigido ao usuário (entregue com a correção do áudio)

## Fase 28 — Atualizar simulador do site para v115.8 (com vinheta)
- [x] Atualizar versão exibida no HTML para 115.8 (title, splash, sobre, rodapé e VERSAO_APP)
- [x] Ajustar referências (icone.png -> storage) como na atualização anterior
- [x] Enviar HTML ao storage (simulador_v1158_3058034a.html) e atualizar key em server/simuladorRoute.ts
- [x] Testar carregamento logado (v115.8 + vinheta confirmadas na resposta)
- [x] Salvar checkpoint e entregar formalmente ao usuário

## Fase 29 — Troca de senha (admin e usuários)
- [x] Mostrar botão "Redefinir senha" também na linha do admin no painel (manter desativar/excluir ocultos para admin)
- [x] Backend: procedure sim.alterarMinhaSenha (senha atual + nova, min 6, log de auditoria)
- [x] Frontend: botão "Alterar senha" no header para qualquer usuário logado + modal com confirmação
- [x] Testes vitest da nova procedure (5 testes, 14/14 passando), verificação visual, checkpoint e entrega
