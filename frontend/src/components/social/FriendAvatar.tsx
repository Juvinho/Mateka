import { initialsFor } from '../../lib/initials'
import type { PublicUser } from '../../lib/socialApi'

export type AvatarProps = { user: PublicUser; onNavigate: (hash: string) => void }

export const FriendAvatar = ({ user, onNavigate }: AvatarProps) => (
  <button type="button" className="friends-avatar-row" onClick={() => onNavigate(`#usuario-${user.id}`)}>
    <div
      className="friends-avatar"
      style={user.avatarUrl ? { backgroundImage: `url(${user.avatarUrl})` } : undefined}
    >
      {user.avatarUrl ? null : initialsFor(user.displayName)}
    </div>
    <span className="friends-avatar__name">{user.displayName}</span>
  </button>
)

export type CardProps = AvatarProps & { actionLabel: string; busy: boolean; disabled?: boolean; onAction: () => void }

export const FriendCard = ({ user, onNavigate, actionLabel, busy, disabled, onAction }: CardProps) => (
  <div className="friends-request-card">
    <FriendAvatar user={user} onNavigate={onNavigate} />
    <button type="button" className="btn-secondary" disabled={busy || disabled} onClick={onAction}>
      {actionLabel}
    </button>
  </div>
)
