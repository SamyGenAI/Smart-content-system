---
name: linkedin-writer
description: >-
  Write one LinkedIn asset for the content waterfall: a post, hook options, or
  a carousel brief. Called by content-waterfall. Not a pipeline.
---

Vault: follow [`pipelines/vault.md`](../../pipelines/vault.md). `$VAULT` is the `VAULT_PATH` checkout (default `../Samy-SmartOS`). Read `$VAULT/AGENTS.md` and follow its Content Workflow. Voice, proof, offer, ICP and positioning are read from `$VAULT/raw/me/` (`voice.md`, `proof.md`, `offer.md`). Never write `$VAULT/raw/` or `$VAULT/outputs/human/`. `$VAULT/outputs/human/content/<Platform>/<Stage>/<title>/` holds Samy's polished, final pieces: read them as the examples to match. Topic knowledge starts at `$VAULT/wiki/index.md` and `$VAULT/wiki/content-os.md`. Save the post and hooks under `$VAULT/outputs/agent/content/Linkedin/Text/<title>/`, the carousel and infographic briefs under `$VAULT/outputs/agent/content/Linkedin/Design brief/<title>/`, research notes under `$VAULT/outputs/agent/content/Linkedin/Research/<title>/`. If `$VAULT` is missing, stop and ask Samy to set `VAULT_PATH`. Do not copy vault files into this repo, and do not invent numbers, results or testimonials.

# LinkedIn writer

The waterfall calls this after YouTube, for one LinkedIn asset. Replies are not this writer. `linkedin-unibox-reply` drafts from a pasted thread, and there is no inbox tool yet.

```bash
node scripts/content-waterfall.mjs next --title "<title>" --channel linkedin
```

`next` returns the asset, its stage and its `draftDir`. Write there and nowhere else.

The newsletter issue is the argument. Take one point from it. Do not compress the whole issue into the post.

| Asset | Folder | File |
|---|---|---|
| Post | `Linkedin/Text/<title>/` | `post.md` |
| Hooks | `Linkedin/Text/<title>/` | `hooks.md` |
| Infographic brief | `Linkedin/Design brief/<title>/` | `infographic-brief.md` |
| Carousel | `Linkedin/Design brief/<title>/` | `carousel.md` |
| Research notes | `Linkedin/Research/<title>/` | `research.md` |

All under `$VAULT/outputs/agent/content/`.

## Post

File: `post.md`, unless a markdown draft is already in the folder. That file is the post. Do not create `post.md` beside it.

Follow `linkedin-copywriter` for the body, symbols and CTA. The opening follows `linkedin-hook-writer`, including the character check:

```bash
python3 skills/linkedin-hook-writer/scripts/check_hook.py draft.txt
```

One useful point, one reader (ICP in `raw/me/`), one job: Reach, Belief or Signup. The body has to pay off the first line. Public numbers come only from `proof.md`. A CTA only when it matches `offer.md`. One LinkedIn post a day when Samy queues it. This repo does not queue it.

## Hooks

File: `hooks.md`, and only when Samy asks for options or `next` names `hooks`. Otherwise the hook lives in the post. The waterfall treats hooks as done once the post exists, so a bare `next` will not ask for a second file.

Default to 3 options when he asks without a count. Mark the one that should open the post. Counts stay outside the copy. Families and length targets are in `linkedin-hook-writer`. Use his facts. Do not invent a result to make a shape fit.

## Carousel

File: `carousel.md` in `Linkedin/Design brief/<title>/`. This is the slide copy and the brief `carousel-designer` builds from, not the JSX. Write it only when `next` names `carousel` or Samy asks. Skip it with:

```bash
node scripts/content-waterfall.mjs skip --title "<title>" --channel linkedin --asset carousel
```

Adapted from Samy's `carousel-copywriting` Claude skill. Text only, no design.

Voice: direct, confident, educational, like explaining to a smart friend. Short sentences. One idea per slide. "You" to the reader. Contractions are fine. An occasional one-word sentence. No corporate jargon, no passive voice, no "In this carousel, I will...", no salesy lines, no emoji in body copy (sparingly in the cover).

Structure, 10 to 15 slides:

1. **Cover.** Subtitle is a format label ("5-step framework", "The complete guide"). Title is a bold statement or question, with 2 to 4 words to highlight. `[IMAGE: Profile photo at bottom center]`.
2. **Slides 2–3, context.** Open with one: a problem the reader feels, something Samy tried, a 3–4 line story, or a contrarian take. Make them nod.
3. **Core slides.** One takeaway each: a step number or label, an action headline, 2–3 lines of explanation. Use before/after, `[IMAGE: …]`, `[SCREENSHOT: …]` or `[DIAGRAM: …]` when a visual carries it. Screenshots come from the test plan in the research brief, in order.
4. **Synthesis.** The key insight, the "after" state, or a quick recap.
5. **CTA, always exactly:**

```
Follow
for more

[IMAGE: Profile photo centered]
🔗 Samy Chouaf
```

Format each slide so `carousel-designer` can build it:

```
---
SLIDE 1 (cover)
type: cover
subtitle: <format label>
title: <title, with the HIGHLIGHT in caps>
[IMAGE: Profile photo at bottom center]

---
SLIDE 4
type: step
stepNumber: 1
title: <action headline>
body: <2–3 lines>
[IMAGE: <what it shows>]
---
```

`type` is one of `cover`, `story`, `context`, `step`, `wrap-up`, `cta`. When Samy supplies images, reference them in order (`[IMAGE 1]`, `[IMAGE 2]`).

Check before delivering: cover has a format label and a punchy title; slides 2–3 set the context; one idea per slide; no slide over about 40 words; 10 to 15 slides; the last slide is exactly the "Follow for more" format. Present the brief and wait for his approval before `carousel-designer` builds the JSX.

## What this hands Design OS

| Asset | When | Skill | Brief | Render |
|---|---|---|---|---|
| Infographic for the post | The post needs a graphic, not by default | `graphics-designer`, then `infographics-designer` | `Linkedin/Design brief/<title>/infographic-brief.md` | `$VAULT/outputs/agent/design/<title>/linkedin-infographic.png` (1080×1350). `pnpm dev` in `$DESIGN_SYSTEM`, Export → Download PNG, or `GET /api/export/png?mode=<modeKey>` |
| Carousel | `carousel.md` is approved | `carousel-designer` | `Linkedin/Design brief/<title>/carousel.md` | `$VAULT/outputs/agent/design/<title>/linkedin-carousel.pdf`. Export → Download PDF, or `GET /api/export/pdf?mode=<modeKey>` |

Design skills live in `$DESIGN_SYSTEM`. `$DESIGN_SYSTEM` is the `DESIGN_SYSTEM_PATH` checkout of the Smart design system (default `../smart-design-system`): Design OS builds and renders every visual there. Do not call `render.py`. Register JSX the way the design skill says.

## Deliver

Return the draft path. Saving a draft does not publish it. When Samy says he posted it:

```bash
node scripts/content-waterfall.mjs publish --title "<title>" --channel linkedin --yes
```
