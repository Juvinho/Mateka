import type { LessonContent, UnitContent } from '../lessonTypes'

export const BASICOS_UNITS: UnitContent[] = [
  {
    number: 1,
    title: 'Conjuntos Numéricos',
    lessons: [
      {
        id: 'conjuntos-1',
        title: 'O que são conjuntos numéricos?',
        description: 'Naturais, inteiros, racionais e reais — e como eles se encaixam.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Os números que usamos no dia a dia pertencem a diferentes conjuntos, cada um mais amplo que o anterior — entender essa hierarquia ajuda a saber que tipo de número você está lidando em cada situação.',
          'O conjunto dos Números Naturais (ℕ) é o ponto de partida: 0, 1, 2, 3, 4, 5... — os números que usamos pra contar e ordenar coisas.',
        ],
        after: [
          'Os Números Inteiros (ℤ) incluem todos os Naturais e também seus opostos negativos: ..., -3, -2, -1, 0, 1, 2, 3, ... Todo natural é inteiro, mas nem todo inteiro é natural.',
          'Os Números Racionais (ℚ) são todos que podem ser escritos como uma fração a/b, com a e b inteiros e b ≠ 0 — isso inclui frações, inteiros e decimais que terminam ou repetem. Cada conjunto contém o anterior: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ.',
        ],
        exerciseSetId: 'ex-conjuntos-fundamentos',
      },
      {
        id: 'conjuntos-2',
        title: 'Racionais e irracionais',
        description: 'A diferença entre frações, dízimas periódicas e números irracionais.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Nem todo número real é racional. Existe um outro grupo — os Números Irracionais — que não cabem na definição de fração exata, e a diferença entre os dois é mais simples do que parece.',
          'Um número é racional quando pode ser escrito como fração a/b (com a e b inteiros): isso inclui inteiros, frações comuns e até decimais que se repetem para sempre, como 0,333... = 1/3.',
        ],
        after: [
          'Já os irracionais têm infinitas casas decimais que nunca se repetem em um padrão fixo — como √2, √3 e π. Não existe fração exata que os represente.',
          'Juntos, racionais e irracionais formam o conjunto dos Números Reais (ℝ) — praticamente todo número que você vai usar na escola mora em algum desses dois grupos.',
        ],
        exerciseSetId: 'ex-racionais-irracionais',
      },
      {
        id: 'conjuntos-3',
        title: 'Reta numérica e comparações',
        description: 'Compare, ordene e calcule o valor absoluto de números.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'A reta numérica organiza todos os números reais em ordem, da esquerda (mais negativos) para a direita (mais positivos) — e ela é a ferramenta mais direta pra comparar dois números.',
          'Comparar números negativos costuma confundir: entre -5 e -2, quem é maior? A resposta é -2, porque ele está mais perto do zero (mais à direita na reta).',
        ],
        after: [
          'O valor absoluto (ou módulo) de um número mede sua distância até o zero, sempre um valor não negativo: |-8| = 8 e |8| = 8 — os dois estão a 8 unidades de distância da origem.',
          'Números com o mesmo valor absoluto mas sinais opostos, como -4 e 4, são chamados de opostos (ou simétricos): eles ficam à mesma distância do zero, em direções contrárias.',
        ],
        exerciseSetId: 'ex-reta-numerica',
      },
    ],
  },
  {
    number: 2,
    title: 'Operações e Propriedades',
    lessons: [
      {
        id: 'operacoes-1',
        title: 'Comutativa e associativa',
        description: 'Por que dá pra reorganizar uma soma ou multiplicação sem mudar o resultado.',
        tags: ['Exercício'],
        duration: 7,
        intro: [
          'Quando você soma 3 + 5 ou 5 + 3, o resultado é sempre 8 — a ordem não muda nada. Isso não é coincidência: é a propriedade comutativa, e ela vale tanto para a soma quanto para a multiplicação.',
          'A propriedade comutativa diz: a + b = b + a, e a × b = b × a. Você pode trocar a ordem dos números numa soma ou numa multiplicação sem alterar o resultado.',
        ],
        after: [
          'Já a propriedade associativa é sobre agrupamento: (a + b) + c = a + (b + c), e o mesmo vale para a multiplicação. Não importa quais dois números você soma (ou multiplica) primeiro — o resultado final é o mesmo.',
          'Um ponto importante: nem toda operação tem essas propriedades. 5 − 3 é diferente de 3 − 5, e 10 ÷ 2 é diferente de 2 ÷ 10 — subtração e divisão NÃO são comutativas nem associativas. Saber onde essas propriedades valem (e onde não valem) evita erros clássicos ao reorganizar uma conta.',
        ],
        exerciseSetId: 'ex-comutativa-associativa',
      },
      {
        id: 'operacoes-2',
        title: 'Propriedade distributiva',
        description: 'Como multiplicar um número por uma soma — a ponte direta para álgebra.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'A propriedade distributiva é a mais usada de todas em álgebra: ela diz como multiplicar um número por uma soma (ou subtração) dentro de parênteses, sem precisar calcular o que está dentro primeiro.',
          'A regra: a × (b + c) = a×b + a×c. Você "distribui" o a para cada termo dentro do parênteses, multiplicando um de cada vez.',
        ],
        after: [
          'Funciona igual com subtração: a × (b − c) = a×b − a×c. E funciona nos dois sentidos — você pode expandir um parênteses (distribuir) ou fazer o caminho inverso, colocando um fator comum em evidência. Esse caminho inverso é o primeiro passo da fatoração, que você vai usar bastante mais pra frente.',
          'Repare que a distributiva é o que permite calcular algo como 6 × 23 mentalmente: 6 × (20 + 3) = 6×20 + 6×3 = 120 + 18 = 138 — sem multiplicar dois números de dois dígitos direto.',
        ],
        exerciseSetId: 'ex-distributiva',
      },
    ],
  },
  {
    number: 3,
    title: 'Frações e Proporção',
    lessons: [
      {
        id: 'fracoes-1',
        title: 'Operações com frações',
        description: 'Some, subtraia, multiplique e divida frações sem travar no denominador.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Uma fração representa uma parte de um todo: em 3/4, o número de baixo (denominador) diz em quantas partes iguais o todo foi dividido, e o de cima (numerador) diz quantas dessas partes você tem.',
          'Para somar ou subtrair frações, elas precisam ter o mesmo denominador. Se não tiverem, o primeiro passo é encontrar um denominador comum (geralmente o mínimo múltiplo comum dos denominadores) antes de somar os numeradores.',
        ],
        after: [
          'Multiplicar frações é mais direto: multiplica numerador por numerador e denominador por denominador — sem precisar de denominador comum. Por exemplo: 2/3 × 3/5 = 6/15, que simplifica para 2/5.',
          'Dividir uma fração por outra é multiplicar pela fração invertida: a/b ÷ c/d = a/b × d/c. Esse "inverte e multiplica" funciona porque dividir por c/d é o mesmo que multiplicar pelo seu inverso, d/c.',
        ],
        exerciseSetId: 'ex-fracoes-operacoes',
      },
      {
        id: 'fracoes-2',
        title: 'Razão e proporção',
        description: 'Compare valores, monte proporções e resolva com regra de três.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Uma razão compara dois valores por divisão: a razão entre a e b se escreve a/b ou a:b, e diz "quantas vezes a cabe em b" (ou a relação entre os dois).',
          'Uma proporção é uma igualdade entre duas razões: a/b = c/d. Quando três desses valores são conhecidos, dá pra encontrar o quarto — é a base da regra de três.',
        ],
        after: [
          'Proporção aparece em todo canto: numa escala de mapa (1 cm representa 1 km), numa receita (dobrar os ingredientes mantendo a razão entre eles), ou numa velocidade (distância percorrida por tempo — uma razão que você vai reencontrar em Cálculo como taxa de variação).',
          'Mais pra frente, em Trigonometria, seno e cosseno de um ângulo também são razões — a razão entre dois lados de um triângulo retângulo. Entender proporção agora é entender a lógica por trás disso antes mesmo de chegar lá.',
        ],
        exerciseSetId: 'ex-razao-proporcao',
      },
    ],
  },
  {
    number: 4,
    title: 'Potenciação e Radiciação',
    lessons: [
      {
        id: 'potenciacao-1',
        title: 'Propriedades da potenciação',
        description: 'Multiplique, divida e eleve potências sem repetir a base toda vez.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Uma potência é uma forma resumida de escrever uma multiplicação repetida: 2⁴ = 2×2×2×2 = 16. O número de baixo (2) é a base, e o de cima (4) é o expoente — quantas vezes a base se repete.',
          'Quando você multiplica potências de mesma base, soma os expoentes: aᵐ × aⁿ = aᵐ⁺ⁿ. E quando divide, subtrai: aᵐ ÷ aⁿ = aᵐ⁻ⁿ.',
        ],
        after: [
          'Uma potência elevada a outro expoente multiplica os expoentes: (aᵐ)ⁿ = aᵐˣⁿ. E todo número elevado a 0 vale 1 (a⁰ = 1, com a ≠ 0) — isso não é decoreba, é consequência direta da propriedade da divisão: aⁿ ÷ aⁿ = aⁿ⁻ⁿ = a⁰, e qualquer número dividido por ele mesmo é 1.',
          'Expoente negativo inverte a base: a⁻ⁿ = 1/aⁿ. E existe até expoente fracionário — a^(1/n) é exatamente a raiz n-ésima de a, o que conecta potenciação e radiciação, o assunto da próxima aula.',
        ],
        exerciseSetId: 'ex-potenciacao',
      },
      {
        id: 'potenciacao-2',
        title: 'Radiciação',
        description: 'Raiz quadrada, cúbica e a conexão direta com expoente fracionário.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'A radiciação desfaz a potenciação: se 5² = 25, então √25 = 5. A raiz quadrada de um número pergunta "que número, multiplicado por ele mesmo, dá esse resultado?".',
          'Existem raízes de qualquer índice: a raiz cúbica de 8 (∛8) pergunta "que número, elevado ao cubo, dá 8?" — e a resposta é 2, porque 2³ = 8.',
        ],
        after: [
          'Toda raiz pode ser escrita como potência fracionária: ⁿ√a = a^(1/n). Por isso √a = a^(1/2) — a raiz quadrada é literalmente "elevar a um meio". Essa é a mesma regra que vai sustentar a derivada de potências mais pra frente.',
          'Propriedades úteis: a raiz de um produto é o produto das raízes (√(a×b) = √a × √b), e a raiz de um quociente é o quociente das raízes (√(a/b) = √a / √b) — desde que os valores envolvidos sejam não negativos.',
        ],
        exerciseSetId: 'ex-radiciacao',
      },
    ],
  },
  {
    number: 5,
    title: 'Fatoração e Produtos Notáveis',
    lessons: [
      {
        id: 'fatoracao-1',
        title: 'Produtos notáveis',
        description: 'Padrões de multiplicação que valem a pena reconhecer de cabeça.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Alguns produtos aparecem tanto em álgebra que vale a pena reconhecer o padrão de cabeça, sem precisar expandir passo a passo toda vez — são os chamados produtos notáveis.',
          'O quadrado da soma: (a + b)² = a² + 2ab + b². Repare que não é só a² + b² — o termo do meio (2ab) é fácil de esquecer, e é o erro mais comum nesse tipo de expansão.',
        ],
        after: [
          'O quadrado da diferença segue o mesmo padrão, só muda o sinal do meio: (a − b)² = a² − 2ab + b².',
          'E o produto da soma pela diferença gera a diferença de quadrados: (a + b)(a − b) = a² − b² — os termos do meio se cancelam. Esse padrão específico vai ser muito usado ao contrário, na fatoração.',
        ],
        exerciseSetId: 'ex-produtos-notaveis',
      },
      {
        id: 'fatoracao-2',
        title: 'Fatoração',
        description: 'O caminho inverso da expansão — essencial para simplificar expressões e resolver limites.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'Fatorar é reescrever uma soma como um produto — o caminho inverso de expandir. A forma mais simples é colocar um fator comum em evidência: 6x + 9 = 3(2x + 3), porque 3 divide os dois termos.',
          'Quando não há um fator comum óbvio em todos os termos, a fatoração por agrupamento junta os termos em pares que compartilham um fator, e depois coloca esse fator em evidência de novo.',
        ],
        after: [
          'Os produtos notáveis também funcionam ao contrário: se você reconhece a² − b², já sabe que isso fatora em (a + b)(a − b). Reconhecer esses padrões de trás pra frente é o que torna a fatoração rápida.',
          'Essa habilidade vai ser decisiva mais pra frente: em Limites, é comum uma expressão gerar uma indeterminação 0/0 — e a saída quase sempre é fatorar o numerador e o denominador pra cancelar o termo problemático. Quem não fatora bem trava exatamente nesse ponto.',
        ],
        exerciseSetId: 'ex-fatoracao',
      },
    ],
  },
  {
    number: 6,
    title: 'Equações e Inequações',
    lessons: [
      {
        id: 'equacoes-1',
        title: 'Equações do 1º grau',
        description: 'Isole a incógnita aplicando a mesma operação inversa dos dois lados.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Uma equação do 1º grau tem uma incógnita (geralmente x) elevada a expoente 1, e o objetivo é descobrir qual valor de x torna a igualdade verdadeira. A forma geral é ax + b = c.',
          'A regra de ouro: o que você faz de um lado da igualdade, precisa fazer do outro também — assim a equação continua equilibrada, como uma balança.',
        ],
        after: [
          'Para isolar x em 2x + 5 = 13, primeiro subtrai 5 dos dois lados (2x = 8), depois divide os dois lados por 2 (x = 4). Cada passo desfaz uma operação usando a operação inversa: subtração desfaz soma, divisão desfaz multiplicação.',
          'Equações do 1º grau aparecem por trás de praticamente todo problema de "descobrir um valor desconhecido" — inclusive dentro de equações mais complexas, como parte da resolução de sistemas ou de problemas de otimização em Cálculo.',
        ],
        exerciseSetId: 'ex-equacoes-1grau',
      },
      {
        id: 'equacoes-2',
        title: 'Equações do 2º grau',
        description: 'A fórmula de Bhaskara e o que o discriminante revela sobre as soluções.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'Uma equação do 2º grau tem a forma ax² + bx + c = 0, com a ≠ 0. Diferente da equação do 1º grau, ela pode ter até duas soluções (raízes) diferentes — porque x aparece elevado ao quadrado.',
          'A fórmula de Bhaskara resolve qualquer equação desse tipo: x = (−b ± √(b² − 4ac)) / 2a. A parte dentro da raiz, b² − 4ac, é chamada de discriminante (Δ).',
        ],
        after: [
          'O discriminante conta a história antes mesmo de terminar a conta: se Δ > 0, a equação tem duas raízes reais diferentes; se Δ = 0, tem uma raiz real (dupla); se Δ < 0, não tem raiz real nenhuma.',
          'Por exemplo, em x² − 5x + 6 = 0: a=1, b=−5, c=6, então Δ = 25 − 24 = 1 (positivo). As raízes são x = (5 ± 1)/2, ou seja, x=3 e x=2.',
        ],
        exerciseSetId: 'ex-equacoes-2grau',
      },
      {
        id: 'equacoes-3',
        title: 'Inequações e sistemas simples',
        description: 'Resolva desigualdades com cuidado no sinal e sistemas de duas equações.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'Uma inequação é como uma equação, mas em vez de igualdade (=), usa uma desigualdade (<, >, ≤ ou ≥). Resolver funciona quase igual a uma equação — com uma armadilha importante.',
          'A armadilha: ao multiplicar ou dividir os dois lados de uma inequação por um número negativo, o sinal da desigualdade inverte. Por exemplo, −2x < 6 vira x > −3 (o "menor que" virou "maior que") ao dividir por −2.',
        ],
        after: [
          'Um sistema de equações é um conjunto de duas (ou mais) equações que precisam ser verdadeiras ao mesmo tempo. O método da substituição isola uma variável numa equação e substitui na outra; o método da adição soma as duas equações (às vezes multiplicando uma delas antes) pra eliminar uma variável.',
          'Por exemplo, no sistema x + y = 10 e x − y = 2: somando as duas equações, 2x = 12, então x = 6 — e substituindo de volta, y = 4.',
        ],
        exerciseSetId: 'ex-inequacoes-sistemas',
      },
    ],
  },
  {
    number: 7,
    title: 'Plano Cartesiano e Noção de Função',
    lessons: [
      {
        id: 'funcoes-1',
        title: 'Plano cartesiano e pares ordenados',
        description: 'Localize pontos, entenda os eixos e os quatro quadrantes.',
        tags: ['Exercício'],
        duration: 7,
        intro: [
          'O plano cartesiano é formado por duas retas numéricas perpendiculares: o eixo x (horizontal) e o eixo y (vertical), que se cruzam num ponto chamado origem (0, 0).',
          'Cada ponto do plano é localizado por um par ordenado (x, y): o primeiro número diz o quanto andar na horizontal, o segundo o quanto andar na vertical. A ordem importa — (2, 5) não é o mesmo ponto que (5, 2).',
        ],
        after: [
          'Os eixos dividem o plano em quatro quadrantes: no 1º (x>0, y>0) ambos são positivos; no 2º (x<0, y>0) só y é positivo; no 3º (x<0, y<0) ambos são negativos; no 4º (x>0, y<0) só x é positivo.',
          'Esse sistema de coordenadas é a base de tudo que envolve gráfico — de uma reta simples até o gráfico de uma função, o círculo trigonométrico, ou a curva de uma derivada.',
        ],
        exerciseSetId: 'ex-plano-cartesiano',
      },
      {
        id: 'funcoes-2',
        title: 'O que é uma função',
        description: 'A ideia central: para cada entrada, existe exatamente uma saída.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Uma função é uma regra que relaciona cada valor de entrada (x) a exatamente um valor de saída (y). Se para um mesmo x existisse mais de um y possível, não seria uma função.',
          'A notação f(x) se lê "f de x" e representa o valor de saída da função f para a entrada x. Por exemplo, se f(x) = 2x + 1, então f(3) = 2×3 + 1 = 7.',
        ],
        after: [
          'O domínio de uma função é o conjunto de todos os valores de entrada permitidos; a imagem é o conjunto de todos os valores de saída que a função realmente produz.',
          'No gráfico de uma função, cada valor de x cruza a curva em no máximo um ponto — se uma linha vertical cruzasse o gráfico em dois pontos, não seria gráfico de uma função. Esse é o chamado teste da reta vertical.',
        ],
        exerciseSetId: 'ex-nocao-funcao',
      },
    ],
  },
  {
    number: 8,
    title: 'Geometria Básica',
    lessons: [
      {
        id: 'geometria-1',
        title: 'Área e perímetro',
        description: 'Meça o contorno e o espaço interno de quadrados, retângulos e triângulos.',
        tags: ['Exercício'],
        duration: 7,
        intro: [
          'O perímetro de uma figura é a soma de todos os seus lados — a distância total ao redor dela. Num quadrado de lado 5, o perímetro é 5+5+5+5 = 20.',
          'A área mede o espaço ocupado dentro da figura. Para um retângulo, área = base × altura. Para um quadrado (um retângulo com todos os lados iguais), área = lado × lado = lado².',
        ],
        after: [
          'A área de um triângulo é (base × altura) / 2 — metade da área do retângulo que o "envolveria". Isso faz sentido porque dois triângulos idênticos formam exatamente um retângulo.',
          'Área e perímetro respondem perguntas diferentes: perímetro é sobre contorno (quanto de cerca você precisa), área é sobre superfície (quanto de piso você precisa) — é fácil confundir os dois, mas eles nunca se misturam numa mesma fórmula.',
        ],
        exerciseSetId: 'ex-area-perimetro',
      },
      {
        id: 'geometria-2',
        title: 'Teorema de Pitágoras e ângulos',
        description: 'A relação entre os lados de um triângulo retângulo, e como ângulos se combinam.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Num triângulo retângulo (que tem um ângulo de 90°), o lado oposto ao ângulo reto é chamado de hipotenusa, e os outros dois lados são os catetos.',
          'O Teorema de Pitágoras relaciona os três lados: a² + b² = c², onde c é a hipotenusa e a, b são os catetos. Ele só vale para triângulos retângulos.',
        ],
        after: [
          'Por exemplo, num triângulo com catetos 3 e 4: c² = 3² + 4² = 9 + 16 = 25, então c = 5 — o famoso "triângulo 3-4-5", um dos exemplos mais usados por dar números inteiros.',
          'Dois ângulos são complementares quando somam 90° (como os dois ângulos agudos de um triângulo retângulo), e suplementares quando somam 180° (como os ângulos de um lado de uma reta). Esses conceitos reaparecem direto em Trigonometria.',
        ],
        exerciseSetId: 'ex-pitagoras-angulos',
      },
    ],
  },
  {
    number: 9,
    title: 'Notação e Linguagem Matemática',
    lessons: [
      {
        id: 'notacao-1',
        title: 'Como ler símbolos matemáticos',
        description: 'Os símbolos que aparecem toda hora e o que cada um realmente significa.',
        tags: ['Exercício'],
        duration: 6,
        intro: [
          'Muita gente trava em matemática não por falta de raciocínio, mas por não reconhecer um símbolo — e isso se resolve rápido, com prática de leitura, não com mais cálculo.',
          'O símbolo ∈ significa "pertence a": 3 ∈ ℕ se lê "3 pertence aos Naturais". O símbolo ∉ é o oposto, "não pertence a".',
        ],
        after: [
          'O símbolo ⊂ significa "está contido em": ℕ ⊂ ℤ se lê "os Naturais estão contidos nos Inteiros" — todo elemento de um conjunto também está no outro, exatamente como você viu na primeira unidade.',
          'O símbolo ∑ (somatório) representa uma soma repetida de forma compacta; |x| é o módulo (valor absoluto) de x. E intervalos usam colchetes para "incluir a ponta" — [a, b] inclui a e b — e parênteses para "excluir a ponta" — (a, b) não inclui nem a nem b.',
        ],
        exerciseSetId: 'ex-notacao',
      },
    ],
  },
]

export const ALL_BASICOS_LESSONS: LessonContent[] = BASICOS_UNITS.flatMap((unit) => unit.lessons)

export const BASICOS_LESSON_BY_ID: Record<string, LessonContent> = Object.fromEntries(
  ALL_BASICOS_LESSONS.map((lesson) => [lesson.id, lesson]),
)
