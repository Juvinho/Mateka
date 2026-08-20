# Backend — Mateka!

Ainda não implementado. Esta pasta existe para manter a separação
`frontend` / `backend` / `database` clara desde já — o código da API (auth,
progresso, exercícios) vai morar aqui quando o frontend deixar de depender só
de `localStorage`.

O que já existe hoje para essa camada:
- O schema de banco de dados completo (com CHECK constraints, triggers,
  migrations e seed) já está pronto em [`/database`](../database).
- O frontend ainda não faz nenhuma chamada de rede para persistência — tudo
  vive em `localStorage`, escopado por módulo (`mateka:{moduleId}:progress`).

Quando esse backend for implementado, ele deve:
- Usar o Prisma Client já configurado em `/database/prisma` (schema
  compartilhado, não duplicar modelos).
- Implementar as regras de negócio documentadas em comentário no
  `schema.prisma` que não são constraints de banco (RN-11 bloqueio de login,
  RN-12 expiração de tokens, RN-13 imutabilidade de pontuação já registrada).
