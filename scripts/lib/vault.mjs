import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const LIB_DIR = path.dirname(fileURLToPath(import.meta.url))
export const REPO_ROOT = path.resolve(LIB_DIR, '../..')

/**
 * The vault layout: outputs/{agent,human}/content/<Platform>/<Stage>/<title>/.
 * folder: the platform folder name in the vault. stages: its stage folders, in order.
 */
export const PLATFORMS = {
  newsletter: { folder: 'Newsletter', stages: ['Research', 'Text', 'Design brief'] },
  youtube: { folder: 'Youtube', stages: ['Research', 'Script', 'Design brief'] },
  'youtube-short': { folder: 'Youtube short', stages: ['Research', 'Script', 'Design brief'] },
  linkedin: { folder: 'Linkedin', stages: ['Research', 'Text', 'Design brief'] },
  x: { folder: 'X', stages: ['Research', 'Text', 'Design brief'] },
}
export const CHANNELS = Object.keys(PLATFORMS)
/** agent: what the agents write. human: Samy's polished, final version. Read-only here. */
export const SIDES = ['agent', 'human']

let envLoaded = false

export function loadEnvFile() {
  if (envLoaded) return
  envLoaded = true
  const envPath = path.join(REPO_ROOT, '.env')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (key && process.env[key] === undefined) process.env[key] = value
  }
}

export function resolveVaultPath() {
  loadEnvFile()
  const configured = process.env.VAULT_PATH?.trim() || '../Samy-SmartOS'
  return path.resolve(REPO_ROOT, configured)
}

export function resolveDesignSystemPath() {
  loadEnvFile()
  const configured = process.env.DESIGN_SYSTEM_PATH?.trim() || '../smart-design-system'
  return path.resolve(REPO_ROOT, configured)
}

export function assertTitle(title) {
  if (typeof title !== 'string' || !title.trim()) {
    throw new Error('Pass --title "<title>".')
  }
  const clean = title.trim()
  if (clean.length > 180) throw new Error('Title is too long.')
  if (/[/\\]/.test(clean) || clean.includes('..') || clean.startsWith('.')) {
    throw new Error('Title cannot be a path.')
  }
  return clean
}

export function assertChannel(channel) {
  if (!CHANNELS.includes(channel)) {
    throw new Error(`Unknown channel "${channel}". Use one of: ${CHANNELS.join(', ')}.`)
  }
  return channel
}

export function assertStage(channel, stage) {
  if (!PLATFORMS[channel].stages.includes(stage)) {
    throw new Error(`Unknown stage "${stage}" for ${channel}. Use one of: ${PLATFORMS[channel].stages.join(', ')}.`)
  }
  return stage
}

/** Refuse any write outside outputs/agent/content/<Platform>/<Stage>/<title>/. raw/ and outputs/human/ stay read-only. */
export function assertContentWrite(vaultRoot, target) {
  const vault = path.resolve(vaultRoot)
  const abs = path.resolve(target)
  const rel = path.relative(vault, abs)
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`Refusing to write outside the vault: ${abs}`)
  }
  const parts = rel.split(path.sep).filter(Boolean)
  if (parts[0] === 'raw') throw new Error('Refusing to write raw/. It is read-only.')
  if (parts[0] === 'outputs' && parts[1] === 'human') {
    throw new Error('Refusing to write outputs/human/. It is Samy\'s polished version.')
  }
  if (parts[0] !== 'outputs' || parts[1] !== 'agent' || parts[2] !== 'content') {
    throw new Error('Refusing to write outside outputs/agent/content/.')
  }
  const channel = CHANNELS.find((id) => PLATFORMS[id].folder === parts[3])
  if (!channel) throw new Error(`Unknown platform folder "${parts[3]}".`)
  if (!PLATFORMS[channel].stages.includes(parts[4])) {
    throw new Error(`Unknown stage folder "${parts[4]}" for ${PLATFORMS[channel].folder}.`)
  }
  if (!parts[5] || parts.length < 7) throw new Error('Refusing to write outside a piece folder.')
  return abs
}

export function stageRoot(vaultRoot, channel, side, stage) {
  if (!SIDES.includes(side)) throw new Error(`Unknown side "${side}".`)
  assertStage(channel, stage)
  return path.join(vaultRoot, 'outputs', side, 'content', PLATFORMS[channel].folder, stage)
}

export function contentDir(vaultRoot, channel, side, stage, folderName) {
  return path.join(stageRoot(vaultRoot, channel, side, stage), folderName)
}

export function designDir(vaultRoot, folderName) {
  return path.join(vaultRoot, 'outputs', 'agent', 'design', folderName)
}
