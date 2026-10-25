# Brief template: one idea

`content-research` fills this into `$VAULT/outputs/agent/content/Newsletter/Research/<title>/brief.md` when that file is missing, and pastes the same brief into the Notion card. Fill every section and delete the hints. If `brief.md` is already there, do not overwrite it: write `brief-update-YYYY-MM-DD.md` beside it. Never write `$VAULT/raw/`.

One brief feeds every platform. The writers adapt it. They do not research again.

```markdown
# <Working title>

Newsletter first, then YouTube (and an optional Short), then LinkedIn, then X. One asset at a time. Release day D is YYYY-MM-DD, or "to set".

Notion card: <link> · Researched YYYY-MM-DD · Tracks run: web, YouTube, X, community, own corpus

## The idea

- **In Samy's words.** "<quote from the Brain dump or his prompt>"
- **His angle.** <the angle he already chose; research sharpens it, never replaces it silently>
- **Human draft.** <none | path or Notion toggle of his draft, and what it already covers>
- **Reader.** <founder, solo consultant, operator, employee; ICP in raw/me/>
- **Job and time saved.** <what it does for them, roughly per week>
- **Pillar and funnel stage.** <1 pillar from $VAULT/wiki/, start at content-os.md>, <top, middle or bottom>
- **One-line promise.** <what the reader gets>
- **Claim.** <1 sentence the newsletter and the video can both support>
- **Stance check.** <what he already published on this, and what this piece adds>

## Trend signal

<What the Social Listening Digest (or the tailored pass) says now, dated. Say if the digest is older than 14 days.>

## Landscape

| Source | Platform | Angle taken | What's good | What's missing or hyped |
|---|---|---|---|---|

YouTube outliers: see `Youtube/Research/<title>/outliers.md`. X signals: see `X/Research/<title>/x-signals.md`.

## Angles, scored 1–5

| Angle | Gap | USP fit | Time saved | Simplicity | Timeliness | Total |
|---|---|---|---|---|---|---|

**Recommended angle.** <2 sentences. If it points away from his Brain dump angle, say so and why.>

## Contrarian takes

| Take | From | Evidence for | Evidence against | Verdict | Use it in |
|---|---|---|---|---|---|

From: "Samy" for takes he gave, "research" for takes found. Verdict: holds, partly, does not hold.

**Hype check.** <popular claims on this topic that are overstated, and why>

## Hands-on test plan (Samy runs it)

### Use case 1: <name>
- Setup: <tools, accounts, cost, time to set up>
- Steps:
  - [ ] <step>
- Success metric: <minutes saved, output quality, what "works" means>
- Screenshots, in order: <1. … 2. …> (these become the carousel and the newsletter visuals)
- Watch for: <likely failure points>

Results log: what worked · what broke · real time saved · verdict

## Per platform

### Newsletter
<If his draft exists: what to verify or add to it, no rewrite. Otherwise the outline, bullets only: hook idea, problem, why common advice falls short, the system (steps), results from the test, limits and when not to use it, CTA.>

### YouTube (~15 min)
<Same structure. Mark screen-share demo vs on camera. 5 title options, from the outliers, each claim marked proven / on video only / packaging hypothesis.>

### YouTube Short
<1 to 3 moments from the video that stand alone in under 60 s, or "none".>

### LinkedIn
<1 insight that links to the newsletter. Post type. Carousel or infographic idea, with the screenshots it needs.>

### X
<Article angle, or thread angle, with the 1 claim that carries it.>

## Facts, verified YYYY-MM-DD

<Only claims checked at the source, each with its link. Numbers outside $VAULT/raw/me/proof.md stay out. No invented results or testimonials. Flag anything unverified.>

## Publish calendar

Production order is not this calendar. Draft the next missing asset only.

| Date | Piece | Status | Channel | Draft path |
|---|---|---|---|---|
| D | Newsletter issue | | newsletter | $VAULT/outputs/agent/content/Newsletter/Text/<title>/ |
| D | YouTube | | youtube | $VAULT/outputs/agent/content/Youtube/Script/<title>/ |
| | YouTube Short | | youtube-short | $VAULT/outputs/agent/content/Youtube short/Script/<title>/ |
| | LinkedIn | | linkedin | $VAULT/outputs/agent/content/Linkedin/Text/<title>/ |
| | X | | x | $VAULT/outputs/agent/content/X/Text/<title>/ |

## Open decisions

1. <only what Samy alone can decide: release date, which use case to test>

## Sources

<Every link used, grouped by track.>

## Results

<Filled after he publishes. He says the word, `publish` records the date. Nothing moves and nothing is posted from this repo.>
```
