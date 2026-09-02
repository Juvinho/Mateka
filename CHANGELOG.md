# Changelog

## Beta v0.4.3 — 2026-09-02

Tudo isso ainda está no working tree (nada commitado ainda) — construído em
cima do v0.4.2, no dia 02/09/2026.

### ⏱️ Sessão expira em 24h sem "Manter sessão"

- O checkbox "Manter sessão" do login existia na tela mas não fazia nada —
  toda sessão durava 30 dias sempre, independente de marcar ou não.
- Agora ele funciona de verdade: marcado, a sessão dura 30 dias (como
  antes); desmarcado (padrão), a sessão expira em 24 horas — cookie e a
  linha correspondente em `sessions` no banco recebem o mesmo prazo.
- Registro continua com sessão de 30 dias (não tem esse checkbox).

### 🧩 Playgrounds interativos em todos os módulos

- `ModuleConfig` ganhou um novo ponto de extensão: `PlaygroundComponent` —
  cada módulo pode ter uma aba livre pra experimentar o conceito na prática,
  sem exercício "certo ou errado".
- Um playground novo por módulo: Frações (Conceitos Básicos), Sistema Linear
  (Sistemas Lineares), Função (Pré-Cálculo), Plano de Coordenadas (Geometria
  Analítica), Triângulo (Geometria Plana) e Cilindro (Geometria Espacial). O
  Explorador de Matrizes que já existia virou o playground de Matrizes.
- No playground de Matrizes agora dá pra escolher o número de linhas/colunas
  com sliders antes de preencher a matriz.

### 📚 Quatro módulos de conteúdo novos

- **Sistemas Lineares** — substituição, adição, gráficos, escalonamento e
  Regra de Cramer.
- **Geometria Analítica** — pontos, retas, circunferências e cônicas.
- **Geometria Plana** — ângulos, triângulos, polígonos e circunferências
  (geometria clássica, sem coordenadas).
- **Geometria Espacial** — prismas, pirâmides, cilindros, cones e esferas.
- Cada um com 9 unidades, 18 aulas e um desafio por unidade — mesmo padrão
  de acabamento dos módulos que já existiam (Matrizes, Conceitos Básicos,
  Pré-Cálculo).
- **Pré-Cálculo** voltou a aparecer na home (tinha sumido do grid principal),
  com uma prévia animada nova (parábola) ao passar o mouse no card.
- Alternativas dos exercícios do Pré-Cálculo agora embaralham de posição a
  cada tentativa, em vez de aparecerem sempre na mesma ordem.

### 👥 Amigos (rede social dentro do Mateka!)

- Busca de usuário por nome, pedido de amizade, aceitar/recusar pedido e
  desfazer amizade.
- Perfil público de qualquer usuário (`#usuario-{id}`), acessível a partir
  da busca, da lista de amigos ou de um pedido pendente.
- Bio do perfil migrou do `localStorage` pro banco (endpoint dedicado) — antes
  só existia no navegador do próprio usuário, então nem outra pessoa nem
  outro dispositivo seu viam a bio que você escreveu.
- Todo o fluxo (buscar, adicionar, ver pedidos, ver lista de amigos) roda
  num popup só, com abas "Ver amigos" e "Buscar" — não existe mais uma
  página cheia só pra isso.
- **Sininho de notificação**: quando alguém aceita seu pedido de amizade,
  o botão "Amigos" ganha um pontinho vermelho; abrir o popup mostra um aviso
  ("🎉 Fulano aceitou seu pedido de amizade!") e o pontinho some — só dentro
  do app, sem e-mail nem push.

### 🏆 Selo de criador

- Novo valor de `role` (`creator`), com o badge dourado "✦ Criador do
  Mateka!" ao lado do nome — aparece tanto no seu próprio perfil quanto no
  perfil público, pra quem visitar.

### 🎯 "Continuar aula" agora avisa quando a próxima etapa é a prova

- Antes, terminar as duas aulas de uma unidade liberava a prova (o exercício
  difícil) mas o botão continuava dizendo "Continuar aula →", sem deixar
  claro que já dava pra fazer a prova direto.
- Agora o botão detecta que a próxima etapa é um desafio e muda pra
  vermelho com o texto "Fazer prova →".

### 🐛 Bugs corrigidos

- Popup de Amigos: o cabeçalho "vazava" pra fora do popup ao rolar a lista —
  bug conhecido do Chrome envolvendo `position: sticky` + desfoque do fundo
  (`backdrop-filter`) + cantos arredondados. Corrigido tirando o cabeçalho e
  as abas de dentro da área que rola.
- Cartão de pedido de amizade / resultado de busca esticava pra ocupar a
  largura inteira do popup, deixando um vão enorme entre o nome e o botão de
  ação — agora o cartão só ocupa o espaço do próprio conteúdo.
- Pontinhos de "max / 0 / min" do visualizador de onda da home removidos —
  poluíam visualmente sem agregar nada.

### ⚠️ Limitações conhecidas

- Notificação de amizade aceita é só dentro do app (pontinho no botão
  "Amigos") — sem e-mail nem push, e só aparece depois que a página é
  recarregada ou o popup é reaberto, não em tempo real.
- Sem notificação nenhuma pra pedido *recebido* (só pra pedido aceito) — pra
  ver quem te chamou de amigo ainda é preciso abrir o popup e checar a aba
  "Ver amigos".
- Sem bloqueio de usuário — só dá pra desfazer amizade/pedido, não impedir

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
