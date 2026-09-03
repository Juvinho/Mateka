-- Hand-written: widen status_valid to allow the 'blocked' status. See the
-- comment on Friendship in schema.prisma — same CHECK-constraints-aren't-in-
-- Prisma-schema pattern used by every other hand-written migration here.
ALTER TABLE "friendships" DROP CONSTRAINT "status_valid";
ALTER TABLE "friendships" ADD CONSTRAINT "status_valid" CHECK (status IN ('pending', 'accepted', 'declined', 'blocked'));
