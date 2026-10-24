# Smart Creator Content OS

The Content OS of Samy's Smart Operating System. Platform copywriting skills, one content waterfall, and the design briefs for **The Smart Creator**: newsletter, YouTube, LinkedIn and X. Grok Bot orchestrates. Claude Code, Codex, or Cursor do the work.

Visuals are built by Design OS, the [Smart Creator design system](https://github.com/SamyGenAI/Smart-creator-design-system). This repo writes the brief, Design OS renders it.

## Setup

Clone the vault and the design system beside this repo, or set their paths in `.env` (see `.env.example`):

```bash
git clone https://github.com/SamyGenAI/Samy-SmartOS.git ../Samy-SmartOS
git clone https://github.com/SamyGenAI/Smart-creator-design-system.git ../smart-creator-design-system
cp .env.example .env
```

Do not copy vault files into this repo. Do not edit the vault's `raw/` or `outputs/human/`. If `voice.md`, `proof.md` or `offer.md` are empty, fill them in the vault before asking an agent to draft. Agents will not invent voice, proof, or numbers.

## Structure

| Path | What it is |
|---|---|
| `skills/` | Platform writers, the waterfall, and the brief skills. Each skill is a folder with `SKILL.md`. |
| `pipelines/` | The content waterfall, `platforms.json` and `vault.md`. |
| `scripts/content-waterfall.mjs` | Reads the vault, names the next asset, records publish dates. Never posts. |
| `CLAUDE.md`, `AGENTS.md` | Rules for Claude Code and Codex. |

## Where things go in the vault

| Path | Who writes it |
|---|---|
| `outputs/agent/content/<channel>/<title>/` | Agents: drafts, briefs, `waterfall.json` |
| `outputs/agent/design/<title>/` | Design OS: rendered visuals |
| `outputs/human/content/<channel>/<title>/` | Samy only: the polished, final version |

## The waterfall

```bash
node scripts/content-waterfall.mjs status --title "<title>"
node scripts/content-waterfall.mjs next --title "<title>"
node scripts/content-waterfall.mjs publish --title "<title>" --channel newsletter --yes
node scripts/content-waterfall.mjs self-test
```

`next` names the writer, the file, the agent folder, and the design handoff for that asset. A file Samy already polished in `outputs/human/` counts. `publish` refuses without `--yes` and without Samy's human folder, records the date, and moves nothing.
