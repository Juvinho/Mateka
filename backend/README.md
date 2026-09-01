# Backend — Mateka!

API do Mateka!, consumindo o Prisma Client compartilhado em
[`/database/prisma`](../database/prisma). Cobre autenticação
(registro/login/logout/sessão) e upload de avatar/banner de perfil —
progresso e exercícios ainda vivem só em `localStorage` no frontend.

## Rodando localmente

Pré-requisitos: Postgres no ar (`npm run db:up` na raiz) e o Prisma Client
gerado a partir do schema (`npm run db:generate` na raiz).

```bash
cp .env.example .env   # ajuste se necessário — aponta pro Postgres local
npm run dev --workspace=backend
```

Sobe em `http://localhost:4000`. O Vite (`frontend/vite.config.ts`) faz proxy
de `/api/*` pra essa porta em dev, então o frontend chama `/api/...` como se
fosse same-origin — sem CORS pra se preocupar localmente.

## Rotas

| Rota                | Método | O que faz                                              |
|----------------------|--------|---------------------------------------------------------|
| `/api/auth/register` | POST   | Cria conta (`name`, `email`, `password`), já loga (seta cookie de sessão) |
| `/api/auth/login`    | POST   | Autentica (`email`, `password`), seta cookie de sessão  |
| `/api/auth/logout`   | POST   | Invalida a sessão atual e limpa o cookie                |
| `/api/auth/me`       | GET    | Retorna o usuário da sessão atual (401 se não logado)   |
| `/api/profile/avatar`| POST   | Upload de avatar (`multipart/form-data`, campo `avatar`) — exige sessão |
| `/api/profile/avatar`| DELETE | Remove o avatar atual — exige sessão                     |
| `/api/profile/banner`| POST   | Upload de banner (`multipart/form-data`, campo `banner`) — exige sessão |
| `/api/profile/banner`| DELETE | Remove o banner atual — exige sessão                     |
| `/api/uploads/*`     | GET    | Serve os arquivos enviados (estático, cache de 30 dias) |
| `/api/health`        | GET    | Healthcheck simples                                     |

## Upload de avatar/banner

Arquivos vão pra `backend/uploads/{avatars,banners}/` (fora do git — ver
`.gitignore`), com nome aleatório (`crypto.randomUUID()`), nunca reaproveitado.
O upload troca o arquivo antigo do usuário automaticamente (deleta o anterior
do disco antes de salvar o novo), então a URL guardada em `users.avatar_url`/
`users.banner_url` sempre aponta pro arquivo certo — e como o nome nunca se
repete, o cache agressivo (`maxAge: 30d, immutable`) em `/api/uploads` nunca
serve conteúdo desatualizado.

Validação: só `image/jpeg`, `image/png` e `image/webp` (rejeitado com 400
`unsupported_file_type`), limite de 5MB por arquivo (o frontend já redimensiona
antes de enviar, então isso raramente é atingido na prática).

## Sessão

Sessão por cookie httpOnly (`mateka_session`), não JWT — segue o `Session`
model do schema: só o hash SHA-256 do token fica no banco (`tokenHash`), o
valor em texto puro só existe no cookie do cliente.

## Regras de negócio implementadas

- **RN-11**: 5 tentativas de login malsucedidas seguidas → `lockedUntil = now() + 15min`.
  Login bem-sucedido zera `failedLoginAttempts`. Mensagens de erro de login são
  propositalmente genéricas ("Email ou senha incorretos") pra não vazar se o
  problema foi o email ou a senha.
- Senhas sempre hasheadas com bcrypt (12 salt rounds — mesmo padrão do
  `database/prisma/seed.ts`), nunca texto puro.

## O que ainda não está aqui

- `institution` (coletado no formulário de registro do frontend) não é
  persistido — não existe coluna correspondente em `users`. Se isso importar,
  precisa de uma migration nova.
- RN-12 (expiração de `verification_tokens` para reset de senha / verificação
  de email) — os endpoints de esqueci-minha-senha/verificação ainda não
  existem, só o schema já suporta.
- Update/delete de conta (edição de nome/email, exclusão) — ainda não pedido.
- Avatar/banner ficam em disco local (`backend/uploads/`), não em object
  storage (S3 etc.) — não tem problema pra dev local, mas não sobrevive a um
  deploy sem disco persistente ou múltiplas instâncias do backend.
