# Vault

The private vault is [Samy-SmartOS](https://github.com/SamyGenAI/Samy-SmartOS). This repo does not contain it and does not copy it. Point at a local checkout with one setting.

| Setting | Meaning |
|---|---|
| `VAULT_PATH` | Absolute path, or a path relative to this repo. Default: `../Samy-SmartOS`. Set it in `.env` (see `.env.example`). |
| `DESIGN_SYSTEM_PATH` | Checkout of the [Smart Creator design system](https://github.com/SamyGenAI/Smart-creator-design-system) (Design OS). Default: `../smart-creator-design-system`. Every visual is built and rendered there. |

`$VAULT` in the skills means the vault checkout. `$DESIGN_SYSTEM` means the design system checkout. Resolve them before reading or writing:

```bash
node scripts/content-waterfall.mjs paths --title "<title>"
```

If the vault is missing, stop. Ask Samy to clone the vault beside this repo, or to set `VAULT_PATH`. Do not create a stand-in vault inside this repo.

## Layout

Karpathy's LLM-wiki layout. The schema is `$VAULT/CLAUDE.md`. Follow its Content Workflow.

| Path | Rule |
|---|---|
| `$VAULT/raw/` | Immutable source. Read-only from this repo. Never create, edit, move, or delete anything under `raw/`. |
| `$VAULT/raw/me/voice.md` | How Samy writes. |
| `$VAULT/raw/me/proof.md` | The only place public numbers, results, and testimonials come from, along with wiki pages that cite a source. |
| `$VAULT/raw/me/offer.md` | The Smart Operating System offer. |
| `$VAULT/raw/ideas/` | Idea inbox. Read it. Do not file drafts here. |
| `$VAULT/raw/content/` | Content research. Read it. Do not edit it. |
| `$VAULT/wiki/index.md` | Read this first when looking for topic pages. |
| `$VAULT/wiki/content-os.md` | Content OS hub. |
| `$VAULT/wiki/design-os.md` | Design OS hub: formats and the brief-to-asset flow. |
| `$VAULT/wiki/log.md` | Append-only. Add a line only when the vault schema says to. |
| `$VAULT/outputs/agent/content/<channel>/<title>/` | Where this repo writes. One folder per piece. Channels: `newsletter`, `youtube`, `linkedin`, `x`. Drafts, briefs, `waterfall.json`. |
| `$VAULT/outputs/agent/design/<title>/` | Where Design OS saves the rendered visuals for that piece. |
| `$VAULT/outputs/human/content/<channel>/<title>/` | Samy's polished, final version. Read-only from this repo. Read it as the example to match, and as his past posts. |

There are no `drafts/` or `published/` folders.

## Agent and human

- Agents write only under `$VAULT/outputs/agent/`. Never create, edit, move, or delete anything under `$VAULT/outputs/human/`.
- Samy takes what he likes from the agent folder and polishes it into the human folder. A file in the human folder is the latest, final version of that piece.
- An asset counts as done when its file exists in either folder. If Samy already wrote `How to design with AI.md` in his human folder, that file is the asset. Do not draft a second copy.
- A new asset file is allowed in the agent folder when that file does not exist yet. Never overwrite one that does.
- `waterfall.json` is the idea manifest this repo maintains, in the newsletter agent folder. It records folder names, skips, and publish dates. The files on disk are the asset state. Do not put the manifest in `raw/` or `human/`.
- Facts in copy come from `proof.md` or a wiki page that cites a source. Do not invent numbers, results, testimonials, or a voice.

## Publishing

Nothing in this repo posts, schedules, uploads, or sends. Samy publishes on the platform. When he says a piece is published:

```bash
node scripts/content-waterfall.mjs publish --title "<title>" --channel newsletter --yes
```

Without `--yes` the command refuses. It also refuses when Samy's human folder for that channel does not exist yet. It records the date in `waterfall.json` and moves nothing. Then log it in `$VAULT/wiki/log.md`.
