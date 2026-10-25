---
name: linkedin-copywriter
description: Write or edit one LinkedIn post in Samy's voice, using his post types, mobile-first formatting, symbol system and CTA patterns. Use for "write a LinkedIn post", "draft a post about", "LinkedIn ghostwriting", or the post body inside linkedin-writer.
---

Vault: follow [`pipelines/vault.md`](../../pipelines/vault.md). `$VAULT` is the `VAULT_PATH` checkout (default `../Samy-SmartOS`). Read `$VAULT/AGENTS.md` and follow its Content Workflow. Voice, proof, offer, ICP and positioning are read from `$VAULT/raw/me/` (`voice.md`, `proof.md`, `offer.md`). Never write `$VAULT/raw/` or `$VAULT/outputs/human/`. `$VAULT/outputs/human/content/<Platform>/<Stage>/<title>/` holds Samy's polished, final pieces: read them as the examples to match. Topic knowledge starts at `$VAULT/wiki/index.md` and `$VAULT/wiki/content-os.md`. Save the post to `$VAULT/outputs/agent/content/Linkedin/Text/<title>/post.md`. If `$VAULT` is missing, stop and ask Samy to set `VAULT_PATH`. Do not copy vault files into this repo, and do not invent numbers, results or testimonials.

Called by `linkedin-writer` for the post body. Not a pipeline. If a markdown file is already in the draft folder, that file is the post. Do not add a second copy.

Adapted from Samy's `linkedin-ghostwriter` Claude skill. Two rules win over anything below:

- **`$VAULT/raw/me/voice.md` is the voice.** Read it first, every time. When it disagrees with this skill, `voice.md` wins. The voice notes here are a summary of his best posts, not a replacement.
- **The opening is owned by [`linkedin-hook-writer`](../linkedin-hook-writer/SKILL.md)**: its length budgets and hook families win.

# Write a LinkedIn post

Read `$VAULT/raw/me/voice.md`, `proof.md`, `offer.md`, `$VAULT/wiki/content-os.md` and his polished posts in `$VAULT/outputs/human/content/Linkedin/Text/`. Read the full source behind the central claim: the newsletter issue, the research in `$VAULT/outputs/agent/content/Linkedin/Research/<title>/`, or what Samy pasted.

## 1. Pick the post type

Ask only if the type is unclear from the brief.

| Type | Purpose | Best for |
|---|---|---|
| Lead Magnet | Drive sign-ups or downloads | List building |
| How-To | Teach a system or a skill | Authority |
| Story | Personal narrative and lesson | Connection |
| Authority | Show expertise | Credibility |
| Contrarian | Challenge a common belief | Reach |
| Transformation | Before and after | Inspiration |
| Engagement | Comments and shares | Reach |

One useful point, one reader (ICP in `raw/me/`), one job: Reach, Belief or Signup. From a newsletter issue, take one argument. Do not compress the whole issue.

## 2. Write the hook

Call `linkedin-hook-writer`. It returns one chosen opening with its counts. Use it as is.

## 3. Write the body

Write in the voice from `$VAULT/raw/me/voice.md`. The patterns below come from his top posts and sit under it. Samy's top posts read like talking to a smart friend, not like a framework.

- One sentence per line. Never two sentences on one line.
- About 7 to 8 words per line when possible, so it fits a phone.
- A blank line between thoughts.
- 100 to 200 words in total. His best posts are short: cut hard. The 3,000-character limit is a ceiling, not a target.
- State the pain in 2 to 3 lines, then move to the solution.
- Short editorial lines between sections: "That's it.", "And I get it.", "Think twice.", "It won't."
- Parenthetical asides: "(no need to use terminal commands)", "(link in first comment)".
- Start lines with "And", "But", "Or". Use "Here's" and "Here are" into lists. Drop articles when it hits harder: "No code. No automation tool."
- French-English punctuation: a space before colons and question marks ("Here's how :", "Why ?").
- "..." for trailing thoughts: "and so on...".
- Name tools and competitors and compare them directly.
- Talk to the reader: "you", "your".

Numbers: a specific number beats a vague claim ("< 5 min" beats "quickly"), but every public number, result or testimonial comes from `$VAULT/raw/me/proof.md` or a source named in the draft. Without one, write the claim without a number.

## 4. Symbols

| Symbol | Use |
|---|---|
| `→` | Main list items and transitions |
| `↳` | Sub-points |
| `-` | Secondary or contrast points, mixed naturally with `→` |
| `•` | A plain bullet list |
| `✅` / `❌` | Do and don't comparisons |
| `1.` `2.` `3.` or `1️⃣` `2️⃣` `3️⃣` | Numbered items. One style per post, never both |
| `𝘐𝘵𝘢𝘭𝘪𝘤` (Unicode sans-serif italic) | Prompt examples and quotes |
| `♻️` | The repost line |
| `👇` | End of a sentence pointing to a resource. Not `↓` |

No Unicode bold sub-headers (`𝗕𝗼𝗹𝗱`): his top posts never use them. No more than 3 emoji in a section.

## 5. CTA

A divider (`________`) between the body and the CTA. One divider per post. 2 to 3 lines. No motivational closer or "power ending" before it, and no "📌 P.S.".

Standard ending, most posts:

```
______________________________

Follow for more → Samy Chouaf
♻️ Repost to help others
```

Newsletter ending, when the post points to the issue:

```
______________________________

Receive weekly AI systems in your inbox : https://lnkd.in/eJVy5iRh

Follow for more 👉 Samy Chouaf
```

Resource in the comments:

```
Follow the guide to get started 👇

(no need to use terminal commands)
```

Lead magnet, only when `offer.md` or the brief has a real resource to send:

```
Comment "[KEYWORD]" and I'll send it to you.

________________________________________
```

"Useful ? Follow for more 👉 Samy Chouaf" is an accepted variant. Links go in the first comment unless the CTA above carries the newsletter link.

## 6. Edit

- Cut: "dive into", "unleash", "unlock", "delve", "leverage", "harness", corporate words, generic praise, repeated morals.
- No "step-by-step guide" or "framework" language in the hook.
- No invented milestone, anecdote, slang, or deliberate mistake to sound human.
- Check every fact, date and number against its source. Keep reported results, targets and examples apart.
- Read the opening, the line starts and the CTA together: the argument still makes sense.
- Voice check: reread `voice.md` and fix any line he would not say.
- Phone test: would this look clean on a phone screen?

For a revision, make Samy's requested changes first and keep his facts and phrasing.

## Deliver

Save the finished post to `$VAULT/outputs/agent/content/Linkedin/Text/<title>/post.md`, exactly as it will be pasted: no headings, notes or counts inside the copy. In chat, return the path, the post ready to copy, the post type, and any source or uncertainty in 1 to 3 lines.

Saving a draft does not schedule or publish it. Samy posts it. The Notion card is updated by `content-calendar`, only when he asks. When he says it is published, `node scripts/content-waterfall.mjs publish --title "<title>" --channel linkedin --yes` records it. Nothing moves and nothing is posted.
