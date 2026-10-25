# Social listening

What the watchlist and the web are saying. Reports in chat. Feeds `content-research` (tailored pass) and the weekly Social Listening Digest.

## Inputs

- `context/signals/watchlist.md` — who to watch. Not a copy of the ICP.
- `context/signals/signals.md` — optional ranking rules. Copy from `signals-template.md`.
- Fit is judged against `## ICP` in `$VAULT/raw/me/offer.md` (the vault, `VAULT_PATH` in `.env`). Read that heading. Do not paste it into the watchlist.

Ask which source to run. Do not run every source.

## Command

```bash
python scripts/signals/social-listening.py --source reddit --dry-run
python scripts/signals/social-listening.py --source linkedin --dry-run
python scripts/signals/social-listening.py --source linkedin --confirm
```

`--estimate` is the same as `--dry-run`.

## Cost

| Source | Paid? | Gate |
|---|---|---|
| LinkedIn (Apify) | yes, per post | `--confirm` |
| X | no script: the Grok bots' built-in X search, never the xAI API | — |
| Web with Brave, Exa, Serper, or Parallel | yes, per query | `--confirm` |
| Web keyless, Reddit, YouTube without Gemini | no | `--dry-run` optional |
| YouTube with `GEMINI_API_KEY` | Gemini may read caption-less videos | `--confirm`, or `--no-gemini` to stay free |

Gmail has no script. Read it through the Gmail connector, newsletters only, and never label, delete, or email anyone else.

## Output

Chat report. Listening writes no file. A paid run still prints call counts and an approximate cost before it spends.

## Review gate

Samy decides which signal is worth a piece of content. The script does not draft, reply to or send anything from a post.
