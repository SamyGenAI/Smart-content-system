#!/usr/bin/env node
/**
 * Content waterfall state.
 *
 * One idea, one asset at a time.
 * Order: newsletter, then YouTube, then the optional YouTube Short, then LinkedIn, then X.
 * Reads the vault at VAULT_PATH (default ../Samy-SmartOS).
 * Layout: outputs/{agent,human}/content/<Platform>/<Stage>/<title>/, for example
 * outputs/agent/content/Linkedin/Text/How to design with AI/post.md.
 * An asset counts when its file is on the agent side (drafts) or the human side
 * (Samy's polished version).
 * Writes only outputs/agent/content/. Never writes raw/ or outputs/human/.
 * Never overwrites an existing draft file.
 * Never posts, schedules, uploads, or sends.
 *
 *   node scripts/content-waterfall.mjs status --title "How to design with AI"
 *   node scripts/content-waterfall.mjs next --title "How to design with AI"
 *   node scripts/content-waterfall.mjs next --title "..." --channel linkedin --asset carousel
 *   node scripts/content-waterfall.mjs init --title "..."
 *   node scripts/content-waterfall.mjs link --title "..." --channel linkedin --folder "How to design with AI 1"
 *   node scripts/content-waterfall.mjs skip --title "..." --channel x --asset thread
 *   node scripts/content-waterfall.mjs publish --title "..." --channel newsletter --yes
 *   node scripts/content-waterfall.mjs scaffold
 *   node scripts/content-waterfall.mjs self-test
 */

import fs from 'fs'
import os from 'os'
import path from 'path'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'
import {
  CHANNELS,
  PLATFORMS,
  REPO_ROOT,
  assertChannel,
  assertContentWrite,
  assertTitle,
  contentDir,
  designDir,
  resolveDesignSystemPath,
  resolveVaultPath,
  stageRoot,
} from './lib/vault.mjs'

const SCRIPT_PATH = fileURLToPath(import.meta.url)
const CONFIG_PATH = path.join(REPO_ROOT, 'pipelines', 'platforms.json')
const RESERVED_ROOT = new Set(['brief.md'])

function loadConfig() {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
  if (!Array.isArray(config.order) || config.order.join() !== CHANNELS.join()) {
    throw new Error(`pipelines/platforms.json order must be ${CHANNELS.join(', ')}.`)
  }
  for (const channel of config.order) {
    for (const asset of config.platforms[channel].assets) {
      if (!PLATFORMS[channel].stages.includes(asset.stage)) {
        throw new Error(`${channel}/${asset.id} has an unknown stage "${asset.stage}".`)
      }
    }
  }
  return config
}

function parseArgs(argv) {
  const out = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i]
    if (!token.startsWith('--')) {
      out._.push(token)
      continue
    }
    const key = token.slice(2)
    const next = argv[i + 1]
    if (next === undefined || next.startsWith('--')) out[key] = true
    else {
      out[key] = next
      i++
    }
  }
  return out
}

function emit(payload, code = 0) {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`)
  process.exit(code)
}

function fail(code, error, extra = {}) {
  emit({ ok: false, error, ...extra }, code)
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function writeJson(vault, file, data) {
  assertContentWrite(vault, file)
  const dir = path.dirname(file)
  fs.mkdirSync(dir, { recursive: true })
  const tmp = `${file}.tmp`
  fs.writeFileSync(tmp, `${JSON.stringify(data, null, 2)}\n`)
  fs.renameSync(tmp, file)
}

function listDirs(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
}

function isDir(dir) {
  return Boolean(dir) && fs.existsSync(dir) && fs.statSync(dir).isDirectory()
}

function manifestDir(vault, config, name) {
  return contentDir(vault, config.manifest.channel, 'agent', config.manifest.stage, name)
}

/** Manifests live on the agent side only, in <Platform>/Research/<title>/. */
function findManifests(vault, config, title) {
  const hits = []
  for (const channel of CHANNELS) {
    const base = stageRoot(vault, channel, 'agent', config.manifest.stage)
    for (const name of listDirs(base)) {
      const file = path.join(base, name, config.manifest.file)
      if (!fs.existsSync(file)) continue
      let data
      try {
        data = readJson(file)
      } catch {
        continue
      }
      if (data && data.title === title) {
        hits.push({ file, data, channel, folder: name })
      }
    }
  }
  hits.sort((a, b) => CHANNELS.indexOf(a.channel) - CHANNELS.indexOf(b.channel))
  return hits
}

/** Every stage folder of one piece, on both sides. */
function pieceDirs(vault, channel, name) {
  const stages = {}
  for (const stage of PLATFORMS[channel].stages) {
    const agent = contentDir(vault, channel, 'agent', stage, name)
    const human = contentDir(vault, channel, 'human', stage, name)
    stages[stage] = { agent: isDir(agent) ? agent : null, human: isDir(human) ? human : null }
  }
  return { name, stages }
}

function hasSide(folder, side) {
  return Object.values(folder.stages).some((dirs) => Boolean(dirs[side]))
}

function hasFolder(folder) {
  return hasSide(folder, 'agent') || hasSide(folder, 'human')
}

function sidesFound(folder) {
  return ['agent', 'human'].filter((side) => hasSide(folder, side))
}

function folderPaths(folder, sides = ['human', 'agent']) {
  const out = []
  for (const dirs of Object.values(folder.stages)) {
    for (const side of sides) if (dirs[side]) out.push(dirs[side])
  }
  return out
}

/** One folder name per channel, looked up in every stage on both sides. */
function resolveFolder(vault, channel, title, manifest) {
  const linked = manifest?.folders?.[channel]
  const names = []
  if (typeof linked === 'string' && linked.trim()) names.push(linked.trim())
  if (!names.includes(title)) names.push(title)
  for (const name of names) {
    const found = pieceDirs(vault, channel, name)
    if (hasFolder(found)) return found
  }
  return pieceDirs(vault, channel, names[0])
}

function rootMarkdown(dir) {
  if (!dir || !fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((name) => name.endsWith('.md') && !name.startsWith('.'))
}

function siblingReserved(assets, asset) {
  const reserved = new Set(RESERVED_ROOT)
  for (const other of assets) {
    if (other.id === asset.id) continue
    for (const file of other.files || []) {
      if (!file.includes('/')) reserved.add(path.basename(file))
    }
  }
  return reserved
}

function filePresent(dir, rel) {
  if (!dir) return null
  const abs = path.join(dir, rel)
  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return abs
  return null
}

function assetHit(dir, asset, assets) {
  for (const rel of asset.files || []) {
    const abs = filePresent(dir, rel)
    if (abs) return { present: true, path: abs, via: rel }
  }
  if (asset.acceptPrimaryMarkdown && dir) {
    const named = new Set((asset.files || []).map((file) => path.basename(file)))
    const reserved = siblingReserved(assets, asset)
    const candidates = rootMarkdown(dir).filter((name) => !reserved.has(name) && !named.has(name))
    if (candidates.length > 0) {
      return { present: true, path: path.join(dir, candidates[0]), via: 'existing-draft' }
    }
  }
  return { present: false, path: null, via: null }
}

/** Samy's polished file wins over an agent draft. */
function sideHit(folder, asset, assets) {
  const dirs = folder.stages[asset.stage]
  const places = [['human', dirs.human], ['agent', dirs.agent]]
  for (const [side, dir] of places) {
    const hit = assetHit(dir, asset, assets)
    if (hit.present) return { ...hit, side }
  }
  return { present: false, path: null, via: null, side: null }
}

function scanAssets(config, folders) {
  const found = {}
  for (const channel of config.order) {
    const assets = config.platforms[channel].assets
    for (const asset of assets) {
      found[`${channel}/${asset.id}`] = {
        channel,
        id: asset.id,
        label: asset.label,
        stage: asset.stage,
        required: Boolean(asset.required),
        ...sideHit(folders[channel], asset, assets),
        satisfiedBy: null,
      }
    }
    for (const asset of assets) {
      const key = `${channel}/${asset.id}`
      if (found[key].present) continue
      for (const otherId of asset.satisfiedByAssets || []) {
        const other = found[`${channel}/${otherId}`]
        if (other?.present) {
          found[key] = {
            ...found[key],
            present: true,
            path: other.path,
            side: other.side,
            via: `satisfied-by:${otherId}`,
            satisfiedBy: otherId,
          }
          break
        }
      }
    }
  }
  return found
}

function skippedSet(manifest) {
  return new Set(Array.isArray(manifest?.skipped) ? manifest.skipped : [])
}

function pickNext(config, assets, manifest, { channel, assetId, includeOptional }) {
  const skipped = skippedSet(manifest)
  const channels = channel ? [channel] : config.order
  const considerOptional = Boolean(channel || includeOptional || assetId)
  for (const name of channels) {
    for (const asset of config.platforms[name].assets) {
      if (assetId && asset.id !== assetId) continue
      const key = `${name}/${asset.id}`
      if (skipped.has(key)) continue
      if (!considerOptional && !asset.required) continue
      const hit = assets[key]
      if (!hit.present) {
        return { channel: name, asset, key, present: false }
      }
      if (assetId) return { channel: name, asset, key, present: true, path: hit.path, via: hit.via }
    }
  }
  return null
}

function stageOf(folder, manifest, channel) {
  if (manifest?.published?.[channel]) return 'published'
  if (hasSide(folder, 'human')) return 'polished'
  if (hasSide(folder, 'agent')) return 'draft'
  return 'missing'
}

function snapshot(config, assets, folders, manifest) {
  const view = {}
  for (const channel of config.order) {
    const folder = folders[channel]
    view[channel] = {
      platform: PLATFORMS[channel].folder,
      folder: hasFolder(folder) ? folder.name : null,
      stage: stageOf(folder, manifest, channel),
      published: manifest?.published?.[channel] || null,
      assets: {},
    }
    for (const asset of config.platforms[channel].assets) {
      const key = `${channel}/${asset.id}`
      const hit = assets[key]
      let status = 'missing'
      if (skippedSet(manifest).has(key)) status = 'skipped'
      else if (hit.present) status = 'present'
      view[channel].assets[asset.id] = {
        status,
        required: Boolean(asset.required),
        stage: asset.stage,
        side: hit.side,
        via: hit.via,
        path: hit.path,
      }
    }
  }
  return view
}

function describeNext(config, choice, folders, title) {
  if (!choice) return null
  const vault = resolveVaultPath()
  const folder = folders[choice.channel]
  const name = folder.name || title
  const writer = config.platforms[choice.channel].writer || null
  return {
    channel: choice.channel,
    platform: PLATFORMS[choice.channel].folder,
    asset: choice.asset.id,
    label: choice.asset.label,
    stage: choice.asset.stage,
    required: Boolean(choice.asset.required),
    present: Boolean(choice.present),
    path: choice.path || null,
    via: choice.via || null,
    file: choice.asset.files[0],
    writer,
    draftDir: folder.stages[choice.asset.stage].agent
      || contentDir(vault, choice.channel, 'agent', choice.asset.stage, name),
    designDir: choice.asset.handsTo ? designDir(vault, name) : null,
    handsTo: choice.asset.handsTo || null,
    action: choice.present ? 'exists' : (writer ? 'write' : 'no-writer'),
  }
}

function summary(config, view, next) {
  const present = []
  const missing = []
  for (const channel of config.order) {
    for (const [id, asset] of Object.entries(view[channel].assets)) {
      const label = `${channel}/${id}`
      if (asset.status === 'present') present.push(label)
      else if (asset.status === 'missing' && asset.required) missing.push(label)
    }
  }
  const nextLabel = next ? `${next.channel}/${next.asset}` : 'none'
  return `Next: ${nextLabel}. Present: ${present.join(', ') || 'none'}. Missing required: ${missing.join(', ') || 'none'}.`
}

function briefState(vault, config, folders, title) {
  const folder = folders[config.brief.channel]
  const name = folder.name || title
  const dirs = folder.stages[config.brief.stage]
  const places = [dirs.human, dirs.agent]
  for (const dir of places) {
    const hit = filePresent(dir, config.brief.file)
    if (hit) return { present: true, path: hit }
  }
  return {
    present: false,
    path: path.join(contentDir(vault, config.brief.channel, 'agent', config.brief.stage, name), config.brief.file),
  }
}

function emptyByChannel() {
  return Object.fromEntries(CHANNELS.map((channel) => [channel, null]))
}

function blankManifest(title) {
  return {
    title,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    notes: '',
    folders: emptyByChannel(),
    published: emptyByChannel(),
    skipped: [],
    lastNext: null,
  }
}

function mergeManifest(prev, next) {
  const keep = {}
  if (prev && typeof prev === 'object') {
    for (const [key, value] of Object.entries(prev)) {
      if (!['title', 'created', 'updated', 'notes', 'folders', 'published', 'skipped', 'lastNext', 'assets'].includes(key)) {
        keep[key] = value
      }
    }
  }
  return {
    ...keep,
    title: next.title,
    created: prev?.created || next.created,
    updated: next.updated,
    notes: typeof prev?.notes === 'string' ? prev.notes : '',
    folders: { ...blankManifest(next.title).folders, ...(prev?.folders || {}), ...(next.folders || {}) },
    published: { ...blankManifest(next.title).published, ...(prev?.published || {}), ...(next.published || {}) },
    skipped: Array.isArray(next.skipped) ? next.skipped : (prev?.skipped || []),
    lastNext: next.lastNext === undefined ? (prev?.lastNext || null) : next.lastNext,
    assets: next.assets,
  }
}

function manifestChanged(prev, next) {
  if (!prev) return true
  const strip = ({ updated, ...rest }) => rest
  return JSON.stringify(strip(prev)) !== JSON.stringify(strip(next))
}

function preferredManifestPath(vault, config, title, folders, existing) {
  if (existing?.file) return existing.file
  const name = folders[config.manifest.channel]?.name || title
  return path.join(manifestDir(vault, config, name), config.manifest.file)
}

function loadState(vault, title) {
  const config = loadConfig()
  if (!isDir(vault)) {
    const error = new Error(`Vault not found at ${vault}. Set VAULT_PATH in .env (default ../Samy-SmartOS).`)
    error.code = 2
    throw error
  }
  const hits = findManifests(vault, config, title)
  const existing = hits[0] || null
  const manifest = existing?.data || null
  const folders = {}
  for (const channel of config.order) folders[channel] = resolveFolder(vault, channel, title, manifest)
  const assets = scanAssets(config, folders)
  return { config, manifest, existing, folders, assets, hits }
}

function assetView(config, assets) {
  const view = {}
  for (const [key, hit] of Object.entries(assets)) {
    view[key] = { status: hit.present ? 'present' : 'missing', side: hit.side, via: hit.via }
  }
  return view
}

function buildManifest(title, prev, folders, assets, config, patch = {}) {
  const folderNames = {}
  for (const channel of config.order) {
    folderNames[channel] = hasFolder(folders[channel]) ? folders[channel].name : (prev?.folders?.[channel] || null)
  }
  return mergeManifest(prev, {
    title,
    created: prev?.created || new Date().toISOString(),
    updated: new Date().toISOString(),
    folders: { ...folderNames, ...(patch.folders || {}) },
    published: patch.published || {},
    skipped: patch.skipped || prev?.skipped || [],
    lastNext: patch.lastNext === undefined ? prev?.lastNext || null : patch.lastNext,
    assets: assetView(config, assets),
  })
}

function saveManifest(vault, title, state, patch = {}) {
  const next = buildManifest(title, state.manifest, state.folders, state.assets, state.config, patch)
  const target = preferredManifestPath(vault, state.config, title, state.folders, state.existing)
  if (state.manifest && !manifestChanged(state.manifest, next) && state.existing?.file === target) {
    return { manifest: state.manifest, wrote: false, file: state.existing.file }
  }
  if (fs.existsSync(target)) {
    let current
    try {
      current = readJson(target)
    } catch {
      throw new Error(`Refusing to overwrite ${target}. It is not a waterfall manifest.`)
    }
    if (!current || current.title !== title) {
      throw new Error(`Refusing to overwrite ${target}. It belongs to a different idea.`)
    }
  }
  writeJson(vault, target, next)
  return { manifest: next, wrote: true, file: target }
}

function requireVault(vault) {
  if (!fs.existsSync(vault)) {
    fail(2, `Vault not found at ${vault}. Set VAULT_PATH in .env (default ../Samy-SmartOS).`)
  }
}

function commandStatus(vault, title, { write }) {
  requireVault(vault)
  const state = loadState(vault, title)
  const choice = pickNext(state.config, state.assets, state.manifest, {})
  const next = describeNext(state.config, choice, state.folders, title)
  const view = snapshot(state.config, state.assets, state.folders, state.manifest)
  let manifestFile = state.existing?.file || null
  if (write && (state.existing || Object.values(state.folders).some(hasFolder))) {
    const saved = saveManifest(vault, title, state)
    manifestFile = saved.file
  }
  emit({
    ok: true,
    command: 'status',
    title,
    vault,
    manifest: manifestFile,
    brief: briefState(vault, state.config, state.folders, title),
    summary: summary(state.config, view, next),
    next,
    channels: view,
  })
}

function commandNext(vault, title, args) {
  requireVault(vault)
  const state = loadState(vault, title)
  const channel = args.channel ? assertChannel(args.channel) : null
  const assetId = typeof args.asset === 'string' ? args.asset : null
  if (assetId && !channel) fail(1, 'Pass --channel with --asset.')
  if (channel && assetId && !state.config.platforms[channel].assets.some((asset) => asset.id === assetId)) {
    fail(1, `Unknown asset "${assetId}" for ${channel}.`)
  }
  const choice = pickNext(state.config, state.assets, state.manifest, {
    channel,
    assetId,
    includeOptional: Boolean(args['include-optional']),
  })
  const next = describeNext(state.config, choice, state.folders, title)
  if (state.existing) {
    saveManifest(vault, title, state, {
      lastNext: next ? { channel: next.channel, asset: next.asset, at: new Date().toISOString() } : null,
    })
  }
  let note = 'Write only this asset, in draftDir. Leave every other file as it is. Never write outputs/human/.'
  if (next?.action === 'exists') note = 'This asset already exists. Do not write another copy.'
  if (next?.action === 'no-writer') note = `No writer skill for ${next.platform} yet. Ask Samy before drafting it.`
  emit({
    ok: true,
    command: 'next',
    title,
    vault,
    summary: summary(state.config, snapshot(state.config, state.assets, state.folders, state.manifest), next),
    next,
    note,
  })
}

function commandInit(vault, title) {
  requireVault(vault)
  const before = loadState(vault, title)
  const name = before.folders[before.config.manifest.channel].name || title
  const dir = manifestDir(vault, before.config, name)
  const existingFiles = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((file) => file !== before.config.manifest.file)
    : []
  assertContentWrite(vault, path.join(dir, before.config.manifest.file))
  fs.mkdirSync(dir, { recursive: true })
  const state = loadState(vault, title)
  const saved = saveManifest(vault, title, state, {
    folders: { [state.config.manifest.channel]: name },
  })
  emit({
    ok: true,
    command: 'init',
    title,
    vault,
    manifest: saved.file,
    brief: briefState(vault, state.config, state.folders, title),
    wrote: saved.wrote,
    preserved: existingFiles,
    note: 'Files already in the folder were left unchanged. outputs/human/ was not touched. Nothing was posted.',
  })
}

function commandLink(vault, title, args) {
  requireVault(vault)
  const channel = assertChannel(args.channel)
  const folderName = assertTitle(args.folder)
  const found = pieceDirs(vault, channel, folderName)
  if (!hasFolder(found)) {
    fail(1, `No ${PLATFORMS[channel].folder} folder named "${folderName}" in any stage under outputs/agent/ or outputs/human/.`)
  }
  const state = loadState(vault, title)
  state.manifest = state.manifest || blankManifest(title)
  state.manifest.folders = { ...(state.manifest.folders || {}), [channel]: folderName }
  state.folders[channel] = found
  state.assets = scanAssets(state.config, state.folders)
  const saved = saveManifest(vault, title, state, { folders: { [channel]: folderName } })
  emit({
    ok: true,
    command: 'link',
    title,
    channel,
    folder: folderName,
    sides: sidesFound(found),
    paths: folderPaths(found),
    manifest: saved.file,
    note: 'Linked the existing folder. No draft file was modified.',
  })
}

function commandSkip(vault, title, args) {
  requireVault(vault)
  const channel = assertChannel(args.channel)
  const state = loadState(vault, title)
  const ids = args.asset
    ? [args.asset]
    : state.config.platforms[channel].assets.map((asset) => asset.id)
  for (const id of ids) {
    if (!state.config.platforms[channel].assets.some((asset) => asset.id === id)) {
      fail(1, `Unknown asset "${id}" for ${channel}.`)
    }
  }
  const skipped = new Set(skippedSet(state.manifest))
  const keys = ids.map((id) => `${channel}/${id}`)
  if (args.undo) keys.forEach((key) => skipped.delete(key))
  else keys.forEach((key) => skipped.add(key))
  if (!state.existing) {
    fail(1, 'Run init before skip, so the manifest has a folder to live in.')
  }
  const saved = saveManifest(vault, title, state, { skipped: [...skipped] })
  emit({
    ok: true,
    command: 'skip',
    title,
    skipped: saved.manifest.skipped,
    manifest: saved.file,
  })
}

/** Records the publish date. Moves nothing: the published version is Samy's file in outputs/human/. */
function commandPublish(vault, title, args) {
  requireVault(vault)
  const channel = assertChannel(args.channel)
  const state = loadState(vault, title)
  const folder = state.folders[channel]
  const humanPaths = folderPaths(folder, ['human'])
  const already = state.manifest?.published?.[channel]
  if (already) {
    emit({
      ok: true,
      command: 'publish',
      title,
      channel,
      already: true,
      published: already,
      paths: humanPaths,
      note: 'Already recorded as published. Nothing was posted.',
    })
  }
  if (!hasSide(folder, 'human')) {
    fail(1, `No polished ${PLATFORMS[channel].folder} folder for "${title}" in outputs/human/content/${PLATFORMS[channel].folder}/. Samy keeps the final version there before it counts as published.`)
  }
  if (!args.yes) {
    fail(1, 'Refusing to record the publish. Re-run with --yes only after Samy says this piece is published. Nothing is posted.', {
      wouldRecord: { channel, paths: humanPaths },
    })
  }
  const at = new Date().toISOString()
  const saved = saveManifest(vault, title, state, { published: { [channel]: at } })
  emit({
    ok: true,
    command: 'publish',
    title,
    channel,
    published: at,
    paths: humanPaths,
    manifest: saved.file,
    note: 'Recorded the publish date. Nothing moved and nothing was posted or sent. Log it in wiki/log.md.',
  })
}

function commandPaths(vault, title) {
  const reads = [
    'AGENTS.md',
    'raw/me/voice.md',
    'raw/me/proof.md',
    'raw/me/offer.md',
    'wiki/index.md',
    'wiki/content-os.md',
    'wiki/design-os.md',
    'wiki/log.md',
  ]
  const designSystem = resolveDesignSystemPath()
  const name = title || '<title>'
  emit({
    ok: true,
    command: 'paths',
    title: title || null,
    vault,
    vaultExists: fs.existsSync(vault),
    read: Object.fromEntries(reads.map((rel) => [rel, {
      path: path.join(vault, rel),
      exists: fs.existsSync(path.join(vault, rel)),
    }])),
    channels: Object.fromEntries(CHANNELS.map((channel) => [channel, {
      platform: PLATFORMS[channel].folder,
      agent: Object.fromEntries(PLATFORMS[channel].stages.map((stage) => [stage, contentDir(vault, channel, 'agent', stage, name)])),
      human: Object.fromEntries(PLATFORMS[channel].stages.map((stage) => [stage, contentDir(vault, channel, 'human', stage, name)])),
    }])),
    design: designDir(vault, name),
    designSystem,
    designSystemExists: fs.existsSync(designSystem),
    note: 'raw/ and outputs/human/ are read-only. This command does not copy files and does not post.',
  })
}

/** Creates the empty agent tree: outputs/agent/content/<Platform>/<Stage>/.gitkeep. Never touches outputs/human/. */
function commandScaffold(vault) {
  requireVault(vault)
  const created = []
  for (const channel of CHANNELS) {
    for (const stage of PLATFORMS[channel].stages) {
      const dir = stageRoot(vault, channel, 'agent', stage)
      if (!isDir(dir)) {
        fs.mkdirSync(dir, { recursive: true })
        created.push(dir)
      }
      const keep = path.join(dir, '.gitkeep')
      if (!fs.existsSync(keep) && fs.readdirSync(dir).length === 0) fs.writeFileSync(keep, '')
    }
  }
  emit({
    ok: true,
    command: 'scaffold',
    vault,
    created,
    note: 'Created only missing agent folders. outputs/human/ was not touched.',
  })
}

function help() {
  emit({
    ok: true,
    command: 'help',
    usage: [
      'status --title "<title>" [--write]',
      'next --title "<title>" [--channel <channel>] [--asset <id>]',
      'init --title "<title>"',
      'link --title "<title>" --channel <channel> --folder "<folder>"',
      'skip --title "<title>" --channel <channel> [--asset <id>] [--undo]',
      'publish --title "<title>" --channel <channel> --yes',
      'paths [--title "<title>"]',
      'scaffold',
      'self-test',
    ],
    order: CHANNELS,
    platforms: Object.fromEntries(CHANNELS.map((channel) => [channel, PLATFORMS[channel]])),
    note: 'One shared waterfall. One asset at a time. Nothing is posted.',
  })
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function runCli(args, vault) {
  return spawnSync(process.execPath, [SCRIPT_PATH, ...args], {
    env: { ...process.env, VAULT_PATH: vault },
    encoding: 'utf8',
  })
}

function parseOut(result) {
  try {
    return JSON.parse(result.stdout)
  } catch {
    throw new Error(`Expected JSON.\nstdout: ${result.stdout}\nstderr: ${result.stderr}`)
  }
}

function selfTest() {
  const vault = fs.mkdtempSync(path.join(os.tmpdir(), 'waterfall-'))
  const title = 'How to design with AI'
  const humanNewsletter = contentDir(vault, 'newsletter', 'human', 'Text', title)
  const agentResearch = contentDir(vault, 'newsletter', 'agent', 'Research', title)
  fs.mkdirSync(humanNewsletter, { recursive: true })
  const samyDraft = path.join(humanNewsletter, 'How to design with AI.md')
  fs.writeFileSync(samyDraft, 'SAMY DRAFT\n')
  fs.mkdirSync(path.join(vault, 'raw', 'me'), { recursive: true })
  fs.writeFileSync(path.join(vault, 'raw', 'me', 'proof.md'), 'proof\n')

  const scaffold = parseOut(runCli(['scaffold'], vault))
  assert(scaffold.ok, 'scaffold should succeed')
  assert(fs.existsSync(path.join(stageRoot(vault, 'youtube-short', 'agent', 'Script'), '.gitkeep')), 'scaffold creates the Youtube short/Script folder')
  assert(!fs.existsSync(path.join(stageRoot(vault, 'newsletter', 'human', 'Text'), '.gitkeep')), 'scaffold must not write outputs/human/')

  const init = parseOut(runCli(['init', '--title', title], vault))
  assert(init.ok, 'init should succeed')
  assert(fs.readFileSync(samyDraft, 'utf8') === 'SAMY DRAFT\n', 'init must not change a human file')
  assert(fs.existsSync(path.join(agentResearch, 'waterfall.json')), 'init writes waterfall.json in Newsletter/Research')
  assert(init.brief.path === path.join(agentResearch, 'brief.md'), 'the brief goes in Newsletter/Research')

  const manifest = readJson(path.join(agentResearch, 'waterfall.json'))
  manifest.notes = 'keep this'
  fs.writeFileSync(path.join(agentResearch, 'waterfall.json'), `${JSON.stringify(manifest, null, 2)}\n`)
  const initAgain = parseOut(runCli(['init', '--title', title], vault))
  assert(initAgain.ok, 'second init should succeed')
  assert(readJson(path.join(agentResearch, 'waterfall.json')).notes === 'keep this', 'notes must survive init')

  const status = parseOut(runCli(['status', '--title', title], vault))
  assert(status.channels.newsletter.assets.issue.status === 'present', 'a human file counts as the issue')
  assert(status.channels.newsletter.assets.issue.side === 'human', 'the issue is found on the human side')
  assert(status.channels.newsletter.stage === 'polished', 'a human folder is polished')
  assert(status.next.channel === 'youtube' && status.next.asset === 'script', 'default next is the YouTube script')
  assert(status.next.draftDir === contentDir(vault, 'youtube', 'agent', 'Script', title), 'the script goes in Youtube/Script')

  const newsletterNext = parseOut(runCli(['next', '--title', title, '--channel', 'newsletter'], vault))
  assert(newsletterNext.next.asset === 'thumbnail', 'channel next continues with the thumbnail brief')
  assert(newsletterNext.next.draftDir === contentDir(vault, 'newsletter', 'agent', 'Design brief', title), 'briefs go in Design brief')
  assert(newsletterNext.next.designDir === designDir(vault, title), 'renders go to outputs/agent/design/')

  const youtube = contentDir(vault, 'youtube', 'agent', 'Script', title)
  fs.mkdirSync(youtube, { recursive: true })
  fs.writeFileSync(path.join(youtube, 'Script.md'), 'script\n')
  const afterScript = parseOut(runCli(['next', '--title', title], vault))
  assert(afterScript.next.channel === 'youtube' && afterScript.next.asset === 'titles', 'script on disk advances to titles')

  fs.writeFileSync(path.join(youtube, 'titles.md'), 'titles\n')
  fs.writeFileSync(path.join(youtube, 'description.md'), 'description\n')
  const afterYoutube = parseOut(runCli(['next', '--title', title], vault))
  assert(afterYoutube.next.channel === 'linkedin' && afterYoutube.next.asset === 'post', 'the optional Short is skipped by default')

  const short = parseOut(runCli(['next', '--title', title, '--channel', 'youtube-short'], vault))
  assert(short.next.action === 'no-writer', 'the Short has no writer yet')
  assert(short.next.draftDir === contentDir(vault, 'youtube-short', 'agent', 'Script', title), 'the Short goes in Youtube short/Script')

  const carousel = parseOut(runCli(['next', '--title', title, '--channel', 'linkedin', '--asset', 'carousel'], vault))
  assert(carousel.next.asset === 'carousel' && carousel.next.action === 'write', 'a named asset can be requested on its own')
  assert(carousel.next.draftDir === contentDir(vault, 'linkedin', 'agent', 'Design brief', title), 'the carousel brief goes in Linkedin/Design brief')
  assert(!fs.existsSync(carousel.next.draftDir), 'requesting an asset must not create the draft')

  const humanLinkedin = contentDir(vault, 'linkedin', 'human', 'Text', 'How to design with AI 1')
  fs.mkdirSync(humanLinkedin, { recursive: true })
  fs.writeFileSync(path.join(humanLinkedin, 'How to design with AI.md'), 'LINKEDIN\n')
  const link = parseOut(runCli(['link', '--title', title, '--channel', 'linkedin', '--folder', 'How to design with AI 1'], vault))
  assert(link.ok && link.sides.includes('human'), 'link finds a human folder')
  assert(fs.readFileSync(path.join(humanLinkedin, 'How to design with AI.md'), 'utf8') === 'LINKEDIN\n', 'link must not change the draft')
  const linked = parseOut(runCli(['status', '--title', title], vault))
  assert(linked.channels.linkedin.assets.post.status === 'present', 'a linked human post counts')
  assert(linked.channels.linkedin.assets.carousel.status === 'missing', 'a post in Text is not a carousel')

  const skipped = parseOut(runCli(['skip', '--title', title, '--channel', 'x'], vault))
  assert(skipped.skipped.includes('x/article'), 'skip records the channel')
  const afterSkip = parseOut(runCli(['next', '--title', title], vault))
  assert(afterSkip.next === null, 'skipping the remaining required channel finishes the default queue')

  const refused = runCli(['publish', '--title', title, '--channel', 'newsletter'], vault)
  assert(refused.status === 1, 'publish without --yes must fail')

  const noHuman = runCli(['publish', '--title', title, '--channel', 'youtube', '--yes'], vault)
  assert(noHuman.status === 1, 'publish needs the polished human folder')

  const published = parseOut(runCli(['publish', '--title', title, '--channel', 'newsletter', '--yes'], vault))
  assert(published.ok && published.published, 'publish --yes records the date')
  assert(fs.readFileSync(samyDraft, 'utf8') === 'SAMY DRAFT\n', 'publish leaves the human file in place')
  const publishedStatus = parseOut(runCli(['status', '--title', title], vault))
  assert(publishedStatus.channels.newsletter.stage === 'published', 'published issue shows as published')
  assert(readJson(path.join(agentResearch, 'waterfall.json')).notes === 'keep this', 'notes survive publish')
  assert(readJson(path.join(agentResearch, 'waterfall.json')).skipped.includes('x/article'), 'skips survive publish')
  const again = parseOut(runCli(['publish', '--title', title, '--channel', 'newsletter', '--yes'], vault))
  assert(again.already === true, 'a second publish is a no-op')

  const badTitle = runCli(['init', '--title', '../raw/me'], vault)
  assert(badTitle.status === 1, 'path titles are rejected')
  assert(fs.readFileSync(path.join(vault, 'raw', 'me', 'proof.md'), 'utf8') === 'proof\n', 'raw/ stays untouched')

  const refusedWrites = [
    path.join(humanNewsletter, 'x.md'),
    path.join(vault, 'outputs', 'agent', 'content', 'linkedin', title, 'post.md'),
    path.join(vault, 'outputs', 'agent', 'content', 'Linkedin', 'Script', title, 'post.md'),
    path.join(stageRoot(vault, 'linkedin', 'agent', 'Text'), 'post.md'),
  ]
  for (const target of refusedWrites) {
    let refusedWrite = false
    try {
      assertContentWrite(vault, target)
    } catch {
      refusedWrite = true
    }
    assert(refusedWrite, `write must be refused: ${path.relative(vault, target)}`)
  }
  assertContentWrite(vault, path.join(contentDir(vault, 'x', 'agent', 'Text', title), 'article.md'))

  const missing = runCli(['status', '--title', title], path.join(vault, 'missing-vault'))
  assert(missing.status === 2, 'a missing vault is a distinct error')

  emit({ ok: true, command: 'self-test', vault })
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const command = args._[0] || 'help'
  try {
    if (command === 'help') help()
    if (command === 'self-test') selfTest()
    const vault = resolveVaultPath()
    if (command === 'scaffold') commandScaffold(vault)
    const title = command === 'paths' && !args.title ? null : assertTitle(args.title)
    if (command === 'paths') commandPaths(vault, title)
    if (command === 'status') commandStatus(vault, title, { write: Boolean(args.write) })
    if (command === 'next') commandNext(vault, title, args)
    if (command === 'init') commandInit(vault, title)
    if (command === 'link') {
      if (!args.channel || !args.folder) fail(1, 'link needs --channel and --folder.')
      commandLink(vault, title, args)
    }
    if (command === 'skip') {
      if (!args.channel) fail(1, 'skip needs --channel.')
      commandSkip(vault, title, args)
    }
    if (command === 'publish') commandPublish(vault, title, args)
    fail(1, `Unknown command "${command}".`)
  } catch (error) {
    fail(error.code === 2 ? 2 : 1, error.message)
  }
}

main()
