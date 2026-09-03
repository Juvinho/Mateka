// Protanopia and deuteranopia are both red-green deficiencies — standard
// accessibility guidance is the same fix for both (avoid red/green, use
// blue/orange), so they share one CSS override block. Tritanopia is
// blue-yellow, not red-green, so it deliberately gets no override — see
// the comment on the CSS block in index.css.
export type ColorblindMode = 'off' | 'protanopia' | 'deuteranopia' | 'tritanopia'

export type Settings = {
  emyVoiceEnabled: boolean
  sfxEnabled: boolean
  colorblindMode: ColorblindMode
}

const STORAGE_KEY = 'mateka:settings'

const DEFAULTS: Settings = {
  emyVoiceEnabled: true,
  sfxEnabled: true,
  colorblindMode: 'off',
}

export function getSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return DEFAULTS
  }
}

function applyColorblindAttribute(mode: ColorblindMode): void {
  if (typeof document === 'undefined') return
  if (mode === 'off') {
    delete document.documentElement.dataset.colorblindMode
  } else {
    document.documentElement.dataset.colorblindMode = mode
  }
}

export function setSetting<K extends keyof Settings>(key: K, value: Settings[K]): Settings {
  const next = { ...getSettings(), [key]: value }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore write failures (private browsing, storage full, etc.)
  }
  if (key === 'colorblindMode') applyColorblindAttribute(next.colorblindMode)
  return next
}

// Called once at app startup so the colorblind CSS override is in place
// before first paint reflects it, rather than flashing the default palette.
export function initSettings(): void {
  applyColorblindAttribute(getSettings().colorblindMode)
}
