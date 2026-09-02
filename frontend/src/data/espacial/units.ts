import type { LessonContent, UnitContent } from '../lessonTypes'

export const ESPACIAL_UNITS: UnitContent[] = [
  {
    number: 1,
    title: 'Introdução aos Sólidos',
    lessons: [
      {
        id: 'solidos-1',
        title: 'Poliedros: faces, arestas e vértices',
        description: 'Sólidos com faces planas — a base da geometria espacial.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Um dado, um cubo mágico, uma caixa de sapato — todos são exemplos de poliedros: sólidos geométricos cujas superfícies são inteiramente formadas por polígonos planos.',
          'Um poliedro tem três elementos principais: faces (os polígonos planos que formam a superfície), arestas (os segmentos onde duas faces se encontram) e vértices (os pontos onde três ou mais arestas se encontram).',
        ],
        after: [
          'Nem todo sólido é um poliedro — a esfera, o cilindro e o cone têm superfícies curvas, então não se encaixam nessa definição, mesmo sendo sólidos geométricos importantes (e temas de unidades mais à frente neste módulo).',
          'Por exemplo, um cubo tem 6 faces (todas quadradas), 12 arestas e 8 vértices. Esses três números — faces, arestas, vértices — não são independentes entre si: eles obedecem a uma relação fixa, que é o assunto da próxima lição.',
        ],
        exerciseSetId: 'ex-solidos-poliedros',
      },
      {
        id: 'solidos-2',
        title: 'A Relação de Euler (V − A + F = 2)',
        description: 'Uma fórmula que vale para qualquer poliedro convexo.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Conte os vértices, as arestas e as faces de qualquer poliedro convexo — um cubo, uma pirâmide, um prisma hexagonal — e uma combinação fixa desses três números sempre dá o mesmo resultado.',
          'A Relação de Euler afirma que, em todo poliedro convexo, V − A + F = 2, onde V é o número de vértices, A o número de arestas e F o número de faces.',
        ],
        after: [
          'Essa relação é extremamente útil para verificar se a contagem de elementos de um poliedro está correta, ou até para descobrir um elemento que falta, sabendo os outros dois.',
          'Por exemplo, no cubo: V=8, A=12, F=6, então 8 − 12 + 6 = 2 ✓. Com poliedros e a Relação de Euler estabelecidos, o módulo agora foca no primeiro sólido específico: o prisma.',
        ],
        exerciseSetId: 'ex-solidos-euler',
      },
    ],
  },
  {
    number: 2,
    title: 'Prismas',
    lessons: [
      {
        id: 'prismas-1',
        title: 'Elementos e classificação dos prismas',
        description: 'Duas bases paralelas e congruentes, ligadas por paralelogramos.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Uma caixa de sapato, um prisma de vidro que separa a luz em cores — o prisma é um dos sólidos mais comuns do dia a dia, com uma estrutura bem regular.',
          'Um prisma tem duas bases poligonais paralelas e congruentes, ligadas por faces laterais em forma de paralelogramo (retângulos, no caso do prisma reto). É classificado como reto (faces laterais perpendiculares às bases) ou oblíquo (inclinado), e nomeado pelo formato da base — prisma triangular, prisma hexagonal, etc.',
        ],
        after: [
          'Um prisma reto com base regular é chamado de prisma regular — todas as faces laterais são retângulos congruentes entre si.',
          'Por exemplo, um prisma de base quadrada e faces laterais retangulares (um "paralelepípedo reto-retângulo") é o formato de praticamente qualquer caixa comum. Com os elementos do prisma definidos, a próxima lição calcula sua área e seu volume.',
        ],
        exerciseSetId: 'ex-prismas-elementos',
      },
      {
        id: 'prismas-2',
        title: 'Área e volume do prisma',
        description: 'Quanto material forma a superfície, e quanto espaço cabe dentro.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Quanta água cabe numa caixa d\'água em forma de prisma? Quanto material é necessário para construir suas paredes? São duas perguntas diferentes — volume e área — e cada uma tem sua própria fórmula.',
          'O volume de qualquer prisma é volume = área da base × altura. A área total é a soma da área lateral (soma das faces laterais) com duas vezes a área da base (as duas bases, topo e fundo).',
        ],
        after: [
          'O paralelepípedo (todas as faces retangulares) e o cubo (todas as faces quadradas) são casos especiais de prisma, e suas fórmulas de volume seguem a mesma lógica: volume = comprimento × largura × altura para o paralelepípedo, e volume = aresta³ para o cubo.',
          'Por exemplo, um prisma com base de área 20cm² e altura 8cm tem volume = 20 × 8 = 160cm³. Com prismas dominados, o módulo agora explora um sólido parecido, mas que termina num único ponto: a pirâmide.',
        ],
        exerciseSetId: 'ex-prismas-area-volume',
      },
    ],
  },
  {
    number: 3,
    title: 'Pirâmides',
    lessons: [
      {
        id: 'piramides-1',
        title: 'Elementos da pirâmide',
        description: 'Uma base poligonal e um vértice comum a todas as faces laterais.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'As pirâmides do Egito são o exemplo mais famoso desse sólido: uma base poligonal, e faces laterais triangulares que se encontram num único ponto no topo.',
          'Uma pirâmide tem uma base poligonal e um vértice (ou ápice) comum a todas as faces laterais, que são sempre triângulos. A altura é a distância do vértice até o plano da base.',
        ],
        after: [
          'Uma pirâmide regular tem base regular e o vértice projetado exatamente sobre o centro da base — nesse caso, todas as faces laterais são triângulos isósceles congruentes entre si.',
          'Por exemplo, uma pirâmide de base quadrada (como as do Egito) tem 4 faces laterais triangulares e 1 base — 5 faces no total. Depois de conhecer os elementos, a próxima lição calcula a área e o volume da pirâmide.',
        ],
        exerciseSetId: 'ex-piramides-elementos',
      },
      {
        id: 'piramides-2',
        title: 'Área e volume da pirâmide',
        description: 'Por que o volume da pirâmide é sempre um terço do prisma correspondente.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'Um resultado surpreendente da geometria espacial: três pirâmides idênticas, encaixadas de jeito certo, formam exatamente um prisma de mesma base e mesma altura — daí vem a fórmula do volume da pirâmide.',
          'O volume de qualquer pirâmide é volume = (área da base × altura)/3 — exatamente um terço do volume do prisma de mesma base e altura. A área lateral é a soma das áreas das faces triangulares.',
        ],
        after: [
          'Essa divisão por 3 não é uma coincidência numérica — é uma propriedade geométrica real, demonstrável dividindo um prisma triangular em três pirâmides de mesmo volume.',
          'Por exemplo, uma pirâmide com base de área 30cm² e altura 9cm tem volume = (30 × 9)/3 = 90cm³ — um terço do volume do prisma equivalente (270cm³). Depois das figuras com faces planas, o módulo passa para o primeiro sólido de superfície curva: o cilindro.',
        ],
        exerciseSetId: 'ex-piramides-area-volume',
      },
    ],
  },
  {
    number: 4,
    title: 'Cilindro',
    lessons: [
      {
        id: 'cilindro-1',
        title: 'Elementos do cilindro',
        description: 'Duas bases circulares paralelas, ligadas por uma superfície curva.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Uma lata de refrigerante é, geometricamente, um cilindro — o primeiro sólido deste módulo cuja superfície lateral não é formada por polígonos, mas por uma curva contínua.',
          'Um cilindro tem duas bases circulares, paralelas e congruentes, ligadas por uma superfície lateral curva. O raio (r) é o raio das bases, a altura (h) é a distância entre elas, e a geratriz é o segmento que "gera" a superfície lateral ao girar.',
        ],
        after: [
          'Num cilindro reto, a geratriz é perpendicular às bases e tem o mesmo comprimento da altura (g = h); num cilindro oblíquo, a geratriz é inclinada e maior que a altura.',
          'Por exemplo, uma lata cilíndrica com raio 3cm e altura 10cm tem geratriz g = h = 10cm (é um cilindro reto). Com os elementos do cilindro definidos, a próxima lição calcula sua área e seu volume.',
        ],
        exerciseSetId: 'ex-cilindro-elementos',
      },
      {
        id: 'cilindro-2',
        title: 'Área e volume do cilindro',
        description: 'Quanto de metal forma a lata, e quanto líquido ela guarda.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Planifique uma lata cilíndrica (desenrole-a numa superfície plana) e você obtém um retângulo (a lateral) mais dois círculos (as bases) — é dessa planificação que vêm as fórmulas de área do cilindro.',
          'O volume do cilindro é volume = πr²h (a área da base circular vezes a altura, igual ao prisma). A área total é área = 2πr² + 2πrh, somando as duas bases circulares com a área lateral (o retângulo planificado).',
        ],
        after: [
          'A largura do retângulo lateral planificado é exatamente o comprimento da circunferência da base (2πr), e sua altura é h — por isso a área lateral é 2πr × h = 2πrh.',
          'Por exemplo, um cilindro com raio 2cm e altura 5cm tem volume = π(2²)(5) = 20π cm³, e área total = 2π(2²) + 2π(2)(5) = 8π + 20π = 28π cm². Com o cilindro dominado, a próxima unidade explora um sólido parecido, mas que termina num vértice: o cone.',
        ],
        exerciseSetId: 'ex-cilindro-area-volume',
      },
    ],
  },
  {
    number: 5,
    title: 'Cone',
    lessons: [
      {
        id: 'cone-1',
        title: 'Elementos do cone',
        description: 'Uma base circular e um vértice — como uma casquinha de sorvete.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Uma casquinha de sorvete, um chapéu de festa — o cone tem uma base circular e um vértice (ápice), unidos por uma superfície lateral curva que se estreita até um ponto.',
          'Um cone tem raio (r) da base, altura (h, a distância do vértice ao centro da base) e geratriz (g, a distância do vértice até qualquer ponto da borda da base). Num cone reto, esses três elementos se relacionam pelo Teorema de Pitágoras: g² = r² + h².',
        ],
        after: [
          'Essa relação g²=r²+h² é exatamente a mesma lógica do triângulo retângulo, do módulo de Geometria Plana — o raio e a altura são os catetos, e a geratriz é a hipotenusa de um triângulo retângulo formado dentro do cone.',
          'Por exemplo, um cone com raio 3cm e altura 4cm tem geratriz g = √(3²+4²) = √25 = 5cm. Com os elementos do cone definidos, a próxima lição calcula sua área e seu volume.',
        ],
        exerciseSetId: 'ex-cone-elementos',
      },
      {
        id: 'cone-2',
        title: 'Área e volume do cone',
        description: 'A mesma divisão por 3 vista nas pirâmides, agora com base circular.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'O cone é, na prática, uma "pirâmide de base circular" — e por isso segue exatamente a mesma lógica de volume que você já viu para pirâmides, só trocando a área da base por πr².',
          'O volume do cone é volume = (πr²h)/3 — um terço do cilindro de mesma base e altura, assim como a pirâmide é um terço do prisma correspondente. A área lateral é área lateral = πrg, e a área total é área total = πr² + πrg.',
        ],
        after: [
          'A fórmula da área lateral vem da planificação do cone: desenrolado, o cone lateral forma um setor circular de raio g (a geratriz) — e a área desse setor, calculada com as ferramentas do módulo de Geometria Plana, dá exatamente πrg.',
          'Por exemplo, um cone com raio 3cm, altura 4cm (geratriz 5cm) tem volume = π(3²)(4)/3 = 12π cm³, e área lateral = π(3)(5) = 15π cm². Depois de dominar prismas, pirâmides, cilindros e cones, a próxima unidade fecha os sólidos "clássicos" com o mais simétrico de todos: a esfera.',
        ],
        exerciseSetId: 'ex-cone-area-volume',
      },
    ],
  },
  {
    number: 6,
    title: 'Esfera',
    lessons: [
      {
        id: 'esfera-1',
        title: 'Elementos da esfera',
        description: 'Todos os pontos a uma mesma distância de um centro — em três dimensões.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Uma bola de futebol, o planeta Terra (aproximadamente) — a esfera é a versão tridimensional da circunferência, e é o sólido mais simétrico que existe.',
          'A esfera é o conjunto de todos os pontos do espaço que ficam a uma mesma distância r (o raio) de um ponto central. O diâmetro é o dobro do raio, e um grande círculo é a seção obtida cortando a esfera exatamente pelo centro.',
        ],
        after: [
          'Qualquer corte plano que passe pelo centro da esfera produz um círculo de raio igual ao da própria esfera (o grande círculo) — é a maior seção circular possível dentro dela.',
          'Por exemplo, uma esfera de raio 6cm tem qualquer grande círculo com raio também 6cm e área π(6²) = 36π cm². Com os elementos da esfera definidos, a próxima lição calcula sua área e seu volume.',
        ],
        exerciseSetId: 'ex-esfera-elementos',
      },
      {
        id: 'esfera-2',
        title: 'Área e volume da esfera',
        description: 'Quanta tinta pinta a superfície, e quanto ar cabe dentro de uma bola.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Diferente dos outros sólidos deste módulo, a esfera não pode ser "desenrolada" numa superfície plana sem distorção — por isso suas fórmulas de área e volume não vêm de uma planificação simples, mas foram descobertas há mais de 2000 anos por Arquimedes.',
          'A área da superfície esférica é área = 4πr². O volume da esfera é volume = (4/3)πr³.',
        ],
        after: [
          'Arquimedes considerava a descoberta da relação entre esfera e cilindro circunscrito (o volume da esfera é exatamente 2/3 do volume do menor cilindro que a contém) uma de suas maiores conquistas — pediu, inclusive, que essa relação fosse gravada em seu túmulo.',
          'Por exemplo, uma esfera de raio 3cm tem área = 4π(3²) = 36π cm² e volume = (4/3)π(3³) = 36π cm³. Com todos os sólidos "puros" cobertos, o módulo agora explora o que acontece quando um desses sólidos é cortado ao meio: os troncos.',
        ],
        exerciseSetId: 'ex-esfera-area-volume',
      },
    ],
  },
  {
    number: 7,
    title: 'Troncos',
    lessons: [
      {
        id: 'troncos-1',
        title: 'Tronco de pirâmide',
        description: 'O que sobra quando se corta uma pirâmide paralelamente à base.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Corte uma pirâmide com um plano paralelo à base, e descarte a parte de cima (a pirâmide menor) — o que sobra é um tronco de pirâmide, com duas bases paralelas de tamanhos diferentes.',
          'Um tronco de pirâmide tem duas bases poligonais paralelas e semelhantes (a base maior, original, e a base menor, do corte), unidas por faces laterais trapezoidais.',
        ],
        after: [
          'O volume do tronco é calculado por subtração: volume do tronco = volume da pirâmide grande (original) − volume da pirâmide pequena (removida no corte).',
          'Por exemplo, se uma pirâmide original tem volume 270cm³ e a pirâmide menor removida no corte tem volume 30cm³, o tronco resultante tem volume 270 − 30 = 240cm³. A mesma ideia de "cortar e subtrair" se aplica a um sólido de base circular — o assunto da próxima lição.',
        ],
        exerciseSetId: 'ex-troncos-piramide',
      },
      {
        id: 'troncos-2',
        title: 'Tronco de cone',
        description: 'Um balde, uma taça — a versão circular do tronco de pirâmide.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Um balde comum, uma taça de champanhe — esses objetos têm o formato de um tronco de cone: duas bases circulares de raios diferentes (R, a maior, e r, a menor), ligadas por uma superfície lateral curva.',
          'Assim como o tronco de pirâmide, o tronco de cone pode ser obtido cortando um cone maior com um plano paralelo à base e descartando a parte de cima (o cone menor).',
        ],
        after: [
          'O volume do tronco de cone também pode ser calculado por subtração (cone maior menos cone menor removido), ou por uma fórmula direta envolvendo os dois raios R e r e a altura h do tronco.',
          'Por exemplo, um balde com raio maior R=10cm, raio menor r=6cm, obtido de um cone completo, tem seu volume calculado subtraindo o volume do "cone fantasma" que foi cortado fora. Com prismas, pirâmides, cilindros, cones e seus troncos mapeados, a próxima unidade explora como sólidos se encaixam uns dentro dos outros.',
        ],
        exerciseSetId: 'ex-troncos-cone',
      },
    ],
  },
  {
    number: 8,
    title: 'Inscrição e Circunscrição de Sólidos',
    lessons: [
      {
        id: 'inscricao-1',
        title: 'Sólidos inscritos em outros sólidos',
        description: 'Quando um sólido cabe perfeitamente dentro de outro.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Imagine uma bola de gude perfeitamente encaixada dentro de uma caixa cúbica, tocando exatamente as seis faces internas — essa é a ideia de um sólido inscrito em outro.',
          'Um sólido está inscrito em outro quando está totalmente contido dentro dele, tocando suas faces (ou vértices, dependendo do caso) sem ultrapassar os limites do sólido maior.',
        ],
        after: [
          'Um caso clássico: uma esfera inscrita num cubo de aresta a toca as seis faces do cubo exatamente no meio de cada uma, e seu raio é sempre metade da aresta do cubo: r = a/2.',
          'Por exemplo, um cubo de aresta 8cm tem uma esfera inscrita de raio 4cm. Nem sempre o sólido menor está por dentro, tocando faces, porém — às vezes é o sólido maior (geralmente uma esfera) que envolve o menor, tocando seus vértices, o assunto da próxima lição.',
        ],
        exerciseSetId: 'ex-inscricao-solidos',
      },
      {
        id: 'inscricao-2',
        title: 'Sólidos inscritos em esferas',
        description: 'Quando a esfera envolve outro sólido, tocando todos os seus vértices.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'Agora inverta a ideia da lição anterior: em vez de uma esfera cabendo dentro de um sólido, imagine um sólido cabendo dentro de uma esfera, com todos os seus vértices tocando a superfície esférica.',
          'Quando um poliedro está inscrito numa esfera, essa esfera é chamada de esfera circunscrita ao poliedro, e passa exatamente por todos os vértices dele.',
        ],
        after: [
          'Um caso clássico: um cubo de aresta a inscrito numa esfera tem sua diagonal principal (a diagonal que vai de um vértice ao vértice oposto, passando pelo centro do cubo) exatamente igual ao diâmetro da esfera: diagonal = a√3.',
          'Por exemplo, um cubo de aresta 4cm inscrito numa esfera tem diagonal = 4√3cm, então a esfera circunscrita tem raio = 4√3/2 = 2√3cm. Com sólidos inscritos e circunscritos dominados, o módulo fecha com problemas que combinam tudo que você aprendeu.',
        ],
        exerciseSetId: 'ex-inscricao-esferas',
      },
    ],
  },
  {
    number: 9,
    title: 'Aplicações e Problemas',
    lessons: [
      {
        id: 'aplicacoes-1',
        title: 'Problemas combinando sólidos',
        description: 'A maioria dos objetos reais não é um único sólido "puro".',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Um silo de grãos é um cilindro com um cone no topo. Um lápis novo é um cilindro com um cone na ponta. A maioria dos objetos do dia a dia é, na verdade, uma combinação de sólidos simples, não um único sólido "puro".',
          'A estratégia para resolver problemas com figuras compostas é sempre a mesma: decompor a figura nos sólidos simples que a formam, calcular a grandeza desejada (volume ou área) de cada parte separadamente, e depois somar ou subtrair, dependendo se as partes se encaixam ou se uma foi removida da outra.',
        ],
        after: [
          'Somar aparece quando as partes se juntam (como o cilindro e o cone do silo); subtrair aparece quando uma parte foi removida de dentro de outra (como um cilindro oco, que é um cilindro maior menos um cilindro menor interno).',
          'Por exemplo, um silo formado por um cilindro de volume 500m³ e um cone de topo com volume 60m³ tem volume total 500 + 60 = 560m³. Com a estratégia de decomposição dominada, a última lição do módulo mostra aplicações reais dessa ideia.',
        ],
        exerciseSetId: 'ex-aplicacoes-combinando',
      },
      {
        id: 'aplicacoes-2',
        title: 'Aplicações práticas de geometria espacial',
        description: 'Arquitetura, engenharia e embalagens — geometria espacial no mundo real.',
        tags: ['Exercício'],
        duration: 10,
        intro: [
          'Arquitetos calculam o volume de um edifício, engenheiros dimensionam reservatórios, empresas de embalagem otimizam caixas para gastar menos material — a geometria espacial resolve problemas reais de capacidade, quantidade de material e custo.',
          'Um problema clássico de otimização: entre uma embalagem cilíndrica e uma prismática de mesmo volume, qual usa menos material (menor área total)? Resolver isso exige calcular e comparar a área total das duas formas para o mesmo volume fixado.',
        ],
        after: [
          'Esse tipo de comparação é exatamente o que empresas de bebidas e alimentos fazem na prática: encontrar as dimensões que minimizam a área de superfície (e portanto o material gasto) para um volume desejado — um problema real de geometria espacial aplicada.',
          'Você chegou ao fim do módulo de Geometria Espacial tendo visto os cinco sólidos fundamentais (prisma, pirâmide, cilindro, cone, esfera), a relação de 1/3 que conecta pirâmides/cones aos seus prismas/cilindros correspondentes, troncos, inscrição/circunscrição, e como decompor objetos reais em sólidos conhecidos para resolver problemas de volume e área do dia a dia.',
        ],
        exerciseSetId: 'ex-aplicacoes-praticas',
      },
    ],
  },
]

export const ALL_ESPACIAL_LESSONS: LessonContent[] = ESPACIAL_UNITS.flatMap((unit) => unit.lessons)

export const ESPACIAL_LESSON_BY_ID: Record<string, LessonContent> = Object.fromEntries(
  ALL_ESPACIAL_LESSONS.map((lesson) => [lesson.id, lesson]),
)
