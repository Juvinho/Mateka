# Banco de dados — Mateka!

Camada de persistência (Postgres 15 + Prisma) para contas, conteúdo, exercícios
e progresso. Este documento cobre só o setup local — o schema em si vive em
[`prisma/schema.prisma`](prisma/schema.prisma) e está comentado com as
CHECK constraints e triggers que existem no banco mas não têm sintaxe no
Prisma Schema Language.

Este é o workspace `database` do monorepo (irmão de `/frontend` e `/backend`
na raiz) — todos os comandos abaixo rodam com o diretório de trabalho em
`/database`. Da raiz do repo, rode com `npm run <script> --workspace=database`,
ou entre em `cd database` e rode os scripts direto.

## 1. Subir o Postgres local

O `backend` ainda não existe de verdade (é só a pasta reservada), então o banco
sobe isolado via Docker:

```bash
npm run db:up
```

Isso sobe um Postgres 15 em `localhost:5432` (usuário `mateka`, banco `Mateka`
— veja `docker-compose.yml`). Para derrubar: `npm run db:down`.

Copie o `.env.example` para `.env` (o `.env` real nunca é commitado — já está
no `.gitignore`):

```bash
cp .env.example .env
```

Se você já tem um Postgres 15+ rodando fora do Docker (nativo ou gerenciado
tipo Neon/Supabase), pule o `db:up` e só ajuste `DATABASE_URL` no `.env`.

## 2. Rodar as migrations

```bash
npm run db:migrate
```

Isso aplica `prisma/migrations/20260819141913_init/migration.sql`, que:
- cria todas as tabelas, índices e foreign keys (com `ON DELETE` explícito em
  toda FK — `CASCADE` ou `SET NULL`, nunca implícito);
- adiciona as CHECK constraints do spec (ex: `password_or_oauth`,
  `points_by_difficulty`, `completed_consistency`);
- cria o trigger `set_updated_at` (mantém `users.updated_at` e
  `lesson_progress.updated_at` atualizados no banco, não na aplicação);
- cria o trigger `forbid_update` e o aplica em `exercise_attempts` e
  `streak_log` — as duas tabelas append-only do schema. Um `UPDATE` nelas
  lança exceção mesmo que a role conectada seja a dona da tabela (por isso o
  enforcement real é o trigger, não só o `REVOKE UPDATE` que também está lá
  como defesa em profundidade).

Esse SQL foi gerado com `prisma migrate diff --from-empty` a partir do schema
e depois editado à mão para incluir o que o Prisma não expressa
declarativamente (CHECK, `CREATE EXTENSION`, triggers). Rodar
`npm run db:migrate` de novo no futuro (depois de mudar o schema) não vai
tentar desfazer esse SQL customizado — ele só aparece nesse arquivo, nunca no
`schema.prisma`, então o Prisma não tem como "ver" isso como algo a remover.

## 3. Popular com dados de exemplo (seed)

```bash
npm run db:seed
```

Cria:
- 1 usuário de teste (`aluno.demo@mateka.dev`, senha `MatekaDemo123!` — hasheada
  com bcrypt antes de ir para o banco, nunca em texto puro, mesmo em seed);
- 1 subject completo ("Matrizes") com 7 units e as 10 lições pedidas (O que é
  uma matriz → Teorema de Cayley-Hamilton);
- 10 exercícios (1 por lição) com 22 questões reais no total — prompt,
  alternativas, resposta correta e explicação, não placeholder;
- progresso de exemplo para o usuário demo (uma lição concluída, outra em
  andamento, unidade 1 desbloqueada, streak dos últimos 3 dias, duas tentativas
  de exercício).

O seed é idempotente (usa `upsert`/find-or-create) — rodar de novo não duplica
linhas.

## 4. Rodar os testes de integridade

```bash
npm run test:db
```

Usa Vitest + o Prisma Client contra o Postgres do passo 1 (não é mockado — os
testes em [`tests/integrity.test.ts`](tests/integrity.test.ts) tentam
inserir dado inválido de verdade e esperam que o banco rejeite). Cobrem, no
mínimo:

- `users` com `auth_provider='email'` e `password_hash=NULL` → rejeitado
  (`password_or_oauth`).
- `exercises` com `difficulty='hard'` e `points=50` → rejeitado
  (`points_by_difficulty`).
- duas `lessons` na mesma `unit_id` com o mesmo `order_index` → rejeitado
  (unique constraint).
- `lesson_progress` com `status='done'` e `completed_at=NULL` → rejeitado
  (`completed_consistency`).
- `UPDATE` em `exercise_attempts` e em `streak_log` → bloqueado pelo trigger
  append-only.

Os testes criam e limpam seus próprios dados fixture (um subject/unit/lesson/
exercise/user isolados) em `beforeAll`/`afterAll`, então rodar `test:db` não
suja o resultado do seed.

## Resumo de comandos

| Comando            | O que faz                                      |
|---------------------|-------------------------------------------------|
| `npm run db:up`     | Sobe o Postgres local via Docker                |
| `npm run db:down`   | Derruba o container do Postgres                 |
| `npm run db:migrate`| Aplica as migrations pendentes                  |
| `npm run db:seed`   | Popula o banco com o conteúdo de exemplo        |
| `npm run db:studio` | Abre o Prisma Studio (explorar dados visualmente)|
| `npm run test:db`   | Roda os testes de integridade                   |

## Regras de negócio que não são constraints de banco

Documentadas em comentário no `schema.prisma`, perto do model relevante, mas
vale repetir aqui porque são fáceis de esquecer ao implementar a API:

- **RN-11**: 5 tentativas de login malsucedidas seguidas → `lockedUntil = now() + 15min`.
  Login bem-sucedido zera `failedLoginAttempts`.
- **RN-12**: `verification_tokens` de `purpose='password_reset'` expiram em 1h;
  `purpose='email_verify'` expiram em 24h. Sempre validar `usedAt IS NULL`
  antes de aceitar um token.
- **RN-13**: mudar `exercises.points` depois de publicado não recalcula
  pontuações já gravadas em `exercise_attempts` — o histórico é imutável por
  design.
- O cooldown da Emy-chan (RN-09, 4min entre aparições) é só em memória de
  sessão no **frontend**. `emy_appearance_log` é só analytics — não usar essa
  tabela para lógica de cooldown.
