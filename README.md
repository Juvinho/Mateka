# Matéka! 🔢

Plataforma interativa de ensino de matemática com estética
cyberpunk. Visualize trigonometria, cálculo diferencial e integral
em tempo real — sem decorar fórmulas.

## ✨ Funcionalidades

- **Círculo trigonométrico interativo** — ponto segue o mouse,
  exibe ângulo, seno e cosseno em tempo real
- **Playground de Ondas** — slider de frequência com visualização
  no canvas e som via Web Audio API
- **5 módulos de conteúdo** — Conceitos Básicos, Pré-Cálculo,
  Cálculo Diferencial, Cálculo Integral, Trigonometria Aplicada
- **Sistema de favoritos** — persistido em localStorage
- **Tela de Login/Registro** com animação de flip 3D
- **Modo Ambience** — soundscape ambiente para estudo
- **Cursor customizado** com efeitos matemáticos

## 🛠️ Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- GSAP + @gsap/react
- Lenis (smooth scroll)
- Web Audio API (nativa)
- Canvas 2D API (nativa)

## 🚀 Como rodar

### Pré-requisitos
- Node.js 18+ instalado
- npm 9+

### Instalação

```bash
git clone https://github.com/seu-usuario/mateka.git
cd mateka
npm install
npm run dev
```

Acesse: http://localhost:5173

### Build de produção

```bash
npm run build
npm run preview
```

## 📁 Estrutura do projeto

```
src/
├── components/       # Componentes reutilizáveis
├── pages/            # LoginPage, RegisterPage
├── hooks/            # Hooks customizados
├── App.tsx           # Roteamento e layout principal
└── main.tsx          # Entrada da aplicação
```

## 🎓 Contexto acadêmico

Projeto desenvolvido como Trabalho de Conclusão de Curso (TCC)
para o curso de Análise e Desenvolvimento de Sistemas.

## 📄 Licença

MIT
