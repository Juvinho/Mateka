import type { LessonContent, UnitContent } from '../lessonTypes'

export const PRECALCULO_UNITS: UnitContent[] = [
  {
    number: 1,
    title: 'Introdução às Funções',
    lessons: [
      {
        id: 'intro-funcoes-1',
        title: 'O que é uma função?',
        description: 'Relação entre conjuntos, domínio, imagem e a notação f(x).',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Você já reparou que o preço de uma corrida de aplicativo depende da distância percorrida? Ou que a área de um quadrado depende do tamanho do seu lado? Essas relações — onde um valor determina o outro — são o que a matemática chama de função, e vão aparecer o tempo todo a partir daqui.',
          'Uma função é uma regra que associa cada elemento de um conjunto (o domínio) a exatamente um elemento de outro conjunto (o contradomínio). Escrevemos f(x) para representar "o valor que a função f produz quando recebe x" — se f(x) = x + 3, então f(2) = 5.',
        ],
        after: [
          'O domínio de uma função é o conjunto de todos os valores de entrada (x) para os quais ela está definida. A imagem é o conjunto de todos os valores de saída que a função realmente produz — nem sempre é igual ao contradomínio inteiro.',
          'Por exemplo, se f(x) = x², o domínio pode ser todo o ℝ, mas a imagem é só os números maiores ou iguais a zero, já que nenhum número ao quadrado é negativo. Nas próximas lições você vai calcular domínio e imagem de vários tipos de função — e, mais adiante, vai ver que toda função exponencial e logarítmica também segue essa mesma lógica de domínio restrito.',
        ],
        exerciseSetId: 'ex-intro-funcoes-fundamentos',
      },
      {
        id: 'intro-funcoes-2',
        title: 'Domínio e imagem na prática',
        description: 'Calculando o domínio de funções racionais e radicais.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Nem toda expressão matemática aceita qualquer número real como entrada — divisão por zero e raiz quadrada de número negativo são as duas armadilhas mais comuns, e saber evitá-las é a habilidade central desta lição.',
          'Para funções racionais (com uma fração), o domínio exclui qualquer valor de x que zere o denominador. Para funções com raiz de índice par (como a raiz quadrada), o domínio exige que o radicando seja maior ou igual a zero.',
        ],
        after: [
          'Um jeito prático de resolver: primeiro identifique o que pode "quebrar" a função (denominador zero, radicando negativo), depois escreva essas condições como inequações e resolva. O domínio é tudo que sobra depois de excluir os valores proibidos.',
          'Por exemplo, em f(x) = 1/(x−3), o domínio é ℝ − {3}. Já em g(x) = √(x−2), precisamos de x−2 ≥ 0, ou seja, domínio = [2, +∞). Essa mesma lógica de "o que está sob a raiz não pode ser negativo" vai reaparecer quando você estudar a função modular, mais à frente.',
        ],
        exerciseSetId: 'ex-intro-funcoes-dominio',
      },
    ],
  },
  {
    number: 2,
    title: 'Função Afim',
    lessons: [
      {
        id: 'afim-1',
        title: 'Função afim: definição e gráfico',
        description: 'A função do tipo f(x) = ax + b e sua reta no plano cartesiano.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'A função afim é provavelmente a mais comum do dia a dia: conta de táxi com bandeirada fixa mais valor por km, salário fixo mais comissão por venda — toda relação "um valor fixo + uma taxa vezes a quantidade" é uma função afim.',
          'Uma função afim tem a forma f(x) = ax + b, onde a e b são números reais fixos (constantes). O gráfico de qualquer função afim é sempre uma reta — por isso ela também é chamada de função do 1º grau ou função linear (quando b = 0).',
        ],
        after: [
          'A constante b é o coeficiente linear: é o valor de f(0), ou seja, onde a reta cruza o eixo y. A constante a é o coeficiente angular: determina a inclinação da reta.',
          'Por exemplo, em f(x) = 2x + 3, a reta cruza o eixo y em (0, 3) e "sobe" 2 unidades pra cada 1 unidade que x aumenta. Entender o papel de a é o assunto da próxima lição — ele é a chave pra prever o comportamento da reta sem precisar desenhar o gráfico inteiro.',
        ],
        exerciseSetId: 'ex-afim-definicao',
      },
      {
        id: 'afim-2',
        title: 'Taxa de variação e aplicações',
        description: 'O que o coeficiente angular representa e como usá-lo em problemas reais.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'O coeficiente angular a de uma função afim não é só "a inclinação da reta" — ele representa a taxa de variação: o quanto f(x) muda pra cada unidade que x aumenta. Se a &gt; 0, a função é crescente; se a &lt; 0, é decrescente; se a = 0, é constante.',
          'Essa taxa de variação é constante em toda função afim — diferente de outras funções, onde a "velocidade de crescimento" muda ponto a ponto. É por isso que basta conhecer dois pontos de uma reta pra descobrir a função inteira.',
        ],
        after: [
          'Dado dois pontos (x₁, y₁) e (x₂, y₂) de uma reta, o coeficiente angular é a = (y₂ − y₁) / (x₂ − x₁). Com a em mãos, basta substituir um dos pontos em y = ax + b pra encontrar b.',
          'Exemplo: uma corrida de táxi custa R$ 8 pra 2 km e R$ 14 pra 5 km. A taxa é a = (14 − 8)/(5 − 2) = 2 reais por km, e substituindo (2, 8): 8 = 2·2 + b, então b = 4 (a bandeirada). A função é C(x) = 2x + 4. Esse mesmo raciocínio de "taxa constante" vai aparecer de novo, com um significado bem diferente, quando você chegar em progressões aritméticas.',
        ],
        exerciseSetId: 'ex-afim-taxa-variacao',
      },
    ],
  },
  {
    number: 3,
    title: 'Função Quadrática',
    lessons: [
      {
        id: 'quadratica-1',
        title: 'A parábola: forma e vértice',
        description: 'A função f(x) = ax² + bx + c e o formato de parábola do seu gráfico.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'A trajetória de uma bola chutada pro alto, o formato de uma antena parabólica, a receita de uma empresa em função do preço cobrado — todas essas situações têm um comportamento em comum: crescem, atingem um pico (ou vale), e depois invertem. Esse é o comportamento de uma função quadrática.',
          'Uma função quadrática tem a forma f(x) = ax² + bx + c, com a ≠ 0. Seu gráfico é sempre uma parábola: com concavidade voltada para cima se a &gt; 0 (tem um ponto mínimo), ou para baixo se a &lt; 0 (tem um ponto máximo).',
        ],
        after: [
          'O ponto mais alto ou mais baixo da parábola é o vértice, com coordenadas xᵥ = −b/(2a) e yᵥ = −Δ/(4a), onde Δ = b² − 4ac (o mesmo Δ da fórmula de Bhaskara, que você vai usar na próxima lição).',
          'Por exemplo, em f(x) = x² − 4x + 3, temos a = 1, b = −4, c = 3, então xᵥ = −(−4)/(2·1) = 2 e yᵥ = f(2) = 4 − 8 + 3 = −1 — o vértice é (2, −1), o ponto mais baixo dessa parábola (já que a &gt; 0).',
        ],
        exerciseSetId: 'ex-quadratica-vertice',
      },
      {
        id: 'quadratica-2',
        title: 'Raízes e o discriminante',
        description: 'Fórmula de Bhaskara e o que o valor de Δ revela sobre a parábola.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'As raízes de uma função quadrática são os valores de x onde f(x) = 0 — ou seja, onde a parábola cruza o eixo x. Encontrar essas raízes é uma das tarefas mais frequentes envolvendo funções quadráticas, e existe uma fórmula pronta pra isso.',
          'A fórmula de Bhaskara diz que x = (−b ± √Δ) / (2a), onde Δ = b² − 4ac é o discriminante. O valor de Δ, sozinho, já revela quantas raízes reais a função tem, antes mesmo de calculá-las.',
        ],
        after: [
          'Se Δ &gt; 0, a função tem duas raízes reais distintas (a parábola cruza o eixo x em dois pontos). Se Δ = 0, tem uma raiz real (a parábola só toca o eixo x no vértice). Se Δ &lt; 0, não tem raiz real (a parábola nunca cruza o eixo x).',
          'Em f(x) = x² − 4x + 3, temos Δ = (−4)² − 4·1·3 = 16 − 12 = 4, então x = (4 ± 2)/2, dando as raízes x = 3 e x = 1. Guarde bem essa ideia de "o sinal de um número revela quantas soluções existem sem precisar resolver tudo" — ela vai reaparecer, com outra cara, quando você estudar convergência de progressões geométricas.',
        ],
        exerciseSetId: 'ex-quadratica-raizes',
      },
    ],
  },
  {
    number: 4,
    title: 'Função Modular',
    lessons: [
      {
        id: 'modular-1',
        title: 'O que é módulo?',
        description: 'A distância até a origem e a função f(x) = |x|.',
        tags: ['Exercício'],
        duration: 7,
        intro: [
          'Distância nunca é negativa — a distância entre sua casa e o trabalho é a mesma indo ou voltando. É essa ideia que o módulo (ou valor absoluto) captura: o módulo de um número é a sua distância até o zero, sempre um valor não-negativo.',
          'O módulo de x é escrito |x|, e é definido por partes: |x| = x se x ≥ 0, e |x| = −x se x &lt; 0. Assim, |5| = 5 e |−5| = 5 — os dois "moram" à mesma distância de zero.',
        ],
        after: [
          'A função modular f(x) = |x| tem domínio todo o ℝ (qualquer número tem uma distância até zero) e imagem [0, +∞) (a distância nunca é negativa). Seu gráfico tem formato de "V", com o vértice na origem.',
          'Funções modulares mais complexas, como f(x) = |x − 2| + 1, deslocam esse "V": aqui, o vértice vai para o ponto (2, 1). Reconhecer esse deslocamento facilita bastante resolver as equações e inequações modulares da próxima lição.',
        ],
        exerciseSetId: 'ex-modular-definicao',
      },
      {
        id: 'modular-2',
        title: 'Equações e inequações modulares',
        description: 'Como resolver |x| = a e |x| &lt; a separando em casos.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Resolver uma equação ou inequação com módulo significa "desmontar" o valor absoluto em casos, usando a definição por partes da lição anterior. É um processo mecânico, desde que você siga as regras certas para cada situação.',
          'Para equações: |x| = a (com a ≥ 0) equivale a x = a ou x = −a. Para inequações: |x| &lt; a (com a &gt; 0) equivale a −a &lt; x &lt; a, enquanto |x| &gt; a equivale a x &lt; −a ou x &gt; a.',
        ],
        after: [
          'Quando o módulo envolve uma expressão, como |x − 3| = 5, aplicamos a mesma regra à expressão inteira: x − 3 = 5 ou x − 3 = −5, dando x = 8 ou x = −2.',
          'Já |2x + 1| ≤ 7 vira −7 ≤ 2x + 1 ≤ 7, que resolvida dá −4 ≤ x ≤ 3. Vale sempre verificar se a ≥ 0 antes de aplicar essas regras — se a &lt; 0, a equação |x| = a não tem solução, já que módulo nunca é negativo. Essa atenção ao domínio de validade é a mesma que você vai precisar ao estudar função composta, na próxima unidade.',
        ],
        exerciseSetId: 'ex-modular-equacoes',
      },
    ],
  },
  {
    number: 5,
    title: 'Composição e Inversa',
    lessons: [
      {
        id: 'composta-inversa-1',
        title: 'Função composta',
        description: 'Aplicar uma função sobre o resultado de outra: (f∘g)(x).',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Imagine calcular o desconto de uma compra e, sobre o valor com desconto, ainda aplicar o imposto — você está aplicando uma função (o imposto) sobre o resultado de outra (o desconto). Isso é composição de funções: encadear duas funções, usando a saída de uma como entrada da outra.',
          'A composta de f com g é escrita (f∘g)(x), e significa f(g(x)) — primeiro calcula g(x), depois aplica f nesse resultado. Repare que a ordem importa: (f∘g)(x) geralmente é diferente de (g∘f)(x).',
        ],
        after: [
          'Para calcular (f∘g)(x), substitua toda ocorrência de x na fórmula de f pela fórmula inteira de g(x), e simplifique.',
          'Exemplo: se f(x) = x² e g(x) = x + 1, então (f∘g)(x) = f(g(x)) = f(x+1) = (x+1)² = x² + 2x + 1. Já (g∘f)(x) = g(x²) = x² + 1 — resultado diferente, confirmando que a ordem realmente importa. O domínio de f∘g também merece atenção: só entram nele os valores de x que estão no domínio de g e cujo g(x) esteja no domínio de f.',
        ],
        exerciseSetId: 'ex-composta-calculo',
      },
      {
        id: 'composta-inversa-2',
        title: 'Função inversa',
        description: 'Desfazer o efeito de uma função com f⁻¹(x).',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Se uma função converte Celsius em Fahrenheit, a função inversa converte Fahrenheit de volta em Celsius — ela "desfaz" o que a função original fez. Nem toda função tem inversa, mas quando tem, ela é uma ferramenta poderosa.',
          'A função inversa de f, escrita f⁻¹, é a função que satisfaz f⁻¹(f(x)) = x para todo x no domínio de f. Uma função só tem inversa se for bijetora (cada saída vem de uma única entrada) — por isso, por exemplo, f(x) = x² não tem inversa em todo o ℝ (tanto x = 2 quanto x = −2 dão f(x) = 4).',
        ],
        after: [
          'Para encontrar f⁻¹ algebricamente: escreva y = f(x), troque x por y e y por x (invertendo os papéis), e isole o novo y.',
          'Exemplo: para f(x) = 2x + 3, escrevemos y = 2x + 3, trocamos: x = 2y + 3, isolamos: y = (x − 3)/2. Logo f⁻¹(x) = (x − 3)/2. Guarde essa técnica de "trocar x por y e isolar" — é exatamente o que você vai usar para chegar na definição de logaritmo, na próxima unidade: o logaritmo nada mais é do que a função inversa da exponencial.',
        ],
        exerciseSetId: 'ex-composta-inversa',
      },
    ],
  },
  {
    number: 6,
    title: 'Função Exponencial',
    lessons: [
      {
        id: 'exponencial-1',
        title: 'Potências e a função exponencial',
        description: 'A função f(x) = aˣ e por que ela cresce de um jeito tão diferente.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Juros compostos, crescimento de uma cultura de bactérias, meia-vida de um material radioativo — todos esses fenômenos têm algo em comum: a variável está no expoente, não na base. É essa a marca registrada da função exponencial.',
          'Uma função exponencial tem a forma f(x) = aˣ, com a &gt; 0 e a ≠ 1 (a chamada base). Diferente da função afim, aqui x pode ser qualquer número real — inclusive fracionário ou negativo — e o domínio é sempre todo o ℝ.',
        ],
        after: [
          'A imagem de f(x) = aˣ é sempre (0, +∞): potência de base positiva nunca dá zero nem negativo, não importa o expoente. O gráfico nunca toca o eixo x — ele se aproxima cada vez mais de y = 0 sem nunca alcançar (uma assíntota horizontal).',
          'Por exemplo, f(x) = 2ˣ dá f(0) = 1, f(1) = 2, f(2) = 4, f(3) = 8 — repare que cada aumento de 1 unidade em x multiplica o resultado por 2, ao invés de somar um valor fixo (como aconteceria numa função afim). Esse crescimento "por multiplicação" é o que vamos explorar melhor na próxima lição.',
        ],
        exerciseSetId: 'ex-exponencial-definicao',
      },
      {
        id: 'exponencial-2',
        title: 'Crescimento e decaimento exponencial',
        description: 'O papel da base a: quando a função cresce e quando decai.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Nem toda função exponencial cresce — algumas decaem, se aproximando de zero cada vez mais devagar. A diferença toda está no valor da base a, e saber ler esse valor te diz o comportamento da função sem precisar calcular ponto por ponto.',
          'Se a &gt; 1, a função f(x) = aˣ é crescente (quanto maior x, maior f(x)). Se 0 &lt; a &lt; 1, a função é decrescente — é o chamado decaimento exponencial, como na meia-vida de um material radioativo ou na depreciação de um carro.',
        ],
        after: [
          'Um exemplo clássico de decaimento: se um carro de R$ 40.000 perde 15% do valor a cada ano, seu valor depois de x anos é V(x) = 40000 · (0,85)ˣ — aqui a base é 0,85, que está entre 0 e 1, então V decresce com o tempo.',
          'Já um investimento de R$ 1.000 rendendo 10% ao ano compostos segue M(x) = 1000 · (1,10)ˣ, com base 1,10 &gt; 1, então M cresce. Em ambos os casos, o valor nunca chega a zero (só se aproxima) e nunca fica negativo — é a mesma imagem (0, +∞) da lição anterior. Essa relação entre expoente e resultado tem uma operação inversa, que é exatamente o assunto da próxima unidade: o logaritmo.',
        ],
        exerciseSetId: 'ex-exponencial-crescimento',
      },
    ],
  },
  {
    number: 7,
    title: 'Logaritmos',
    lessons: [
      {
        id: 'log-1',
        title: 'O que é logaritmo?',
        description: 'A pergunta "por qual expoente elevar a base pra chegar nesse valor?"',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Se 2ˣ = 8, qual é o valor de x? Você provavelmente já sabe responder de cabeça: x = 3. Mas e se a pergunta fosse 2ˣ = 100? Não existe um inteiro que resolva isso exatamente — é pra responder perguntas desse tipo que o logaritmo existe.',
          'O logaritmo de b na base a, escrito logₐ(b), é a resposta à pergunta "a que expoente eu elevo a para chegar em b?". Formalmente: logₐ(b) = x se, e somente se, aˣ = b (com a &gt; 0, a ≠ 1, b &gt; 0).',
        ],
        after: [
          'Repare que o logaritmo é literalmente a função inversa da exponencial da mesma base — se f(x) = aˣ, então f⁻¹(x) = logₐ(x), exatamente a ideia de função inversa que você estudou algumas unidades atrás.',
          'Por isso, o domínio do logaritmo (só aceita b &gt; 0) é a imagem da exponencial, e a imagem do logaritmo (todo o ℝ) é o domínio da exponencial — os papéis literalmente se invertem. Exemplo: log₂(8) = 3, porque 2³ = 8. E log₁₀(100) = 2, porque 10² = 100 (esse logaritmo de base 10 é tão comum que costuma ser escrito só como "log", sem indicar a base).',
        ],
        exerciseSetId: 'ex-log-definicao',
      },
      {
        id: 'log-2',
        title: 'Propriedades e equações logarítmicas',
        description: 'As regras que transformam produto em soma, divisão em subtração e potência em multiplicação.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'A grande utilidade prática do logaritmo está nas suas propriedades: elas transformam operações complicadas (multiplicação, divisão, potenciação) em operações mais simples (soma, subtração, multiplicação por um número).',
          'As três propriedades fundamentais são: logₐ(b·c) = logₐ(b) + logₐ(c) (log do produto vira soma), logₐ(b/c) = logₐ(b) − logₐ(c) (log do quociente vira subtração), e logₐ(bⁿ) = n·logₐ(b) (log da potência vira multiplicação pelo expoente).',
        ],
        after: [
          'Essas propriedades são a base pra resolver equações logarítmicas — o objetivo geralmente é reduzir a equação até ter um único logaritmo de cada lado, ou até "cancelar" os logaritmos aplicando a definição.',
          'Exemplo: resolver log₂(x) + log₂(3) = log₂(24). Pela propriedade do produto, o lado esquerdo vira log₂(3x), então log₂(3x) = log₂(24), o que dá 3x = 24, logo x = 8. Sempre vale checar a solução no domínio original (x &gt; 0 aqui) — assim como você fez ao estudar domínio de funções racionais e radicais, lá na primeira unidade.',
        ],
        exerciseSetId: 'ex-log-propriedades',
      },
    ],
  },
  {
    number: 8,
    title: 'Progressão Aritmética',
    lessons: [
      {
        id: 'pa-1',
        title: 'O que é uma PA e seu termo geral',
        description: 'Sequências com razão constante e a fórmula para encontrar qualquer termo.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Os assentos numerados de um cinema, os degraus de uma escada, o saldo de uma poupança que recebe o mesmo valor fixo todo mês — sequências onde cada termo aumenta (ou diminui) sempre a mesma quantidade em relação ao anterior são progressões aritméticas.',
          'Uma progressão aritmética (PA) é uma sequência de números em que a diferença entre um termo e o anterior é sempre a mesma, chamada razão (r). Se a₁ é o primeiro termo, então a₂ = a₁ + r, a₃ = a₂ + r, e assim por diante.',
        ],
        after: [
          'Em vez de somar r repetidamente até chegar no termo desejado, existe uma fórmula direta: o termo geral da PA é aₙ = a₁ + (n − 1)·r, onde n é a posição do termo na sequência.',
          'Por exemplo, na PA (3, 7, 11, 15, ...), temos a₁ = 3 e r = 4. O 10º termo é a₁₀ = 3 + (10 − 1)·4 = 3 + 36 = 39. Essa ideia de "razão constante" é, de certa forma, a versão discreta da taxa de variação constante que você viu na função afim — não é coincidência que o gráfico dos termos de uma PA, marcados em pontos, forme uma reta.',
        ],
        exerciseSetId: 'ex-pa-termo-geral',
      },
      {
        id: 'pa-2',
        title: 'Soma dos termos de uma PA',
        description: 'A fórmula de Gauss para somar os n primeiros termos sem somar um por um.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Conta a lenda que o matemático Gauss, ainda criança, somou instantaneamente todos os números de 1 a 100 quando seu professor pediu isso como castigo. O truque dele é exatamente a fórmula que você vai aprender aqui.',
          'A soma dos n primeiros termos de uma PA é dada por Sₙ = n·(a₁ + aₙ)/2 — ou seja, "quantidade de termos" vezes "a média entre o primeiro e o último", já que numa PA os termos crescem de forma simétrica ao redor dessa média.',
        ],
        after: [
          'Pra usar essa fórmula você só precisa saber três coisas: o primeiro termo a₁, o último termo aₙ que está somando, e quantos termos n existem — o último costuma vir do termo geral da lição anterior.',
          'Voltando ao truque de Gauss: somar 1 + 2 + ... + 100 é uma PA com a₁ = 1, a₁₀₀ = 100 e n = 100 termos, então S₁₀₀ = 100·(1 + 100)/2 = 100·50,5 = 5050. Essa lógica de somar termos de uma sequência vai reaparecer, com uma reviravolta interessante, quando a razão deixar de ser somada e passar a ser multiplicada — é aí que entra a progressão geométrica, o assunto da próxima unidade.',
        ],
        exerciseSetId: 'ex-pa-soma',
      },
    ],
  },
  {
    number: 9,
    title: 'Progressão Geométrica',
    lessons: [
      {
        id: 'pg-1',
        title: 'O que é uma PG e seu termo geral',
        description: 'Sequências com razão multiplicada e a fórmula para encontrar qualquer termo.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'A quantidade de bactérias que dobra a cada hora, os quiques de uma bola perdendo sempre uma fração da altura anterior, o valor de um investimento a juros compostos — nessas sequências, cada termo não soma, mas multiplica o anterior por um valor fixo.',
          'Uma progressão geométrica (PG) é uma sequência em que cada termo é obtido multiplicando o anterior por um valor constante, chamado razão (q). Se a₁ é o primeiro termo, então a₂ = a₁·q, a₃ = a₂·q, e assim por diante.',
        ],
        after: [
          'O termo geral da PG é aₙ = a₁ · qⁿ⁻¹ — repare no paralelo com a PA: lá era "somar r, (n−1) vezes"; aqui é "multiplicar por q, (n−1) vezes".',
          'Por exemplo, na PG (2, 6, 18, 54, ...), temos a₁ = 2 e q = 3. O 6º termo é a₆ = 2 · 3⁵ = 2 · 243 = 486. Assim como a PA lembra a função afim (crescimento por soma constante), a PG lembra a função exponencial (crescimento por multiplicação constante) — não é acaso que ambas usam potência na fórmula.',
        ],
        exerciseSetId: 'ex-pg-termo-geral',
      },
      {
        id: 'pg-2',
        title: 'Soma de uma PG finita',
        description: 'A fórmula para somar os n primeiros termos de uma progressão geométrica.',
        tags: ['Exercício'],
        duration: 8,
        intro: [
          'Diferente da PA, não dá pra usar "média entre o primeiro e o último" pra somar uma PG — o crescimento não é simétrico, já que os termos multiplicam em vez de somar. Por isso a PG precisa da sua própria fórmula de soma.',
          'A soma dos n primeiros termos de uma PG (com q ≠ 1) é Sₙ = a₁·(qⁿ − 1)/(q − 1). Essa fórmula funciona tanto pra razões maiores que 1 (crescimento) quanto pra razões entre 0 e 1 (decaimento).',
        ],
        after: [
          'É uma fórmula que aparece bastante fora da sala de aula — por exemplo, no cálculo do valor total de uma série de depósitos mensais rendendo juros compostos.',
          'Exemplo: somar os 5 primeiros termos de (3, 6, 12, 24, 48), com a₁ = 3 e q = 2: S₅ = 3·(2⁵ − 1)/(2 − 1) = 3·31/1 = 93. Repare que aqui a razão q = 2 é maior que 1, então a soma cresce rápido conforme n aumenta. Mas o que acontece quando |q| &lt; 1 e você soma infinitos termos? É exatamente essa pergunta que fecha o módulo, na próxima e última lição.',
        ],
        exerciseSetId: 'ex-pg-soma-finita',
      },
      {
        id: 'pg-3',
        title: 'Soma de uma PG infinita',
        description: 'Por que somar infinitos termos pode dar um resultado finito, quando |q| &lt; 1.',
        tags: ['Exercício'],
        duration: 9,
        intro: [
          'Parece contraintuitivo: como somar infinitos números pode resultar em um valor finito? Mas é exatamente isso que acontece quando você soma os termos de uma PG decrescente — cada termo fica tão pequeno, tão rápido, que a soma total "converge" para um número específico.',
          'Isso só acontece quando o módulo da razão é menor que 1, ou seja, |q| &lt; 1 (equivalente a −1 &lt; q &lt; 1). Nesse caso, a soma de todos os infinitos termos da PG é dada por S∞ = a₁ / (1 − q).',
        ],
        after: [
          'Se |q| ≥ 1, a soma infinita não converge — ela cresce sem limite (ou oscila sem parar), então essa fórmula simplesmente não se aplica.',
          'Exemplo clássico: some 1 + 1/2 + 1/4 + 1/8 + ... — uma PG com a₁ = 1 e q = 1/2. Como |1/2| &lt; 1, a soma converge: S∞ = 1/(1 − 1/2) = 1/(1/2) = 2. Faz sentido pensar visualmente: cada pedaço que você soma preenche metade do espaço que falta até chegar em 2, sem nunca ultrapassar. Esse tipo de raciocínio — "o que acontece quando um processo se repete infinitas vezes" — é a porta de entrada pra cálculo diferencial e integral, o próximo grande passo depois do pré-cálculo.',
        ],
        exerciseSetId: 'ex-pg-soma-infinita',
      },
    ],
  },
]

export const ALL_PRECALCULO_LESSONS: LessonContent[] = PRECALCULO_UNITS.flatMap((unit) => unit.lessons)

export const PRECALCULO_LESSON_BY_ID: Record<string, LessonContent> = Object.fromEntries(
  ALL_PRECALCULO_LESSONS.map((lesson) => [lesson.id, lesson]),
)
