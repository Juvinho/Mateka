import type { LessonContent, UnitContent } from '../lessonTypes'

export const PLANA_UNITS: UnitContent[] = [
  {
    number: 1,
    title: 'Ângulos e Retas Paralelas',
    lessons: [
      {
        id: 'angulos-1',
        title: 'Tipos de ângulos e suas relações',
        description: 'Complementares, suplementares e opostos pelo vértice.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Ângulos estão em toda parte: a abertura de uma tesoura, a esquina de uma rua, os ponteiros de um relógio. Antes de estudar triângulos, polígonos ou circunferências, vale revisar as relações básicas entre ângulos que vão aparecer o módulo inteiro.',
          'Um ângulo é a região formada por duas semirretas com origem comum, medida em graus. Dois ângulos são complementares quando somam 90°, e suplementares quando somam 180°.',
        ],
        after: [
          'Quando duas retas se cruzam, formam-se quatro ângulos, e os pares opostos (um de cada lado do cruzamento) são chamados de ângulos opostos pelo vértice — e são sempre congruentes (medem exatamente o mesmo).',
          'Por exemplo, se duas retas se cruzam formando um ângulo de 40°, o ângulo oposto a ele também mede 40°, e os outros dois ângulos (adjacentes a ambos) medem 140° cada, já que são suplementares ao de 40°. Essas relações ficam ainda mais ricas quando entra em cena uma terceira reta cruzando duas retas paralelas — o assunto da próxima lição.',
        ],
        exerciseSetId: 'ex-angulos-tipos',
      },
      {
        id: 'angulos-2',
        title: 'Retas paralelas cortadas por uma transversal',
        description: 'Ângulos correspondentes, alternos e colaterais.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Os trilhos de uma ferrovia (duas retas paralelas) cruzados por uma rua (a transversal) formam um padrão de oito ângulos com relações bem previsíveis entre si — e esse padrão é uma das ferramentas mais usadas da geometria plana.',
          'Quando uma transversal corta duas retas paralelas, forma-se um total de 8 ângulos, organizados em pares com nomes específicos: correspondentes (mesma posição relativa em cada reta, sempre congruentes) e alternos internos/externos (em lados opostos da transversal, também congruentes).',
        ],
        after: [
          'Há ainda os ângulos colaterais (ou conjugados) internos e externos, que ficam do mesmo lado da transversal — esses são suplementares entre si (somam 180°), não congruentes.',
          'Por exemplo, se um dos ângulos formados mede 70°, seu correspondente também mede 70°, seu alterno interno mede 70°, e seu colateral interno mede 110° (suplementar). Com ângulos dominados, o módulo agora foca na figura geométrica mais simples e fundamental: o triângulo.',
        ],
        exerciseSetId: 'ex-angulos-paralelas',
      },
    ],
  },
  {
    number: 2,
    title: 'Triângulos: Classificação e Ângulos',
    lessons: [
      {
        id: 'triangulos-1',
        title: 'Classificando triângulos por lados e ângulos',
        description: 'Equilátero, isósceles, escaleno, acutângulo, retângulo, obtusângulo.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'O triângulo é o polígono mais simples que existe — só três lados — e por isso mesmo é a base de praticamente toda a geometria plana e espacial que vem depois.',
          'Por lados, um triângulo é equilátero (três lados iguais), isósceles (dois lados iguais) ou escaleno (três lados diferentes). Por ângulos, é acutângulo (todos os ângulos agudos, menores que 90°), retângulo (um ângulo reto, 90°) ou obtusângulo (um ângulo obtuso, maior que 90°).',
        ],
        after: [
          'Essas duas classificações são independentes — um mesmo triângulo recebe uma classificação por lado e outra por ângulo ao mesmo tempo. Por exemplo, um triângulo pode ser isósceles E retângulo simultaneamente.',
          'Um triângulo equilátero, por sua vez, é sempre acutângulo (todos os seus três ângulos medem exatamente 60°) — nunca pode ser retângulo ou obtusângulo. Depois de classificar triângulos pela forma, a próxima lição explora uma propriedade que vale para absolutamente todos eles: a soma dos ângulos internos.',
        ],
        exerciseSetId: 'ex-triangulos-classificacao',
      },
      {
        id: 'triangulos-2',
        title: 'A soma dos ângulos internos e o ângulo externo',
        description: 'Por que os ângulos internos de qualquer triângulo somam sempre 180°.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Pegue qualquer triângulo — gigante, minúsculo, torto — e some seus três ângulos internos. O resultado é sempre o mesmo número, não importa a forma: essa é uma das propriedades mais úteis (e mais usadas em provas) de toda a geometria.',
          'A soma dos ângulos internos de qualquer triângulo é sempre 180°. Isso significa que, sabendo dois ângulos de um triângulo, o terceiro sempre pode ser calculado por subtração.',
        ],
        after: [
          'O ângulo externo de um triângulo (formado prolongando um dos lados) é sempre igual à soma dos dois ângulos internos não adjacentes a ele — uma consequência direta da soma dar sempre 180°.',
          'Por exemplo, num triângulo com ângulos internos de 50° e 70°, o terceiro ângulo mede 180° − 50° − 70° = 60°, e o ângulo externo adjacente a esse último mede 50° + 70° = 120°. Com ângulos de triângulos dominados, a próxima unidade explora quando dois triângulos são "iguais" ou "parecidos" entre si.',
        ],
        exerciseSetId: 'ex-triangulos-soma',
      },
    ],
  },
  {
    number: 3,
    title: 'Congruência e Semelhança de Triângulos',
    lessons: [
      {
        id: 'congruencia-1',
        title: 'Casos de congruência (LAL, ALA, LLL)',
        description: 'Quando dois triângulos são exatamente iguais, em forma e tamanho.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Duas peças de uma linha de produção, cortadas pelo mesmo molde, têm exatamente o mesmo formato e tamanho — em geometria, triângulos assim são chamados de congruentes.',
          'Dois triângulos são congruentes quando têm os três lados e os três ângulos correspondentes iguais. Não é preciso checar os seis elementos, porém — existem casos que garantem a congruência com menos informação: LAL (dois lados e o ângulo entre eles), ALA (dois ângulos e o lado entre eles) e LLL (os três lados).',
        ],
        after: [
          'Cada caso funciona como um "atalho": se as condições de um deles forem satisfeitas, os outros elementos do triângulo automaticamente também coincidem — não é preciso verificar tudo.',
          'Por exemplo, se dois triângulos têm dois lados de mesma medida e o ângulo entre esses lados também igual (caso LAL), eles são congruentes, mesmo sem checar o terceiro lado ou os outros dois ângulos. Nem sempre dois triângulos são idênticos, porém — às vezes têm a mesma forma em tamanhos diferentes, o que a próxima lição explora.',
        ],
        exerciseSetId: 'ex-congruencia-casos',
      },
      {
        id: 'congruencia-2',
        title: 'Semelhança de triângulos e o Teorema de Tales',
        description: 'Mesma forma, tamanhos proporcionais — e o teorema que sustenta essa ideia.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'Um mapa e o território real que ele representa têm exatamente a mesma forma, só que em tamanhos completamente diferentes — essa é a ideia central da semelhança de triângulos.',
          'Dois triângulos são semelhantes quando têm os ângulos correspondentes iguais e os lados correspondentes proporcionais (na mesma razão). O Teorema de Tales afirma que um feixe de retas paralelas cortado por duas transversais determina segmentos proporcionais nessas transversais.',
        ],
        after: [
          'A razão de semelhança é o número que relaciona os lados correspondentes dos dois triângulos — se a razão é 2, cada lado do triângulo maior mede o dobro do lado correspondente no menor.',
          'Por exemplo, dois triângulos semelhantes com razão 3 têm um lado de 4cm no menor correspondendo a um lado de 12cm no maior. A semelhança de triângulos é, inclusive, a ferramenta usada para provar as relações métricas do triângulo retângulo — o assunto da próxima unidade.',
        ],
        exerciseSetId: 'ex-congruencia-semelhanca',
      },
    ],
  },
  {
    number: 4,
    title: 'Relações Métricas no Triângulo Retângulo',
    lessons: [
      {
        id: 'metricas-1',
        title: 'Elementos do triângulo retângulo e o Teorema de Pitágoras',
        description: 'Catetos, hipotenusa, e a relação mais famosa da geometria.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Escadas encostadas na parede, o telhado de uma casa, o canto de uma folha de papel — o triângulo retângulo (com um ângulo de 90°) aparece por toda parte, e guarda uma das relações mais famosas de toda a matemática.',
          'Num triângulo retângulo, os dois lados que formam o ângulo reto são chamados de catetos, e o lado oposto ao ângulo reto (o maior dos três) é a hipotenusa. O Teorema de Pitágoras afirma que a²= b² + c², onde a é a hipotenusa e b, c são os catetos.',
        ],
        after: [
          'Essa é exatamente a mesma relação já usada no módulo de Geometria Analítica para calcular distância entre dois pontos — a fórmula da distância nada mais é do que o Teorema de Pitágoras aplicado a coordenadas.',
          'Por exemplo, um triângulo retângulo com catetos 3 e 4 tem hipotenusa a = √(3²+4²) = √25 = 5 — o famoso "triângulo 3-4-5". Além da hipotenusa, o triângulo retângulo guarda outras relações métricas úteis, envolvendo sua altura — o assunto da próxima lição.',
        ],
        exerciseSetId: 'ex-metricas-pitagoras',
      },
      {
        id: 'metricas-2',
        title: 'Relações métricas: altura, projeções e médias geométricas',
        description: 'A altura relativa à hipotenusa divide o triângulo em dois menores, semelhantes ao original.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'Trace a altura relativa à hipotenusa num triângulo retângulo, e você obtém dois triângulos menores — e, surpreendentemente, os três (o original e os dois menores) são todos semelhantes entre si.',
          'Chamando a altura de h, e m, n as projeções dos catetos b, c sobre a hipotenusa (com m+n=a), valem as relações: h² = m·n, b² = a·n, e c² = a·m — todas consequência direta da semelhança entre os três triângulos.',
        ],
        after: [
          'Essas fórmulas são chamadas de "médias geométricas" porque cada uma delas tem a forma "quadrado de um lado = produto de dois outros" — o mesmo padrão da média geométrica entre dois números.',
          'Por exemplo, no triângulo 3-4-5 (catetos 3 e 4, hipotenusa 5), a altura relativa à hipotenusa mede h = (3×4)/5 = 2,4 — calculável também a partir da área do triângulo. Com o triângulo retângulo totalmente mapeado, o módulo agora se expande para polígonos com qualquer número de lados.',
        ],
        exerciseSetId: 'ex-metricas-relacoes',
      },
    ],
  },
  {
    number: 5,
    title: 'Polígonos',
    lessons: [
      {
        id: 'poligonos-1',
        title: 'Soma dos ângulos internos e externos de um polígono',
        description: 'Generalizando a soma de 180° dos triângulos para qualquer polígono.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Um quadrado, um pentágono, um hexágono — qualquer figura fechada de lados retos é um polígono, e cada um tem sua própria soma de ângulos internos, generalizando o que você já sabe sobre o triângulo.',
          'A soma dos ângulos internos de um polígono de n lados é dada por Sᵢ = (n − 2) × 180°. Já a soma dos ângulos externos de qualquer polígono convexo é sempre 360°, não importa o número de lados.',
        ],
        after: [
          'A fórmula da soma interna vem de dividir o polígono em triângulos a partir de um único vértice: um polígono de n lados sempre se divide em exatamente (n−2) triângulos, cada um contribuindo 180°.',
          'Por exemplo, um pentágono (n=5) tem soma dos ângulos internos igual a (5−2)×180° = 540°. Com a soma total resolvida, a próxima lição conta quantas diagonais um polígono tem, e o que muda quando ele é regular.',
        ],
        exerciseSetId: 'ex-poligonos-soma',
      },
      {
        id: 'poligonos-2',
        title: 'Diagonais e polígonos regulares',
        description: 'Contando diagonais e conhecendo os polígonos de lados e ângulos iguais.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Quantos segmentos dá para traçar dentro de um hexágono ligando vértices que não são vizinhos? Essas linhas se chamam diagonais, e existe uma fórmula direta para contá-las, sem precisar desenhar e contar uma por uma.',
          'O número de diagonais de um polígono de n lados é d = n(n−3)/2. Um polígono é regular quando todos os seus lados e todos os seus ângulos são iguais entre si — como o quadrado e o hexágono regular.',
        ],
        after: [
          'Num polígono regular, cada ângulo interno individual pode ser calculado dividindo a soma total pelo número de lados: ângulo interno = Sᵢ/n = ((n−2)×180°)/n.',
          'Por exemplo, um hexágono (n=6) tem d = 6(6−3)/2 = 9 diagonais, e se for regular, cada ângulo interno mede (6−2)×180°/6 = 120°. Com polígonos genéricos dominados, o módulo agora foca nos quadriláteros — os polígonos de quatro lados mais importantes da geometria.',
        ],
        exerciseSetId: 'ex-poligonos-diagonais',
      },
    ],
  },
  {
    number: 6,
    title: 'Quadriláteros Notáveis',
    lessons: [
      {
        id: 'quadrilateros-1',
        title: 'Paralelogramos: propriedades e casos especiais',
        description: 'Lados opostos paralelos — e os casos especiais retângulo, losango e quadrado.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Portas, janelas, a tela de uma TV — quadriláteros com lados opostos paralelos, os paralelogramos, estão entre as formas mais comuns do dia a dia, e guardam propriedades bem previsíveis.',
          'Num paralelogramo, os lados opostos são paralelos e iguais, os ângulos opostos são iguais, e as diagonais se cortam ao meio (no ponto médio de cada uma). Três casos especiais de paralelogramo merecem nomes próprios: o retângulo (todos os ângulos retos), o losango (todos os lados iguais) e o quadrado (que é retângulo E losango ao mesmo tempo).',
        ],
        after: [
          'Essa é uma hierarquia, não uma lista de opções separadas: todo quadrado é um retângulo, todo quadrado é um losango, e todo retângulo e todo losango são paralelogramos — mas nem todo paralelogramo é retângulo ou losango.',
          'Por exemplo, um paralelogramo com diagonais de 8cm e 6cm tem essas diagonais se cruzando exatamente no ponto médio de cada uma, dividindo cada diagonal em duas partes de 4cm e 3cm. Nem todo quadrilátero de quatro lados é um paralelogramo, porém — a próxima lição cobre um caso bem diferente: o trapézio.',
        ],
        exerciseSetId: 'ex-quadrilateros-paralelogramos',
      },
      {
        id: 'quadrilateros-2',
        title: 'Trapézios e suas propriedades',
        description: 'Só um par de lados paralelos — a base maior e a base menor.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Diferente do paralelogramo, o trapézio tem só um par de lados paralelos — chamados de base maior (B) e base menor (b) — e por isso não herda todas as propriedades dos paralelogramos.',
          'A base média de um trapézio (o segmento que liga os pontos médios dos lados não paralelos) mede a média das duas bases: base média = (B + b)/2. Um trapézio é isósceles quando os lados não paralelos são iguais.',
        ],
        after: [
          'No trapézio isósceles, além dos lados não paralelos serem iguais, os ângulos da base maior são iguais entre si, e o mesmo vale para os ângulos da base menor — uma simetria que o trapézio escaleno não tem.',
          'Por exemplo, um trapézio com base maior 10cm e base menor 6cm tem base média = (10+6)/2 = 8cm. Com todos os quadriláteros notáveis mapeados, o módulo agora ensina a calcular a área de cada uma dessas figuras.',
        ],
        exerciseSetId: 'ex-quadrilateros-trapezios',
      },
    ],
  },
  {
    number: 7,
    title: 'Área de Figuras Planas',
    lessons: [
      {
        id: 'area-1',
        title: 'Área de triângulos e quadriláteros',
        description: 'As fórmulas de área das figuras mais comuns da geometria plana.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Quanto de grama é preciso para cobrir um terreno triangular? Quanto de piso para uma sala em forma de losango? Calcular área é transformar uma figura geométrica num único número que mede o quanto de espaço ela ocupa.',
          'A área do triângulo é (base × altura)/2. A área do paralelogramo (e do retângulo) é base × altura. A área do losango é (D × d)/2, onde D e d são as diagonais maior e menor. A área do trapézio é ((B + b) × h)/2.',
        ],
        after: [
          'Repare que a fórmula do triângulo é exatamente metade da do paralelogramo — faz sentido, já que dois triângulos congruentes formam um paralelogramo. Da mesma forma, a fórmula do trapézio usa a base média (já vista na lição anterior) multiplicada pela altura.',
          'Por exemplo, um triângulo com base 8cm e altura 5cm tem área (8×5)/2 = 20cm². Depois de dominar as figuras de poucos lados, a próxima lição generaliza a ideia de área para qualquer polígono regular.',
        ],
        exerciseSetId: 'ex-area-triangulos-quadrilateros',
      },
      {
        id: 'area-2',
        title: 'Área de polígonos regulares',
        description: 'Usando o apótema para calcular a área de qualquer polígono regular.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Um piso hexagonal, uma mesa octogonal — polígonos regulares com mais de quatro lados também têm uma fórmula de área única, que funciona para qualquer um deles, não importa o número de lados.',
          'A área de um polígono regular é dada por área = (perímetro × apótema)/2, onde o apótema é a distância do centro do polígono até o ponto médio de um dos lados (perpendicular a esse lado).',
        ],
        after: [
          'Essa fórmula vem de dividir o polígono regular em triângulos idênticos a partir do centro — cada triângulo tem como base um lado do polígono e como altura o apótema, e a soma das áreas desses triângulos dá a fórmula geral.',
          'Por exemplo, um hexágono regular de lado 4cm (perímetro 24cm) e apótema 2√3cm tem área = (24 × 2√3)/2 = 24√3 cm². Com áreas de polígonos dominadas, o módulo fecha o tema de "figuras de lados retos" e parte para a curva mais simétrica que existe: a circunferência.',
        ],
        exerciseSetId: 'ex-area-poligonos-regulares',
      },
    ],
  },
  {
    number: 8,
    title: 'Circunferência e Círculo',
    lessons: [
      {
        id: 'circulo-1',
        title: 'Elementos da circunferência e comprimento',
        description: 'A curva mais simétrica que existe, e como medir seu contorno.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'A roda de uma bicicleta, um prato de mesa — a circunferência é, entre todas as figuras geométricas, a mais simétrica de todas, sem nenhum vértice ou lado reto.',
          'A circunferência é a curva (a "borda"), enquanto o círculo é a região plana que ela delimita (o "interior"). O raio (r) é a distância do centro a qualquer ponto da curva; o diâmetro (2r) é o segmento que passa pelo centro ligando dois pontos opostos. O comprimento da circunferência é C = 2πr.',
        ],
        after: [
          'O número π (aproximadamente 3,14159) é a razão constante entre o comprimento de qualquer circunferência e seu diâmetro — não importa o tamanho do círculo, essa razão é sempre a mesma.',
          'Por exemplo, uma circunferência de raio 5cm tem comprimento C = 2π(5) = 10π ≈ 31,4cm. Depois de medir o contorno, a próxima lição mede o espaço interno: a área do círculo.',
        ],
        exerciseSetId: 'ex-circulo-elementos',
      },
      {
        id: 'circulo-2',
        title: 'Área do círculo e de setores circulares',
        description: 'Medindo o espaço interno de um círculo, e de "fatias" dele.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Uma fatia de pizza é, geometricamente, um setor circular — uma "fatia" do círculo delimitada por dois raios e um arco. Antes de medir a fatia, porém, vale medir o círculo inteiro.',
          'A área do círculo é área = πr². A área de um setor circular, que corresponde a um ângulo central θ (em graus), é uma fração proporcional da área total: área do setor = (θ/360°) × πr².',
        ],
        after: [
          'Essa proporcionalidade faz sentido: um setor de 360° é o círculo inteiro, um setor de 180° é meio círculo, e assim por diante — a fração do ângulo em relação a 360° é exatamente a fração da área.',
          'Por exemplo, um círculo de raio 6cm tem área π(6²) = 36π cm², e um setor de 90° desse mesmo círculo (um quarto do círculo) tem área (90/360) × 36π = 9π cm². Com círculos e setores dominados, a última unidade do módulo explora ângulos e segmentos especiais dentro da circunferência.',
        ],
        exerciseSetId: 'ex-circulo-area',
      },
    ],
  },
  {
    number: 9,
    title: 'Relações Métricas na Circunferência',
    lessons: [
      {
        id: 'metricascirculo-1',
        title: 'Ângulos na circunferência (central e inscrito)',
        description: 'Comparando um ângulo com vértice no centro e um ângulo com vértice na borda.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Aponte para o mesmo arco de duas formas diferentes: uma com o vértice no centro da circunferência, outra com o vértice na própria borda — os dois ângulos resultantes têm uma relação fixa entre si.',
          'Um ângulo central tem vértice no centro da circunferência, e sua medida é igual à medida do arco que ele determina. Um ângulo inscrito tem vértice sobre a própria circunferência, e sua medida é sempre a metade do arco que ele determina (metade do ângulo central correspondente).',
        ],
        after: [
          'Um caso especial importante: todo ângulo inscrito que enxerga um semicírculo (um arco de 180°) mede exatamente 90° — é sempre um ângulo reto, não importa onde o vértice esteja sobre a circunferência.',
          'Por exemplo, se um arco mede 80°, o ângulo central correspondente também mede 80°, e qualquer ângulo inscrito que enxergue esse mesmo arco mede 40° (metade). Com ângulos na circunferência resolvidos, a última lição do módulo cobre uma relação entre segmentos que se cruzam dentro e fora do círculo.',
        ],
        exerciseSetId: 'ex-metricascirculo-angulos',
      },
      {
        id: 'metricascirculo-2',
        title: 'Potência de um ponto em relação à circunferência',
        description: 'A relação fixa entre segmentos de cordas, secantes e tangentes.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'Duas cordas que se cruzam dentro de um círculo dividem-se em pedaços — e, por mais que a posição das cordas mude, o produto dos pedaços de uma sempre é igual ao produto dos pedaços da outra.',
          'Se duas cordas AB e CD se cruzam num ponto P dentro da circunferência, vale PA · PB = PC · PD. Se duas secantes partem de um ponto P externo à circunferência, vale a mesma lógica: o produto da secante inteira pela sua parte externa é igual para as duas retas.',
        ],
        after: [
          'Um caso especial dessa mesma ideia envolve uma reta tangente: se uma tangente e uma secante partem do mesmo ponto externo, o quadrado do segmento tangente é igual ao produto da secante inteira pela sua parte externa.',
          'Você chegou ao fim do módulo de Geometria Plana tendo conectado ângulos, triângulos, polígonos, áreas e a circunferência — e viu, na prática, como a semelhança de triângulos (Unidade 3) é o motor por trás de quase todas essas relações métricas, da altura do triângulo retângulo até a potência de um ponto que fecha o módulo.',
        ],
        exerciseSetId: 'ex-metricascirculo-potencia',
      },
    ],
  },
]

export const ALL_PLANA_LESSONS: LessonContent[] = PLANA_UNITS.flatMap((unit) => unit.lessons)

export const PLANA_LESSON_BY_ID: Record<string, LessonContent> = Object.fromEntries(
  ALL_PLANA_LESSONS.map((lesson) => [lesson.id, lesson]),
)
