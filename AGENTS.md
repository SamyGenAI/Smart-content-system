# Smart Content System — Rules for coding agents

## What this repo is

This repo is Samy's **Content OS**: the copywriting skills for each platform, the content waterfall, the content calendar, and the design briefs for Samy's content: The Smart Creator newsletter, YouTube, YouTube Shorts, LinkedIn and X. Grok Bot orchestrates. The Head of Content bot runs this OS. Claude Code, Codex, or Cursor do the work.

Visuals are not built here. **Design OS** is the [Smart design system](https://github.com/SamyGenAI/Smart-design-system) repo: Content OS writes the brief, Design OS builds and renders the asset.

## Do these in order

1. **Read the vault first.** The private vault is [Samy-SmartOS](https://github.com/SamyGenAI/Samy-SmartOS). Its path is `VAULT_PATH` in `.env`, default `../Samy-SmartOS`. Rules: [`pipelines/vault.md`](pipelines/vault.md). Read `$VAULT/AGENTS.md` and follow its **Content Workflow**. Voice, proof and offer are in `$VAULT/raw/me/`.
2. **Write only to `$VAULT/outputs/agent/content/<Platform>/<Stage>/<title>/`.** See the layout below. `$VAULT/outputs/human/` is Samy's polished, final version: read it as his past posts and the examples to match, never write it. `$VAULT/raw/` is read-only.
3. **Run the one waterfall.** The only content pipeline is [`pipelines/content-waterfall.md`](pipelines/content-waterfall.md). Four writers, in order: newsletter, YouTube, LinkedIn, X. The YouTube Short is an optional slot after YouTube, with no writer yet. One asset at a time.
4. **Hand visuals to Design OS.** Write the brief in the platform's `Design brief/<title>/` folder. The build runs in `$DESIGN_SYSTEM` (`DESIGN_SYSTEM_PATH`, default `../smart-design-system`) with its own skills and rules. Rendered files go in `$VAULT/outputs/agent/design/<title>/`.

## Where outputs go

Every Content OS output goes to `$VAULT/outputs/agent/content/<Platform>/<Stage>/<title>/`. Nothing else.

| Platform folder | Stage folders |
|---|---|
| `Newsletter` | `Research`, `Text`, `Design brief` |
| `Youtube` | `Research`, `Script`, `Design brief` |
| `Youtube short` | `Research`, `Script`, `Design brief` |
| `Linkedin` | `Research`, `Text`, `Design brief` |
| `X` | `Research`, `Text`, `Design brief` |

- **Research**: research briefs, outlier and trend notes, test plans. The waterfall's `brief.md` and `waterfall.json` live in `Newsletter/Research/<title>/`.
- **Text** / **Script**: the copy. Issue, post, hooks, article, thread. YouTube script, titles, description.
- **Design brief**: what a visual says, before Design OS builds it. Thumbnail, infographic, carousel copy, X figures.

Use the exact folder names, including case and spaces. `node scripts/content-waterfall.mjs next` returns the `draftDir` for the next asset. `node scripts/content-waterfall.mjs scaffold` creates any missing folder. `outputs/human/content/` uses the same layout.

| Order | Writer | Formats |
|---|---|---|
| 1. Newsletter | `newsletter-writer` | Issue, then the 420×300 thumbnail brief |
| 2. YouTube | `youtube-writer` | Script, titles, description, thumbnail brief |
| — YouTube Short | None yet. Ask Samy | Short script |
| 3. LinkedIn | `linkedin-writer` | Post, hooks, infographic brief, carousel |
| 4. X | `x-writer` | Article, figures brief, thread, post |

Check what already exists before writing:

```bash
node scripts/content-waterfall.mjs status --title "<title>"
node scripts/content-waterfall.mjs next --title "<title>"
```

A file in either `outputs/agent/` or `outputs/human/` counts. Never write a second copy.

Public numbers, results and testimonials come only from `$VAULT/raw/me/proof.md` or a source named in the draft. The content calendar is in Notion, read and updated with `content-calendar`. Stages: **Idea**, **Research / Scripting**, **Design or Filming**, **Final copy / Editing**, **Scheduled**, **Posted**. Nothing here posts, schedules, uploads or sends. When Samy says a piece is published, `node scripts/content-waterfall.mjs publish --title "<title>" --channel <channel> --yes` records the date. Nothing moves.

## External tools

MCP servers for this repo are in [`.mcp.json`](.mcp.json). Claude.ai connectors come from Samy's account. If a tool a skill needs is missing or not signed in, say so and use the skill's fallback. Never invent the data it would have returned.

| Tool | Used by | Connection |
|---|---|---|
| Notion | `content-calendar`, `content-waterfall`, `x-planner` | Claude.ai connector |
| Gmail | `content-research`: the weekly Social Listening Digest | Claude.ai connector |
| vidIQ | `youtube-title-outlier-packaging`, `youtube-writer`: outliers, trends, channel stats | Claude.ai connector (directory version, read-only) |
| Exa | `content-research` web track, fact checks in every writer | `exa` in `.mcp.json` |
| X | `content-research` X track | Grok's built-in X search, through the Content researcher bot. Fallback: `last30days` |
| `last30days` | `content-research` communities track (Reddit, Hacker News, X) | Claude Code skill |
| Tella | Recording, transcripts, YouTube editing | Claude.ai connector |
| Canva, Figma | Design OS refinement | Claude.ai connectors |

Codex and Cursor do not read `.mcp.json` or Claude.ai connectors. Add the servers in their own MCP settings (Codex: `codex mcp add vidiq --url https://mcp.vidiq.com/mcp`).

## Skills

| Skill | Job |
|---|---|
| `content-waterfall` | Which asset comes next, idea to publish |
| `content-research` | Ideas with proof of heat, or one idea into one brief for every platform. Run by the Content researcher bot |
| `content-calendar` | Read the Notion content calendar, and update it when Samy asks |
| `newsletter-writer`, `youtube-writer`, `linkedin-writer`, `x-writer` | The four platform writers |
| `linkedin-copywriter`, `linkedin-hook-writer`, `linkedin-unibox-reply` | LinkedIn body, hooks, DM replies |
| `youtube-title-outlier-packaging`, `youtube-description` | YouTube packaging |
| `x-article-writer`, `x-planner` | X Article and the weekly X plan |
| `voice-calibration` | Calibrate Samy's voice from his own edits |
| `graphics-designer`, `youtube-thumbnail` | Design briefs: what a graphic or thumbnail says, before Design OS builds it |

`graphics-designer` decides the graphic and hands the build to a Design OS skill (`infographics-designer`, `carousel-designer`, `newsletter-thumbnail-designer`). `youtube-thumbnail` is a 1280×720 brief. `newsletter-thumbnail-designer` is the 420×300 newsletter thumbnail. Do not swap them.

## Still to build

- Social listening skill
- YouTube Short writer
- One design brief skill per format: infographic, carousel, thumbnail, motion graphics
- Analytics: read the performance of past posts per platform
