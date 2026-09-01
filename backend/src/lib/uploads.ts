import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import multer from 'multer'

const UPLOAD_ROOT = path.resolve(import.meta.dirname, '../../uploads')

const KIND_DIRS = {
  avatar: path.join(UPLOAD_ROOT, 'avatars'),
  banner: path.join(UPLOAD_ROOT, 'banners'),
} as const

export type UploadKind = keyof typeof KIND_DIRS

for (const dir of Object.values(KIND_DIRS)) {
  fs.mkdirSync(dir, { recursive: true })
}

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
}

// The client already resizes before sending — this just guards against
// someone hitting the endpoint directly with something huge.
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

export function uploadMiddlewareFor(kind: UploadKind) {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, KIND_DIRS[kind]),
    filename: (_req, file, cb) => {
      const ext = EXTENSION_BY_MIME[file.mimetype] ?? ''
      cb(null, `${crypto.randomUUID()}${ext}`)
    },
  })

  return multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE_BYTES },
    fileFilter: (_req, file, cb) => {
      if (!(file.mimetype in EXTENSION_BY_MIME)) {
        cb(new Error('unsupported_file_type'))
        return
      }
      cb(null, true)
    },
  }).single(kind)
}

// Public URL the client fetches the file from — /api/uploads is mounted as
// static in app.ts, and the /api prefix rides the same Vite dev proxy as
// every other backend call, so no separate CORS/proxy setup is needed.
export function urlForUpload(kind: UploadKind, filename: string): string {
  return `/api/uploads/${kind}s/${filename}`
}

// Deletes a previously-uploaded file given the URL stored on the user row.
// Only ever called with URLs this server generated itself (see
// urlForUpload), but still resolves just the basename before touching the
// filesystem so a malformed/tampered value can't escape the upload dir.
export async function deleteUploadByUrl(url: string | null): Promise<void> {
  if (!url) return
  const match = /^\/api\/uploads\/(avatars|banners)\/([^/]+)$/.exec(url)
  if (!match) return
  const [, dirName, filename] = match
  const filePath = path.join(UPLOAD_ROOT, dirName!, path.basename(filename!))
  await fs.promises.unlink(filePath).catch(() => {})
}
