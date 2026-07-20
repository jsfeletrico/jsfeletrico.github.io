# JSF Elétrico — Exportação Completa do Projeto

Este arquivo contém **todo o código-fonte** do site jsfeletrico.com para transferência para outra hospedagem.

## Conteúdo

- **client/** — Frontend React + Tailwind CSS + shadcn/ui
- **server/** — Backend Express + tRPC + autenticação
- **drizzle/** — Schema do banco de dados (MySQL/TiDB)
- **shared/** — Tipos e constantes compartilhadas
- **references/** — Documentação de integrações (LLM, storage, mapas, etc)
- **package.json** — Dependências do projeto
- **pnpm-lock.yaml** — Lock file (use `pnpm install`)

## Setup em Nova Hospedagem

### 1. Instalar dependências
```bash
pnpm install
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env` com as variáveis necessárias. As principais são:
```
DATABASE_URL=mysql://user:pass@host/dbname
JWT_SECRET=sua_chave_secreta_aqui
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://seu-oauth-server
VITE_OAUTH_PORTAL_URL=https://seu-portal-oauth
```

Consulte `references/` para documentação completa de cada integração.

### 3. Preparar banco de dados
```bash
pnpm db:push
```

### 4. Build para produção
```bash
pnpm build
```

### 5. Iniciar servidor
```bash
node dist/index.js
```

## Arquivos Importantes

- **server/simuladorRoute.ts** — Rota do simulador (protegida por login)
- **server/simRouter.ts** — Procedures tRPC (login, usuários, senha)
- **client/src/pages/Home.tsx** — Página inicial
- **client/src/pages/Sobre.tsx** — Página Sobre (com fotos)
- **client/src/pages/Simulador.tsx** — Página do simulador
- **drizzle/schema.ts** — Tabelas do banco (users, audit_log, etc)

## Banco de Dados

O projeto usa **MySQL/TiDB**. Schema:
- `users` — Usuários do simulador (email, senha hash, role, ativo)
- `audit_log` — Log de acessos (quem, quando, IP, user-agent)

## Simulador

O simulador é um arquivo HTML separado (`simulador_v1161_e09d7017.html`) armazenado no storage e servido pela rota `/api/simulador` apenas para usuários logados.

## Dúvidas?

Consulte:
- `NOTAS_PROJETO.md` — Histórico de desenvolvimento
- `todo.md` — Features implementadas e planejadas
- `references/` — Documentação de cada integração

---
Exportado em: 2026-07-17
Versão do site: 115.8
Versão do simulador: 116.1
