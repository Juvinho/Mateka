# Changelog

## Beta v0.4.2 — 2026-09-01

Tudo isso ainda está no working tree (nada commitado ainda) — construído entre
28/08 e 01/09/2026.

### 🔐 Autenticação de verdade (registro e login)

- Backend novo do zero (`/backend`): Express + Prisma, consumindo o schema
  compartilhado em `/database`.
- Sessão por cookie httpOnly (`mateka_session`) — não JWT. Só o hash SHA-256
  do token vai pro banco; o valor em texto puro só existe no cookie do
  cliente.
- Endpoints: `POST /api/auth/register`, `POST /api/auth/login`,
  `POST /api/auth/logout`, `GET /api/auth/me`.
- Senhas com bcrypt (12 salt rounds). Registro já loga automaticamente.
- **RN-11 implementada**: 5 tentativas de login malsucedidas seguidas →
  bloqueia a conta por 15 minutos. Mensagens de erro propositalmente
  genéricas ("Email ou senha incorretos") pra não vazar se o problema foi o
  email ou a senha.
- Formulários de login/registro do frontend, que antes só simulavam sucesso
  com um `setTimeout`, agora chamam a API de verdade.

### 🔒 Módulos exigem login

- Módulos, aulas, exercícios e modo Endless agora só são acessíveis logado —
  inclusive por link direto (deep link).
- Visitante não-logado é redirecionado pro login e **volta pro destino
  original** depois de entrar (não cai genericamente na home).
- Usuário já logado que tenta acessar `#login`/`#register` é redirecionado
  pra fora dali.
- CTA da barra de navegação muda de "Começar Agora" pra "Acessar Perfil"
  quando autenticado.
- Botão "Sair" (que já existia no menu do perfil, mas não fazia nada) agora
  desloga de verdade.

### 👤 Página de Perfil (nova)

- Dashboard pessoal em `#perfil`: avatar, nome, email, "aluno desde
  [data]", estatísticas gerais (pontos totais, precisão média, sequência de
  dias).
- **Bio editável** (texto curto, até 240 caracteres).
- **Conquistas**: 8 badges calculados a partir do progresso real (primeiro
  passo, multitarefa, precisão total, sequências de 3/7 dias, 500 pontos,
  50 questões no Endless, módulo 100% concluído) — bloqueadas aparecem
  com cadeado e cinza, desbloqueadas ganham cor.
- **"Seus módulos"** agora só mostra módulos já iniciados; conta nova mostra
  um estado vazio com CTA pra escolher o primeiro módulo.
- **Pop-up "Acessar outros módulos"**: lista todos os módulos disponíveis;
  clicar num já iniciado mostra "Você já está nesse módulo" em vez de
  navegar.

### 🖼️ Avatar e banner de perfil (upload de verdade)

- Migration nova no banco: colunas `avatar_url` e `banner_url` em `users`.
- Upload real via `multer` (v2.x — a v1 tinha vulnerabilidades conhecidas),
  com redimensionamento no navegador antes de enviar. Arquivos ficam em
  `backend/uploads/{avatars,banners}/` (fora do git), nome aleatório único,
  servidos em `/api/uploads/...` com cache de 30 dias.
- Trocar ou remover a imagem apaga o arquivo antigo do disco — não acumula
  lixo.
- Substituiu a versão anterior (que só salvava no `localStorage` do
  navegador, sem sincronizar entre dispositivos).

### 🎭 Emy-chan e Mii-chan reorganizadas

- **Emy-chan** (avatar pequeno, canto inferior direito) agora só aparece na
  home. O balão de fala ganhou um botão "Conheça a Emy →".
- Nova página **`#conheca-emy`**: vídeo (placeholder, "em breve") e bios da
  Emy-chan e da Mii-chan lado a lado.
- **Mii-chan** (antes "Emy-Dark") agora vive nas seções/módulos, some
  durante a introdução de primeira vez de um módulo e durante os
  exercícios. Continua abrindo o Caderno Obscuro ao clicar.

### 🗄️ Banco de dados e Docker

- `docker-compose.yml` do Postgres revisado; banco renomeado pra `Mateka`.
- Migration `add_user_avatar_banner` aplicada.
- Comando único **`npm run dev:all`** — sobe Postgres + backend + frontend
  juntos, com logs coloridos por serviço (`[api]`/`[web]`).

### 🐛 Bugs reais corrigidos ao longo do caminho

- Contexto de autenticação do frontend não se atualizava depois de
  login/registro — a primeira navegação pra um módulo logo após entrar
  jogava o usuário de volta pro login.
- Backend caía inteiro se o Postgres piscasse (uma exceção não tratada
  derrubava o processo Node inteiro, não só a requisição) — agora toda
  rota tem tratamento de erro e um handler global.
- Resposta de `/api/auth/me` podia ser servida do cache do navegador mesmo
  depois da sessão mudar — adicionado `Cache-Control: no-store`.
- Depois de logar, o botão ficava travado em "✓ Bem-vindo!" pra sempre — a
  tela de login/registro nunca navegava pra lugar nenhum após autenticar.
- Página de Perfil tinha um espaço vazio enorme entre seções — causado por
  uma regra CSS global de `<section>` (pensada pra landing page) vazando
  pros blocos internos do perfil.
- `alt` da imagem do avatar sempre dizia "Emy-chan", mesmo quando era a
  Mii-chan sendo exibida.

### ⚠️ Limitações conhecidas

- Campo `institution` do formulário de registro é coletado mas não
  persistido (sem coluna correspondente em `users`).
- RN-12 (expiração de tokens de reset de senha / verificação de email) —
  schema já suporta, endpoints ainda não existem.
- Avatar/banner ficam em disco local do backend, não em object storage —
  não sobrevive a um deploy sem disco persistente.
- Se a sessão for invalidada por fora do app (ex: cookie apagado
  manualmente) enquanto a aba continua aberta sem recarregar, o app só
  percebe na próxima navegação/reload.
