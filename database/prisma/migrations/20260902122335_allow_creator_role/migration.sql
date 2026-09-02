-- Hand-written: widen role_valid to allow the 'creator' badge value.
-- See the comment on User.role in schema.prisma for the full explanation —
-- this mirrors the same CHECK-constraints-aren't-in-Prisma-schema pattern
-- used by every other hand-written migration in this project.
ALTER TABLE "users" DROP CONSTRAINT "role_valid";
ALTER TABLE "users" ADD CONSTRAINT "role_valid" CHECK (role IN ('student', 'admin', 'creator'));
