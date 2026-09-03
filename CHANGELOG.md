# Changelog

## Beta v0.4.5 — 2026-09-03

Tudo isso ainda está no working tree (nada commitado ainda) — construído em
cima do v0.4.4, no dia 03/09/2026.

### 🎨 Paleta para daltonismo agora tem um modo por tipo

- Antes era um toggle único liga/desliga. Agora são 4 opções em
  Configurações → Acessibilidade: **Desativado**, **Protanopia**,
  **Deuteranopia**, **Tritanopia**.
- Protanopia e deuteranopia são as duas formas de daltonismo
  vermelho-verde (deuteranopia é a mais comum) — a orientação de
  acessibilidade pras duas é a mesma: trocar o par vermelho/verde de
  "certo"/"errado" dos exercícios por azul/laranja. As duas opções usam a
  mesma paleta calibrada, de propósito — não tem base científica pra
  inventar tons diferentes pra cada uma.
- Tritanopia é daltonismo azul-amarelo — **não afeta** a distinção
  vermelho/verde, então essa opção não muda nada, e diz isso claramente na
  própria tela (pra não parecer bug).
- De brinde: o ✓ verde de "senhas conferem" no cadastro, que era uma cor
  fixa não coberta pelo toggle antigo, agora também respeita o modo
  escolhido.

### 💔 Endless ganhou vidas

- Antes o modo Endless era literalmente infinito, sem nenhuma consequência
  por errar. Agora tem **3 vidas**: cada resposta errada custa uma,
  mostradas como corações (❤️❤️❤️ → ❤️❤️🖤 → ...) nas estatísticas da sessão.
- Ao zerar as vidas, a sessão acaba numa tela de **Game Over** — Emy-chan
  chorando (`muito-triste.webp`, não a `depressao.webp` que já é usada em
  outro lugar), com um resumo ("Você respondeu X questões, Y corretas") e
  a mensagem "Não fique assim, tente novamente!".
- **"Tentar novamente"** reinicia a sessão na hora (vidas cheias, contador
  zerado, banco de questões reembaralhado) — sem passar pela tela de
  intro de novo. **"Encerrar sessão"** volta pro hub do módulo, igual ao
  botão que já existia.
- Vidas são só da sessão — não mexem em nada persistido. Pontos e
  precisão continuam vitalícios como já valia desde a correção acima;
  perder todas as vidas e tentar de novo não apaga o que você já ganhou.

### 🔥 Pontos, precisão e sequência — comportamento acertado

- **Pontos agora incluem o modo Endless.** Antes, "pontos totais" no Perfil
  somava só os exercícios normais dos módulos — o que você ganhava no
  Endless (5 pontos por acerto) era guardado mas nunca entrava nessa conta.
  Agora entra tudo.
- **Pontos são vitalícios** — só crescem, nunca somem. Refazer um exercício
  pior não tira pontos já ganhos (só substitui se a nova nota for melhor), e
  pontos não têm nenhuma ligação com a sequência de dias — perder a
  sequência não afeta a pontuação.
- **Sequência de dias reseta pra 0 se você falhar um dia** (estilo
  Duolingo) — isso já era a intenção original, mas só "acontecia de
  verdade" na sua próxima prática (o número guardado ficava desatualizado
  até então). Agora o valor mostrado no Perfil é recalculado toda vez que a
  página carrega: se a última prática não foi hoje nem ontem, mostra 0 na
  hora, sem precisar praticar de novo pra "perceber" que quebrou.

## Beta v0.4.4 — 2026-09-02

Tudo isso ainda está no working tree (nada commitado ainda) — construído em
cima do v0.4.3, no mesmo dia 02/09/2026.

### 👤 Menu do perfil virou de verdade — 3 páginas novas + Configurações

O menu (avatar + sequência de dias) só existia dentro dos módulos; agora
também aparece no header do próprio Perfil. E os itens que eram só
decoração (iam pro lugar errado ou não faziam nada) agora funcionam:

- **Meus Módulos** (`#meus-modulos`) — página própria com os módulos já
  iniciados e o atalho "Acessar outros módulos", em vez de cair no hub de
  um módulo específico (Matrizes) como antes.
- **Conquistas** (`#conquistas`) — página própria com as 8 badges, em vez
  de só reaproveitar a rolagem do Perfil.
- **Configurações** (`#configuracoes`) — não existia nada, o item só
  fechava o menu ao clicar. Agora tem:
  - **Voz da Emy-chan**: liga/desliga o áudio narrado (introduções, avisos,
    aula de Matrizes) — o texto continua aparecendo, só o som é cortado.
  - **Efeitos sonoros**: liga/desliga o som de acerto/erro nos exercícios.
  - **Música ambiente**: mesmo toggle que já existia solto na navbar,
    centralizado aqui também.
  - **Paleta para daltonismo**: troca o verde/vermelho de "certo"/"errado"
    nos exercícios (multiple choice e quiz) por azul/laranja — a
    substituição recomendada para deuteranopia/protanopia, já que essas
    duas cores continuam distinguíveis nesse tipo de daltonismo. Escopo
    consciente: cobre as cores que já usavam variável CSS nesse par
    específico (não é uma repaginada de toda a paleta do site, e não
    adiciona ícone de certo/errado — só a cor muda).
  - Tudo salvo em `localStorage` (`mateka:settings`), aplicado imediato,
    sem precisar de backend.
  - **Zona de perigo → Excluir conta**: exclusão permanente e imediata,
    exige digitar a senha pra confirmar (bloqueia com "Senha incorreta" se
    errar). Apaga o usuário e tudo que referencia ele — sessões, progresso
    em todos os módulos, amizades (nas duas direções), avatar e banner
    (inclusive os arquivos no disco, não só a referência no banco) — via
    `onDelete: Cascade` no schema mais uma limpeza explícita dos uploads.
    Sem confirmação por e-mail nem prazo de carência: é na hora.
- Por trás dos panos: extraí a lógica de "progresso agregado de todos os
  módulos + conquistas" da `PerfilPage` pra um hook compartilhado
  (`useAggregatedProgress`), já que agora três páginas precisam dos mesmos
  números — evita ter isso calculado (e podendo divergir) em três lugares.

### ⏱️ Sessão expira em 24h sem "Manter sessão"

- O checkbox "Manter sessão" do login existia na tela mas não fazia nada —
  toda sessão durava 30 dias sempre, independente de marcar ou não.
- Agora ele funciona de verdade: marcado, a sessão dura 30 dias (como
  antes); desmarcado (padrão), a sessão expira em 24 horas — cookie e a
  linha correspondente em `sessions` no banco recebem o mesmo prazo.
- Registro continua com sessão de 30 dias (não tem esse checkbox).

### 👥 Amigos: sininho de notificação + bloqueio de usuário

- **Sininho de notificação**: quando alguém aceita seu pedido de amizade ou
  te manda um pedido novo, o botão "Amigos" ganha um pontinho vermelho;
  abrir o popup mostra um aviso ("🎉 Fulano aceitou seu pedido de
  amizade!") pra aceites, e o pontinho some — só dentro do app, sem e-mail
  nem push. Funciona com um polling leve (a cada 20s enquanto a página do
  Perfil está aberta), não é uma inscrição em tempo real de verdade.
- **Bloquear usuário**: além de desfazer amizade, agora dá pra bloquear
  alguém no perfil público dela — a pessoa não consegue mandar pedido de
  novo enquanto o bloqueio existir, e só quem bloqueou pode desfazer o
  bloqueio (a pessoa bloqueada não pode se "auto-desbloquear").

### ⚙️ Débitos técnicos resolvidos

- **Instituição de ensino persiste**: o campo já existia no formulário de
  registro desde o v0.4.2 mas nunca era salvo (faltava a coluna no banco).
  Agora vai pro banco e aparece no Perfil, junto de "Aluno desde".
- **Índice trigram na busca de amigos**: `pg_trgm` + índice GIN em
  `display_name`, pra busca continuar rápida conforme a base de usuários
  cresce (sem isso, toda busca varre a tabela inteira).

### ⚠️ Limitações conhecidas

- Notificação de amizade (pedido novo ou aceito) continua só dentro do app,
  sem e-mail nem push, e é *polling* (a cada 20s enquanto a página do Perfil
  está aberta) — não é uma inscrição em tempo real de verdade (WebSocket/SSE
  ainda não existe nesse projeto).
- Bloquear alguém impede pedido novo, mas não esconde a pessoa da busca —
  ela continua aparecendo nos resultados normalmente.
- Instituição de ensino só é coletada em registros novos — contas criadas
  antes dessa migration ficam com o campo em branco até editarem o perfil
  (não existe tela pra editar isso ainda, só no cadastro).

## Beta v0.4.3 — 2026-09-02

Tudo isso ainda está no working tree (nada commitado ainda) — construído em
cima do v0.4.2, no dia 02/09/2026.

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

- Sem notificação (push ou e-mail) quando alguém manda ou aceita um pedido
  de amizade — só aparece na próxima vez que o popup de Amigos é aberto.
- Sem bloqueio de usuário — só dá pra desfazer amizade/pedido, não impedir
  que a pessoa ache seu perfil de novo pela busca.
- O badge de "criador" hoje só pode ser atribuído via SQL direto no banco —
  não existe painel de admin pra isso.

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
