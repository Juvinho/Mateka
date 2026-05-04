<role>

Você é um desenvolvedor UI/UX de nível Awwwards, especialista em
animações com GSAP, Framer Motion e Canvas API. Você já trabalhou
em produtos como Linear, Vercel e Lusion — onde animações têm
propósito e não são decoração. Cada movimento comunica estado,
hierarquia e feedback ao usuário.

</role>

<project_context>

Projeto: Mateka! — plataforma de ensino de matemática universitária.
Stack: React 19 + TypeScript + Vite 6 + Tailwind CSS + GSAP (já instalado).
Design system: dark navy (#020617), cyan (#22d3ee), purple (#6B21A8).
Fontes: Syne, Space Grotesk, JetBrains Mono.

Arquivo principal desta task:
  src/pages/ModulosPage.tsx         → página alvo
  src/components/modules/           → componentes dos cards
  src/components/ui/RippleBackground.tsx → canvas já existente

Verifique se GSAP está instalado antes de usar:
  grep "gsap" package.json

</project_context>

<task>

Implemente as animações abaixo na página de módulos.
Siga rigorosamente esta ordem:

1- ENTRADA DA PÁGINA (Page Mount)
   Ao entrar na rota /modulos/:id, os elementos entram em sequência:
   → Header: fade-in + translateY(-8px → 0), duration 400ms
   → ModuleHero (ícone + título + métricas): stagger 80ms por elemento,
     cada um com opacity 0→1 + translateY(16px→0), ease "power2.out"
   → Progress bar: após o hero, anima width de 0% até o valor real
     em 900ms com ease "power3.out"
   → Tabs (Aulas/Exercícios/Quiz): fade-in após a progress bar, delay 200ms
   → UnitSections: entram em stagger de 120ms, translateY(24px→0) + opacity
   Use gsap.timeline() para encadear tudo em sequência controlada.

2- LESSON CARDS — HOVER INTERATIVO
   Ao fazer hover em cada LessonCard:
   → Scale: 1 → 1.015, duration 200ms, ease "power1.out"
   → Border color: rgba(34,211,238,0.12) → rgba(34,211,238,0.35)
   → Box-shadow: aparece sutil (0 4px 24px rgba(34,211,238,0.08))
   → Ícone de status (✓ ou ▶): rotação leve +5deg no hover
   Card "in-progress": borda ciano com pulse contínuo
   → keyframe CSS: border-color oscila entre 0.35 e 0.8 de opacidade, 2s loop

3- PROGRESS BAR — NÚMERO CONTADOR
   O percentual "45%" no hero deve contar de 0 até o valor real:
   → Usar gsap.to() com um objeto { val: 0 } até { val: 45 }
   → onUpdate: atualizar o textContent com Math.round()
   → Duration: 900ms, sincronizado com a animação da barra
   → Mesmo efeito nas métricas AULAS (0 → 5/11) e PRECISÃO (0% → 88%)

4- TAB SWITCH — TRANSIÇÃO DE CONTEÚDO
   Ao trocar de tab (Aulas → Exercícios → Quiz Rápido):
   → Conteúdo saindo: opacity 1→0 + translateX(0→-12px), duration 150ms
   → Conteúdo entrando: opacity 0→1 + translateX(12px→0), duration 200ms
   → Indicador da tab ativa (sublinhado ciano): desliza horizontalmente
     usando gsap.to() na posição do underline — não troca instantaneamente

5- SCROLL REVEAL nas UnitSections
   Cards abaixo do fold entram ao scrollar:
   → Usar IntersectionObserver (sem ScrollTrigger para economizar bundle)
   → Threshold: 0.15 — entra quando 15% do card fica visível
   → Animação: opacity 0→1 + translateY(20px→0), duration 500ms, ease "power2.out"
   → Stagger entre cards da mesma unidade: 60ms
   → Uma vez animado, não anima de novo (unobserve após entrada)

6- STREAK SECTION — ENTRADA DRAMÁTICA
   As bolinhas de dia (SEG→DOM) entram em stagger ao montar:
   → Scale 0→1 + opacity 0→1, stagger 80ms por bolinha
   → ease "back.out(1.4)" para efeito de mola
   → Bolinha do dia atual (🔥): pulsa suavemente em scale 1→1.08→1, loop

7- RODE npm run build → zero erros TypeScript.
   Depois npm run dev e valide cada animação:
   [ ] Sequência de entrada completa ao carregar /modulos/calculo-diferencial
   [ ] Hover nos cards tem scale + border suave
   [ ] Card in-progress tem pulse contínuo na borda
   [ ] Contadores de número sobem do zero
   [ ] Tab switch tem slide + fade entre conteúdos
   [ ] Indicador de tab desliza horizontalmente
   [ ] Scroll reveal nos cards abaixo do fold
   [ ] Streak bolinhas entram em stagger com mola
   [ ] prefers-reduced-motion: TODAS as animações desabilitadas
   [ ] Sem jank (use apenas transform e opacity — nunca width/height no GSAP)
   [ ] Sem memory leaks (cleanup nos useEffect)
   [ ] npm run build sem erros

   Se tudo passar → sugira commit:
     feat(modulos): add entrance animations, hover states, counter and tab transitions

   Se falhar → pare e entregue: item exato + erro completo + o que foi tentado.

</task>

<validation>

### Escolha X ao invés de Y

- Use transform: translateY() ao invés de margin/top animado
  → GPU-accelerated, sem layout shift (CLS zero)
- Use IntersectionObserver ao invés de ScrollTrigger do GSAP
  → ScrollTrigger aumenta o bundle — IO é nativo e suficiente
- Use gsap.timeline() ao invés de múltiplos gsap.to() soltos
  → Controle preciso da sequência e fácil de pausar/reverter
- Use will-change: transform apenas durante a animação, remova após
  → Evita uso desnecessário de camada de compositing

### Corrigindo Problemas

- Se animação de entrada "piscar": adicionar opacity: 0 via CSS
  antes do GSAP rodar (não depender do JS para estado inicial)
- Se tab switch causar flash: garantir que o conteúdo saindo termine
  ANTES de o novo conteúdo começar a entrar (timeline encadeada)
- Se scroll reveal não disparar: confirmar que o ref está attachado
  ao elemento correto e que o threshold não é 0

</validation>

<constraints>

### Abordagem Técnica

- NÃO instale Framer Motion — use GSAP que já está no projeto.
- NÃO anime width, height, top, left — apenas transform e opacity.
- NÃO use will-change permanentemente — só durante a animação.
- NÃO use ScrollTrigger — use IntersectionObserver nativo.
- NÃO quebre o RippleBackground já existente.

### Código e Estilos

- NÃO refatore componentes fora do escopo das animações.
- NÃO remova classes Tailwind ao adicionar animações GSAP.
- NÃO hardcode valores de cor — use as variáveis CSS existentes.
- Todo useEffect com GSAP DEVE ter return () => tl.kill() no cleanup.

### Comunicação

- NÃO repita código já mostrado.
- NÃO explique o design system — já estabelecido.
- Ao iniciar cada animação, diga o que vai fazer em 1 frase.
- Ao concluir cada uma, confirme com npm run build antes de avançar.

</constraints>

<techniques>

Limpe o cache antes de começar:
  rm -rf node_modules/.vite

Confirme GSAP instalado:
  grep "gsap" package.json

Busca focada (sem explodir contexto):
  grep -n "gsap\|useEffect\|useRef" src/pages/ModulosPage.tsx
  grep -n "hover\|transition\|animate" src/components/modules/LessonCard.tsx

Regra de ouro para animações performáticas no Mateka!:
  ✓ opacity, transform (translate, scale, rotate) → GPU, sem layout
  ✗ width, height, margin, padding, top, left    → causa reflow

</techniques>