<div align="center">

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/GSAP-3.12-88CE02?style=for-the-badge&logo=greensock&logoColor=black" />

<br/><br/>

# Mateka!

### *Não decore. Visualize.*

**Plataforma web de ensino de matemática universitária com estética cyberpunk/futurista.**  
Transforma conceitos abstratos — derivadas, limites, integrais — em experiências visuais e manipuláveis em tempo real.

**TCC — Análise e Desenvolvimento de Sistemas**

<br/>

[**Ver Demo**](https://github.com/Juvinho/Mateka) · [**Reportar Bug**](https://github.com/Juvinho/Mateka/issues) · [**Sugerir Feature**](https://github.com/Juvinho/Mateka/issues)

</div>

---

## Sobre o projeto

O ensino tradicional de matemática falha em três frentes que o **Mateka!** ataca diretamente:

| Problema tradicional | Solução Mateka! |
|---|---|
| Memorização estática de fórmulas | Visualizações interativas manipuláveis |
| Abstração sem âncora visual | Canvas em tempo real com resposta imediata |
| Passividade do aluno | Interação direta: mova, clique, ouça |

A filosofia central é simples: **você não aprende matemática lendo — você aprende fazendo**. Cada conceito da plataforma pode ser visto, movido e modificado pelo usuário.

---

## Funcionalidades

### Visualizações interativas
- **Círculo trigonométrico** — ponto rastreado pelo mouse, exibe ângulo, sen e cos em tempo real com animação fluida
- **Playground de Ondas** — slider de frequência com visualização em canvas + feedback sonoro via Web Audio API
- **Visualizador de Derivadas** — interpretação geométrica da taxa de variação instantânea
- **Visualizador de Integrais** — somas de Riemann animadas com área destacada

### Dashboard de Módulos
- **Trilha de aulas** por unidade progressiva com desbloqueio sequencial
- **Sistema de gamificação** — streak diário 🔥, precisão por aula, pontuação por exercício
- **Grid de exercícios** com badges de dificuldade (Fácil / Médio / Difícil)
- **Quiz rápido** com fórmulas destacadas em fonte monospace e feedback imediato de acerto/erro
- **Progresso visual** com barra gradiente animada

### Experiência visual
- **Background com ripple effect** — ondas circulares cyan ao clicar, partículas flutuantes passivas
- **Cursor customizado** com rastro de símbolos matemáticos
- **Loading screen** animada com símbolo do Mateka!
- **Modo Ambience** — soundscape ambiente para sessões de estudo
- **Tela de Login/Registro** com animação de flip 3D e verificação visual estilo captcha matemático
- **Professor Mode** — ativado via Konami Code (↑↑↓↓←→←→BA)

---

## Stack técnica

```
Frontend   →  React 19 + TypeScript 5.7 + Vite 6
Estilização → Tailwind CSS 4 + variáveis CSS customizadas
Animações  →  GSAP 3.12 + Canvas 2D API (nativa)
Áudio      →  Web Audio API (nativa, sem dependências)
Roteamento →  History API nativa (hash-based, sem React Router)
Build      →  Vite 6 com lazy loading de componentes pesados
```

### Dependências de produção

| Pacote | Versão | Uso |
|---|---|---|
| `react` | 19 | Framework principal |
| `react-dom` | 19 | Renderização DOM |
| `gsap` | 3.12.5 | Animações complexas (logo, cards, reveal) |
| `@gsap/react` | 2.1.1 | Hook `useGSAP` para animações React-safe |
| `split-type` | 0.3.4 | Split de texto para animações por caractere |

> Zero dependências de UI (sem Radix, MUI, Shadcn). Design system 100% proprietário.

---

## Design System

### Paleta de cores

| Token | Valor | Uso |
|---|---|---|
| `--bg-main` | `#020617` | Fundo global |
| `--bg-section` | `#0a0f1e` | Seções alternadas |
| `--cyan` | `#22d3ee` | Acento principal |
| `--cyan-strong` | `#06b6d4` | Hover / foco |
| `--pink` | `#ec4899` | Acento secundário |
| `--purple` | `#6b21a8` | Acento terciário |
| `--text-main` | `#f8fafc` | Texto primário |
| `--text-soft` | `#94a3b8` | Texto secundário |

### Tipografia

| Uso | Fonte | Peso |
|---|---|---|
| Headings / Logo | Syne | 700–800 |
| Corpo | Space Grotesk | 400–700 |
| Código / Badges / Fórmulas | JetBrains Mono | 400–600 |

### Logo

O logo é composto por um ícone com gradiente **cyan → purple → pink** e o texto **"Mat"** em ghost (baixa opacidade) + **"eka!"** em cyan sólido — reforçando a identidade visual da plataforma.

---

## Estrutura do projeto

```
src/
├── components/
│   ├── modules/              # Componentes do dashboard de módulos
│   │   ├── ModuleHeader.tsx  # Header sticky com logo + streak + avatar
│   │   ├── ModuleHero.tsx    # Hero com métricas e CTA
│   │   ├── ModuleProgress.tsx# Barra de progresso animada
│   │   ├── LessonCard.tsx    # Card de aula (done/in-progress/locked)
│   │   ├── UnitSection.tsx   # Agrupador de aulas por unidade
│   │   ├── ExerciseCard.tsx  # Card de exercício com dificuldade e pontos
│   │   ├── QuizQuestion.tsx  # Questão com fórmula + alternativas A/B/C/D
│   │   └── StreakSection.tsx # Calendário semanal de streak
│   ├── ui/
│   │   ├── RippleBackground.tsx  # Canvas fullscreen com ondas e partículas
│   │   └── ProfileDropdown.tsx   # Dropdown do avatar com SVG inline
│   ├── Aurora.tsx            # Efeito de aurora boreal no fundo
│   ├── AuthCardFlip.tsx      # Container do flip card login/registro
│   ├── BackgroundCanvas.tsx  # Canvas de partículas da landing
│   ├── CustomCursor.tsx      # Cursor customizado com rastro matemático
│   ├── DerivativeVisualizer.tsx  # (lazy) Visualizador de derivadas
│   ├── IntegralVisualizer.tsx    # (lazy) Visualizador de integrais
│   ├── LoginCard.tsx         # Card de login com animações GSAP
│   ├── MatekaLogo.tsx        # Componente de logo reutilizável
│   ├── ModuleGrid.tsx        # Grid de módulos disponíveis
│   ├── NavBar.tsx            # Barra de navegação sticky
│   ├── TrigCircle.tsx        # Círculo trigonométrico interativo
│   ├── WavePlayground.tsx    # Playground de ondas sonoras
│   └── ...
├── hooks/
│   ├── useAmbience.ts        # Soundscape de estudo
│   ├── useCardTilt.ts        # Efeito de tilt 3D nos cards
│   ├── useLoginForm.ts       # Validação do formulário de login
│   ├── useMousePosition.ts   # Rastreamento de posição do mouse
│   ├── useScrollProgress.ts  # Barra de progresso de scroll
│   ├── useSpacedRepetition.ts# Algoritmo de repetição espaçada
│   └── ...
├── pages/
│   ├── LoginPage.tsx         # Página de login
│   ├── RegisterPage.tsx      # Página de registro
│   └── ModulosPage.tsx       # Dashboard de módulos (rota #modulos)
├── utils/
│   ├── audio.ts              # Helpers para Web Audio API
│   ├── math.ts               # Funções matemáticas utilitárias
│   └── particles.ts          # Sistema de partículas
├── App.tsx                   # Roteamento principal (hash-based)
└── main.tsx                  # Entry point
```

---

## Rotas

| Hash | Descrição |
|---|---|
| `#hero` | Landing page — impacto visual e apresentação |
| `#login` | Login com flip card animado |
| `#register` | Registro de conta |
| `#conteudos` | Grid de módulos disponíveis |
| `#modulos/:id` | Dashboard do módulo (ex: `#modulos/calculo-diferencial`) |
| `#aula-1` / `#aula-2` | Visualizadores interativos de aulas |

---

## Como rodar

### Pré-requisitos

- Node.js **18+**
- npm **9+**

### Instalação

```bash
git clone https://github.com/Juvinho/Mateka.git
cd Mateka
npm install
npm run dev
```

Acesse: **http://localhost:5173**

### Scripts disponíveis

```bash
npm run dev      # Servidor de desenvolvimento com HMR
npm run build    # Build de produção (TypeScript + Vite)
npm run preview  # Preview do build de produção
npm run lint     # ESLint com regras para React Hooks
```

### Navegar para o dashboard de módulos

Após rodar `npm run dev`, acesse diretamente:

```
http://localhost:5173/#modulos/calculo-diferencial
```

---

## Mascote

**Emy-chan** — chibi anime com cabelo roxo/rosa, olhos azuis e hoodie navy com detalhes pink. Aparece no onboarding do primeiro acesso para guiar o novo usuário pela plataforma.

---

## Contexto acadêmico

> Projeto desenvolvido como **Trabalho de Conclusão de Curso (TCC)**  
> Curso: Análise e Desenvolvimento de Sistemas  
> Tema: Plataforma de ensino interativo com foco em visualização matemática

A proposta nasceu da observação de que alunos de cursos de exatas consistentemente relatam dificuldade com cálculo e trigonometria não por falta de esforço, mas por falta de uma representação visual e interativa dos conceitos. O Mateka! é a resposta a esse problema.

---

## Roadmap

- [x] Landing page com visualizações interativas
- [x] Sistema de login/registro com flip card
- [x] Dashboard de módulos com trilha de aulas
- [x] Sistema de gamificação (streak, precisão, pontos)
- [x] Quiz rápido com feedback de acerto/erro
- [x] Ripple background interativo
- [x] Dropdown de perfil com SVG inline
- [ ] Backend — Python + Node.js + PostgreSQL
- [ ] Autenticação real (JWT)
- [ ] Progresso persistido em banco de dados
- [ ] Mascote Emy-chan no onboarding
- [ ] Modo offline (PWA)

---

## Licença

Distribuído sob a licença MIT. Veja [`LICENSE`](LICENSE) para mais informações.

---

<div align="center">

Feito com 🔢 e muita vontade de aprender.

**[Juvinho](https://github.com/Juvinho)** — TCC 2026

</div>
