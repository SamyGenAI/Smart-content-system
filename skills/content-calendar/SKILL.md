---
name: content-calendar
description: Read and update Samy's Notion content calendar (🗓️ Content calendar - Samy). Use to list ideas or what is in progress, find the card for a piece, create a card from the right template, move a card's stage, set a schedule date, or paste an agent draft into a card's toggle. Writes only when Samy asks.
---

Vault: follow [`pipelines/vault.md`](../../pipelines/vault.md). The vault is the source of truth for drafts. Notion is the source of truth for **what** is planned and **where** it stands. Agent drafts live in `$VAULT/outputs/agent/content/<Platform>/<Stage>/<title>/`. The calendar points to them. It does not replace them.

Tools: the Notion MCP (`notion-fetch`, `notion-query-data-sources`, `notion-search`, `notion-create-pages`, `notion-update-page`). If the Notion tools are missing, stop and say the Notion connector needs to be connected. Do not fall back to a local copy of the calendar.

# Content calendar

## The database

| | |
|---|---|
| Database | [🗓️ Content calendar - Samy](https://app.notion.com/p/2b3920a9bd3d8019b14edaa455829be6) |
| Data source | `collection://2b3920a9-bd3d-817d-ae02-000b15ae13a3` |
| Board view (by stage) | `view://2b3920a9-bd3d-8101-a8aa-000cd9ac9bde` |
| Active table (Idea to Final copy) | `view://2b3920a9-bd3d-81f3-bf7d-000c1576915d` |
| Calendar view (by Scheduled) | `view://2b3920a9-bd3d-8137-8f6d-000c05e0446d` |

Properties, with the exact option names:

| Property | Type | Options |
|---|---|---|
| `Name` | title | The piece title. Same string as the vault `<title>` folder |
| `Platform` | select | `Newsletter`, `Youtube`, `Youtube short`, `Linkedin`, `X`, `Blog` |
| `Content Stage` | select | `Idea`, `Research / Scripting`, `Design or Filming`, `Final copy / Editing`, `Scheduled`, `Posted` |
| `Content Format` | select | `Article`, `Carousel`, `Video`, `Infographic`, `Image` |
| `Content Type` | select | `Build in public`, `AI systems (How To)`, `Educational` |
| `Scheduled` | date | SQL columns `date:Scheduled:start`, `date:Scheduled:end`, `date:Scheduled:is_datetime` |

If an option is missing or renamed, re-fetch the data source. The schema wins over this table. Never add an option or property without Samy's go-ahead.

Vault platform to Notion `Platform`:

The vault platform folder and the Notion `Platform` option have the same name: `Newsletter`, `Youtube`, `Youtube short`, `Linkedin`, `X`. `Blog` has no vault folder.

## Templates

Create cards from the platform's template (`template_id` in `notion-create-pages`, no `content`). Each template is a set of toggles. Know which toggle is whose. `Youtube short` and `X` have no template yet: use the YouTube template for a Short and the LinkedIn template for X, then set `Platform` to the right option.

| Template | `template_id` | Toggles |
|---|---|---|
| `[Newsletter Title]` | `343920a9-bd3d-80de-8160-d04569c5fcea` | Brain dump · Research & sources · Draft & screenshots · AI copy · Final copy · Thumbnail prompt · Tasks |
| `[YouTube Video Title]` | `343920a9-bd3d-8071-b5ae-c2362b73f7a3` | Brain dump · Title & thumbnails ideas · Research · Script (a sub-page) · Slides prompt · Tasks |
| `[LinkedIn Post Title]` | `2b3920a9-bd3d-8186-91ae-e0edb3a1eff5` | Hooks · Research & sources · Draft & Screenshots · Design brief · Tasks |

| Toggle | Owner | Agent rule |
|---|---|---|
| Brain dump | Samy | Read first, always. Never edit |
| Draft & screenshots | Samy | Read. Never edit |
| Final copy | Samy | Never edit |
| Tasks | Samy | Never tick a box for him |
| Research & sources, Research | Agent | Append below what is there |
| AI copy, Hooks, Title & thumbnails ideas | Agent | Append below what is there |
| Design brief, Thumbnail prompt, Slides prompt | Agent | Append below what is there |
| Script sub-page | Agent, only when asked | Append. Never replace his edits |

## Read

Default read, everything in progress:

```sql
SELECT "Name", "Platform", "Content Stage", "Content Format", "Content Type", "date:Scheduled:start", url
FROM "collection://2b3920a9-bd3d-817d-ae02-000b15ae13a3"
WHERE "Content Stage" IN ('Idea', 'Research / Scripting', 'Design or Filming', 'Final copy / Editing')
ORDER BY createdTime DESC
```

Other reads:

- **Ideas only**: `WHERE "Content Stage" = 'Idea'`, optionally `AND "Platform" = ?`.
- **This week's schedule**: `WHERE date("date:Scheduled:start") BETWEEN date('now') AND date('now', '+7 days')`.
- **Find a piece by title**: `WHERE "Name" LIKE ?` with `%keyword%`. Try 2 or 3 keyword variants, then `notion-search` with `data_source_url` set to the data source. Several matches: take the closest and say which one in 1 line. None: say so. Never create a card silently.
- **What the stage really is**: compare the card with the vault. Run `node scripts/content-waterfall.mjs status --title "<Name>"`. If the vault is ahead of Notion (a draft exists but the card says `Idea`), report the gap. Do not fix it unless asked.

If SQL is refused on this plan, use `mode: "view"` with the active table or board view URL.

To read a card's toggles, `notion-fetch` its URL. Read the Brain dump before any research or draft. It is Samy's intent and his angle: keep it.

Return reads as a short table: Name, Platform, Stage, Format, Scheduled, link. Group by stage when there are more than 8 rows.

## Write

Only when Samy asks in this conversation, or a skill he invoked says to update the card and he agreed. Never batch-edit cards he did not name. Fetch the card first, then make the smallest edit.

**Create a card.** Search first, as above. If none exists, create it in `data_source_id` `2b3920a9-bd3d-817d-ae02-000b15ae13a3` with the platform's `template_id`, `Name`, `Platform`, `Content Stage` = `Idea` (or the stage he names), and `Content Format` / `Content Type` only if he gave them. Template content appears a few seconds after creation: fetch again before writing into a toggle.

**Move the stage.** Agents may set:

| Stage | When |
|---|---|
| `Research / Scripting` | A research brief or script exists in the vault for this piece |
| `Design or Filming` | A design brief exists, or Samy says he is filming |
| `Final copy / Editing` | Samy says he is polishing, or his file is in `outputs/human/` |
| `Scheduled` | Only when Samy says he queued it on the platform, with the date |
| `Posted` | Only when Samy says it is published. Then also run `node scripts/content-waterfall.mjs publish --title "<Name>" --channel <channel> --yes` |

Never move a card backwards without asking.

**Set the date.** `date:Scheduled:start` as `YYYY-MM-DD`, `date:Scheduled:is_datetime` = 0, unless he gives a time. Only a date he agreed.

**Paste a draft into a toggle.** `notion-update-page` with `update_content`: match the toggle's existing last line and append after it, inside the toggle. Paste the copy as it is in the vault file, then one line: `Source: outputs/agent/content/<Platform>/<Stage>/<title>/<file>`. Do not rewrite the toggle. Do not paste into Samy's toggles.

Before writing toggle content, read `notion://docs/notion-flavored-markdown-spec` once with `notion-fetch`.

## Rules

- Nothing here posts, schedules on a platform, uploads or sends. `Scheduled` in Notion is a label, not a queue.
- The Notion `Name` and the vault `<title>` are the same string. If they differ, use `node scripts/content-waterfall.mjs link` on the vault side. Do not rename the card without asking.
- Never delete, archive or duplicate a card.
- After any write, return the card link and what changed in 1 line.
