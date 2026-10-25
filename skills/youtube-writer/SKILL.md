---
name: youtube-writer
description: >-
  Write one YouTube asset for the content waterfall: a filmable script with shot
  lists, titles, a description, or a thumbnail brief. The script turns the
  newsletter issue into Samy's intro formula and chapter beats, tagged for how he
  films (desk A-roll, Tella screen records, iPad, slides). Called by
  content-waterfall. Not a pipeline.
---

Vault: follow [`pipelines/vault.md`](../../pipelines/vault.md). `$VAULT` is the `VAULT_PATH` checkout (default `../Samy-SmartOS`). Read `$VAULT/AGENTS.md` and follow its Content Workflow. Voice, proof, offer, ICP and positioning are read from `$VAULT/raw/me/` (`voice.md`, `proof.md`, `offer.md`). Never write `$VAULT/raw/` or `$VAULT/outputs/human/`. `$VAULT/outputs/human/content/<Platform>/<Stage>/<title>/` holds Samy's polished, final pieces: read them as the examples to match. Topic knowledge starts at `$VAULT/wiki/index.md` and `$VAULT/wiki/content-os.md`. Save the script, titles and description under `$VAULT/outputs/agent/content/Youtube/Script/<title>/`, the thumbnail brief under `$VAULT/outputs/agent/content/Youtube/Design brief/<title>/`, research under `$VAULT/outputs/agent/content/Youtube/Research/<title>/`. If `$VAULT` is missing, stop and ask Samy to set `VAULT_PATH`. Do not copy vault files into this repo, and do not invent numbers, results or testimonials.

# YouTube writer

The waterfall calls this after the newsletter issue, for one YouTube asset at a time. Samy films, cuts and uploads. This skill writes what he reads and what he records.

```bash
node scripts/content-waterfall.mjs next --title "<title>" --channel youtube
```

Write only that asset. If the file exists (`Script.md` counts as the script), do not write another. The newsletter issue for this title is the argument. Do not invent a new thesis.

References:

- [`references/creator-patterns.md`](references/creator-patterns.md): how Jeff Su, Nate Herk and Ben AI script their intros, bodies and CTAs. The why behind the rules below.
- [`references/filming.md`](references/filming.md): Samy's setup, the direction tags and the recording sessions.
- [`references/script-template.md`](references/script-template.md): the shape of `script.md`.

## Script

File: `script.md`, unless `Script.md` or another root markdown draft is already there. That existing file is the script.

### 1. Read

1. The newsletter issue: `$VAULT/outputs/human/content/Newsletter/Text/<title>/` first, then `outputs/agent/`. Then `brief.md` in `Newsletter/Research/<title>/`.
2. If the issue is not in the vault, use `content-calendar` to find it in Notion (data source `collection://2b3920a9-bd3d-817d-ae02-000b15ae13a3`, Platform = Newsletter). Match by name. If several fit, ask which one. Read the Final copy toggle, then AI copy, then Draft & screenshots. Read Brain dump and Research & sources for extra angles. If Samy pasted the issue or a link, use that.
3. Samy's past scripts in `$VAULT/outputs/human/content/Youtube/Script/`. They show how he films and what he keeps.
4. `voice.md`, `proof.md`, `offer.md`.

Note every screenshot in the issue and where it sits. Each one becomes a `[SCREEN]` or `[SLIDE]` beat.

If the issue is only an outline, say so. Script from the outline and mark `[SAMY]` wherever his own words, demo or opinion are needed.

### 2. Map the issue to the video

Build the map before writing, so the video keeps the issue's logic. It goes in the script's header.

| Issue element | Becomes in the video |
|---|---|
| Opening hook or timely observation | Claim in the intro |
| Problem and context (→ bullets) | Setup: the problem, shown on screen or slide |
| "Follow this framework 👇" | Structure preview in the intro ("I'll show you how to : 1… 2… 3…") |
| Numbered framework steps | Body chapters, same steps, same order |
| Screenshots | `[SCREEN]` demo beats or `[SLIDE]` visuals |
| Bonus, "you may also consider…" | Pro level chapter |
| "I know what you're thinking…" | Honest limits |
| Mission statement and sign-off | Outro |

Pick ONE running example from the issue: a real case Samy tested. Thread it through every chapter.

Write the working promise: the one outcome the title and thumbnail will sell. `titles.md` comes later, but the hook has to confirm this promise in 15 seconds, so it is fixed now.

### 3. Write it

Target 1,500 to 2,200 spoken words (10 to 15 min at 150 wpm). If the issue supports less, make a shorter video. Do not pad.

| Section | Time | Job |
|---|---|---|
| Hook and intro | 0:00 to 0:35 | Earn the next 2 minutes |
| Setup | 0:35 to 2:00 | Why the problem exists, the mental model, Samy's angle |
| The system | 2:00 to about 10:00 | The steps, demo-led, one chapter per step |
| Pro level | about 2 min | What most people miss, the advanced version |
| Honest limits | 30 to 60 s | Trade-offs, who should not bother |
| Outro | last 30 to 45 s | Recap, which path, one CTA, next video, sign-off |

Times are estimates from word count. Say so in the timing table.

**Hook and intro (35 s, about 80 words).** The first 15 seconds confirm the working promise. Beats, in order:

1. **Viewer line.** Who it's for, or the doubt they already have. "If you use Claude every day but your designs still look like AI made them…". Never open with "Welcome, my name is Samy": the viewer has not decided to care yet.
2. **Claim.** The contrarian or scale statement from the issue. "Most people build their AI OS in one giant folder."
3. **Proof on screen (about 10 s).** Show the finished thing Samy built before explaining anything. Write it as a `[SCREEN]` direction. This is the proof, so it must exist: mark `[CHECK]` if the issue does not show it.
4. **Structure preview and outcome.** "I'll show you 4 steps : …, so that by the end you can …". One outcome, phrased with "so that".
5. **Credibility in one line.** Only now, and only if it earns trust for this topic. Use what `voice.md` and `proof.md` say (Data & AI consulting for large companies in Europe). No years, client names or results that are not in `proof.md`.
6. **Handoff line.** Samy's fixed transition, identical in every video. Default: "Let's get into it." He can change it once. Then keep it.

**Setup (60 to 90 s).**

- Show the problem: the bad example on a `[SLIDE]`, or the old way on `[SCREEN]`.
- Say why it fails, in one or two sentences. The root cause from the issue.
- Bring in how companies actually solve it, when that is honest. The consulting angle is Samy's edge. Use it in most videos.
- End on the mental model the rest of the video builds on ("any design can be turned into numbers"). Samy usually draws this one: `[IPAD]`.

**The system.** One chapter per step. Each chapter, in order:

1. **Step marker.** Say the number and title out loud ("Step 2 : turn your design system into templates") with a `[TEXT: step marker]`. Viewers need to know where they are.
2. **Why.** One sentence on what this step solves.
3. **Demo.** `[SCREEN]` walkthrough. Narration as short actions: "Open Claude design. Click Design system. Add your fonts." Do not describe what the screen already shows. Exact button names and URLs Samy did not give get `[CHECK]`.
4. **Running example.** Apply the step to it.
5. **Analogy.** Only if the concept is abstract. One plain image ("a skill is a recipe").
6. **Callback.** When a step depends on an earlier one, say so ("Remember the tokens from step 1 ? That's why this works.").

One chapter answers one viewer objection, so it can be sent later as a timestamped reply.

Every 3 or 4 chapters, a progress line: "That's the foundation. Now the fun part." A light, self-aware joke every couple of minutes if one comes naturally. Never force it.

**Lead magnet at 25 to 30% of the runtime.** Right after the first real payoff, one or two sentences pointing to one free resource from the issue or `offer.md` (template, repo, prompt, the free Smart OS). Jeff Su's one-line mention outperforms long mid-video pitches. If the link in `offer.md` is still a placeholder, mark `[CHECK link]`. No paid pitch mid-video.

**Pro level.** The issue's bonus or advanced part (for example, moving from Claude design to his own open-source system). Frame it as what most people miss. Show it on `[SCREEN]`. If Samy has a repo or Smart OS piece for it, it appears here.

**Honest limits.** Samy's pillar is honest, no-hype reviews. 2 or 3 real trade-offs from the issue (cost, tokens, lock-in, setup time) and who should not bother. On `[CAM]`. Adapt the issue's "I know what you're thinking…".

**Outro (30 to 45 s).**

1. Recap in one breath, over a `[SLIDE]` of the full framework.
2. Which path to choose, if the video showed a beginner and a pro option.
3. One CTA: The Smart Creator newsletter (the written version lives there) or the free resource. Not both. The paid offer gets at most one honest line, and only if Samy asks for it.
4. Next video: name a specific related video or upcoming topic, so the end screen has a reason.
5. Sign-off: Samy's fixed closing line. Default: "See you in the next one."

No LinkedIn in any CTA: Samy keeps YouTube off LinkedIn. Showing a LinkedIn post as proof is fine.

### Spoken lines

The script is read aloud and captioned. Write for the ear.

- One sentence per line. One line is one caption and one take. Most lines under 20 words.
- Contractions, plain words, "you". Turn → bullets into spoken lists ("three things : …, … and …").
- Keep Samy's transitions where they sound natural spoken: "Here's how it works :", "That's it.", "Simply put,", "No wonder…".
- Follow the words used and avoided in `voice.md`. No "not X, but Y", no automatic threes, no hype words, no "in today's video". His written punctuation (space before colons) does not change how a line sounds, so keep it only for consistency.
- Numbers and tool names exactly as in the issue. Never invent stats, tools or features. Counts that structure the video ("4 steps") are fine. Counts of what Samy tested ("I tried 12 tools") need `[CHECK]` unless they are in the issue. Results need `proof.md` and something he can show on camera.

### Filming tags

Directions go on their own line, before the lines they cover. Full rules in [`references/filming.md`](references/filming.md).

| Tag | What |
|---|---|
| `[CAM]` | A-roll at the desk, talking to camera |
| `[SCREEN: what to show]` | Tella screen recording with his face next to the screen. One clip per beat |
| `[IPAD: what to draw]` | Writing or annotating on the iPad, filmed or screen-shared |
| `[VO: over what]` | Voice-over (dictaphone) on an animation or slide |
| `[SLIDE n: description]` | Full-screen slide in Tella |
| `[B-ROLL: description]` | Hands, iPad, desk, environment |
| `[TEXT: style]` | Overlay: step marker, split screen, or fullscreen diagram with face-cam PiP |

Camera for the intro, chapter openers, honest limits and outro. Screen, iPad or slides the rest of the time. Do not stay on `[CAM]` for long stretches.

### Output

Follow [`references/script-template.md`](references/script-template.md): header (working promise, main idea, running example, map), timing table, full script, then the shoot lists (Session 1 screen, Session 2 camera, iPad, voice-over, slides). The lists are built from the script, never written separately.

### Check before saving

- [ ] First 15 s confirms the working promise. No name or bio as the first line.
- [ ] Proof shown before explanation.
- [ ] Structure preview and one "so that" outcome in the intro. Intro under 35 s, ends on the handoff line.
- [ ] Same steps, same order as the issue. One running example throughout.
- [ ] Every chapter: step marker, why, demo, callback where relevant.
- [ ] Lead magnet at 25 to 30%, two sentences at most. No paid pitch mid-video.
- [ ] Honest limits included.
- [ ] Outro: recap, which path, one CTA, next video, the fixed sign-off. No LinkedIn CTA.
- [ ] One sentence per line. No AI tells. Nothing invented. `[CHECK]` on every unsure fact, button or link.
- [ ] Every `[SCREEN]`, `[CAM]`, `[IPAD]`, `[VO]` and `[SLIDE]` beat appears in its shoot list, in order.

## Titles

File: `titles.md`. Follow `youtube-title-outlier-packaging`. Start from the working promise in `script.md`. Two variants, different structures, each claim marked **proven**, **on video only** or **packaging hypothesis**. Proven means `proof.md` or the cut. The hook has to confirm the title in 15 seconds: if a title promises more than the intro shows, change the title, or tell Samy the intro needs to change. Do not package a comparison the video is not. Add up to 3 thumbnail text ideas of 4 words or fewer for the thumbnail brief. If vidIQ is connected, offer to score the top titles.

## Description

File: `description.md`. Follow `youtube-description`.

Open with what the viewer gets: 2 sentences, about 25 words together. Sentence 1, at most 12 words, carries the main search phrase. Sentence 2, at most 15 words, says what the video shows. No keyword stuffing, no hashtag block.

Resources use full URLs. YouTube links use `https://www.youtube.com/watch?v=<id>`. Link the newsletter and every resource the script mentions. Chapter times come from the final cut. If there is no cut, take the chapters from the script's timing table and mark them provisional. Offer links come from `offer.md`. Do not invent a sponsor or a download.

## Thumbnail

File: `thumbnail-brief.md`. Follow `youtube-thumbnail`. Target 1280×720, also readable at 320×180.

This app has no YouTube thumbnail canvas. Do not use `newsletter-thumbnail-designer` (that is the 420×300 email image). Do not stretch an infographic into a fake still. A number on the concept has to be in `proof.md` and shown in the video.

Write four lines: text, visual, colour role from `$DESIGN_SYSTEM/DESIGN.md`, what not to do. One dominant promise, 2 to 5 words, the same promise the hook confirms.

A still that is actually a LinkedIn graphic uses `graphics-designer` and `infographics-designer`, then `pnpm dev` in `$DESIGN_SYSTEM` and Export → Download PNG (`GET /api/export/png?mode=<modeKey>` with the server up). Save it in `$VAULT/outputs/agent/design/<title>/` with its own name. Do not call `render.py`.

## Deliver

Return the asset path, the list of `[CHECK]` and `[SAMY]` items, and any claim Samy must confirm. For the script, offer to copy it into the video's Script page in Notion (the YouTube template has a Script toggle with a sub-page) with `content-calendar`. Ask first. Do not create calendar entries unless asked.

This repo does not upload. When he says the video is published:

```bash
node scripts/content-waterfall.mjs publish --title "<title>" --channel youtube --yes
```
