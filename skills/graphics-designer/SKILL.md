---
name: graphics-designer
description: Decide the job of one graphic, carousel or banner, then hand the build to the design system. Use before infographics-designer, carousel-designer or newsletter-thumbnail-designer.
---

Vault: follow [`pipelines/vault.md`](../../pipelines/vault.md). `$VAULT` is the `VAULT_PATH` checkout (default `../Samy-SmartOS`). Read `$VAULT/CLAUDE.md` and follow its Content Workflow. Voice, proof, offer, ICP and positioning are read from `$VAULT/raw/me/` (`voice.md`, `proof.md`, `offer.md`). Never write `$VAULT/raw/` or `$VAULT/outputs/human/`. `$VAULT/outputs/human/content/<channel>/` holds Samy's polished, final pieces: read them as the examples to match. Topic knowledge starts at `$VAULT/wiki/index.md` and `$VAULT/wiki/content-os.md`. The finished image goes in `$VAULT/outputs/agent/design/<title>/`. `$DESIGN_SYSTEM` is the `DESIGN_SYSTEM_PATH` checkout of the Smart Creator design system (default `../smart-creator-design-system`): Design OS builds and renders every visual there. If `$VAULT` is missing, stop and ask Samy to set `VAULT_PATH`. Do not copy vault files into this repo, and do not invent numbers, results or testimonials.

A platform writer calls this for one visual, after the copy for that asset exists. Not a pipeline.

# Design a graphic

This skill chooses what the graphic says. It does not replace the design system.

`infographics-designer` stays the skill that builds a 1080×1350 LinkedIn infographic in JSX. `carousel-designer` builds the carousel. `newsletter-thumbnail-designer` builds the 420×300 email thumbnail. `youtube-thumbnail` is a different surface (a YouTube still) and is not this skill. `flowchart` builds an editable process map. Read the content brief, `$DESIGN_SYSTEM/DESIGN.md`, and the positioning, ICP and voice pages in `$VAULT/raw/me/` before choosing.

Establish the information relationship before choosing a composition: a thesis, sequence, comparison, hierarchy, evidence or reflection. Keep the copy faithful to its source. A missing number or screenshot is not permission to invent one.

Use dimensions from the requested destination or supplied brief. Verify current platform requirements when exact compliance matters. Infer routine layout details; ask only when a missing choice changes the content or format materially.

## Which design skill builds it

| Ask | Skill | Canvas | Render |
|---|---|---|---|
| LinkedIn infographic | `infographics-designer` | 1080×1350 | `pnpm dev` in `$DESIGN_SYSTEM`, Export → Download PNG. Or `GET /api/export/png?mode=<modeKey>` with the dev server up |
| LinkedIn carousel | `carousel-designer` | 1080×1350 × N | `pnpm dev` in `$DESIGN_SYSTEM`, Export → Download PDF. Or `GET /api/export/pdf?mode=<modeKey>` |
| Newsletter thumbnail | `newsletter-thumbnail-designer` | 420×300 | `pnpm dev` in `$DESIGN_SYSTEM`, Export → Download PNG. Or `GET /api/export/png?mode=<modeKey>` |
| Process map or funnel | `flowchart` | Excalidraw scene | The editor's own export, saved beside the `.excalidraw` |
| YouTube thumbnail | `youtube-thumbnail` | No canvas in Design OS yet | `thumbnail-brief.md` only, until a 1280×720 mode exists |

Follow that skill's rules, including the design-brief gate for infographics, carousels and slides. Register the JSX in `$DESIGN_SYSTEM/src/modes.js` and `$DESIGN_SYSTEM/src/App.jsx` the way that skill says. Save the export into `$VAULT/outputs/agent/design/<title>/`. Do not call `render.py`.

## Visual choices

Brand colour and type come from `$DESIGN_SYSTEM/DESIGN.md` and the design-system components. Do not put a hex colour or a font name in a design file. Do not invent a logo, author signature or decorative footer. Include a call to action only when the brief provides a useful next step.

Let spacing, hierarchy and truthful relationships carry the graphic. Do not force diagrams into quotes or turn every slide into identical cards. Keep authentic product screenshots intact and use supplied photography with known permissions.

For carousels, give each page a specific job and maintain continuity.

## Deliver

Return the design file path, the mode key, the export path under `$VAULT/outputs/agent/design/<title>/`, the dimensions and any limitation. Producing one graphic does not authorize changing `$DESIGN_SYSTEM/DESIGN.md` or publishing the piece.
