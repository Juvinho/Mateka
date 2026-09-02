import type { LessonContent, UnitContent } from '../lessonTypes'

export const GEOMETRIA_UNITS: UnitContent[] = [
  {
    number: 1,
    title: 'Coordenadas e Distância entre Pontos',
    lessons: [
      {
        id: 'coordenadas-1',
        title: 'O plano cartesiano e a localização de pontos',
        description: 'Dois eixos perpendiculares, um par ordenado — assim se localiza qualquer ponto do plano.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Um GPS localiza você no mapa com apenas dois números: latitude e longitude. Essa ideia — usar dois valores para apontar exatamente um lugar — é exatamente o que sustenta toda a geometria analítica, o assunto deste módulo.',
          'O plano cartesiano é formado por dois eixos perpendiculares: o eixo x (horizontal) e o eixo y (vertical), que se cruzam na origem, o ponto (0, 0). Todo ponto do plano é identificado por um par ordenado (x, y), onde x é a distância horizontal até a origem e y é a distância vertical.',
        ],
        after: [
          'Os dois eixos dividem o plano em quatro regiões chamadas quadrantes, numerados de I a IV no sentido anti-horário a partir do canto superior direito. O sinal de x e y indica em qual quadrante um ponto está: (+,+) no primeiro, (−,+) no segundo, (−,−) no terceiro e (+,−) no quarto.',
          'Por exemplo, o ponto (3, 2) fica no primeiro quadrante, e o ponto (−4, 1) fica no segundo. Com pontos localizados, a próxima pergunta natural é: qual é a distância entre dois deles? É exatamente o que você vai calcular na próxima lição.',
        ],
        exerciseSetId: 'ex-coordenadas-plano',
      },
      {
        id: 'coordenadas-2',
        title: 'Calculando a distância entre dois pontos',
        description: 'Usando o Teorema de Pitágoras para medir a distância entre dois pontos do plano.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Se você soubesse a localização exata de duas cidades num mapa, como calcularia a distância em linha reta entre elas sem usar uma régua? A resposta está num teorema que você já conhece: o de Pitágoras.',
          'A distância entre dois pontos A(xA, yA) e B(xB, yB) é dada por d(A, B) = √((xB − xA)² + (yB − yA)²) — a mesma fórmula do Teorema de Pitágoras, aplicada aos catetos horizontal e vertical entre os dois pontos.',
        ],
        after: [
          'Geometricamente, Δx = xB − xA e Δy = yB − yA formam os dois catetos de um triângulo retângulo, e a distância d(A, B) é a hipotenusa desse triângulo — por isso a fórmula é literalmente o Teorema de Pitágoras escrito em coordenadas.',
          'Por exemplo, para A(1, 2) e B(4, 6): Δx = 3, Δy = 4, então d = √(3² + 4²) = √25 = 5. Na próxima unidade você vai aprender a encontrar o ponto exatamente no meio do caminho entre dois pontos — o ponto médio.',
        ],
        exerciseSetId: 'ex-coordenadas-distancia',
      },
    ],
  },
  {
    number: 2,
    title: 'Ponto Médio e Razão de Secção',
    lessons: [
      {
        id: 'ponto-medio-1',
        title: 'Encontrando o ponto médio de um segmento',
        description: 'O ponto exatamente no meio do caminho entre dois pontos.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Duas pessoas caminhando uma em direção à outra a partir de pontos diferentes se encontram exatamente na metade do caminho. Esse "ponto de encontro" tem nome e fórmula própria em geometria analítica.',
          'O ponto médio M de um segmento com extremidades A(xA, yA) e B(xB, yB) é dado por M = ((xA + xB)/2, (yA + yB)/2) — a média aritmética simples de cada coordenada, separadamente.',
        ],
        after: [
          'Repare que essa fórmula trata x e y de forma completamente independente: a coordenada x do ponto médio só depende das coordenadas x de A e B, e o mesmo vale para y.',
          'Por exemplo, para A(1, 3) e B(5, 7): M = ((1+5)/2, (3+7)/2) = (3, 5). Essa é uma divisão exatamente na metade — mas nem sempre você quer o ponto do meio; às vezes quer um ponto mais perto de uma das extremidades. É o que a próxima lição resolve.',
        ],
        exerciseSetId: 'ex-pontomedio-formula',
      },
      {
        id: 'ponto-medio-2',
        title: 'Razão de secção e divisão de segmentos',
        description: 'Dividindo um segmento numa proporção qualquer, não só ao meio.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'Imagine dividir uma barra de metal não ao meio, mas numa proporção específica — um terço de um lado, dois terços do outro. O ponto médio é só um caso particular (proporção 1:1) de uma ideia mais geral: a razão de secção.',
          'Um ponto P divide o segmento AB numa razão r = AP/PB. As coordenadas de P são dadas por P = ((xA + r·xB)/(1 + r), (yA + r·yB)/(1 + r)), onde r é a razão entre as duas partes do segmento.',
        ],
        after: [
          'Repare que, se r = 1 (ou seja, AP = PB, as duas partes são iguais), a fórmula se reduz exatamente à fórmula do ponto médio da lição anterior — o ponto médio é só o caso r = 1 dessa ideia mais geral.',
          'Por exemplo, para A(0, 0) e B(9, 6), dividindo na razão r = 2 (P duas vezes mais perto de B que de A): P = ((0 + 2·9)/3, (0 + 2·6)/3) = (6, 4). Com pontos e segmentos dominados, a próxima unidade parte para as retas que passam por eles.',
        ],
        exerciseSetId: 'ex-pontomedio-razao',
      },
    ],
  },
  {
    number: 3,
    title: 'Equação da Reta',
    lessons: [
      {
        id: 'reta-1',
        title: 'Coeficiente angular e equação reduzida',
        description: 'Medindo a inclinação de uma reta e escrevendo sua equação na forma y = mx + n.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Uma rampa de skate e uma ladeira íngreme têm "inclinações" bem diferentes — e a matemática tem um jeito exato de medir essa inclinação para qualquer reta no plano.',
          'O coeficiente angular m de uma reta que passa por A(xA, yA) e B(xB, yB) é m = (yB − yA)/(xB − xA) — o quanto y varia para cada unidade que x varia. A equação reduzida da reta é y = mx + n, onde n é o coeficiente linear (o valor de y quando x = 0).',
        ],
        after: [
          'Para encontrar n, basta substituir as coordenadas de um ponto conhecido da reta na equação y = mx + n e resolver para n, já sabendo o valor de m.',
          'Por exemplo, a reta que passa por (1, 5) e (3, 9) tem m = (9−5)/(3−1) = 2; substituindo (1, 5): 5 = 2(1) + n, então n = 3, e a equação é y = 2x + 3. Essa forma reduzida tem uma limitação — não representa retas verticais — que a próxima lição resolve.',
        ],
        exerciseSetId: 'ex-reta-coeficiente',
      },
      {
        id: 'reta-2',
        title: 'Equação geral da reta',
        description: 'Uma forma que representa qualquer reta, inclusive as verticais.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Uma reta vertical, como x = 4, não tem como ser escrita na forma y = mx + n — não existe um "m" definido para ela. Para representar toda e qualquer reta, a matemática usa uma forma mais geral.',
          'A equação geral da reta é ax + by + c = 0, onde a, b e c são números reais (com a e b não ambos nulos). Qualquer reta do plano, vertical ou não, pode ser escrita nessa forma.',
        ],
        after: [
          'Para converter da forma reduzida y = mx + n para a geral, basta reorganizar: mx − y + n = 0, ou seja, a = m, b = −1, c = n. Para converter de volta, isola-se y (quando b ≠ 0).',
          'Por exemplo, y = 2x + 3 vira 2x − y + 3 = 0 na forma geral. Com a reta bem definida nas duas formas, a próxima unidade explora como duas retas se relacionam entre si — paralelas ou perpendiculares.',
        ],
        exerciseSetId: 'ex-reta-geral',
      },
    ],
  },
  {
    number: 4,
    title: 'Posições Relativas entre Retas',
    lessons: [
      {
        id: 'posicoes-retas-1',
        title: 'Retas paralelas',
        description: 'Quando duas retas nunca se encontram — e como reconhecer isso pelo coeficiente angular.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Os trilhos de uma ferrovia mantêm sempre a mesma distância um do outro, nunca se cruzando — essa é a ideia intuitiva por trás de retas paralelas, e ela tem um teste algébrico simples.',
          'Duas retas são paralelas quando têm o mesmo coeficiente angular: m₁ = m₂. Geometricamente, isso significa que as duas retas "sobem" ou "descem" exatamente na mesma proporção, então nunca se encontram (a menos que sejam a mesma reta).',
        ],
        after: [
          'Vale reparar na sutileza: se além de m₁ = m₂ as retas também tiverem o mesmo coeficiente linear n, elas são coincidentes (a mesma reta, infinitos pontos em comum) — se os n forem diferentes, são paralelas de verdade (nenhum ponto em comum). Essa mesma distinção — coincidentes vs. paralelas distintas — já apareceu no módulo de Sistemas Lineares, na classificação SPI/SI.',
          'Por exemplo, y = 3x + 1 e y = 3x − 5 são paralelas (mesmo m = 3, n diferente). Se as retas não são paralelas, elas se cruzam em algum ângulo — e o caso mais especial desse cruzamento, o ângulo reto, é o assunto da próxima lição.',
        ],
        exerciseSetId: 'ex-posicoesretas-paralelas',
      },
      {
        id: 'posicoes-retas-2',
        title: 'Retas perpendiculares',
        description: 'Quando duas retas se cruzam formando um ângulo reto.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Os cantos de uma sala, as linhas de um caderno quadriculado — retas perpendiculares formam ângulos retos (90°) entre si, e esse relacionamento também tem um teste exato usando o coeficiente angular.',
          'Duas retas são perpendiculares quando o produto dos seus coeficientes angulares é −1: m₁ · m₂ = −1. Isso equivale a dizer que um coeficiente é o inverso e oposto do outro: m₁ = −1/m₂.',
        ],
        after: [
          'Esse teste também explica um caso especial: uma reta horizontal (m = 0) é sempre perpendicular a uma reta vertical (m indefinido) — é a única situação em que a regra do produto não se aplica diretamente, mas a perpendicularidade geométrica continua valendo.',
          'Por exemplo, se uma reta tem m = 2, qualquer reta perpendicular a ela tem m = −1/2. Com paralelismo e perpendicularidade resolvidos, a próxima unidade mede a distância entre um ponto qualquer e uma reta — uma ferramenta que vai reaparecer em várias aplicações.',
        ],
        exerciseSetId: 'ex-posicoesretas-perpendiculares',
      },
    ],
  },
  {
    number: 5,
    title: 'Distância de Ponto a Reta',
    lessons: [
      {
        id: 'distancia-ponto-reta-1',
        title: 'A fórmula da distância ponto–reta',
        description: 'Medindo o menor caminho entre um ponto qualquer e uma reta.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Qual é a distância mais curta entre uma casa e uma estrada reta que passa perto dela? Não é a distância até um ponto qualquer da estrada — é a distância até o ponto mais próximo, medida perpendicularmente.',
          'A distância de um ponto P(x₀, y₀) até uma reta ax + by + c = 0 é dada por d = |ax₀ + by₀ + c| / √(a² + b²) — o módulo garante que a distância seja sempre positiva, não importa de que lado da reta o ponto esteja.',
        ],
        after: [
          'O denominador √(a² + b²) normaliza a fórmula: ele "cancela" o efeito de multiplicar toda a equação da reta por um número (o que não deveria mudar a reta nem a distância até ela).',
          'Por exemplo, a distância do ponto (4, 3) até a reta 3x + 4y − 12 = 0 é |3(4) + 4(3) − 12| / √(9+16) = |12| / 5 = 2,4. Essa fórmula é a base de duas aplicações práticas que você vai ver na próxima lição.',
        ],
        exerciseSetId: 'ex-distanciaponto-formula',
      },
      {
        id: 'distancia-ponto-reta-2',
        title: 'Aplicações: área de triângulos e distância entre retas paralelas',
        description: 'Usando a distância ponto–reta para calcular áreas e comparar retas paralelas.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'A fórmula da área de um triângulo — base vezes altura, dividido por 2 — esconde um problema prático: como medir a "altura" quando você só tem as coordenadas dos três vértices? A distância ponto–reta resolve exatamente isso.',
          'Para calcular a área de um triângulo ABC, escolha um lado como base (por exemplo, AB), calcule seu comprimento com a fórmula da distância entre pontos, e calcule a altura como a distância do vértice C até a reta que contém AB.',
        ],
        after: [
          'A mesma fórmula também mede a distância entre duas retas paralelas: como elas nunca se encontram, a distância entre elas é constante em qualquer ponto — basta escolher um ponto qualquer de uma das retas e calcular sua distância até a outra.',
          'Por exemplo, para medir a distância entre as retas paralelas 2x + y − 4 = 0 e 2x + y − 10 = 0, escolha um ponto fácil na primeira, como (2, 0), e calcule sua distância até a segunda: |2(2)+0−10|/√5 = 6/√5. Com retas dominadas, a próxima unidade parte para a primeira curva do módulo: a circunferência.',
        ],
        exerciseSetId: 'ex-distanciaponto-aplicacoes',
      },
    ],
  },
  {
    number: 6,
    title: 'Equação da Circunferência',
    lessons: [
      {
        id: 'circunferencia-1',
        title: 'Equação reduzida (centro e raio)',
        description: 'Todo ponto a uma mesma distância de um centro — a definição da circunferência.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'A roda de uma bicicleta, a órbita (aproximada) de um satélite — uma circunferência é o conjunto de todos os pontos que mantêm exatamente a mesma distância de um ponto central.',
          'Uma circunferência de centro C(a, b) e raio r é o conjunto dos pontos (x, y) tais que a distância até C é sempre r. Usando a fórmula da distância entre pontos e elevando ao quadrado os dois lados, chegamos à equação reduzida: (x − a)² + (y − b)² = r².',
        ],
        after: [
          'Essa equação é chamada de "reduzida" porque mostra o centro e o raio diretamente, sem precisar de nenhum cálculo extra — basta ler os valores de a, b e r na equação.',
          'Por exemplo, (x − 2)² + (y + 1)² = 9 representa uma circunferência de centro (2, −1) e raio 3 (pois r² = 9). Nem sempre a equação vem nesse formato pronto, porém — às vezes ela aparece "expandida", que é o assunto da próxima lição.',
        ],
        exerciseSetId: 'ex-circunferencia-reduzida',
      },
      {
        id: 'circunferencia-2',
        title: 'Equação geral da circunferência',
        description: 'Reconhecendo e revertendo a forma expandida da equação da circunferência.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'Se você expandir os quadrados da equação reduzida (x − a)² + (y − b)² = r², os termos se reorganizam numa forma bem diferente, sem centro nem raio visíveis diretamente — essa é a equação geral.',
          'A equação geral da circunferência tem a forma x² + y² + Dx + Ey + F = 0. Para voltar à forma reduzida e descobrir o centro e o raio, usa-se a técnica de completar quadrados em x e em y separadamente.',
        ],
        after: [
          'Depois de completar os quadrados, o centro é (−D/2, −E/2), e o raio é r = √((D/2)² + (E/2)² − F) — desde que esse valor dentro da raiz seja positivo (se for zero, a "circunferência" é só um ponto; se for negativo, a equação não representa nenhuma circunferência real).',
          'Por exemplo, x² + y² − 4x + 2y − 4 = 0 tem D = −4, E = 2, F = −4: centro (2, −1) e raio √(4+1+4) = 3 — a mesma circunferência da lição anterior, só que escrita na forma expandida. Com a equação dominada, a próxima unidade explora como um ponto ou uma reta se posicionam em relação a uma circunferência.',
        ],
        exerciseSetId: 'ex-circunferencia-geral',
      },
    ],
  },
  {
    number: 7,
    title: 'Posições Relativas com a Circunferência',
    lessons: [
      {
        id: 'posicoes-circunferencia-1',
        title: 'Ponto interior, exterior ou na circunferência',
        description: 'Descobrindo se um ponto está dentro, fora, ou exatamente sobre uma circunferência.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'O alcance de uma torre de wifi cobre uma área circular — e saber se um dispositivo está dentro ou fora dessa área é simplesmente comparar sua distância até a torre com o raio de alcance.',
          'Para um ponto P e uma circunferência de centro C e raio r, calcule d = distância(P, C) e compare com r: se d < r, P é interior; se d = r, P está sobre a circunferência; se d > r, P é exterior.',
        ],
        after: [
          'Essa comparação é só a definição da circunferência aplicada ao contrário: a circunferência é exatamente o conjunto de pontos onde d = r, então qualquer outro ponto precisa estar mais perto (interior) ou mais longe (exterior) do centro.',
          'Por exemplo, para a circunferência de centro (0,0) e raio 5, o ponto (3, 4) tem distância √(9+16) = 5 até o centro — está exatamente sobre a circunferência. Depois de classificar pontos, a próxima lição faz o mesmo tipo de análise para retas inteiras.',
        ],
        exerciseSetId: 'ex-posicoescirc-ponto',
      },
      {
        id: 'posicoes-circunferencia-2',
        title: 'Reta secante, tangente ou externa',
        description: 'Classificando como uma reta se relaciona com uma circunferência: cruza, toca, ou nem chega perto.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'Uma estrada reta perto de um lago circular pode cruzar a água (dois pontos de encontro), tocar a margem de leve (um único ponto), ou passar longe o suficiente para nunca tocar o lago — três situações bem diferentes.',
          'Para classificar a posição de uma reta em relação a uma circunferência de centro C e raio r, calcule d = distância(reta, C) (usando a fórmula de distância ponto–reta) e compare com r: d < r → secante (dois pontos em comum); d = r → tangente (um ponto); d > r → externa (nenhum ponto em comum).',
        ],
        after: [
          'Essa classificação é o mesmo tipo de raciocínio já visto na classificação de sistemas lineares (SPD/SPI/SI) e no discriminante de uma equação do segundo grau: substituir a reta na equação da circunferência gera uma equação quadrática, e o sinal do discriminante Δ dessa equação (positivo, zero ou negativo) determina secante, tangente ou externa.',
          'Por exemplo, a reta y = 0 (o eixo x) em relação à circunferência x² + y² = 9 (centro na origem, raio 3) passa a uma distância 0 do centro — 0 < 3, então é secante, cruzando a circunferência em dois pontos: (−3, 0) e (3, 0). Com retas e circunferências completamente mapeadas, o módulo agora parte para as demais cônicas, começando pela elipse.',
        ],
        exerciseSetId: 'ex-posicoescirc-reta',
      },
    ],
  },
  {
    number: 8,
    title: 'Elipse',
    lessons: [
      {
        id: 'elipse-1',
        title: 'Definição e elementos da elipse',
        description: 'A curva formada por pontos cuja soma das distâncias a dois focos é sempre a mesma.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'As órbitas dos planetas ao redor do Sol não são círculos perfeitos — são elipses, uma curva "achatada" com uma propriedade curiosa envolvendo não um, mas dois pontos especiais.',
          'Uma elipse é o conjunto dos pontos do plano cuja soma das distâncias a dois pontos fixos, chamados focos (F₁ e F₂), é sempre constante e igual a 2a. Quanto mais distantes os focos estiverem um do outro, mais "achatada" é a elipse.',
        ],
        after: [
          'Os elementos principais da elipse: o centro (ponto médio entre os focos), o eixo maior (comprimento 2a, o maior diâmetro), o eixo menor (comprimento 2b), e a distância focal (2c, entre os dois focos) — esses três valores se relacionam pela equação a² = b² + c².',
          'Quanto mais próximos os focos estiverem do centro (c pequeno), mais a elipse se parece com um círculo; se os focos coincidem (c = 0), a elipse vira exatamente uma circunferência. Com os elementos definidos, a próxima lição escreve essa curva como uma equação algébrica.',
        ],
        exerciseSetId: 'ex-elipse-definicao',
      },
      {
        id: 'elipse-2',
        title: 'Equação reduzida da elipse',
        description: 'Escrevendo a elipse centrada na origem como uma equação algébrica.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'Assim como a circunferência ganhou uma equação algébrica a partir da sua definição geométrica, a elipse também tem uma forma reduzida elegante quando está centrada na origem do plano.',
          'Para uma elipse centrada na origem com eixo maior sobre o eixo x, a equação reduzida é x²/a² + y²/b² = 1 (com a > b). Se o eixo maior estiver sobre o eixo y, a equação é x²/b² + y²/a² = 1, com o maior denominador embaixo do y.',
        ],
        after: [
          'Para identificar a orientação da elipse a partir da equação, basta comparar os denominadores: o maior denominador indica sobre qual eixo está o eixo maior daquela elipse.',
          'Por exemplo, x²/25 + y²/9 = 1 tem a² = 25 (a = 5) e b² = 9 (b = 3), com o eixo maior sobre o eixo x, já que 25 > 9. Como a > b sempre corresponde ao eixo maior, e a elipse é só um caso mais geral da circunferência, a última unidade do módulo fecha com duas cônicas que seguem essa mesma lógica de dois focos: a hipérbole e a parábola.',
        ],
        exerciseSetId: 'ex-elipse-equacao',
      },
    ],
  },
  {
    number: 9,
    title: 'Hipérbole e Parábola',
    lessons: [
      {
        id: 'conicas-1',
        title: 'Hipérbole: definição e equação reduzida',
        description: 'A curva formada por pontos cuja diferença das distâncias a dois focos é sempre a mesma.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'Sistemas de navegação antigos localizavam navios comparando a diferença de tempo entre sinais de rádio recebidos de duas torres — e o conjunto de pontos com uma diferença constante até dois focos forma exatamente uma hipérbole, duas curvas que se abrem em direções opostas.',
          'Uma hipérbole é o conjunto dos pontos cuja diferença (em módulo) das distâncias a dois focos F₁ e F₂ é sempre constante e igual a 2a. Centrada na origem, com focos sobre o eixo x, sua equação reduzida é x²/a² − y²/b² = 1 — repare no sinal de menos, que é o que diferencia essa equação da elipse.',
        ],
        after: [
          'Diferente da elipse, na hipérbole vale a relação c² = a² + b² (com o sinal invertido em relação à elipse), e a curva nunca cruza certas retas chamadas assíntotas, dadas por y = ±(b/a)x — a hipérbole se aproxima cada vez mais dessas retas sem nunca tocá-las.',
          'Por exemplo, x²/16 − y²/9 = 1 tem a = 4 e b = 3, com assíntotas y = ±(3/4)x. Depois de conhecer essa curva de "dois ramos", falta uma última cônica clássica — e você já a conhece, mesmo sem saber: a parábola.',
        ],
        exerciseSetId: 'ex-conicas-hiperbole',
      },
      {
        id: 'conicas-2',
        title: 'Parábola: definição e equação reduzida',
        description: 'A curva de pontos equidistantes de um foco e de uma reta — que fecha o módulo.',
        tags: ['Exercício'],
        duration: 11,
        intro: [
          'Antenas parabólicas, faróis de carro, a trajetória de uma bola arremessada — a parábola é talvez a curva mais familiar deste módulo, e ela também tem uma definição baseada em distâncias.',
          'Uma parábola é o conjunto dos pontos equidistantes de um ponto fixo (o foco) e de uma reta fixa (a diretriz). Centrada na origem, com foco sobre o eixo x, sua equação reduzida é y² = 4px (ou x² = 4py, se o foco estiver sobre o eixo y), onde p é a distância do vértice ao foco.',
        ],
        after: [
          'Vale fechar o módulo com uma conexão importante: a função quadrática y = ax² + bx + c, que você estudou no módulo de Pré-Cálculo, é justamente uma parábola — só que descrita como função, e não pela definição de foco e diretriz usada aqui.',
          'Você chegou ao fim do módulo de Geometria Analítica tendo conectado álgebra e geometria em cada etapa: pontos e distâncias, retas e suas posições relativas, e as quatro cônicas clássicas (circunferência, elipse, hipérbole e parábola) — cada uma definida por uma propriedade de distância diferente, mas todas nascidas da mesma ideia central deste módulo.',
        ],
        exerciseSetId: 'ex-conicas-parabola',
      },
    ],
  },
]

export const ALL_GEOMETRIA_LESSONS: LessonContent[] = GEOMETRIA_UNITS.flatMap((unit) => unit.lessons)

export const GEOMETRIA_LESSON_BY_ID: Record<string, LessonContent> = Object.fromEntries(
  ALL_GEOMETRIA_LESSONS.map((lesson) => [lesson.id, lesson]),
)
