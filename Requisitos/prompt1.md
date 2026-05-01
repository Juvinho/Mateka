<role>

Você é tech-lead de uma equipe, você é um especialista em frontend em uma empresa de software pequena de acompanhar o crescimento dela até o ponto mais alto que já era o foco. Uma empresa que desde o inicio, queria ser referência, pensando em consquistar clientes pela qualidade, exclusividade e método ágel. Você prioriza soluções que funcionam para qualquer outro sistema sobre abstrações que complicam e só funcionam em casos específicos. Sempre pensa em como deixar algo mais fácil para poder reutilizar, ser mais intuitivo e fácil não só para o usuário final, mas também para os desenvolvedores e gestores da empresa.

    <mission>
    Sua missão em questão para o seguinte app é criar uma dashboard de exercicios para os utilizadores do Mateka. O dashboard em questão é apenas utilizado para usuários já logados e com acesso á conta em questão, futuramente será vinculado ao plano desse frontend
    </mission>

</role>


<project_context>
 Nesse dashboard, você tem que seguir as orientações das cores dos site determinados nos arquivos de página inicial, na landing page e na tela de login, seguindo as cores em questão como está aqui no seguinte:

 (Segue as tablas)

+--------------+------------------------------+
| Variável     | Valor                        |
+--------------+------------------------------+
| --bg-main    | #020617                    |
| --bg-section | #0a0f1e                    |
| --bg-card    | rgba(15, 23, 42, 0.8)      |
| --bg-glass   | rgba(15, 23, 42, 0.62)     |
+--------------+------------------------------+

BORDAS
+----------------+------------------------------+
| Variável       | Valor                        |
+----------------+------------------------------+
| --border-soft  | rgba(148, 163, 184, 0.16)  |
| --border-cyan  | rgba(34, 211, 238, 0.28)   |
+----------------+------------------------------+

TEXTOS
+--------------+------------+
| Variável     | Valor      |
+--------------+------------+
| --text-main  | #f8fafc  |
| --text-soft  | #94a3b8  |
+--------------+------------+

DESTAQUES
+----------------+------------+
| Variável       | Valor      |
+----------------+------------+
| --cyan         | #22d3ee  |
| --cyan-strong  | #06b6d4  |
| --pink         | #ec4899  |
| --purple       | #6b21a8  |
+----------------+------------+

SOMBRAS / GLOWS
+----------------+-------------------------------------------+
| Variável       | Valor                                     |
+----------------+-------------------------------------------+
| --shadow-cyan  | 0 0 20px rgba(34, 211, 238, 0.35)       |
| --shadow-pink  | 0 0 20px rgba(236, 72, 153, 0.3)        |
+----------------+-------------------------------------------+

FONTES
+-------------------+-------------------+
| Uso               | Fonte             |
+-------------------+-------------------+
| Corpo             | Space Grotesk     |
| Código            | JetBrains Mono    |
| Headings          | Syne              |
+-------------------+-------------------+

BACKGROUND GRADIENT
+----------------------+----------------------------------------------+
| Elemento             | Valor                                        |
+----------------------+----------------------------------------------+
| Base                 | #020617                                    |
| Canto superior esq   | #2d1b69                                    |
| Canto superior dir   | #06b6d4                                    |
+----------------------+----------------------------------------------+

TIPOGRAFIA
+--------------------------+------------------+---------+----------------------------------------------+
| Uso                      | Fonte            | Peso    | Características                              |
+--------------------------+------------------+---------+----------------------------------------------+
| Headings / logo          | Syne             | 700–800 | letter-spacing: -0.04em, italic no logo      |
| Corpo                    | Space Grotesk    | 400–700 | fonte padrão do body                         |
| Código / dados / badges  | JetBrains Mono   | 400–600 | letter-spacing: 0.01em a 0.18em              |
+--------------------------+------------------+---------+----------------------------------------------+

ESCALA DE TAMANHOS
+------------------------+-----------------------------------+-------------------+
| Elemento               | Valor                             | Observação        |
+------------------------+-----------------------------------+-------------------+
| Hero title             | clamp(3rem, 7vw, 4.1rem)          | line-height: 0.94 |
| Section h2             | clamp(2rem, 4vw, 3rem)            |                   |
| Scroll-film h2         | clamp(1.8rem, 2.8vw, 2.45rem)     |                   |
| Section kicker         | 0.72rem                           | uppercase, 0.18em |
| Corpo                  | 1.02rem                           |                   |
| Labels / mono badges   | 0.68rem – 0.76rem                 |                   |
+------------------------+-----------------------------------+-------------------+

CORES
+----------------+-------------------------------+----------------------------------+
| Token          | Valor                         | Uso                              |
+----------------+-------------------------------+----------------------------------+
| --bg-main      | #020617                     | fundo global                     |
| --bg-section   | #0a0f1e                     | seções alternadas                |
| --bg-card      | rgba(15,23,42,0.8)          | cards                            |
| --bg-glass     | rgba(15,23,42,0.62)         | glassmorphism                    |
| --text-main    | #f8fafc                     | texto primário                   |
| --text-soft    | #94a3b8                     | texto secundário                 |
| --cyan         | #22d3ee                     | acento principal                 |
| --cyan-strong  | #06b6d4                     | hover/foco cyan                  |
| --pink         | #ec4899                     | acento secundário                |
| --purple       | #6b21a8                     | acento terciário                 |
| —              | #f472b6                     | pink claro (aurora, orbs)        |
| —              | #6d28d9                     | purple médio (aurora)            |
| —              | #7c3aed                     | purple forte (orb)               |
| —              | #facc15                     | amarelo (valor de tan)           |
| —              | #c4b5fd                     | lavanda (ângulo label)           |
| —              | #bae6fd                     | azul claro (hero badge)          |
| —              | #e2e8f0                     | branco acinzentado (texto forte) |
| —              | #cbd5e1                     | cinza claro (subtexto)           |
| —              | #64748b                     | cinza muted (small text)         |
| --border-soft  | rgba(148,163,184,0.16)      | bordas neutras                   |
| --border-cyan  | rgba(34,211,238,0.28)       | bordas destacadas                |
+----------------+-------------------------------+----------------------------------+

GRADIENTES RECORRENTES
+-------------------+-----------------------------------------------------------------------+--------------------------------------+
| Nome              | Valor                                                                 | Uso                                  |
+-------------------+-----------------------------------------------------------------------+--------------------------------------+
| Cyan → Pink       | linear-gradient(90deg, #22d3ee, #ec4899)                          | progress bar, underlines, logo icon  |
| Dark glass        | linear-gradient(140deg, rgba(10,15,30,0.92), rgba(15,23,42,0.82)) | superfícies glass                    |
| Orb purple        | rgba(124,58,237,0.64)                                               | orb com blur(56px)                   |
| Orb cyan          | rgba(34,211,238,0.65)                                               | orb com blur(56px)                   |
| Orb pink          | rgba(244,114,182,0.45)                                              | orb com blur(56px)                   |
+-------------------+------------------------------------------------------------------------+--------------------------------------+

ESPAÇAMENTO
+-------------------------+----------------------------------+
| Elemento                | Valor                            |
+-------------------------+----------------------------------+
| Seção padding           | 120px 0                          |
| Seção max-width         | min(1160px, calc(100% - 40px))   |
| Section header mb       | 40px                             |
| Gap hero                | 36px                             |
| Gap cards               | 12–16px                          |
| Border-radius card      | 14–20px                          |
| Border-radius pill      | 999px                            |
| Border-radius botão     | 10px                             |
| Navbar padding          | 14px 18px                        |
| Navbar border-radius    | 16px                             |
+-------------------------+----------------------------------+

ANIMAÇÕES
+-----------------------------+----------------------+--------------------------------------+----------------------------------+
| Nome                        | Duração              | Easing                               | Gatilho                          |
+-----------------------------+----------------------+--------------------------------------+----------------------------------+
| Reveal scroll               | 520ms / 560ms        | ease                                 | translateY(28px) -> 0            |
| Botão hover                 | 200ms                | ease-out                             | translateY(-2px)                 |
| Navbar transition           | 240ms                | ease                                 | scroll                           |
| Nav pill (active)           | 300ms                | ease                                 | hover/click                      |
| pulseDot                    | 1.6s                 | ease-in-out infinite                 | badge hero                       |
| aurora-rotate               | 18s / 24s            | linear infinite                      | fundo                            |
| scanlineMove                | 14s                  | linear infinite                      | overlay global                   |
| orbMorphPurple / Pink       | 8.4s / 9.2s          | ease-in-out infinite                 | hero orbs                        |
| blinkCursor                 | 900ms                | steps(1) infinite                    | typewriter                       |
| strokeDraw                  | 1.2s                 | ease                                 | ícones SVG                       |
| Stats bar clip-path reveal  | 620ms                | cubic-bezier(0.2, 0.8, 0.2, 1)       | scroll                           |
| drawWave                    | 2.2s                 | ease forwards                        | wave SVG                         |
| Shimmer CTA navbar          | 460ms                | ease                                 | hover (translateX -120% -> 120%) |
+-----------------------------+----------------------+--------------------------------------+----------------------------------+

GLASS / BACKDROP
+------------------+-----------------------------------------+
| Propriedade      | Valor                                   |
+------------------+-----------------------------------------+
| background       | rgba(15, 23, 42, 0.62–0.84)             |
| backdrop-filter  | blur(12–24px)                           |
| border           | 1px solid rgba(34, 211, 238, 0.08–0.16) |
| border-radius    | 16–20px                                 |
+------------------+-----------------------------------------+

Siga esse projeto para a criação e prototipação da página:
Fetch this design file, read its readme, and implement the relevant aspects of the design. https://api.anthropic.com/v1/design/h/vQA7yKx6s05VoLZJsD_1aA?open_file=modulos.html
Implement: modulos.html

Em PDF está aqui:
[text](<../../Mateka! — Módulos & Exercícios.pdf>)

Mas de modo geral aqui é:
Visão Geral
Mateka! é uma plataforma de estudos de matemática universitária com tema dark e gamificação. O módulo exibido é Cálculo Diferencial (nível Universitário), com foco em derivadas, limites e aplicações reais.

Design Visual
O site usa um tema escuro (dark mode) com fundo azul-marinho quase preto (#0A0F1E), cartas em azul-escuro acinzentado (#111827), e acentos em ciano neon e roxo/violeta para criar contraste vibrante. A tipografia é monospace e sans-serif moderna, com destaques coloridos em ciano para porcentagens e status. A barra de progresso usa um gradiente de azul → roxo → ciano.

Layout e Estrutura
A hierarquia visual segue um padrão bem definido:

Header: logo M Mateka! à esquerda + breadcrumb (Dashboard › Cálculo Diferencial) + streak (🔥 7 dias) + avatar à direita
Hero do módulo: ícone f′ + badge "Universitário" + título + descrição + 3 métricas em destaque (Progresso, Aulas, Precisão) + botão CTA CONTINUAR AULA →
Barra de progresso: com label "Progresso do Módulo" e percentual à direita
Tabs de navegação: Aulas | Exercícios | Quiz Rápido
Trilha de aulas: cards organizados por unidades

Sistema de Trilha de Aulas
As aulas são organizadas em 3 unidades progressivas:

UNIDADES DO MÓDULO
==========================================
| UNIDADE | TEMA                | STATUS  |
|---------|---------------------|---------|
|    1    | Limites e           | DONE    |
|         | Continuidade        | 3 aulas |
|---------|---------------------|---------|
|    2    | Derivadas           | WIP     |
|         |                     | 5 aulas |
|---------|---------------------|---------|
|    3    | Aplicações          | LOCKED  |
|         |                     | 3 aulas |
==========================================

Cada card de aula contém: ícone de status (✓ verde, ▶ ciano, 🔒 cinza) + título + descrição curta + tags de tipo (Vídeo, Interativo, Exercício) + percentual de precisão em verde + tempo estimado em minutos.

Gamificação
O sistema de gamificação é um dos elementos centrais da UI:
Streak de dias seguidos (🔥 7 dias) visível no header e em seção própria
Precisão por aula em porcentagem (100%, 92%, 88%...)
Pontuação por exercício (+40 pts, +70 pts, +120 pts, +150 pts)
Dificuldade categorizada: FÁCIL / MÉDIO / DIFÍCIL com badges coloridos
Meta semanal com calendário de dias (SEG→DOM) e mensagem motivacional

Seção de Exercício
Os exercícios aparecem em cards grid 3x2 com:
Ícone simbólico (f′, ∂, ⛓, sin, ln, max)
Badge de dificuldade

Título + descrição
⏱ Tempo estimado + número de questões + pontos ganhos
Status: ✓ Concluído — X% ou Pendente

Quiz Rápido
O quiz exibe questões com:
Enunciado em texto
Display da fórmula em fonte monospace ciano em destaque visual
4 alternativas (A/B/C/D) em botões full-width com borda sutil
Dificuldade indicada no topo de cada questão

<project_context>
Aqui onde tem que ser criado esse dashboard e como vai se suceder estéticamente

mateka-app/
├── .claude
├── dist/
│   ├── assets/
│   ├── favicon.svg
│   ├── icons.svg
│   └── index.html
├── node_modules/
├── public/
├── Requisitos/
│   ├── HOW_2_WRITE_...
│   ├── image.png
│   └── prompt1.md
├── src/
│   ├── assets/
│   │   └── (imagens, ícones do projeto)
│   ├── components/
│   │   ├── Header.tsx          ← logo Mateka! + breadcrumb + streak + avatar
│   │   ├── ModuleHero.tsx      ← ícone f', badge, título, métricas, CTA
│   │   ├── ProgressBar.tsx     ← barra gradiente azul→roxo→ciano
│   │   ├── LessonCard.tsx      ← card com ícone status, tags, %, tempo
│   │   ├── UnitSection.tsx     ← agrupa LessonCards por unidade
│   │   ├── ExerciseCard.tsx    ← card grid com ícone, dificuldade, pts
│   │   ├── QuizQuestion.tsx    ← questão com fórmula destacada + alternativas
│   │   └── StreakSection.tsx   ← calendário semanal + meta
│   ├── pages/
│   │   └── modulos.html        ← ← ← ARQUIVO JÁ EXISTENTE (sua tela)
│   ├── styles/
│   │   ├── tokens.css          ← variáveis: cores dark navy, ciano, roxo
│   │   └── components.css      ← estilos dos componentes
│   ├── App.tsx
│   └── main.tsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── requisitos.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

Mateka! — Contexto Completo
O que é: Plataforma web interativa de ensino de matemática, desenvolvida como TCC, com a filosofia "Não decore. Visualize." — transforma conceitos abstratos (cálculo, trigonometria, funções) em experiências visuais e manipuláveis em tempo real.

MATEKA! — DESIGN SYSTEM
==========================================================

IDENTIDADE VISUAL
+------------------+---------------------------------------+
| Elemento         | Valor                                 |
+------------------+---------------------------------------+
| Background main  | #020617 (slate-950)                 |
| Background cards | #0d1b2e / #0f1f35                 |
| Accent cyan      | #00e5ff / #22d3ee                 |
| Accent purple    | #6B21A8                             |
| Accent pink      | #ec4899                             |
| Glass/cards      | rgba(15,23,42,0.62-0.84)              |
| Backdrop blur    | blur(12-24px)                         |
| Border cyan      | rgba(34,211,238,0.08-0.16)            |
| Border soft      | rgba(148,163,184,0.16)              |
+------------------+---------------------------------------+

TIPOGRAFIA
+------------------+---------------+---------+------------------------------+
| Uso              | Fonte         | Peso    | Caracteristicas              |
+------------------+---------------+---------+------------------------------+
| Headings / logo  | Syne          | 700-800 | letter-spacing -0.04em       |
| Corpo            | Space Grotesk | 400-700 | fonte padrao do body         |
| Codigo / badges  | JetBrains Mono| 400-600 | letter-spacing 0.01-0.18em   |
+------------------+---------------+---------+------------------------------+

STACK TECNICA
+------------------+---------------------------------------+
| Camada           | Tecnologia                            |
+------------------+---------------------------------------+
| Framework        | React 19 + TypeScript                 |
| Build tool       | Vite 6                                |
| Estilizacao      | Tailwind CSS                          |
| Animacoes        | GSAP + Canvas API                     |
| Roteamento       | React Router (hash-based)             |
+------------------+---------------------------------------+

PAGINAS EXISTENTES
+------------------+---------------------------------------+
| Rota             | Descricao                             |
+------------------+---------------------------------------+
| /                | Landing page (scroll film 3 atos)     |
| /login           | Login/Registro (flip card animado)    |
| /home            | Dashboard pos-login                   |
| /modulos         | Trilha de aulas (EM CONSTRUCAO)       |
+------------------+---------------------------------------+

MASCOTE
+------------------+---------------------------------------+
| Nome             | Emy-chan                              |
| Estilo           | Chibi anime                           |
| Cabelo           | Roxo / rosa                           |
| Olhos            | Azuis                                 |
| Roupa            | Hoodie navy com detalhes pink         |
| Funcao           | Onboarding no primeiro login          |
+------------------+---------------------------------------+

FILOSOFIA
+----------------------------------------------------------+
| "Nao decore. Visualize."                                 |
| Matematica visual e interativa (TCC)                     |
+----------------------------------------------------------+

Se quiser saber mais, segue o PDF:
[text](<../../Videos Brutos/Documentação dos Artefatos da Mateka.pdf>)

<architecture>

1. Filosofia Pedagógica
O ensino tradicional falha em três frentes que o Mateka! ataca diretamente:
Memorização estática — o aluno decora fórmulas sem entender o porquê
Abstração sem âncora — conceitos como derivada e limite ficam no plano abstrato
Passividade — o aluno só lê, nunca manipula
O Mateka! resolve isso tornando cada conceito algo que o usuário pode ver, mover e modificar em tempo real através de visualizações interativas.

2. Jornada do Usuário
O fluxo de uso é linear e progressivo:

Landing Page (impacto visual)
       ↓
Login / Registro (flip card animado)
       ↓
Home Dashboard (visão geral dos módulos)
       ↓
Página de Módulo (ex: Cálculo Diferencial)
       ↓
Aulas → Exercícios → Quiz Rápido

3. Sistema de Módulos
Cada módulo (ex: Cálculo Diferencial) é organizado em unidades progressivas com desbloqueio sequencial:
Unidade 1 — Limites e Continuidade (libera primeiro)
Unidade 2 — Derivadas (libera ao concluir a anterior)
Unidade 3 — Aplicações (bloqueada até completar as anteriores)
Cada aula dentro da unidade tem tipo definido: Vídeo, Interativo ou Exercício — com percentual de precisão e tempo estimado visíveis.

4. Gamificação
O engajamento é mantido por um sistema de recompensas integrado:
🔥 Streak diário — dias seguidos de estudo (exibido no header e em seção própria)
Precisão por aula — percentual individual (100%, 92%, 78%...)
Pontuação por exercício — +40 pts (fácil) até +150 pts (difícil)
Badges de dificuldade — FÁCIL / MÉDIO / DIFÍCIL com cores distintas

Meta semanal — calendário SEG→DOM com indicador visual de conclusão

5. Playground Interativo
O diferencial técnico do Mateka! é o WavePlayground — um canvas interativo onde o aluno manipula ondas senoidais em tempo real via slider de frequência, com resposta sonora via Web Audio API. É a tradução prática da filosofia do app: matemática que você ouve e vê acontecer.

6. Identidade Visual
O design reforça a proposta com uma estética cyberpunk/futurista dark:
Fundo #020617 navy quase preto + acentos em cyan neon e roxo/pink
Fonte Syne nos títulos, Space Grotesk no corpo, JetBrains Mono em dados
Cards com efeito glass (backdrop-filter: blur) e animações Awwwards-level
Mascote Emy-chan (chibi anime) para onboarding no primeiro acesso

7. Stack Técnica
O projeto é 100% frontend por enquanto, com backend previsto para fase futura:
Frontend  → React 19 + TypeScript + Vite 6 + Tailwind
Animações → GSAP + Canvas API + Web Audio API
Backend   → Python + Node + PostgreSQL (fase futura)

Mateká TG/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── Aurora.tsx
│   │   ├── AuthCardFlip.tsx
│   │   ├── BackgroundCanvas.tsx
│   │   ├── ClickBurst.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── DerivativeVisualizer.tsx
│   │   ├── FloatingEquations.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── IntegralVisualizer.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── LoginBackground.tsx
│   │   ├── LoginCard.tsx
│   │   ├── LoginCursor.tsx
│   │   ├── MatekaLogo.tsx
│   │   ├── MathBackground.tsx
│   │   ├── MathTrail.tsx
│   │   ├── MiniWaveCanvas.tsx
│   │   ├── ModuleGrid.tsx
│   │   ├── NavBar.tsx
│   │   ├── ParticleField.tsx
│   │   ├── PlaygroundErrorBoundary.tsx
│   │   ├── StatsBar.tsx
│   │   ├── StatsCounter.tsx
│   │   ├── TestimonialSection.tsx
│   │   ├── TrigCircle.tsx
│   │   ├── Vignette.tsx
│   │   ├── WavePlayground.tsx
│   │   └── WhyItMatters.tsx
│   ├── hooks/
│   │   ├── useAmbience.ts
│   │   ├── useCardTilt.ts
│   │   ├── useGlitchText.ts
│   │   ├── useLoginForm.ts
│   │   ├── useMagneticButton.ts
│   │   ├── useMousePosition.ts
│   │   ├── useRegisterForm.ts
│   │   ├── useScrollProgress.ts
│   │   ├── useScrollVelocity.ts
│   │   ├── useSpacedRepetition.ts
│   │   └── useSpringReveal.ts
│   ├── lib/              (empty)
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── utils/
│   │   ├── audio.ts
│   │   ├── math.ts
│   │   └── particles.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── Requisitos/
│   ├── HOW_2_WRITE_PROMPTS.md
│   ├── image.png
│   └── prompt1.md
├── dist/               (build output)
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
└── requisitos.md

<status>

Estamos na fase de planejamento e criação desse app
Para a criação dessa parte crie numa parte chamada "/dashboard", após o link
Crie a pasta chamada "Documentação geral", e coloque as saídas necessárias e relatórios de correções e criação

</status>

<task>

Você está implementando a página de módulos do Mateka! — uma plataforma
de ensino de matemática universitária com estética cyberpunk/futurista dark.
O design de referência é o arquivo Requisitos/modulos.html (Claude Design).

Siga rigorosamente esta ordem de execução:

══════════════════════════════════════════════════════════
1. LEITURA E AUDITORIA
══════════════════════════════════════════════════════════

- Leia o arquivo Requisitos/modulos.html por completo
- Mapeie todos os componentes visuais presentes:
    → Header (logo + breadcrumb + streak + avatar)
    → ModuleHero (ícone f', badge, título, métricas, CTA)
    → ProgressBar (gradiente azul → roxo → ciano)
    → UnitSection (agrupador de aulas por unidade)
    → LessonCard (status, tags, precisão %, tempo)
    → ExerciseCard (grid 3x2, dificuldade, pontos)
    → QuizQuestion (fórmula destacada + alternativas A/B/C/D)
    → StreakSection (calendário semanal + meta)
- Leia src/index.css para extrair as variáveis CSS existentes
- Leia src/App.tsx para entender o sistema de rotas atual
- Anote qualquer conflito de rota ou componente duplicado antes de prosseguir

══════════════════════════════════════════════════════════
2. DESIGN TOKENS — SINCRONIZAR COM O DESIGN SYSTEM
══════════════════════════════════════════════════════════

NÃO crie um novo design system. Estenda o existente em src/index.css.
Adicione APENAS as variáveis que ainda não existem:

  --mateka-bg-main:       #020617
  --mateka-bg-card:       #0d1b2e
  --mateka-bg-card-2:     #0f1f35
  --mateka-cyan:          #00e5ff
  --mateka-cyan-dim:      #22d3ee
  --mateka-purple:        #6B21A8
  --mateka-pink:          #ec4899
  --mateka-border-cyan:   rgba(34, 211, 238, 0.12)
  --mateka-border-soft:   rgba(148, 163, 184, 0.16)
  --mateka-glass:         rgba(15, 23, 42, 0.72)
  --mateka-success:       #22c55e
  --mateka-locked:        rgba(148, 163, 184, 0.35)

Fontes (já devem existir — confirme antes de recarregar):
  Syne → headings
  Space Grotesk → body
  JetBrains Mono → badges, dados, fórmulas

══════════════════════════════════════════════════════════
3. CRIAR OS COMPONENTES (src/components/modules/)
══════════════════════════════════════════════════════════

Crie cada componente abaixo em TypeScript + Tailwind.
Use APENAS as variáveis CSS do design system existente.

3.1 — ModuleHeader.tsx
  - Logo "M Mateka!" à esquerda
  - Breadcrumb: Dashboard › Nome do Módulo
  - Streak badge com ícone de fogo + "X dias"
  - Avatar do usuário à direita
  - Fundo: glass com backdrop-filter blur(16px)
  - Sticky no topo

3.2 — ModuleHero.tsx
  Props: icon, badge, title, description, progress, totalLessons,
         completedLessons, accuracy
  - Ícone do módulo (ex: f') em card com borda cyan
  - Badge de nível (ex: "Universitário") em pill roxo/ciano
  - Título em Syne 700
  - Descrição em Space Grotesk muted
  - 3 métricas lado a lado: PROGRESSO % | AULAS X/Y | PRECISÃO %
    → valores em cyan neon, labels em texto muted maiúsculo
  - Botão CTA "CONTINUAR AULA →" com fundo cyan, texto escuro,
    borda arredondada, hover com glow box-shadow cyan

3.3 — ModuleProgress.tsx
  Props: percentage
  - Label "Progresso do Módulo" à esquerda
  - Percentual em cyan à direita
  - Barra com gradiente: azul → roxo → ciano
  - Animação de preenchimento ao montar (transition 1s ease)

3.4 — LessonCard.tsx
  Props: title, description, tags[], status, accuracy, duration
  Status pode ser: "done" | "in-progress" | "locked"
  - "done"        → ícone ✓ verde em círculo
  - "in-progress" → ícone ▶ ciano em círculo (card com borda ciano brilhando)
  - "locked"      → ícone 🔒 cinza, texto opaco, sem hover
  - Tags coloridas: Vídeo (roxo), Interativo (ciano), Exercício (laranja)
  - Precisão em verde à direita
  - Duração em texto muted

3.5 — UnitSection.tsx
  Props: unitNumber, title, lessons[], locked?
  - Label "UNIDADE X — TÍTULO" em maiúsculo, espaçado, cyan dim
  - Se locked: label com "(BLOQUEADO)" + ícone cadeado
  - Lista de LessonCards com gap consistente

3.6 — ExerciseCard.tsx
  Props: icon, difficulty, title, description, duration,
         questions, points, status, accuracy?
  Difficulty: "easy" | "medium" | "hard"
  - Grid 3 colunas no desktop, 1 coluna no mobile
  - Ícone simbólico no topo (f', ∂, ⛓, sin, ln, max)
  - Badge de dificuldade: FÁCIL (verde) / MÉDIO (amarelo) / DIFÍCIL (vermelho)
  - Pontos em destaque cyan (+40 pts)
  - Status: "✓ Concluído — X%" em verde ou "Pendente" em muted

3.7 — QuizQuestion.tsx
  Props: number, difficulty, question, formula, options[]
  - Label "QUESTÃO X · DIFICULDADE" em topo do card
  - Enunciado em texto normal
  - Display da fórmula em JetBrains Mono, fundo escuro, texto cyan
  - 4 botões A/B/C/D full-width, borda sutil, hover com borda cyan
  - Ao selecionar: fundo glass cyan suave

3.8 — StreakSection.tsx
  Props: streak, days[] (boolean[7])
  - Ícone 🔥 + número grande + "DIAS SEGUIDOS"
  - Bolinhas SEG→DOM: ✓ verde (concluído) ou 🔥 ciano (hoje)
  - Mensagem motivacional dinâmica baseada no streak

══════════════════════════════════════════════════════════
4. CRIAR A PÁGINA (src/pages/ModulosPage.tsx)
══════════════════════════════════════════════════════════

- Importe e monte todos os componentes na ordem correta:
    1. ModuleHeader
    2. ModuleHero
    3. ModuleProgress
    4. Tabs: [Aulas] [Exercícios] [Quiz Rápido]
       → Tab ativa: sublinhado ciano + texto branco
       → Tab inativa: texto muted, hover suave
    5. Conteúdo condicional por tab ativa:
       - "Aulas"      → UnitSections com LessonCards
       - "Exercícios" → Grid de ExerciseCards
       - "Quiz Rápido"→ Lista de QuizQuestions + StreakSection

- Dados mockados inline (sem API por enquanto)
- Fundo: --mateka-bg-main com gradiente sutil de roxo no topo

══════════════════════════════════════════════════════════
5. REGISTRAR A ROTA
══════════════════════════════════════════════════════════

Em src/App.tsx, adicione:
  /modulos/:moduleId  → <ModulosPage />

Se já existir rota /modulos, apenas atualize o componente.
Não quebre nenhuma rota existente.

══════════════════════════════════════════════════════════
6. RESPONSIVIDADE E ANIMAÇÕES
══════════════════════════════════════════════════════════

- Mobile (375px): tudo em coluna única, grid de exercícios 1 coluna
- Progress bar: animação de entrada (width 0% → X% em 1s)
- LessonCard "in-progress": pulse suave na borda ciano (keyframe)
- Tab switch: fade entre conteúdos (opacity 0 → 1, 200ms)
- Streak days: entrada em sequência (stagger 80ms por bolinha)
- Respeitar prefers-reduced-motion em TODAS as animações

══════════════════════════════════════════════════════════
7. TESTES E VERIFICAÇÃO
══════════════════════════════════════════════════════════

Execute na ordem:

  a) npm run build
     → Zero erros de TypeScript obrigatório antes de continuar

  b) npm run dev
     → Acesse /modulos/calculo-diferencial
     → Verifique cada componente visualmente

  c) Checklist de validação:
     [ ] Header sticky funciona no scroll
     [ ] Métricas do hero exibem corretamente
     [ ] Progress bar anima ao carregar
     [ ] Tabs alternam o conteúdo corretamente
     [ ] LessonCard done/in-progress/locked com visual correto
     [ ] Card "in-progress" tem borda ciano pulsante
     [ ] Grid de exercícios: 3 colunas no desktop, 1 no mobile
     [ ] Quiz: fórmula destacada em JetBrains Mono
     [ ] Streak: bolinhas entram em stagger
     [ ] Sem overflow horizontal em 375px
     [ ] Nenhuma cor hardcoded fora das variáveis CSS
     [ ] Fontes Syne/Space Grotesk/JetBrains Mono carregando

  d) Se algum item falhar:
     → Corrija o item isoladamente
     → Rode npm run build novamente
     → Repita o checklist completo

Caso esgote as tentativas sem resolver, pare e me entregue:
  - Lista exata dos itens que falharam
  - Erro completo do console (se houver)
  - O que foi tentado em cada caso

Caso tudo passe, me diga:
  - URL exata para acessar no browser
  - Como navegar até a página de módulos a partir do login
  - Print mental de cada seção funcionando

</task>

<validation>

### Casos de Uso

══════════════════════════════════════════════════════════
CASOS DE USO — MÓDULOS DO MATEKA!
══════════════════════════════════════════════════════════

CU-01 · VISUALIZAR TRILHA DE AULAS
──────────────────────────────────
Ator: Estudante logado
Fluxo principal:
  1. Usuário acessa /modulos/calculo-diferencial
  2. Sistema exibe o hero com título, badge de nível e métricas
  3. Sistema renderiza a progress bar animada com % atual
  4. Tab "Aulas" fica ativa por padrão
  5. Sistema exibe as unidades em ordem com seus LessonCards
  6. Unidades bloqueadas aparecem com cadeado e texto opaco
Fluxo alternativo:
  - Se módulo não existir → redireciona para /home com toast de erro

──────────────────────────────────
CU-02 · CONTINUAR AULA EM ANDAMENTO
──────────────────────────────────
Ator: Estudante com progresso salvo
Fluxo principal:
  1. Usuário visualiza o botão "CONTINUAR AULA →" no hero
  2. Clica no botão
  3. Sistema identifica a última aula com status "in-progress"
  4. Redireciona para a aula correspondente
Fluxo alternativo:
  - Se não houver aula em andamento → inicia a primeira aula da
    Unidade 1 automaticamente
  - Se todas as aulas estiverem concluídas → botão muda para
    "REVISAR MÓDULO →"

──────────────────────────────────
CU-03 · ACESSAR UMA AULA ESPECÍFICA
──────────────────────────────────
Ator: Estudante
Fluxo principal:
  1. Usuário clica em um LessonCard com status "done" ou "in-progress"
  2. Card expande ou redireciona para a aula
  3. Sistema registra o acesso
Fluxo alternativo:
  - Se status for "locked" → card não responde ao clique
  - Cursor muda para "not-allowed" no hover de cards bloqueados

──────────────────────────────────
CU-04 · NAVEGAR ENTRE TABS
──────────────────────────────────
Ator: Estudante
Fluxo principal:
  1. Usuário clica em "Exercícios" ou "Quiz Rápido"
  2. Tab ativa recebe sublinhado ciano + texto branco
  3. Conteúdo troca com fade (opacity 0 → 1, 200ms)
  4. Scroll retorna ao topo do conteúdo da tab
Fluxo alternativo:
  - URL atualiza com hash: /modulos/calculo-diferencial#exercicios
  - Ao recarregar a página, a tab correta fica ativa

──────────────────────────────────
CU-05 · INICIAR UM EXERCÍCIO
──────────────────────────────────
Ator: Estudante na tab "Exercícios"
Fluxo principal:
  1. Usuário visualiza o grid de ExerciseCards (3 colunas)
  2. Identifica dificuldade pelo badge (FÁCIL/MÉDIO/DIFÍCIL)
  3. Clica no card desejado
  4. Sistema redireciona para o exercício correspondente
Fluxo alternativo:
  - Cards já concluídos mostram "✓ Concluído — X%" em verde
  - Usuário pode refazer clicando em "Tentar novamente"
  - Em mobile: grid colapsa para 1 coluna com scroll vertical

──────────────────────────────────
CU-06 · RESPONDER QUIZ RÁPIDO
──────────────────────────────────
Ator: Estudante na tab "Quiz Rápido"
Fluxo principal:
  1. Sistema exibe questões em sequência com fórmula destacada
  2. Usuário lê o enunciado e a fórmula em JetBrains Mono
  3. Clica em uma alternativa (A/B/C/D)
  4. Alternativa selecionada recebe fundo glass cyan
  5. Sistema revela se está correta ou errada com cor de feedback
  6. Botão "Próxima →" aparece para avançar
Fluxo alternativo:
  - Se errar: alternativa fica vermelha, correta fica verde
  - Ao finalizar todas as questões: exibe tela de resultado
    com % de acerto e pontos ganhos

──────────────────────────────────
CU-07 · VISUALIZAR STREAK SEMANAL
──────────────────────────────────
Ator: Estudante
Fluxo principal:
  1. Usuário scrolla até a StreakSection no Quiz
  2. Sistema exibe contador de dias seguidos com ícone 🔥
  3. Bolinhas SEG→DOM entram em stagger (80ms cada)
  4. Dias concluídos: ✓ verde | Dia atual: 🔥 ciano | Futuros: vazio
  5. Mensagem motivacional dinâmica aparece abaixo
Variações da mensagem por streak:
  1-3 dias   → "Bom começo! Continue assim."
  4-6 dias   → "Quase uma semana! Não pare agora."
  7 dias     → "Meta da semana concluída! 🎉"
  14+ dias   → "Você está em chamas! 🔥🔥"

──────────────────────────────────
CU-08 · MÓDULO BLOQUEADO
──────────────────────────────────
Ator: Estudante que não completou pré-requisitos
Fluxo principal:
  1. Usuário tenta acessar /modulos/aplicacoes (Unidade 3)
  2. Sistema detecta que Unidade 2 não foi concluída
  3. Unidade 3 é renderizada com overlay escuro + cadeado
  4. Tooltip ao hover: "Complete Derivadas para desbloquear"
Fluxo alternativo:
  - Se usuário tentar clicar diretamente numa aula bloqueada:
    card vibra levemente (shake animation 300ms) como feedback
    negativo sem redirecionar

──────────────────────────────────
CU-09 · MOBILE — NAVEGAÇÃO ADAPTADA
──────────────────────────────────
Ator: Estudante em dispositivo móvel (375px)
Fluxo principal:
  1. Hero exibe métricas em linha única com scroll horizontal suave
  2. Grid de exercícios colapsa para 1 coluna
  3. Tabs ficam sticky abaixo do header, com scroll horizontal
     se não couberem na tela
  4. LessonCards ocupam largura total com padding reduzido
  5. Botão CTA "CONTINUAR AULA →" full-width na base do hero
Restrições:
  - Nenhum elemento com overflow horizontal visível
  - Touch targets mínimos de 44x44px em todos os clicáveis
  - Hover states substituídos por active states no touch

──────────────────────────────────
CU-10 · ATUALIZAÇÃO DE PROGRESSO
──────────────────────────────────
Ator: Sistema após conclusão de aula
Fluxo principal:
  1. Usuário conclui uma aula
  2. Sistema atualiza o status do LessonCard para "done"
  3. Progress bar reanima do valor antigo para o novo (transition)
  4. Métricas do hero atualizam: PROGRESSO %, AULAS X/Y
  5. Se última aula da unidade: próxima unidade é desbloqueada
     com animação de unlock (cadeado abre + fade-in dos cards)
Fluxo alternativo:
  - Se for a última aula do módulo inteiro:
    confetti + mensagem "Módulo concluído! 🎉"
    botão muda para "IR PARA O PRÓXIMO MÓDULO →"

══════════════════════════════════════════════════════════

</validation>

<constraints>
══════════════════════════════════════════════════════════
RESTRIÇÕES GERAIS — NÃO FAÇA
══════════════════════════════════════════════════════════

### Abordagem Técnica e Runtime

- NÃO use localStorage ou sessionStorage — o ambiente é um iframe
  sandboxado que bloqueia acesso ao storage. Use variáveis em memória.
- NÃO instale dependências novas sem me consultar primeiro e justificar
  o motivo — o projeto já tem GSAP, Tailwind, React e Vite configurados.
- NÃO use fetch() para arquivos binários (imagens, fontes) via JavaScript
  — use diretamente em tags HTML (<img>, <video>, <source>).
- NÃO crie um novo design system paralelo — estenda APENAS o src/index.css
  existente com as variáveis que ainda não existem.
- NÃO hardcode cores, fontes ou espaçamentos fora das variáveis CSS
  definidas no design system (--mateka-*, --color-*, etc).
- NÃO use inline styles com valores arbitrários (ex: style="color:#fff").
  Use sempre classes Tailwind ou variáveis CSS.
- NÃO quebre nenhuma rota existente ao adicionar /modulos/:moduleId.
- NÃO use animações CSS que não respeitem prefers-reduced-motion.
- NÃO renderize texto menor que 12px em nenhum elemento.
- NÃO use setTimeout ou setInterval sem limpar no cleanup do useEffect.
- NÃO deixe memory leaks — todo cancelAnimationFrame e removeEventListener
  devem estar no return do useEffect.

### Estrutura de Arquivos e Organização

- NÃO altere a estrutura de pastas ou nomes de arquivos já existentes.
- NÃO mova arquivos de lugar sem me perguntar antes.
- NÃO crie arquivos auxiliares (scripts bash, configs extras,
  arquivos de teste) sem eu pedir explicitamente.
- NÃO crie nenhum arquivo de documentação, README parcial ou
  comentário de bloco explicativo no projeto sem minha solicitação.
- NÃO crie um index.ts de barrel export a menos que eu peça.
- NÃO divida um componente em sub-arquivos desnecessários — se o
  componente cabe em um arquivo, mantenha-o em um arquivo.
- NÃO crie pastas novas além de src/components/modules/ e
  src/pages/ conforme mapeado na estrutura acordada.

### Manipulação de Código e Estilos

- NÃO refatore código existente que não está no escopo da task —
  se encontrar algo a melhorar fora do escopo, me avise mas não altere.
- NÃO remova classes Tailwind existentes ao adicionar novas.
- NÃO substitua variáveis CSS por valores hardcoded ao "simplificar".
- NÃO altere App.tsx além de adicionar a rota /modulos/:moduleId.
- NÃO altere src/index.css além de adicionar as variáveis listadas
  na seção de design tokens desta task.
- NÃO use any em TypeScript — todos os tipos devem ser explícitos
  ou inferidos corretamente.
- NÃO use // @ts-ignore ou // eslint-disable para suprimir erros —
  corrija o erro de verdade.
- NÃO misture estilos Tailwind com styled-components ou CSS Modules
  — o projeto usa Tailwind + variáveis CSS, mantenha esse padrão.
- NÃO adicione bordas coloridas laterais nos cards (border-left colorido)
  — use elevação de superfície (shadow, background) para diferenciação.

### Protocolo de Comunicação e Fluxo

- NÃO repita código que já foi mostrado antes — referencie pelo
  nome do arquivo/componente se precisar mencionar.
- NÃO explique conceitos já discutidos (design system, stack, filosofia
  do Mateka!) — eles já foram estabelecidos no briefing.
- NÃO re-leia arquivos que já foram lidos nesta sessão sem necessidade.
- NÃO pergunte confirmação para cada micro-decisão óbvia dentro do escopo
  — só me consulte em decisões que impactem arquitetura ou dependências.
- NÃO mostre o checklist de validação antes de executá-lo — execute
  primeiro, depois reporte o resultado.
- NÃO entregue código parcial ou incompleto — cada componente deve
  estar 100% funcional antes de passar para o próximo.
- NÃO sugira "melhorias futuras" ao final — se algo for importante,
  implemente agora ou me avise durante a execução.

══════════════════════════════════════════════════════════

</constraints>

══════════════════════════════════════════════════════════
TÉCNICAS E REGRAS DE TRABALHO — MATEKA!
══════════════════════════════════════════════════════════

### Ambiente e Runtime

- Use SEMPRE npm (ou o gerenciador já configurado no projeto).
  Não instale pacotes globalmente — tudo dentro do projeto.
- Antes de rodar qualquer comando, confirme que está na raiz
  do projeto onde o package.json está localizado.
- Limpe o cache do Vite antes de rodar testes de build:
    rm -rf node_modules/.vite dist
- Se houver conflito de dependência, leia o package.json antes
  de tentar resolver — não instale versões diferentes por impulso.

Comandos padrão do ciclo de trabalho:
    npm run build          → verifica TypeScript + gera dist/
    npm run dev            → servidor local em desenvolvimento
    npm run lint           → ESLint (já configurado no projeto)
    rm -rf node_modules/.vite && npm run dev  → força rebuild limpo

### Comunicação

- Ao iniciar cada fase, diga o que vai fazer em 1-2 frases.
- Ao concluir, diga o que fez e qual o próximo passo.
- Se encontrar uma decisão arquitetural ambígua, informe o que
  escolheu e por quê — não me pergunte, decida e documente.
- Economize contexto: não repita código já mostrado, não explique
  conceitos já discutidos (stack, design system, filosofia do Mateka!).

### Autonomia

- Rode TODOS os comandos necessários você mesmo (install, build, lint).
  Não me peça para rodar manualmente, a não ser que só eu tenha
  permissão de acesso (ex: variável de ambiente, secret).
- Se um comando falhar, analise o erro e tente resolver sozinho.
  Só escale quando esgotar as alternativas — e nesse caso me traga
  o erro completo + o que foi tentado.
- Ao concluir cada componente, rode npm run build para confirmar
  zero erros de TypeScript antes de avançar para o próximo.

### Sugestão de Commit

- Ao final de cada etapa concluída com sucesso, sempre me sugira
  uma mensagem de commit no padrão Conventional Commits:

    feat(modulos): add ModuleHero and ProgressBar components
    feat(modulos): implement LessonCard with status variants
    feat(modulos): add ExerciseCard grid and QuizQuestion
    feat(modulos): register /modulos/:moduleId route in App.tsx
    fix(modulos): correct progress bar animation on mount

  Nunca dê push automaticamente — apenas sugira o commit.

### Estratégia de Navegação e Busca (Context Economy)

Você DEVE economizar tokens. Siga estas regras estritas:

1. EXCLUSÃO MANDATÓRIA:
   Ao usar grep, find ou ls -R, exclua SEMPRE:
     node_modules, dist, .git, .vite, coverage, .cache

   Padrão para listar estrutura do projeto:
     find . -maxdepth 3 \
       -not -path '*/node_modules/*' \
       -not -path '*/.git/*' \
       -not -path '*/dist/*' \
       -not -path '*/.vite/*'

   Padrão para buscar texto no código:
     grep -r "termo" . \
       --exclude-dir={node_modules,dist,.git,.vite,coverage}

   Padrão para listar só arquivos TypeScript/TSX:
     find . -name "*.tsx" -o -name "*.ts" \
       | grep -v node_modules \
       | grep -v dist

2. LEITURA INTELIGENTE:
   - Nunca leia um arquivo inteiro se só precisa de uma função.
   - Use grep com contexto antes de abrir o arquivo completo:
       grep -n "ModuleHero" src/App.tsx
       grep -C 3 "variável_procurada" src/index.css
   - Para ver só o início de um arquivo grande:
       head -n 50 src/App.tsx

3. LEITURA DE ARQUIVOS MINIFICADOS:
   - Nunca leia arquivos dentro de dist/ diretamente.
   - Se precisar inspecionar o output do build:
       head -c 500 dist/assets/index-[hash].js

### Estratégia de Erro e Debug

1. ERROS DE TYPESCRIPT (npm run build):
   - Leia APENAS a linha do erro + 3 linhas de contexto:
       grep -n "error TS" build-output.txt | head -n 20
   - Corrija um erro por vez — erros em cascata somem ao
     resolver o primeiro.

2. ERROS DE RUNTIME (browser console):
   - Classifique antes de agir:
       → "Cannot find module" → import path errado
       → "is not a function"  → tipo errado ou prop faltando
       → "undefined"          → dado mockado ausente ou prop opcional
   - Não refatore para resolver um erro de runtime — corrija
     o ponto específico que falhou.

3. ERROS DE ESTILO/LAYOUT:
   - Inspecione pelo DevTools antes de alterar o código.
   - Confirme qual variável CSS está sendo aplicada:
       grep "var(--mateka" src/components/modules/LessonCard.tsx

══════════════════════════════════════════════════════════
</techniques>






    




