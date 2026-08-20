import audioMatriz1 from '../assets/voice/O-que-e-uma-matriz.mp3'
import audioMatriz2 from '../assets/voice/tipos-de-matriz.mp3'
import audioMatriz3 from '../assets/voice/Localizando-e-comparando.mp3'
import audioOpBasicas from '../assets/voice/SSM-escala.mp3'
import audioMultMatrizes from '../assets/voice/MLC-multi.mp3'
import audioDetTransposta from '../assets/voice/ITD-multi.mp3'
import audioInversaSistemas from '../assets/voice/Minver-Linear.mp3'
import audioAplicacoes from '../assets/voice/TGG-multi.mp3'
import audioTiposAvancados from '../assets/voice/MTM-multi.mp3'
import audioCayleyHamilton from '../assets/voice/CH-multii.mp3'
import audioConjuntos1 from '../assets/voice/Conjuntos Numéricos.mp3'
import audioRetaNumerica from '../assets/voice/Reta numérica e comparações.mp3'
import audioComutativaAssociativa from '../assets/voice/Comutativa e associativa.mp3'
import audioDistributiva from '../assets/voice/Propriedade distributiva.mp3'
import audioFracoesOperacoes from '../assets/voice/Operações com Frações.mp3'
import audioRazaoProporcao from '../assets/voice/Razão e Proporção.mp3'
import audioPotenciacao from '../assets/voice/Propriedades da potenciação.mp3'
import audioRadiciacao from '../assets/voice/Radiciação.mp3'
import audioProdutosNotaveis from '../assets/voice/Produtos Notáveis.mp3'
import audioRacionaisIrracionais from '../assets/voice/Racionais e Irracionais.mp3'
import audioFatoracao from '../assets/voice/Fatoração.mp3'
import audioEquacoes1Grau from '../assets/voice/Equação 1 Grau.mp3'
import type { Reaction } from './mascotReactions'

// `start` times (seconds) are proportioned from each clip's real duration by
// character weight per segment — there's no forced-alignment transcript, so
// this is an approximation, not exact word-level sync.
export const LESSON_NARRATIONS: Partial<Record<string, Reaction>> = {
  'matriz-1': {
    audio: audioMatriz1,
    segments: [
      { mood: 'entusiasmo', start: 0, text: 'Vamos começar do começo: o que é, de fato, uma matriz?' },
      {
        mood: 'normal',
        start: 4.14,
        text: 'Pensa assim: é só uma tabela de números, organizada em linhas — que vão na horizontal — e colunas, que vão na vertical.',
      },
      { mood: 'entusiasmo', start: 12.79, text: 'Simples, né?' },
      {
        mood: 'normal',
        start: 13.89,
        text: 'Quando falamos que uma matriz tem dimensão "m por n", significa que ela tem "m" linhas e "n" colunas. Olha esse exemplo aqui:',
      },
      { mood: 'suspense', start: 22.55, text: 'essa matriz A tem 2 linhas e 3 colunas...' },
      { mood: 'entusiasmo', start: 25.72, text: 'então dizemos que ela é 2 por 3!' },
      {
        mood: 'normal',
        start: 27.98,
        text: 'E cada número dentro dela tem um endereço só dele — chamamos de elemento, e localizamos ele por aᵢⱼ, onde "i" é a linha e "j" é a coluna.',
      },
      {
        mood: 'timida',
        start: 37.47,
        text: 'Pode parecer só uma notação chata agora, mas confia em mim, ela vai facilitar MUITO sua vida daqui pra frente.',
      },
      { mood: 'entusiasmo', start: 45.1, text: 'Agora é sua vez:' },
      {
        mood: 'normal',
        start: 46.33,
        text: 'desce até o editor ali embaixo, clica numa célula e descobre a posição dela na prática!',
      },
    ],
  },
  'matriz-2': {
    audio: audioMatriz2,
    segments: [
      {
        mood: 'entusiasmo',
        start: 0,
        text: 'Agora vamos conhecer alguns tipos especiais de matriz que aparecem o tempo todo por aí!',
      },
      {
        mood: 'normal',
        start: 5.75,
        text: 'Primeiro, a matriz quadrada: quando o número de linhas é igual ao número de colunas, tipo essa aqui, que é 2 por 2.',
      },
      { mood: 'entusiasmo', start: 13.92, text: 'Fácil de identificar, né?' },
      {
        mood: 'normal',
        start: 15.83,
        text: 'Mas tem mais: a matriz linha tem só uma linha, a matriz coluna tem só uma coluna...',
      },
      {
        mood: 'timida',
        start: 21.96,
        text: 'os nomes são bem literais mesmo, eu sei, matemática às vezes não capricha na criatividade!',
      },
      {
        mood: 'normal',
        start: 28.16,
        text: 'E por último, a matriz nula: todos os elementos são zero, não importa o tamanho dela.',
      },
      {
        mood: 'entusiasmo',
        start: 34.29,
        text: 'Com esses tipos na cabeça, você já reconhece matriz em qualquer lugar!',
      },
      { mood: 'normal', start: 39.08, text: 'Bora praticar pra fixar de vez?' },
    ],
  },
  'matriz-3': {
    audio: audioMatriz3,
    segments: [
      { mood: 'entusiasmo', start: 0, text: 'Vamos falar sobre como localizar e comparar matrizes!' },
      {
        mood: 'normal',
        start: 3.65,
        text: 'Pra achar um elemento específico, usamos aquela notação que já vimos: aᵢⱼ — primeiro a linha, depois a coluna. Olha essa matriz A aqui, 3 por 3...',
      },
      { mood: 'suspense', start: 14.66, text: 'consegue achar sozinho quem é o elemento a₃₂?' },
      { mood: 'normal', start: 17.79, text: 'Isso mesmo, é o 3! Linha 3, coluna 2.' },
      {
        mood: 'entusiasmo',
        start: 20.92,
        text: 'Agora, uma pegadinha importante: quando duas matrizes são iguais de verdade?',
      },
      { mood: 'timida', start: 26.39, text: 'Não é só "parecerem" iguais de longe, viu...' },
      {
        mood: 'normal',
        start: 29.91,
        text: 'Elas precisam ter exatamente a mesma dimensão, e cada elemento na mesma posição precisa ser idêntico.',
      },
      {
        mood: 'entusiasmo',
        start: 36.88,
        text: 'Se só um numerozinho estiver diferente, ou a dimensão não bater, já não são iguais!',
      },
      { mood: 'normal', start: 42.74, text: 'Bora praticar e testar seu olho pra detalhes?' },
    ],
  },
  'op-basicas': {
    audio: audioOpBasicas,
    segments: [
      { mood: 'entusiasmo', start: 0, text: 'Vamos combinar matrizes agora! Primeiro, soma e subtração.' },
      {
        mood: 'normal',
        start: 3.83,
        text: 'A regra é simples: se duas matrizes têm a mesma dimensão, você soma ou subtrai elemento por elemento, cada um na sua posição correspondente.',
      },
      { mood: 'suspense', start: 12.48, text: 'Olha esse exemplo: A mais B...' },
      { mood: 'entusiasmo', start: 14.82, text: 'cada posição soma direto, sem mistério nenhum!' },
      {
        mood: 'normal',
        start: 17.74,
        text: 'Agora, multiplicação por escalar é ainda mais direta: você pega um número — chamamos de k — e multiplica TODOS os elementos da matriz por ele.',
      },
      {
        mood: 'timida',
        start: 26.61,
        text: 'Sério, é bem mais simples do que a soma, não tem pegadinha nenhuma dessa vez!',
      },
      {
        mood: 'entusiasmo',
        start: 31.42,
        text: 'E olha que legal: aqui embaixo você pode editar A, B e o k, e ver os três resultados recalculando na hora, ao vivo!',
      },
      {
        mood: 'normal',
        start: 38.68,
        text: 'Testa uns valores diferentes, muda o k pra negativo, vê o que acontece...',
      },
      { mood: 'entusiasmo', start: 43.55, text: 'bora brincar com os números!' },
    ],
  },
  'mult-matrizes': {
    audio: audioMultMatrizes,
    segments: [
      { mood: 'entusiasmo', start: 0, text: 'Agora sim, o chefão da seção: multiplicação de matrizes!' },
      {
        mood: 'suspense',
        start: 4.13,
        text: 'E já aviso: esquece tudo que você aprendeu na soma, porque aqui a lógica é bem diferente.',
      },
      {
        mood: 'normal',
        start: 10.44,
        text: 'Multiplicar matrizes NÃO é multiplicar posição por posição — cada elemento do resultado vem de pegar uma LINHA inteira de A e uma COLUNA inteira de B, multiplicar par a par, e somar tudo.',
      },
      {
        mood: 'timida',
        start: 23.15,
        text: 'Confesso que na primeira vez que fiz isso na mão, me perdi contando qual linha ia com qual coluna...',
      },
      {
        mood: 'normal',
        start: 30.24,
        text: 'mas o print aqui te mostra exatamente: o elemento da linha 1, coluna 1 do resultado é 1 vezes 5, mais 2 vezes 7, que dá 19!',
      },
      {
        mood: 'entusiasmo',
        start: 38.94,
        text: 'E atenção pra uma regrinha importante: só dá pra multiplicar A por B se o número de colunas de A for igual ao número de linhas de B — senão nem começa a fazer sentido matematicamente!',
      },
      { mood: 'normal', start: 51.25, text: 'O resultado final vai ter dimensão "m por p".' },
      {
        mood: 'entusiasmo',
        start: 54.41,
        text: 'Agora desce até o editor, muda os valores de A e B, e observa o resultado se recalculando na hora!',
      },
      {
        mood: 'normal',
        start: 61.18,
        text: 'Isso aqui é a base de praticamente tudo que vem depois em Álgebra Linear, então vale a pena treinar bastante.',
      },
    ],
  },
  'det-transposta': {
    audio: audioDetTransposta,
    segments: [
      {
        mood: 'entusiasmo',
        start: 0,
        text: 'Mais uma parada da nossa jornada por matrizes: identidade, transposta e determinante!',
      },
      { mood: 'normal', start: 5.97, text: 'Três conceitos novos, então vamos com calma, um de cada vez.' },
      { mood: 'suspense', start: 10.34, text: 'Primeiro: a matriz identidade.' },
      { mood: 'normal', start: 12.72, text: 'Ela tem 1 na diagonal principal e 0 em todo o resto.' },
      {
        mood: 'entusiasmo',
        start: 16.32,
        text: 'Por que isso importa? Porque ela funciona exatamente como o número 1 na multiplicação normal — multiplicar qualquer matriz pela identidade não muda nada!',
      },
      { mood: 'normal', start: 26.66, text: 'Segundo conceito: a transposta.' },
      { mood: 'timida', start: 29.1, text: 'O nome é feio, mas a ideia é simples...' },
      {
        mood: 'normal',
        start: 32.25,
        text: 'Você simplesmente troca linha por coluna. A primeira linha de A vira a primeira coluna de Aᵀ, e assim por diante.',
      },
      { mood: 'entusiasmo', start: 40.15, text: 'E o terceiro, o mais aguardado: determinante!' },
      { mood: 'suspense', start: 43.55, text: 'Pra matriz 2 por 2, a fórmula é curtinha: a·d − b·c.' },
      {
        mood: 'normal',
        start: 47.47,
        text: 'Pra matrizes maiores, como o 3 por 3 que você vê no editor, o cálculo é mais elaborado, mas o resultado te conta algo poderoso sobre a matriz —',
      },
      {
        mood: 'entusiasmo',
        start: 57.17,
        text: 'inclusive se ela tem ou não uma inversa, que é assunto pra outro dia!',
      },
      {
        mood: 'normal',
        start: 61.92,
        text: 'Desce até o editor, mexe nos valores de A, e observa o traço, a transposta e o determinante recalculando ao vivo.',
      },
      {
        mood: 'entusiasmo',
        start: 69.83,
        text: 'Essa foi a última tela de Matrizes — você chegou até aqui, e isso já é motivo de comemorar!',
      },
    ],
  },
  'inversa-sistemas': {
    audio: audioInversaSistemas,
    segments: [
      { mood: 'entusiasmo', start: 0, text: 'Continuando em Matrizes: agora vamos conhecer a matriz inversa!' },
      {
        mood: 'normal',
        start: 4.66,
        text: 'A⁻¹ é aquela matriz especial que, multiplicada por A, te devolve a identidade — lembra dela lá de trás?',
      },
      { mood: 'suspense', start: 12.22, text: 'Mas atenção: nem toda matriz tem inversa.' },
      { mood: 'timida', start: 15.46, text: 'Ela só existe quando o determinante NÃO é zero...' },
      {
        mood: 'normal',
        start: 19.31,
        text: 'então viu como aquele conceito de determinante que a gente aprendeu não era só decoração? Ele decide se a inversa existe ou não!',
      },
      {
        mood: 'entusiasmo',
        start: 28.36,
        text: 'Pra matriz 2 por 2 a fórmula é direta: você inverte a posição dos elementos da diagonal principal, troca o sinal dos outros dois, e divide tudo pelo determinante.',
      },
      { mood: 'normal', start: 40.05, text: 'Olha o exemplo: determinante 10, então a inversa sai certinha.' },
      { mood: 'entusiasmo', start: 44.84, text: 'E pra que serve isso na prática?' },
      {
        mood: 'normal',
        start: 47.2,
        text: 'Pra resolver sistemas lineares! Se A × x = b, então x = A⁻¹ × b — é uma ferramenta poderosíssima.',
      },
      { mood: 'entusiasmo', start: 54.5, text: 'Agora no editor, desce e tenta um desafio:' },
      {
        mood: 'suspense',
        start: 57.67,
        text: 'deixa o determinante chegar em zero, tipo tornando a segunda linha um múltiplo da primeira...',
      },
      { mood: 'normal', start: 64.63, text: 'e observa o que acontece com a inversa.' },
      { mood: 'timida', start: 67.53, text: 'Spoiler: ela literalmente desaparece!' },
      { mood: 'entusiasmo', start: 70.44, text: 'Bora testar?' },
    ],
  },
  aplicacoes: {
    audio: audioAplicacoes,
    segments: [
      {
        mood: 'entusiasmo',
        start: 0,
        text: 'Pra fechar Matrizes com chave de ouro: você sabia que elas também descrevem transformações geométricas?',
      },
      {
        mood: 'normal',
        start: 6.55,
        text: 'Isso mesmo — multiplicar um ponto, tipo (x, y), por uma matriz de escala ou rotação, literalmente move ou distorce esse ponto no espaço!',
      },
      { mood: 'suspense', start: 15.51, text: 'Olha esse exemplo: a matriz S aqui é uma matriz de escala...' },
      {
        mood: 'entusiasmo',
        start: 19.78,
        text: 'e quando multiplicamos pelo ponto P, ele simplesmente dobra de tamanho!',
      },
      {
        mood: 'normal',
        start: 24.35,
        text: 'O ponto (3,1) vira (6,2) — a mesma direção, só que duas vezes mais longe da origem.',
      },
      {
        mood: 'timida',
        start: 30.07,
        text: 'Ah, e um bônus rapidinho: matrizes também aparecem representando grafos — tipo redes de conexões — mas isso é assunto pra outra hora, só queria plantar essa sementinha na sua cabeça.',
      },
      {
        mood: 'normal',
        start: 41.91,
        text: 'Agora no editor: muda os valores de A e vê o ponto se transformando no gráfico em tempo real.',
      },
      {
        mood: 'entusiasmo',
        start: 47.93,
        text: 'Tenta deixar A negativo em algum lugar, ou zerar uma linha, e observa o que acontece com o ponto —',
      },
      {
        mood: 'normal',
        start: 54.18,
        text: 'rotação, espelhamento, achatamento, tudo é só multiplicação de matriz!',
      },
      {
        mood: 'entusiasmo',
        start: 58.93,
        text: 'Com isso, você fecha oficialmente a seção de Matrizes. Parabéns por chegar até aqui!',
      },
    ],
  },
  'tipos-avancados': {
    audio: audioTiposAvancados,
    segments: [
      {
        mood: 'entusiasmo',
        start: 0,
        text: 'Bônus especial de Matrizes: mais alguns tipos que valem a pena conhecer, principalmente se você for seguir pra álgebra linear mais avançada!',
      },
      {
        mood: 'normal',
        start: 9.52,
        text: 'Primeiro, matriz triangular: se todos os elementos ABAIXO da diagonal principal são zero, ela é triangular superior. Se são os de CIMA que zeram, é triangular inferior.',
      },
      {
        mood: 'suspense',
        start: 21.43,
        text: 'Repara na matriz T do exemplo — só tem número embaixo da diagonal e à direita, o resto é zero puro.',
      },
      { mood: 'entusiasmo', start: 28.31, text: 'Segundo tipo: matriz binária!' },
      { mood: 'normal', start: 30.56, text: 'Todos os elementos são 0 ou 1, nada mais.' },
      {
        mood: 'timida',
        start: 33.59,
        text: 'Lembra que eu comentei rapidinho sobre matrizes representando grafos, lá atrás?',
      },
      {
        mood: 'entusiasmo',
        start: 38.99,
        text: 'Pois é exatamente essa aqui, a matriz binária, que a gente usa pra isso — o 1 indica que existe conexão entre dois pontos, o 0 indica que não existe!',
      },
      { mood: 'normal', start: 49.29, text: 'E por último, um conceito mais avançado: matriz ortogonal.' },
      { mood: 'suspense', start: 53.6, text: 'Uma matriz quadrada A é ortogonal quando Aᵀ × A dá a identidade.' },
      {
        mood: 'normal',
        start: 57.97,
        text: 'Parece abstrato, mas tem aplicação enorme em computação gráfica e rotações no espaço 3D!',
      },
      { mood: 'entusiasmo', start: 63.95, text: 'Com isso, encerramos de vez a seção de Matrizes —' },
      {
        mood: 'normal',
        start: 67.37,
        text: 'você já sabe organizar, somar, multiplicar, inverter, transformar e agora até classificar matrizes.',
      },
      { mood: 'entusiasmo', start: 74.51, text: 'Só falta um passo antes da gente seguir em frente...' },
    ],
  },
  'cayley-hamilton': {
    audio: audioCayleyHamilton,
    segments: [
      { mood: 'normal', start: 0, text: 'Ok...' },
      { mood: 'timida', start: 1.74, text: 'chegou a hora que eu tava adiando... Teorema de Cayley-Hamilton.' },
      { mood: 'suspense', start: 7.04, text: 'Eu já avisei lá atrás que esse aqui é o meu ponto fraco, né?' },
      { mood: 'normal', start: 11.57, text: 'Mas vamos lá, respira fundo comigo.' },
      {
        mood: 'entusiasmo',
        start: 14.43,
        text: 'O teorema diz uma coisa meio maluca: toda matriz quadrada A é "raiz" do próprio polinômio característico dela.',
      },
      { mood: 'timida', start: 22.58, text: 'Sei que isso soa como grego agora, mas fica comigo.' },
      {
        mood: 'normal',
        start: 26.56,
        text: 'Pra uma matriz 2 por 2, esse polinômio é p(λ) = λ² − tr(A)·λ + det(A).',
      },
      { mood: 'suspense', start: 31.86, text: 'E quando substituímos a própria matriz A no lugar de λ...' },
      { mood: 'entusiasmo', start: 36.39, text: 'a mágica acontece: p(A) sempre, SEMPRE dá a matriz nula!' },
      {
        mood: 'timida',
        start: 40.85,
        text: 'Confesso que a primeira vez que vi isso funcionar eu achei que tinha algum erro de conta,',
      },
      { mood: 'normal', start: 47.19, text: 'mas não, é sério, é assim mesmo que funciona.' },
      {
        mood: 'entusiasmo',
        start: 50.89,
        text: 'E o mais louco: isso serve pra coisa prática! Dá pra usar essa relação pra calcular potências maiores de A sem multiplicar matriz várias vezes,',
      },
      {
        mood: 'suspense',
        start: 61.41,
        text: 'e até pra achar a fórmula da inversa direto, sem aquele processo mais longo!',
      },
      {
        mood: 'normal',
        start: 67.06,
        text: 'Olha, isolando a identidade na equação, a gente chega numa fórmula pronta pra A⁻¹.',
      },
      { mood: 'entusiasmo', start: 73.33, text: 'Bora pro editor:' },
      {
        mood: 'normal',
        start: 75.07,
        text: 'muda os valores de A, e observa p(A) sempre voltando pra matriz nula, não importa o que você digitar.',
      },
      { mood: 'timida', start: 82.67, text: 'Viu? Eu disse que ia dar certo... eu acho.' },
      {
        mood: 'entusiasmo',
        start: 86.65,
        text: 'Com isso, agora sim, encerramos de vez a seção de Matrizes!',
      },
    ],
  },
  'conjuntos-1': {
    audio: audioConjuntos1,
    segments: [
      { mood: 'entusiasmo', start: 0, text: 'Vamos começar pelo alicerce de tudo: os conjuntos numéricos!' },
      {
        mood: 'normal',
        start: 4.53,
        text: 'Todo número que você usa no dia a dia pertence a algum conjunto, e esses conjuntos vão se encaixando um dentro do outro, cada um mais amplo que o anterior.',
      },
      { mood: 'suspense', start: 16.23, text: 'Primeiro, os Números Naturais — o N.' },
      {
        mood: 'normal',
        start: 18.94,
        text: 'São os números que você usa pra contar: zero, um, dois, três... o ponto de partida de tudo.',
      },
      { mood: 'entusiasmo', start: 25.81, text: 'Depois vêm os Números Inteiros, o Z.' },
      {
        mood: 'normal',
        start: 28.53,
        text: 'Eles pegam tudo que já era Natural e somam os opostos negativos: menos três, menos dois, menos um...',
      },
      {
        mood: 'timida',
        start: 36.07,
        text: 'o nome "Z" vem do alemão "Zahlen", que só quer dizer número — juro que não inventei isso, é curiosidade real!',
      },
      {
        mood: 'normal',
        start: 44.3,
        text: 'Repara numa coisa importante: todo natural é inteiro, mas nem todo inteiro é natural — afinal, não dá pra "contar" menos três pessoas, faz sentido?',
      },
      { mood: 'entusiasmo', start: 55.39, text: 'E por último, os Números Racionais, o Q.' },
      {
        mood: 'normal',
        start: 58.41,
        text: 'São todos aqueles que dá pra escrever como uma fração a sobre b, com a e b inteiros e b diferente de zero.',
      },
      {
        mood: 'suspense',
        start: 66.41,
        text: 'Isso inclui frações, números inteiros e até decimais que terminam ou repetem, tipo 0,333...',
      },
      {
        mood: 'entusiasmo',
        start: 73.28,
        text: 'E cada conjunto desses contém o anterior dentro dele: N dentro de Z, Z dentro de Q.',
      },
      {
        mood: 'normal',
        start: 79.55,
        text: 'Guarda essa ideia de "caixinhas uma dentro da outra" — ela vai aparecer o tempo todo daqui pra frente, principalmente quando a gente for falar sobre domínio de função.',
      },
      { mood: 'entusiasmo', start: 92.15, text: 'Bora praticar pra fixar?' },
    ],
  },
  'conjuntos-3': {
    audio: audioRetaNumerica,
    segments: [
      { mood: 'entusiasmo', start: 0, text: 'Agora vamos visualizar os números de um jeito novo: a reta numérica!' },
      {
        mood: 'normal',
        start: 4.89,
        text: 'Ela organiza todos os números reais em ordem, da esquerda pra direita — os mais negativos lá na esquerda, os mais positivos lá na direita.',
      },
      { mood: 'suspense', start: 14.81, text: 'E é a ferramenta mais direta pra comparar dois números.' },
      { mood: 'normal', start: 18.77, text: 'Mas presta atenção, porque tem uma pegadinha clássica aqui:' },
      {
        mood: 'timida',
        start: 23.01,
        text: 'comparar números negativos costuma confundir todo mundo, inclusive eu confundi bastante quando aprendi isso.',
      },
      { mood: 'suspense', start: 30.77, text: 'Entre -5 e -2, qual é o maior?' },
      { mood: 'normal', start: 32.93, text: 'A resposta é -2!' },
      {
        mood: 'entusiasmo',
        start: 34.08,
        text: 'Porque quanto mais perto do zero, maior o número — e -2 tá mais à direita na reta do que -5.',
      },
      {
        mood: 'normal',
        start: 40.7,
        text: 'Outro conceito importante aqui: o valor absoluto, ou módulo, de um número.',
      },
      {
        mood: 'suspense',
        start: 46.02,
        text: 'Ele mede a distância desse número até o zero, e essa distância é sempre um valor não negativo.',
      },
      {
        mood: 'entusiasmo',
        start: 52.77,
        text: 'Olha só: o módulo de -8 é 8, e o módulo de 8 também é 8 — os dois estão exatamente a 8 unidades de distância da origem, só que em direções opostas.',
      },
      {
        mood: 'normal',
        start: 63.34,
        text: 'E quando dois números têm o mesmo valor absoluto mas sinais contrários, tipo -4 e 4, a gente chama eles de opostos, ou simétricos.',
      },
      {
        mood: 'timida',
        start: 72.69,
        text: 'O nome "simétrico" faz todo sentido, né? Eles são like um espelho um do outro, com o zero no meio.',
      },
      {
        mood: 'entusiasmo',
        start: 79.74,
        text: 'Bora praticar e testar se você já pegou o jeito de comparar negativos?',
      },
    ],
  },
  'operacoes-1': {
    audio: audioComutativaAssociativa,
    segments: [
      {
        mood: 'entusiasmo',
        start: 0,
        text: 'Vamos falar de duas propriedades que você já usa sem perceber: comutativa e associativa!',
      },
      {
        mood: 'normal',
        start: 6.55,
        text: 'Repara nisso: quando você soma 3 mais 5, ou 5 mais 3, o resultado é sempre 8 — a ordem não muda nada.',
      },
      { mood: 'suspense', start: 14.07, text: 'Isso não é coincidência.' },
      {
        mood: 'normal',
        start: 15.86,
        text: 'Tem nome: propriedade comutativa. E ela vale tanto pra soma quanto pra multiplicação.',
      },
      {
        mood: 'entusiasmo',
        start: 22.18,
        text: 'Em símbolos, fica assim: a mais b é igual a b mais a, e a vezes b é igual a b vezes a.',
      },
      {
        mood: 'normal',
        start: 28.59,
        text: 'Você pode trocar a ordem dos números numa soma ou numa multiplicação sem alterar o resultado final.',
      },
      { mood: 'suspense', start: 35.96, text: 'Já a propriedade associativa é sobre outra coisa: agrupamento.' },
      { mood: 'normal', start: 40.57, text: '"a mais b, tudo mais c" é igual a "a, mais b mais c".' },
      {
        mood: 'entusiasmo',
        start: 44.52,
        text: 'Não importa quais dois números você soma primeiro — o resultado final é sempre o mesmo.',
      },
      {
        mood: 'timida',
        start: 50.99,
        text: 'E agora, um aviso importante, porque essa é a parte que costuma pegar todo mundo de surpresa...',
      },
      { mood: 'suspense', start: 58.07, text: 'nem toda operação tem essas propriedades!' },
      {
        mood: 'normal',
        start: 61.12,
        text: '5 menos 3 é diferente de 3 menos 5. 10 dividido por 2 é diferente de 2 dividido por 10.',
      },
      { mood: 'entusiasmo', start: 67.59, text: 'Subtração e divisão NÃO são comutativas, nem associativas.' },
      {
        mood: 'normal',
        start: 71.91,
        text: 'Saber exatamente onde essas propriedades valem — e onde não valem — evita erros clássicos quando você for reorganizar uma conta mais complexa lá na frente.',
      },
      { mood: 'entusiasmo', start: 83.45, text: 'Bora praticar pra fixar isso de vez?' },
    ],
  },
  'operacoes-2': {
    audio: audioDistributiva,
    segments: [
      { mood: 'entusiasmo', start: 0, text: 'Chegamos na propriedade mais usada de toda álgebra: a distributiva!' },
      {
        mood: 'normal',
        start: 4.84,
        text: 'Ela te ensina como multiplicar um número por uma soma, ou subtração, que tá dentro de parênteses, sem precisar calcular o que tá dentro primeiro.',
      },
      {
        mood: 'suspense',
        start: 15.33,
        text: 'A regra é essa: a vezes, entre parênteses, b mais c... é igual a a vezes b, mais a vezes c.',
      },
      {
        mood: 'entusiasmo',
        start: 21.91,
        text: 'Você "distribui" o a pra cada termo dentro do parênteses, multiplicando um de cada vez!',
      },
      {
        mood: 'normal',
        start: 28.2,
        text: 'E funciona igualzinho com subtração: a vezes, entre parênteses, b menos c, é igual a a vezes b, menos a vezes c.',
      },
      { mood: 'timida', start: 36.29, text: 'E aqui vem uma parte que eu acho genuinamente bonita da matemática...' },
      { mood: 'suspense', start: 41.28, text: 'essa propriedade funciona nos dois sentidos!' },
      {
        mood: 'normal',
        start: 44.46,
        text: 'Você pode expandir um parênteses, que é distribuir, ou fazer o caminho inverso: colocar um fator comum em evidência.',
      },
      {
        mood: 'entusiasmo',
        start: 52.85,
        text: 'Esse caminho inverso é o primeiro passo da fatoração, que você vai usar MUITO daqui pra frente — é uma ferramenta poderosíssima.',
      },
      { mood: 'normal', start: 62.1, text: 'E olha que aplicação prática legal:' },
      {
        mood: 'suspense',
        start: 64.63,
        text: 'a distributiva é o que te permite calcular de cabeça algo como 6 vezes 23.',
      },
      {
        mood: 'entusiasmo',
        start: 69.98,
        text: 'Você quebra o 23 em 20 mais 3, distribui: 6 vezes 20 é 120, 6 vezes 3 é 18, soma os dois e... 138!',
      },
      {
        mood: 'timida',
        start: 77.07,
        text: 'Sem precisar multiplicar dois números de dois dígitos direto, o que é bem mais complicado de fazer de cabeça.',
      },
      { mood: 'entusiasmo', start: 84.95, text: 'Bora praticar esse truque?' },
    ],
  },
  'fracoes-1': {
    audio: audioFracoesOperacoes,
    segments: [
      { mood: 'normal', start: 0, text: 'Ahh... at-choom!' },
      { mood: 'timida', start: 1.1, text: 'Desculpa, tô meio gripada hoje...' },
      {
        mood: 'normal',
        start: 3.38,
        text: 'inclusive, olha só, até isso vira matemática: o remédio que eu tenho que tomar é meio comprimido a cada 12 horas — ou seja, um meio,',
      },
      { mood: 'suspense', start: 12.49, text: 'que é literalmente uma fração!' },
      {
        mood: 'entusiasmo',
        start: 14.55,
        text: 'E por falar nisso, bora aproveitar meu nariz entupido e aprender operações com frações.',
      },
      {
        mood: 'normal',
        start: 20.56,
        text: 'Uma fração representa uma parte de um todo. Em três quartos, o número de baixo, o denominador, diz em quantas partes iguais o todo foi dividido. E o de cima, o numerador, diz quantas dessas partes você tem.',
      },
      {
        mood: 'suspense',
        start: 34.77,
        text: 'Pra somar ou subtrair frações, elas precisam ter o mesmo denominador.',
      },
      {
        mood: 'normal',
        start: 39.52,
        text: 'Se não tiverem, o primeiro passo é encontrar um denominador comum — geralmente o mínimo múltiplo comum dos denominadores — antes de somar os numeradores.',
      },
      {
        mood: 'entusiasmo',
        start: 50.08,
        text: 'Já multiplicar frações é bem mais direto: multiplica numerador por numerador, e denominador por denominador, sem precisar de denominador comum nenhum!',
      },
      {
        mood: 'normal',
        start: 60.43,
        text: 'Por exemplo: dois terços vezes três quintos é igual a seis quinze avos, que simplifica pra dois quintos.',
      },
      { mood: 'timida', start: 67.6, text: 'E a divisão...' },
      { mood: 'suspense', start: 68.56, text: 'essa tem um truque que parece mágica na primeira vez que você vê.' },
      {
        mood: 'normal',
        start: 73.05,
        text: 'Dividir uma fração por outra é multiplicar pela fração invertida.',
      },
      {
        mood: 'entusiasmo',
        start: 77.53,
        text: 'Esse "inverte e multiplica" funciona porque dividir por c sobre d é a mesma coisa que multiplicar pelo inverso dele, d sobre c.',
      },
      { mood: 'timida', start: 86.29, text: 'Ok, chega de espirro,' },
      { mood: 'normal', start: 87.74, text: 'bora praticar essas operações?' },
    ],
  },
  'fracoes-2': {
    audio: audioRazaoProporcao,
    segments: [
      { mood: 'normal', start: 0, text: 'Sabe o Pi, meu shiba inu?' },
      {
        mood: 'entusiasmo',
        start: 1.54,
        text: 'Ele tá crescendo, e ontem eu precisei recalcular a ração dele — a embalagem diz 30 gramas pra cada quilo de peso do cachorro.',
      },
      {
        mood: 'timida',
        start: 9.27,
        text: 'Ele ganhou meio quilo esse mês, e eu quase errei a conta de cabeça...',
      },
      {
        mood: 'normal',
        start: 13.53,
        text: 'mas percebi que era exatamente isso que a gente ia estudar hoje: razão e proporção!',
      },
      { mood: 'suspense', start: 18.65, text: 'Uma razão compara dois valores por divisão.' },
      {
        mood: 'normal',
        start: 21.31,
        text: 'A razão entre a e b se escreve a sobre b, ou a dois pontos b, e significa "quantas vezes a cabe em b" — ou simplesmente a relação entre os dois.',
      },
      {
        mood: 'entusiasmo',
        start: 30.21,
        text: 'Já uma proporção é uma igualdade entre duas razões: a sobre b é igual a c sobre d.',
      },
      {
        mood: 'suspense',
        start: 35.27,
        text: 'E aqui vem a parte útil de verdade: quando você conhece três desses quatro valores, dá pra descobrir o quarto!',
      },
      {
        mood: 'normal',
        start: 42.07,
        text: 'É a base da regra de três, que você provavelmente já usou sem saber o nome.',
      },
      { mood: 'timida', start: 46.7, text: 'Tipo eu, calculando a ração do Pi.' },
      {
        mood: 'entusiasmo',
        start: 48.8,
        text: 'E proporção aparece em todo canto: numa escala de mapa, onde um centímetro representa um quilômetro, numa receita, quando você dobra os ingredientes mantendo a razão entre eles, ou numa velocidade — distância percorrida dividida pelo tempo.',
      },
      {
        mood: 'suspense',
        start: 63.62,
        text: 'Aliás, guarda essa: você vai reencontrar essa mesma razão em Cálculo, lá na frente, como taxa de variação.',
      },
      {
        mood: 'normal',
        start: 70.17,
        text: 'E mais pra frente ainda, em Trigonometria, seno e cosseno de um ângulo também são razões — a razão entre dois lados de um triângulo retângulo.',
      },
      {
        mood: 'entusiasmo',
        start: 78.94,
        text: 'Entender proporção agora é entender a lógica por trás disso tudo antes mesmo de chegar lá.',
      },
      {
        mood: 'timida',
        start: 84.5,
        text: 'Agora com licença, vou terminar de calcular a ração do Pi de verdade.',
      },
      { mood: 'normal', start: 88.77, text: 'Bora praticar?' },
    ],
  },
  'potenciacao-1': {
    audio: audioPotenciacao,
    segments: [
      {
        mood: 'entusiasmo',
        start: 0,
        text: 'Vamos falar de potenciação — e não é só decoreba de fórmula, prometo que cada regra aqui tem uma lógica por trás.',
      },
      {
        mood: 'normal',
        start: 8.03,
        text: 'Primeiro, o básico: uma potência é uma forma resumida de escrever uma multiplicação repetida. Dois elevado a quatro é dois vezes dois vezes dois vezes dois, que dá dezesseis.',
      },
      {
        mood: 'suspense',
        start: 20.39,
        text: 'O número de baixo é a base, o de cima é o expoente — ele conta quantas vezes a base se repete.',
      },
      {
        mood: 'entusiasmo',
        start: 27.07,
        text: 'Agora vem a primeira propriedade: quando você multiplica potências de mesma base, você soma os expoentes.',
      },
      {
        mood: 'normal',
        start: 34.53,
        text: 'a elevado a m, vezes a elevado a n, é igual a a elevado a "m mais n".',
      },
      { mood: 'suspense', start: 39.44, text: 'E quando você divide, faz o contrário: subtrai os expoentes.' },
      {
        mood: 'normal',
        start: 43.7,
        text: 'Segunda propriedade: uma potência elevada a outro expoente multiplica os expoentes entre si.',
      },
      {
        mood: 'timida',
        start: 50.24,
        text: 'Presta atenção nessa, porque é fácil confundir "somar" com "multiplicar" entre as duas primeiras regras...',
      },
      {
        mood: 'normal',
        start: 57.77,
        text: 'mas repara: multiplicação de potências soma expoente, potência de potência multiplica expoente.',
      },
      {
        mood: 'entusiasmo',
        start: 64.52,
        text: 'E aqui vem uma parte que eu acho linda: todo número elevado a zero vale um!',
      },
      {
        mood: 'suspense',
        start: 69.85,
        text: 'Isso não é decoreba, viu — é consequência direta da propriedade da divisão.',
      },
      {
        mood: 'normal',
        start: 75.18,
        text: 'Se você divide a elevado a n por a elevado a n, os expoentes se cancelam e sobra a elevado a zero. Mas qualquer número dividido por ele mesmo é um!',
      },
      { mood: 'entusiasmo', start: 85.63, text: 'Então a elevado a zero TEM que ser um.' },
      {
        mood: 'normal',
        start: 88.33,
        text: 'Terceira coisa: expoente negativo inverte a base. a elevado a menos n é igual a um sobre a elevado a n.',
      },
      {
        mood: 'suspense',
        start: 95.64,
        text: 'E pra fechar, o mais surpreendente de todos: existe até expoente fracionário!',
      },
      {
        mood: 'normal',
        start: 101.12,
        text: 'a elevado a um sobre n é exatamente a raiz enésima de a.',
      },
      {
        mood: 'timida',
        start: 105.1,
        text: 'Isso conecta potenciação com radiciação, que é justamente o assunto da próxima aula.',
      },
      { mood: 'entusiasmo', start: 111.06, text: 'Bora praticar tudo isso?' },
    ],
  },
  'potenciacao-2': {
    audio: audioRadiciacao,
    segments: [
      { mood: 'entusiasmo', start: 0, text: 'Chegou a hora de fechar o ciclo que eu abri lá atrás: radiciação!' },
      {
        mood: 'normal',
        start: 4.89,
        text: 'A radiciação desfaz a potenciação. Se 5 ao quadrado é 25, então a raiz quadrada de 25 é 5.',
      },
      {
        mood: 'suspense',
        start: 11.66,
        text: 'A raiz quadrada de um número basicamente pergunta: "que número, multiplicado por ele mesmo, dá esse resultado?"',
      },
      {
        mood: 'entusiasmo',
        start: 20.01,
        text: 'E não para na raiz quadrada — existem raízes de qualquer índice!',
      },
      {
        mood: 'normal',
        start: 24.82,
        text: 'A raiz cúbica de 8 pergunta "que número, elevado ao cubo, dá 8?"',
      },
      { mood: 'suspense', start: 29.64, text: 'E a resposta é 2, porque 2 ao cubo é 8.' },
      { mood: 'timida', start: 32.57, text: 'Lembra que eu prometi lá na aula passada que ia conectar tudo?' },
      {
        mood: 'normal',
        start: 37.24,
        text: 'Pois é, chegou a hora: toda raiz pode ser escrita como potência fracionária. A raiz enésima de a é igual a a elevado a um sobre n.',
      },
      {
        mood: 'entusiasmo',
        start: 47.01,
        text: 'Por isso a raiz quadrada de a é a elevado a um meio — a raiz quadrada é literalmente "elevar a um meio"!',
      },
      { mood: 'suspense', start: 54.84, text: 'E essa não é só uma curiosidade bonitinha, viu...' },
      {
        mood: 'normal',
        start: 58.52,
        text: 'essa é a mesma regra que vai sustentar a derivada de potências lá na frente, em Cálculo.',
      },
      {
        mood: 'entusiasmo',
        start: 65.14,
        text: 'Duas propriedades úteis pra fechar: a raiz de um produto é o produto das raízes, e a raiz de um quociente é o quociente das raízes.',
      },
      {
        mood: 'timida',
        start: 75,
        text: 'Só um detalhe técnico importante: isso vale desde que os valores envolvidos sejam não negativos —',
      },
      {
        mood: 'normal',
        start: 82.29,
        text: 'mas isso é papo pra quando a gente chegar em números complexos, ainda não precisa se preocupar com isso agora.',
      },
      { mood: 'entusiasmo', start: 90.57, text: 'Bora praticar radiciação?' },
    ],
  },
  'fatoracao-1': {
    audio: audioProdutosNotaveis,
    segments: [
      {
        mood: 'entusiasmo',
        start: 0,
        text: 'Vamos falar de um atalho que vai te poupar muito trabalho: produtos notáveis!',
      },
      {
        mood: 'normal',
        start: 5.74,
        text: 'Alguns produtos aparecem tanto em álgebra que vale a pena reconhecer o padrão de cabeça, sem precisar expandir passo a passo toda vez.',
      },
      { mood: 'suspense', start: 15.73, text: 'O primeiro, e mais importante: o quadrado da soma.' },
      {
        mood: 'normal',
        start: 19.46,
        text: 'a mais b, tudo ao quadrado, é igual a a ao quadrado, mais dois a b, mais b ao quadrado.',
      },
      {
        mood: 'timida',
        start: 25.95,
        text: 'E aqui vem um aviso sério, porque é o erro que eu mais vejo gente cometer...',
      },
      { mood: 'suspense', start: 31.61, text: 'repara que NÃO é só a ao quadrado mais b ao quadrado!' },
      {
        mood: 'normal',
        start: 35.57,
        text: 'O termo do meio, esse dois a b, é super fácil de esquecer, e esquecer ele é o erro mais comum nesse tipo de expansão.',
      },
      {
        mood: 'entusiasmo',
        start: 44.29,
        text: 'Segunda regra: o quadrado da diferença segue exatamente o mesmo padrão, só muda o sinal do meio. a menos b, tudo ao quadrado, é a ao quadrado, menos dois a b, mais b ao quadrado.',
      },
      {
        mood: 'suspense',
        start: 57.56,
        text: 'E a terceira, talvez a mais elegante de todas: o produto da soma pela diferença.',
      },
      {
        mood: 'normal',
        start: 63.53,
        text: 'a mais b, vezes a menos b, gera a diferença de quadrados: a ao quadrado menos b ao quadrado.',
      },
      { mood: 'entusiasmo', start: 70.39, text: 'Os termos do meio se cancelam completamente!' },
      {
        mood: 'timida',
        start: 73.67,
        text: 'E guarda esse padrão específico, viu, porque ele vai voltar — só que ao contrário,',
      },
      { mood: 'normal', start: 79.78, text: 'na fatoração, que é exatamente o que vem a seguir.' },
      { mood: 'entusiasmo', start: 83.51, text: 'Bora praticar esses três padrões?' },
    ],
  },
  'conjuntos-2': {
    audio: audioRacionaisIrracionais,
    segments: [
      {
        mood: 'entusiasmo',
        start: 0,
        text: 'Continuando com conjuntos numéricos: vamos falar de racionais e irracionais!',
      },
      {
        mood: 'normal',
        start: 5.44,
        text: 'Você já conhece os Racionais da tela passada — todo número que dá pra escrever como fração a sobre b, com a e b inteiros.',
      },
      { mood: 'suspense', start: 14.1, text: 'Mas nem todo número real é racional.' },
      {
        mood: 'normal',
        start: 16.67,
        text: 'Existe um outro grupo, os Números Irracionais, que simplesmente não cabem nessa definição de fração exata.',
      },
      {
        mood: 'timida',
        start: 24.26,
        text: 'E o nome não é chute, viu — eles são "irracionais" porque não existe razão, ou seja, fração, que os represente exatamente.',
      },
      { mood: 'entusiasmo', start: 32.99, text: 'E a diferença entre os dois é mais simples do que parece!' },
      {
        mood: 'normal',
        start: 37.07,
        text: 'Um racional, quando vira decimal, ou termina, tipo 0,5, ou repete um padrão pra sempre, tipo 0,333... que é um terço.',
      },
      {
        mood: 'suspense',
        start: 45.44,
        text: 'Já um irracional tem infinitas casas decimais que NUNCA se repetem em nenhum padrão fixo.',
      },
      {
        mood: 'entusiasmo',
        start: 51.81,
        text: 'Os exemplos mais famosos: raiz de dois, raiz de três, e o queridinho de todo mundo, o pi!',
      },
      { mood: 'timida', start: 58.18, text: 'Ah, o pi...' },
      {
        mood: 'normal',
        start: 58.96,
        text: 'Ele aparece em círculo, em onda, em quase todo lugar que você for olhar depois.',
      },
      {
        mood: 'entusiasmo',
        start: 64.62,
        text: 'E juntando os dois grupos — racionais e irracionais — a gente forma o conjunto dos Números Reais, o R!',
      },
      {
        mood: 'normal',
        start: 71.91,
        text: 'Praticamente todo número que você vai usar na escola mora em algum desses dois grupos.',
      },
      { mood: 'entusiasmo', start: 78.07, text: 'Bora praticar?' },
    ],
  },
  'fatoracao-2': {
    audio: audioFatoracao,
    segments: [
      {
        mood: 'entusiasmo',
        start: 0,
        text: 'Agora vamos fazer o caminho inverso do que aprendemos até aqui: fatoração!',
      },
      {
        mood: 'normal',
        start: 5.38,
        text: 'Fatorar é reescrever uma soma como um produto — literalmente o oposto de expandir.',
      },
      { mood: 'suspense', start: 11.35, text: 'A forma mais simples é colocar um fator comum em evidência.' },
      {
        mood: 'normal',
        start: 15.64,
        text: 'Olha esse exemplo: 6x mais 9 é igual a 3, vezes, entre parênteses, 2x mais 3.',
      },
      { mood: 'entusiasmo', start: 21.24, text: 'Porque o 3 divide os dois termos!' },
      { mood: 'normal', start: 23.64, text: 'Mas nem sempre tem um fator comum óbvio em todos os termos.' },
      {
        mood: 'suspense',
        start: 27.94,
        text: 'Quando isso acontece, existe uma técnica chamada fatoração por agrupamento: você junta os termos em pares que compartilham um fator, e depois coloca esse fator em evidência de novo.',
      },
      { mood: 'timida', start: 41.11, text: 'Lembra dos produtos notáveis que a gente viu na aula passada?' },
      { mood: 'entusiasmo', start: 45.54, text: 'Pois é, eles também funcionam ao contrário!' },
      {
        mood: 'normal',
        start: 48.67,
        text: 'Se você reconhece a ao quadrado menos b ao quadrado, você já sabe de cara que isso fatora em a mais b, vezes a menos b.',
      },
      {
        mood: 'suspense',
        start: 57.33,
        text: 'Reconhecer esses padrões de trás pra frente é exatamente o que torna a fatoração rápida.',
      },
      { mood: 'timida', start: 63.73, text: 'E agora presta bem atenção nisso, porque é sério mesmo...' },
      { mood: 'normal', start: 67.88, text: 'essa habilidade vai ser decisiva mais pra frente.' },
      {
        mood: 'suspense',
        start: 71.44,
        text: 'Em Limites, é muito comum uma expressão gerar uma indeterminação zero sobre zero.',
      },
      {
        mood: 'entusiasmo',
        start: 77.34,
        text: 'E a saída, quase sempre, é fatorar o numerador e o denominador pra cancelar o termo que tá causando o problema.',
      },
      {
        mood: 'timida',
        start: 85.41,
        text: 'Quem não fatora bem trava exatamente nesse ponto — foi o que aconteceu comigo, sinceramente, na primeira vez que vi isso.',
      },
      { mood: 'entusiasmo', start: 94.22, text: 'Bora praticar fatoração até ficar automático?' },
    ],
  },
  'equacoes-1': {
    audio: audioEquacoes1Grau,
    segments: [
      {
        mood: 'entusiasmo',
        start: 0,
        text: 'Agora vamos resolver o primeiro tipo de "quebra-cabeça" da matemática: equações do primeiro grau!',
      },
      {
        mood: 'normal',
        start: 7.77,
        text: 'Uma equação do primeiro grau tem uma incógnita — geralmente chamamos de x — elevada ao expoente um.',
      },
      { mood: 'suspense', start: 15.71, text: 'E o objetivo é descobrir qual valor de x torna a igualdade verdadeira.' },
      { mood: 'normal', start: 21.32, text: 'A forma geral é: a vezes x, mais b, igual a c.' },
      {
        mood: 'entusiasmo',
        start: 25,
        text: 'E agora, a regra de ouro, a mais importante de toda essa aula:',
      },
      {
        mood: 'suspense',
        start: 29.97,
        text: 'o que você faz de um lado da igualdade, precisa fazer do outro também.',
      },
      { mood: 'normal', start: 35.58, text: 'Pensa numa balança bem equilibrada.' },
      {
        mood: 'timida',
        start: 38.39,
        text: 'Se você tira peso de um prato sem tirar do outro, ela desequilibra, né?',
      },
      { mood: 'entusiasmo', start: 44.08, text: 'Com equação é a mesma lógica!' },
      {
        mood: 'normal',
        start: 46.4,
        text: 'Vamos resolver um exemplo juntos: dois x mais cinco, igual a treze.',
      },
      {
        mood: 'suspense',
        start: 51.77,
        text: 'Primeiro passo: subtrai cinco dos dois lados. Sobra dois x igual a oito.',
      },
      { mood: 'normal', start: 57.54, text: 'Segundo passo: divide os dois lados por dois.' },
      { mood: 'entusiasmo', start: 61.15, text: 'E chegamos em x igual a quatro!' },
      {
        mood: 'normal',
        start: 63.63,
        text: 'Repara que cada passo desfaz uma operação usando a operação inversa: subtração desfaz soma, divisão desfaz multiplicação.',
      },
      { mood: 'timida', start: 73.33, text: 'É tipo desenrolar um novelo, um passo de cada vez.' },
      {
        mood: 'entusiasmo',
        start: 77.34,
        text: 'E não pensa que isso é só exercício de livro didático, viu —',
      },
      {
        mood: 'normal',
        start: 82.15,
        text: 'equações do primeiro grau aparecem por trás de praticamente todo problema de "descobrir um valor desconhecido".',
      },
      {
        mood: 'suspense',
        start: 91.04,
        text: 'Inclusive dentro de equações bem mais complexas, como parte da resolução de sistemas, ou de problemas de otimização, que você vai ver lá na frente em Cálculo.',
      },
      { mood: 'entusiasmo', start: 103.7, text: 'Bora praticar até isolar x virar automático?' },
    ],
  },
}
