---
name: content-research
description: Deep research for Samy's content, run by the Content researcher bot. Two modes. Ideas: bring 3 to 5 ideas with proof of heat. Research: turn one idea into one brief that feeds every platform (newsletter, YouTube, Short, LinkedIn, X), with parallel subagents on the web, YouTube (vidIQ), X, communities and Samy's own corpus, scored angles, contrarian takes and a hands-on test plan. Saves the brief to the vault and to the Notion card. Use for "research this topic", "find me ideas", "what should I write about".
---

Vault: follow [`pipelines/vault.md`](../../pipelines/vault.md). `$VAULT` is the `VAULT_PATH` checkout (default `../Samy-SmartOS`). Read `$VAULT/AGENTS.md` and follow its Content Workflow. Voice, proof, offer, ICP and positioning are read from `$VAULT/raw/me/` (`voice.md`, `proof.md`, `offer.md`). Never write `$VAULT/raw/` or `$VAULT/outputs/human/`. `$VAULT/outputs/human/content/<Platform>/<Stage>/<title>/` holds Samy's polished, final pieces: read them as the examples to match. Topic knowledge starts at `$VAULT/wiki/index.md` and `$VAULT/wiki/content-os.md`. If `$VAULT` is missing, stop and ask Samy to set `VAULT_PATH`. Do not invent numbers, results or testimonials.

Stage 1 of the waterfall (`content-waterfall`). Replaces Samy's earlier Claude `content-research` skill.

# Content research

Research, structure and bullets only. Never write the newsletter prose here: that is `newsletter-writer`, or Samy himself.

## Context (always apply)

- **Topic space.** AI operating systems for business and life that really save time for founders and business workers.
- **USP filter.** Actionable, realistic advice from 5 years of Data & AI consulting with large European firms. No hype. Bridge amateur and professional advice, keep it simple.
- **Angle and title references.** Matt Gray (systems, frameworks, leverage), Ali Abdaal (evidence-based, warm, personal experiment), Jeff Su (crisp, practical, step-by-step, no fluff). These shape angles and title options. The writing voice is `$VAULT/raw/me/voice.md`.
- **Chain.** Research → Samy tests it himself → newsletter → YouTube (~15 min, scripted from the newsletter) → Short → LinkedIn → X.
- **Channels.** YouTube https://www.youtube.com/@SamyAISystems · Substack https://samychouaf.substack.com/

## Who runs it

The **Content researcher bot** orchestrates this skill. It has its own X access (Grok's built-in X search) and YouTube access. When it passes X or YouTube data in (pasted, or as files), use that data and do not fetch that track again. Otherwise fetch it with the tools below.

| Track | Tool, in order of preference | If missing |
|---|---|---|
| Web landscape and facts | Exa (`web_search_exa`, `web_fetch_exa`) | Built-in web search |
| YouTube | vidIQ connector ("Use vidIQ to…"): outliers, trends, competitor channels, comments | `youtube-title-outlier-packaging` manual method |
| X | Grok's built-in X search, through the bot | `last30days` (X source), then Exa on x.com |
| Communities | `last30days` (Reddit, Hacker News, YouTube comments, GitHub) | Exa on reddit.com and forums |
| Samy's own corpus | The vault, Notion (`content-calendar`), his Substack | |
| Social listening | Latest Social Listening Digest in Gmail | A tailored social listening pass, see Step 2 |

If a tool is missing or not signed in, say which track ran without it. Never fill a track with guesses.

## Pick the mode

- **Ideas mode**: Samy asks for ideas, or gives no topic. Go to [Ideas mode](#ideas-mode).
- **Research mode**: Samy names a topic or a Notion card. Go to Step 0.

His prompt may also carry contrarian takes ("I think X is overrated"), a target platform, or a deadline. Keep them for the brief.

## Step 0: Find the card and check what exists

1. Find the Notion card with `content-calendar` (search by `Name`, 2 or 3 keyword variants). Several matches: take the closest and say which in 1 line. None: create one at **Idea** with the right template, then continue. If he passes a link, use it.
2. Read the card fully: **Brain dump** first. It is Samy's intent, angle, examples and constraints, and the main source of truth. Skim **Research & sources** (or **Research**) so you do not redo it.
3. **Check for a human draft.** Samy sometimes writes the newsletter himself, sometimes an agent drafts it. Look in:
   - `$VAULT/outputs/human/content/Newsletter/Text/<title>/` (and the other platforms' `Text/` or `Script/`)
   - the card's **Draft & screenshots**, **Final copy** or **Script** toggles
   If a draft exists, read it. The research then supports his draft: facts to verify, gaps, examples, packaging. It does not propose a rewrite, and the brief says so under **Human draft**.
4. Run `node scripts/content-waterfall.mjs status --title "<title>"`. If `brief.md` already exists, do not overwrite it. Ask whether he wants an update (`brief-update-YYYY-MM-DD.md`) or stop.
5. Summarise in 3 to 5 bullets: what Samy wants to say, for whom, the angle and examples he already chose. If the Brain dump is empty or thin, ask him for 2 or 3 lines. If he is not around, proceed from the title and flag the assumption.

## Step 1: Frame the idea

Restate the idea in one line. Then:

- Who exactly is this for: founder, solo consultant, operator, employee?
- What job does it do, and roughly how much time does it save per week?

## Step 2: Social listening input

- **Weekly digest.** In Gmail, search `subject:"Social Listening Digest"` and open the most recent thread. Pull what bears on this topic: discussions, pain points, notable posts, data points, tools. If nothing relates, keep the top 2 or 3 trends as context. If the latest digest is over 14 days old, say so.
- **Tailored pass.** When the digest is stale, off-topic, or Samy asks, run a social listening pass on this topic only: `social-listening` with the topic once that skill exists, until then `last30days` with the topic and the last 30 days.

## Step 3: Deep research with subagents

Spawn one subagent per track, in parallel, when the runtime supports subagents. Otherwise run the tracks one after the other. Give each subagent the one-line idea, the reader, Samy's angle, the contrarian takes, and its brief below. Each returns findings with links and dates, and nothing it could not source.

| Track | Brief for the subagent | Saves |
|---|---|---|
| **Web** | 6 to 12 searches, one per sub-question: top newsletters and articles on the topic (titles, promises), official docs and changelogs for the tools involved (what is actually current, prices, limits), and what is overstated | Findings go into the brief |
| **YouTube** | vidIQ: outliers on the topic in the last 3 to 6 months (views against the channel's own median, as `youtube-title-outlier-packaging` defines it), title structures, thumbnail promises, the top questions in comments | `$VAULT/outputs/agent/content/Youtube/Research/<title>/outliers.md` |
| **X** | Posts and threads on the topic going above the author's normal, the arguments people are having, the claims that get pushback | `$VAULT/outputs/agent/content/X/Research/<title>/x-signals.md` |
| **Communities** | Reddit, Hacker News, forums: what real users complain about, get stuck on, or ask twice | Findings go into the brief |
| **Own corpus** | Samy's past pieces in `$VAULT/outputs/human/content/`, the wiki, his Substack archive, and the calendar's Posted cards: what he already said, so the piece does not repeat a past issue | Findings go into the brief |

When all tracks are back, merge them. Drop duplicates. Where tracks disagree, keep both and say which is more recent.

## Step 4: Angles

List 5 to 8 pain points or angles that existing content covers poorly, using the Brain dump, the digest and the tracks as signals. Score each 1 to 5:

- **Gap**: how poorly existing content covers it.
- **USP fit**: does consulting experience (data quality, governance, scale, ROI, change management, real constraints) give Samy a credible edge?
- **Time saved**: measurable and real for the target reader.
- **Simplicity**: can a non-technical founder set it up in under an hour?
- **Timeliness**: is it trending now (digest, recent launches, outliers)?

Recommend the top angle in 2 sentences. If the research points away from the Brain dump's angle, say so explicitly and explain why.

## Step 5: Contrarian takes

1. **Samy's takes.** Test every take he gave in the prompt or the Brain dump: evidence for, evidence against, verdict (holds, partly, does not hold). Keep his take even when the evidence is mixed, and say how to phrase it honestly.
2. **Found takes.** Add 3 to 5 contrarian takes the research supports: a common belief in the niche that the evidence or his consulting experience contradicts.
3. **Hype check.** Which popular claims on this topic are overstated, and why.

For each take that holds, name where it is used: the newsletter's "why common advice falls short", a YouTube reversal title, a LinkedIn Contrarian post, or the X article's claim.

## Step 6: Hands-on test plan (Samy runs it)

Propose 1 to 3 extremely useful use cases, starting from the Brain dump's examples. Prefer one great use case over five shallow ones. For each: setup (tools, accounts, cost, time), steps as a checklist, success metric, screenshots to capture in order (they become the carousel and the newsletter visuals), likely failure points. Add an empty results log.

If the honest conclusion is "this doesn't really save time", say so. That can be the angle.

## Step 7: The brief

Fill [`references/brief-template.md`](references/brief-template.md). It has one block per platform, so the newsletter, YouTube, Short, LinkedIn and X writers all start from it:

- Working title and 5 title options (a mix of the three references, nothing Samy can't back up)
- One-line promise, claim, stance check
- Trend signal, landscape, scored angles, contrarian takes, hype check
- Test plan
- Per platform: newsletter outline (or what to add to his draft), YouTube angle and titles, Short moments, LinkedIn insight and visual, X angle
- Facts verified with dates, sources

## Step 8: Save to the vault and to Notion

Both, every time.

1. **Vault.** `$VAULT/outputs/agent/content/Newsletter/Research/<title>/brief.md`, plus the track files above. Run `node scripts/content-waterfall.mjs init --title "<title>"` first so the folder and `waterfall.json` exist. Never overwrite an existing `brief.md`.
2. **Notion.** Follow `content-calendar`. Append the brief and the test plan inside the card's **Research & sources** toggle (**Research** on a YouTube card), below anything already there, ending with `Source: outputs/agent/content/Newsletter/Research/<title>/brief.md`. Never edit the Brain dump or any of Samy's toggles.
3. Set **Content Stage** to **Research / Scripting**. Keep the Platform. Set **Content Format** and **Content Type** only if empty (default `AI systems (How To)`).

If Notion is unavailable, save to the vault and say the card was not updated.

## Ideas mode

1. **Read the demand.** The latest Social Listening Digest, YouTube outliers and trends in the niche (vidIQ), X posts going above normal, community questions (`last30days`), and last month's posted pieces with their results if Samy shared them.
2. **Read the backlog.** Every **Idea** card in the calendar (`content-calendar`). Prefer upgrading an existing idea over adding a new one, and say which card it is.
3. **The slate.** 3 to 5 ideas. For each: the one-line idea, the reader, proof of heat (links: outliers, posts, threads, digest lines), the gap, a contrarian take if one exists, the pillar from `$VAULT/wiki/`, the funnel job, and what he can show on camera. Prefer ideas with more demand than supply. Score each with the five criteria from Step 4.
4. **Save.** `$VAULT/outputs/agent/content/Newsletter/Research/Ideas YYYY-MM-DD/ideas.md`. Show the slate in chat.
5. **Samy picks.** Never pick for him. For each idea he keeps, create or update the Notion card at **Idea** (`content-calendar`), with the proof of heat in **Research & sources**. Then run Research mode on it when he asks.

## Rules

- Verify every tool feature, price and limit against a current source, and flag anything unverified.
- Numbers about Samy come only from `$VAULT/raw/me/proof.md`. Another creator's numbers are evidence about the market, never Samy's results.
- Keep his angle. Research sharpens it. When it should change, say so.
- Nothing here posts, schedules, uploads or sends.
- Return the brief path, the Notion card link, the recommended angle, and which tracks ran without their tool.
