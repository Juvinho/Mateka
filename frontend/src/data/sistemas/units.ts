import type { LessonContent, UnitContent } from '../lessonTypes'

export const SISTEMAS_UNITS: UnitContent[] = [
  {
    number: 1,
    title: 'Introdução a Sistemas Lineares',
    lessons: [
      {
        id: 'intro-sistemas-1',
        title: 'O que é um sistema linear e uma solução',
        description: 'Duas equações, duas incógnitas — e um único par que resolve as duas ao mesmo tempo.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Imagine que uma lanchonete vende só dois produtos, suco e sanduíche, e você sabe que 2 sucos + 1 sanduíche custam R$ 16, e que 1 suco + 3 sanduíches custam R$ 23. Duas informações, dois preços desconhecidos — dá pra descobrir os dois valores exatos? Essa é a pergunta que um sistema linear responde.',
          'Um sistema linear é um conjunto de duas ou mais equações lineares que precisam ser satisfeitas ao mesmo tempo, pelas mesmas incógnitas. A solução do sistema não é um valor que resolve uma equação isolada — é o conjunto de valores que resolve todas elas simultaneamente.',
        ],
        after: [
          'No exemplo da lanchonete, escrevemos x para o preço do suco e y para o preço do sanduíche: 2x + y = 16 e x + 3y = 23. Um par (x, y) só é solução do sistema se satisfizer as duas equações ao mesmo tempo — não basta satisfazer uma delas.',
          'Nesse caso, x = 5 e y = 6 funciona: 2(5) + 6 = 16 ✓ e 5 + 3(6) = 23 ✓. Você acabou de conferir uma solução — mas como alguém chega nesses valores sem "adivinhar"? É exatamente o que os métodos de resolução das próximas lições vão te ensinar, começando pela verificação de soluções e pelas regras que preservam essa igualdade.',
        ],
        exerciseSetId: 'ex-intro-sistemas-definicao',
      },
      {
        id: 'intro-sistemas-2',
        title: 'Sistemas equivalentes e verificação de soluções',
        description: 'Como confirmar se um par de valores realmente resolve o sistema — e o que são sistemas equivalentes.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Alguém te entrega um par de números e diz "essa é a solução do sistema". Como você confere se é verdade, sem refazer a conta toda do zero? A resposta é mais simples do que parece: você só precisa testar.',
          'Verificar uma solução significa substituir os valores propostos em cada equação do sistema e checar se a igualdade se mantém em todas elas. Se falhar em pelo menos uma equação, aquele par não é solução do sistema.',
        ],
        after: [
          'Além de verificar, existe outra ideia importante: dois sistemas são equivalentes quando têm exatamente a mesma solução, mesmo que as equações pareçam diferentes. Multiplicar uma equação inteira por um número diferente de zero, ou somar uma equação a outra, gera um sistema equivalente ao original — a solução não muda.',
          'Por exemplo, 2x + y = 16 é equivalente a 4x + 2y = 32 (multiplicamos tudo por 2) — o par (5, 6) continua satisfazendo as duas. Essa propriedade — poder transformar equações sem alterar a solução — é exatamente o motor por trás do método da substituição e do método da adição, que você vai aprender nas próximas duas unidades.',
        ],
        exerciseSetId: 'ex-intro-sistemas-verificacao',
      },
    ],
  },
  {
    number: 2,
    title: 'Método da Substituição',
    lessons: [
      {
        id: 'substituicao-1',
        title: 'Isolando uma variável',
        description: 'O primeiro passo do método da substituição: escrever uma incógnita em função da outra.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Se você já sabe verificar se um par resolve um sistema, o próximo passo natural é: como descobrir esse par sem chutar? O método da substituição começa com uma ideia simples — trocar uma incógnita por uma expressão equivalente feita só com a outra.',
          'Isolar uma variável significa reescrever uma das equações de forma que uma incógnita fique sozinha de um lado do sinal de igual, expressa em função da outra. Em x + 3y = 23, por exemplo, isolar x dá x = 23 − 3y.',
        ],
        after: [
          'Qualquer uma das duas equações pode ser usada para isolar qualquer uma das duas variáveis — a escolha certa é sempre a que deixa a conta mais simples (evite dividir por um coeficiente diferente de 1 sempre que puder escolher outra equação).',
          'No sistema 2x + y = 16 e x + 3y = 23, isolar y na primeira equação é mais rápido: y = 16 − 2x. Guarde essa expressão — na próxima lição você vai substituí-la na outra equação para descobrir o valor de x diretamente.',
        ],
        exerciseSetId: 'ex-substituicao-isolamento',
      },
      {
        id: 'substituicao-2',
        title: 'Resolvendo sistemas 2×2 por substituição',
        description: 'Substituindo a expressão isolada na outra equação para resolver o sistema por completo.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'Com uma variável isolada, falta um único passo para fechar o sistema: colocar essa expressão no lugar da variável correspondente na outra equação, transformando um sistema de duas incógnitas em uma única equação de uma incógnita só.',
          'O método da substituição completo tem três etapas: isolar uma variável em uma equação, substituir essa expressão na outra equação (que agora só tem uma incógnita) e resolver essa equação simples — depois, usar o valor encontrado para calcular a segunda variável.',
        ],
        after: [
          'Continuando o exemplo: y = 16 − 2x substituído em x + 3y = 23 dá x + 3(16 − 2x) = 23, ou seja, x + 48 − 6x = 23, o que resolve para x = 5. Substituindo x = 5 de volta em y = 16 − 2x, obtemos y = 6 — a mesma solução (5, 6) que você já tinha verificado antes.',
          'A substituição funciona sempre, mas fica trabalhosa quando os coeficientes não são "redondos". Na próxima unidade você vai conhecer o método da adição, que costuma ser mais rápido justamente nesses casos — e que usa a mesma ideia de sistemas equivalentes da Unidade 1.',
        ],
        exerciseSetId: 'ex-substituicao-resolucao',
      },
    ],
  },
  {
    number: 3,
    title: 'Método da Adição',
    lessons: [
      {
        id: 'adicao-1',
        title: 'Somando equações para eliminar uma variável',
        description: 'Quando somar as duas equações do sistema faz uma das incógnitas desaparecer.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Repare em algo curioso no sistema x + y = 10 e x − y = 4: se você somar as duas equações membro a membro, o y desaparece — sobra só 2x = 14. Essa não é uma coincidência de exemplo escolhido a dedo; é a ideia central do método da adição.',
          'O método da adição consiste em somar (ou subtrair) as duas equações de um sistema para eliminar uma das variáveis, restando uma equação só com a incógnita que sobrou — que aí sim é fácil de resolver.',
        ],
        after: [
          'Esse método funciona direto sempre que os coeficientes de uma das variáveis já são opostos (como +y e −y no exemplo). No caso acima, 2x = 14 dá x = 7, e substituindo em qualquer uma das equações originais (x + y = 10) obtemos y = 3.',
          'Mas nem todo sistema chega assim "pronto" — em 2x + y = 16 e x + 3y = 23, nem x nem y têm coeficientes opostos. Para esses casos, o próximo passo é multiplicar uma ou as duas equações por números convenientes antes de somar, que é o que você vai aprender na próxima lição.',
        ],
        exerciseSetId: 'ex-adicao-eliminacao',
      },
      {
        id: 'adicao-2',
        title: 'Multiplicando equações antes de somar',
        description: 'Preparando os coeficientes com multiplicação para que a soma elimine a variável desejada.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'Você já sabe que multiplicar uma equação inteira por um número diferente de zero gera um sistema equivalente (Unidade 1) — e é exatamente essa regra que resolve o problema de coeficientes que não se cancelam de cara.',
          'Para eliminar uma variável por adição quando os coeficientes não são opostos, multiplique uma ou ambas as equações por números escolhidos para que os coeficientes dessa variável fiquem iguais em módulo e opostos em sinal — só então some as equações.',
        ],
        after: [
          'No sistema 2x + y = 16 e x + 3y = 23, para eliminar y multiplicamos a primeira equação por −3: −6x − 3y = −48. Somando com x + 3y = 23, o y cancela: −5x = −25, então x = 5 — batendo com a solução que já conhecemos.',
          'Escolher qual variável eliminar e por qual número multiplicar é uma questão de praticidade, não de regra fixa — com prática, você passa a enxergar de cara o caminho mais curto. Na próxima unidade, você vai ver esse mesmo sistema de um jeito totalmente diferente: como duas retas desenhadas num gráfico.',
        ],
        exerciseSetId: 'ex-adicao-multiplicacao',
      },
    ],
  },
  {
    number: 4,
    title: 'Interpretação Gráfica',
    lessons: [
      {
        id: 'grafico-1',
        title: 'Cada equação como uma reta',
        description: 'Toda equação linear com duas incógnitas é, geometricamente, uma reta no plano.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Até agora você resolveu sistemas só com álgebra — isolando, substituindo, somando. Mas existe outra forma de enxergar o mesmo problema, tão útil quanto: cada equação de um sistema 2×2 pode ser desenhada como uma reta num plano cartesiano.',
          'Uma equação da forma ax + by = c, com a e b não ambos nulos, representa geometricamente uma reta: o conjunto de todos os pontos (x, y) que satisfazem aquela equação. Para desenhá-la, basta encontrar dois pontos que a satisfaçam e traçar a reta que passa por eles.',
        ],
        after: [
          'Um jeito rápido de achar dois pontos é calcular as interseções com os eixos: fazendo x = 0 encontramos onde a reta cruza o eixo y, e fazendo y = 0 encontramos onde ela cruza o eixo x. Em 2x + y = 16, por exemplo, x = 0 dá y = 16, e y = 0 dá x = 8.',
          'Repita esse processo para a segunda equação do sistema e você terá duas retas no mesmo plano. A pergunta que resta — onde exatamente essas duas retas se cruzam — é o assunto da próxima lição, e a resposta vai revelar uma conexão direta com tudo que você já resolveu algebricamente.',
        ],
        exerciseSetId: 'ex-grafico-retas',
      },
      {
        id: 'grafico-2',
        title: 'Interseção de retas = solução do sistema',
        description: 'O ponto onde as duas retas se cruzam é, exatamente, a solução do sistema.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Pense de novo no par (5, 6), a solução do sistema 2x + y = 16 e x + 3y = 23. Esse ponto satisfaz as duas equações — o que, geometricamente, significa que ele pertence às duas retas ao mesmo tempo. Só existe um lugar onde isso pode acontecer: o ponto de interseção.',
          'A solução de um sistema linear 2×2 corresponde exatamente ao ponto (ou pontos) onde as retas das duas equações se encontram no plano cartesiano. Resolver o sistema algebricamente e encontrar a interseção graficamente são duas formas de responder à mesma pergunta.',
        ],
        after: [
          'Essa interpretação gráfica também explica intuitivamente por que às vezes um sistema não tem solução única: duas retas no plano só podem se relacionar de três formas — se cruzam em um único ponto, são paralelas e nunca se cruzam, ou são exatamente a mesma reta (se sobrepõem por completo).',
          'Essas três situações têm nomes formais em matemática, e é exatamente o que você vai estudar na próxima unidade: a classificação dos sistemas lineares como determinado, indeterminado ou impossível — cada um correspondendo a uma dessas três relações entre retas.',
        ],
        exerciseSetId: 'ex-grafico-intersecao',
      },
    ],
  },
  {
    number: 5,
    title: 'Classificação de Sistemas',
    lessons: [
      {
        id: 'classificacao-1',
        title: 'Sistema possível e determinado (SPD)',
        description: 'Quando um sistema tem exatamente uma solução — o caso mais comum.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Todo sistema linear que você resolveu até agora teve uma única resposta — um único par (x, y). Esse é o comportamento mais frequente, mas não o único possível, e agora ele ganha um nome formal.',
          'Um sistema é chamado de possível e determinado (SPD) quando admite exatamente uma solução. Geometricamente, isso corresponde a duas retas que se cruzam em um único ponto — elas têm inclinações (coeficientes angulares) diferentes.',
        ],
        after: [
          'Um jeito rápido de reconhecer um SPD sem desenhar nada: compare a razão entre os coeficientes de x e de y nas duas equações. Se essa razão for diferente entre as duas equações, as retas não são paralelas e o sistema é SPD.',
          'No sistema 2x + y = 16 e x + 3y = 23, a razão entre os coeficientes é 2/1 = 2 na primeira equação e 1/3 na segunda — diferentes, então SPD, com solução única (5, 6). Mas o que acontece quando essa razão é igual nas duas equações? É o que você vai descobrir na próxima lição.',
        ],
        exerciseSetId: 'ex-classificacao-spd',
      },
      {
        id: 'classificacao-2',
        title: 'Sistema possível indeterminado (SPI) e impossível (SI)',
        description: 'Quando um sistema tem infinitas soluções, ou nenhuma solução.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Quando a razão entre os coeficientes de x e y é igual nas duas equações, as retas ficam paralelas — e paralelas só têm dois destinos possíveis: nunca se cruzam, ou são exatamente a mesma reta.',
          'Um sistema é possível indeterminado (SPI) quando tem infinitas soluções — as duas equações representam a mesma reta, sobreposta. Um sistema é impossível (SI) quando não tem solução nenhuma — as retas são paralelas e distintas, nunca se encontram.',
        ],
        after: [
          'Pra distinguir SPI de SI, depois de confirmar que as razões dos coeficientes de x e y são iguais, compare também a razão dos termos independentes: se ela também for igual às outras duas, é SPI (mesma reta); se for diferente, é SI (paralelas distintas).',
          'Por exemplo, 2x + 4y = 10 e x + 2y = 5 são a mesma reta multiplicada por 2 → SPI. Já 2x + 4y = 10 e x + 2y = 8 têm a mesma inclinação mas termos independentes que não guardam essa mesma proporção → SI, sem solução. No playground deste módulo você pode arrastar os coeficientes e ver essas três situações — SPD, SPI e SI — acontecendo ao vivo.',
        ],
        exerciseSetId: 'ex-classificacao-spi-si',
      },
    ],
  },
  {
    number: 6,
    title: 'Sistemas 3×3',
    lessons: [
      {
        id: 'sistemas3x3-1',
        title: 'O que muda com 3 variáveis',
        description: 'Sistemas com três incógnitas e três equações — e por que planos substituem retas.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Tudo que você aprendeu até aqui foi sobre sistemas com duas incógnitas. Mas nada impede um sistema de ter três (ou mais) — como x + y + z = 6, 2x − y + z = 3 e x + 2y − z = 2, um sistema com três equações e três incógnitas.',
          'Um sistema 3×3 tem três equações lineares com três incógnitas (geralmente x, y, z), e sua solução é a tripla ordenada (x, y, z) que satisfaz as três equações simultaneamente. Geometricamente, cada equação passa a representar um plano no espaço tridimensional, não mais uma reta.',
        ],
        after: [
          'A boa notícia é que os métodos que você já conhece continuam funcionando — só ficam um pouco mais longos, porque agora há uma variável a mais para eliminar. A ideia central da substituição e da adição não muda: transformar o sistema em algo mais simples, uma equação de cada vez.',
          'A classificação também se mantém: um sistema 3×3 pode ser determinado (solução única), indeterminado (infinitas soluções) ou impossível (nenhuma solução) — só que agora pensando em como três planos podem se cruzar no espaço, em vez de duas retas no plano. Na próxima lição você vai resolver esse tipo de sistema na prática.',
        ],
        exerciseSetId: 'ex-sistemas3x3-intro',
      },
      {
        id: 'sistemas3x3-2',
        title: 'Resolvendo 3×3 por substituição encadeada',
        description: 'Reduzindo um sistema de três incógnitas a um de duas, e depois a um de uma só.',
        tags: ['Exercício'],
        duration: 11,
        intro: [
          'A estratégia para resolver um sistema 3×3 é reduzir o problema a algo que você já sabe fazer: usar uma equação para eliminar uma variável das outras duas, transformando um sistema 3×3 em um sistema 2×2 — que você já domina desde a Unidade 2 e 3.',
          'O processo, em etapas: use uma das equações para isolar uma variável; substitua essa expressão nas outras duas equações, eliminando essa variável delas; resolva o sistema 2×2 restante pelos métodos já conhecidos; por fim, volte e calcule a variável que faltou.',
        ],
        after: [
          'No sistema x + y + z = 6, 2x − y + z = 3 e x + 2y − z = 2: isolando z na primeira equação (z = 6 − x − y) e substituindo nas outras duas, sobra um sistema 2×2 em x e y. Resolvendo esse sistema (por substituição ou adição) e depois voltando para calcular z, chegamos à solução (1, 2, 3).',
          'Esse processo de "eliminar uma variável por vez até sobrar uma equação simples" é exatamente a ideia por trás do escalonamento, um método mais organizado e sistemático para fazer a mesma coisa — especialmente útil quando o sistema cresce. É o assunto da próxima unidade.',
        ],
        exerciseSetId: 'ex-sistemas3x3-substituicao',
      },
    ],
  },
  {
    number: 7,
    title: 'Escalonamento (Gauss)',
    lessons: [
      {
        id: 'escalonamento-1',
        title: 'Forma triangular e operações elementares',
        description: 'Organizando um sistema em degraus, usando operações que preservam a solução.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'Resolver um sistema 3×3 por substituição encadeada funciona, mas o caminho pode ficar bagunçado se você não seguir uma ordem. O método de escalonamento (ou eliminação de Gauss) organiza esse processo em um roteiro fixo, sempre na mesma direção.',
          'Escalonar um sistema significa usar operações elementares — trocar a ordem de duas equações, multiplicar uma equação por um número diferente de zero, ou somar um múltiplo de uma equação a outra — para chegar numa forma triangular, onde cada equação, de cima para baixo, tem uma incógnita a menos que a anterior.',
        ],
        after: [
          'Note que essas operações elementares são exatamente as mesmas regras de sistemas equivalentes que você já usa desde a Unidade 1 e no método da adição — escalonar não é uma técnica nova, é aplicar essas regras de forma organizada, eliminando sempre a primeira variável das equações de baixo primeiro.',
          'No sistema x + y + z = 6, 2x − y + z = 3, x + 2y − z = 2, o objetivo é chegar em algo como x + y + z = 6, 0x − 3y − z = −9, 0x + 0y + Nz = M — uma "escada" onde a última equação já tem só uma incógnita. É daí que vem o nome forma triangular, e é o que a próxima lição resolve.',
        ],
        exerciseSetId: 'ex-escalonamento-triangular',
      },
      {
        id: 'escalonamento-2',
        title: 'Substituição regressiva',
        description: 'Da forma triangular até a solução completa, resolvendo de baixo para cima.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'Depois de escalonar um sistema até a forma triangular, a última equação sobra com uma única incógnita — fácil de resolver direto. E a partir daí, cada equação anterior fica cada vez mais fácil também.',
          'A substituição regressiva é o passo final do escalonamento: resolve-se a última equação (que tem uma incógnita), substitui-se esse valor na equação anterior (que agora também fica com uma incógnita só) e assim por diante, subindo até a primeira equação.',
        ],
        after: [
          'Seguindo o exemplo escalonado da lição anterior: da última equação encontramos z; substituindo z na equação do meio, encontramos y; substituindo y e z na primeira equação, encontramos x. O resultado final é a mesma tripla (1, 2, 3) que já tínhamos achado por substituição encadeada.',
          'O escalonamento é o método preferido quando sistemas ficam maiores, porque segue sempre o mesmo roteiro sem exigir decisões criativas a cada passo. Ele também é o primeiro passo de uma ideia que você vai formalizar na próxima unidade: representar o sistema inteiro como uma única equação matricial.',
        ],
        exerciseSetId: 'ex-escalonamento-regressiva',
      },
    ],
  },
  {
    number: 8,
    title: 'Representação Matricial',
    lessons: [
      {
        id: 'matricial-1',
        title: 'Sistema como Ax = b',
        description: 'Reescrevendo um sistema linear inteiro como uma única equação entre matrizes.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Um sistema linear é, no fundo, uma lista repetitiva de coeficientes multiplicando incógnitas. Sempre que uma estrutura se repete assim, a matemática costuma ter um jeito mais compacto de escrevê-la — e para sistemas, esse jeito são as matrizes.',
          'Todo sistema linear pode ser escrito na forma Ax = b, onde A é a matriz dos coeficientes das incógnitas, x é a matriz-coluna das incógnitas, e b é a matriz-coluna dos termos independentes. Multiplicar A por x, usando multiplicação de matrizes, reproduz exatamente as equações originais.',
        ],
        after: [
          'No sistema 2x + y = 16 e x + 3y = 23, temos A = [[2, 1], [1, 3]], x = [[x], [y]] e b = [[16], [23]]. Fazer Ax reproduz [2x + y, x + 3y] — e igualar isso a b é exatamente o sistema original, só que numa notação mais enxuta.',
          'Essa forma compacta não é só estética: ela é o que permite aplicar tudo que você já sabe sobre matrizes (do módulo de Matrizes) para resolver sistemas — incluindo determinantes, que vão aparecer na Regra de Cramer daqui a duas lições. Antes disso, vale destacar as duas matrizes derivadas de A e b que os livros mais usam: a matriz dos coeficientes e a matriz aumentada, tema da próxima lição.',
        ],
        exerciseSetId: 'ex-matricial-axb',
      },
      {
        id: 'matricial-2',
        title: 'Matriz dos coeficientes e matriz aumentada',
        description: 'As duas matrizes que resumem por completo um sistema linear.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Já vimos que um sistema pode ser escrito como Ax = b. Só a matriz A — sem x nem b — já carrega quase toda a informação do sistema, e existe ainda uma forma de guardar tudo, coeficientes e termos independentes, numa matriz só.',
          'A matriz dos coeficientes é a matriz A da equação Ax = b, contendo só os números que multiplicam as incógnitas. A matriz aumentada é a matriz A com a coluna b anexada à direita (geralmente separada por uma linha vertical), reunindo o sistema inteiro numa única tabela de números.',
        ],
        after: [
          'Para o sistema 2x + y = 16, x + 3y = 23, a matriz dos coeficientes é [[2, 1], [1, 3]], e a matriz aumentada é [[2, 1 | 16], [1, 3 | 23]]. Cada linha da matriz aumentada representa uma equação completa, coeficientes e termo independente juntos.',
          'A matriz aumentada é útil justamente porque o escalonamento da Unidade 7 pode ser feito diretamente sobre ela, aplicando operações nas linhas em vez de reescrever equações inteiras a cada passo — é assim que o escalonamento costuma ser feito na prática. Com a matriz dos coeficientes em mãos, sobra uma última ferramenta poderosa: usar o determinante dela para resolver o sistema direto, sem escalonar nada — a Regra de Cramer, tema da última unidade.',
        ],
        exerciseSetId: 'ex-matricial-aumentada',
      },
    ],
  },
  {
    number: 9,
    title: 'Regra de Cramer',
    lessons: [
      {
        id: 'cramer-1',
        title: 'Determinantes e a Regra de Cramer em 2×2',
        description: 'Resolvendo um sistema 2×2 direto, usando só determinantes — sem escalonar nada.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'Se você já estudou determinantes no módulo de Matrizes, sabe que det([[a, b], [c, d]]) = ad − bc. O que talvez não pareça óbvio é que esse número, sozinho, é capaz de resolver um sistema linear inteiro — sem escalonar, sem substituir nada.',
          'A Regra de Cramer resolve um sistema 2×2 Ax = b calculando três determinantes: D (o determinante da matriz dos coeficientes A), Dx (a matriz A com a primeira coluna trocada por b) e Dy (a matriz A com a segunda coluna trocada por b). A solução é x = Dx/D e y = Dy/D — mas só quando D ≠ 0.',
        ],
        after: [
          'No sistema 2x + y = 16, x + 3y = 23: D = det([[2,1],[1,3]]) = 2·3 − 1·1 = 5; Dx = det([[16,1],[23,3]]) = 16·3 − 1·23 = 25; Dy = det([[2,16],[1,23]]) = 2·23 − 16·1 = 30. Logo x = 25/5 = 5 e y = 30/5 = 6 — a mesma solução (5, 6) de sempre, agora obtida direto por determinantes.',
          'Repare que D = 0 é justamente a condição que separa SPD dos outros dois casos (Unidade 5) — quando D = 0, a Regra de Cramer não dá uma solução única, porque não dá pra dividir por zero, e o sistema é SPI ou SI. No playground deste módulo, esse D = 0 é exatamente o limite entre retas que se cruzam e retas paralelas.',
        ],
        exerciseSetId: 'ex-cramer-2x2',
      },
      {
        id: 'cramer-2',
        title: 'Regra de Cramer em 3×3',
        description: 'A mesma ideia, agora com determinantes 3×3, fechando o módulo.',
        tags: ['Exercício'],
        duration: 11,
        intro: [
          'A Regra de Cramer não fica limitada a sistemas 2×2 — a mesma lógica se estende para 3×3, usando os determinantes 3×3 que você também já viu no módulo de Matrizes (a regra de Sarrus, por exemplo, é uma forma prática de calculá-los).',
          'Para um sistema 3×3 Ax = b, calculamos D (determinante de A) e mais três determinantes — Dx, Dy, Dz — cada um trocando a coluna correspondente de A pela coluna b. A solução é x = Dx/D, y = Dy/D, z = Dz/D, sempre que D ≠ 0.',
        ],
        after: [
          'No sistema x + y + z = 6, 2x − y + z = 3, x + 2y − z = 2, calcular D e os três determinantes trocados (usando a regra de Sarrus ou expansão por cofatores) leva de novo à solução (1, 2, 3) que você já encontrou por substituição encadeada e por escalonamento — três caminhos diferentes, mesma resposta.',
          'Você chegou ao fim do módulo de Sistemas Lineares tendo visto o mesmo problema por quatro ângulos diferentes: álgebra pura (substituição e adição), geometria (retas e planos), um processo sistemático (escalonamento) e álgebra matricial (Cramer). Cada método tem seu momento ideal — e agora você escolhe qual usar em cada situação.',
        ],
        exerciseSetId: 'ex-cramer-3x3',
      },
    ],
  },
]

export const ALL_SISTEMAS_LESSONS: LessonContent[] = SISTEMAS_UNITS.flatMap((unit) => unit.lessons)

export const SISTEMAS_LESSON_BY_ID: Record<string, LessonContent> = Object.fromEntries(
  ALL_SISTEMAS_LESSONS.map((lesson) => [lesson.id, lesson]),
)
