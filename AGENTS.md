# Smart Creator Content OS — Rules for Codex

## What this repo is

This repo is Samy's **Content OS**: the copywriting skills for each platform, the content waterfall, and the design briefs for The Smart Creator (newsletter, YouTube, LinkedIn, X). Grok Bot orchestrates. The Head of Content bot runs this OS. Claude Code, Codex, or Cursor do the work.

Visuals are not built here. **Design OS** is the [Smart Creator design system](https://github.com/SamyGenAI/Smart-creator-design-system) repo: Content OS writes the brief, Design OS builds and renders the asset.

## Do these in order

1. **Read the vault first.** The private vault is [Samy-SmartOS](https://github.com/SamyGenAI/Samy-SmartOS). Its path is `VAULT_PATH` in `.env`, default `../Samy-SmartOS`. Rules: [`pipelines/vault.md`](pipelines/vault.md). Read `$VAULT/CLAUDE.md` and follow its **Content Workflow**. Voice, proof and offer are in `$VAULT/raw/me/`.
2. **Write only to `$VAULT/outputs/agent/`.** Drafts and briefs go in `$VAULT/outputs/agent/content/<channel>/<title>/`. `$VAULT/outputs/human/` is Samy's polished, final version: read it as his past posts and the examples to match, never write it. `$VAULT/raw/` is read-only.
3. **Run the one waterfall.** The only content pipeline is [`pipelines/content-waterfall.md`](pipelines/content-waterfall.md). Four writers, in order: newsletter, YouTube, LinkedIn, X. One asset at a time.
4. **Hand visuals to Design OS.** Write the brief next to the draft. The build runs in `$DESIGN_SYSTEM` (`DESIGN_SYSTEM_PATH`, default `../smart-creator-design-system`) with its own skills and rules. Rendered files go in `$VAULT/outputs/agent/design/<title>/`.

| Order | Writer | Formats |
|---|---|---|
| 1. Newsletter | `newsletter-writer` | Issue, then the 420×300 thumbnail brief |
| 2. YouTube | `youtube-writer` | Script, titles, description, thumbnail brief |
| 3. LinkedIn | `linkedin-writer` | Post, hooks, carousel |
| 4. X | `x-writer` | Article, thread, post |

Check what already exists before writing:

```bash
node scripts/content-waterfall.mjs status --title "<title>"
node scripts/content-waterfall.mjs next --title "<title>"
```

A file in either `outputs/agent/` or `outputs/human/` counts. Never write a second copy.

Public numbers, results and testimonials come only from `$VAULT/raw/me/proof.md` or a source named in the draft. The content calendar is in Notion. Stages: **Idea**, **Research / Scripting**, **Design or Filming**, **Final copy / Editing**, **Scheduled**, **Posted**. Nothing here posts, schedules, uploads or sends. When Samy says a piece is published, `node scripts/content-waterfall.mjs publish --title "<title>" --channel <channel> --yes` records the date. Nothing moves.

## Skills

| Skill | Job |
|---|---|
| `content-waterfall` | Which asset comes next, idea to publish |
| `newsletter-writer`, `youtube-writer`, `linkedin-writer`, `x-writer` | The four platform writers |
| `linkedin-copywriter`, `linkedin-hook-writer`, `linkedin-unibox-reply` | LinkedIn body, hooks, DM replies |
| `youtube-title-outlier-packaging`, `youtube-description` | YouTube packaging |
| `x-article-writer`, `x-planner` | X Article and the weekly X plan |
| `voice-calibration` | Calibrate Samy's voice from his own edits |
| `graphics-designer`, `youtube-thumbnail` | Design briefs: what a graphic or thumbnail says, before Design OS builds it |

`graphics-designer` decides the graphic and hands the build to a Design OS skill (`infographics-designer`, `carousel-designer`, `newsletter-thumbnail-designer`). `youtube-thumbnail` is a 1280×720 brief. `newsletter-thumbnail-designer` is the 420×300 email image. Do not swap them.

## Still to build

- Content calendar skill: read and update the Notion calendar
- Research and social listening skills
- One design brief skill per format: infographic, carousel, thumbnail, motion graphics
- Analytics: read the performance of past posts per platform
