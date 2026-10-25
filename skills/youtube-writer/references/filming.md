# How Samy films

Taken from his scripts in `$VAULT/outputs/human/content/Youtube/Script/` ("How to design with AI", "How to build your AI OS") and his notes, 2026-10-25. When he changes his setup, update this page.

## Setup

| Tag | What it is | Recorded in |
|---|---|---|
| `[CAM]` | A-roll at his desk, talking to camera. | Session 2 |
| `[SCREEN: what to show]` | Screen recording in Tella, with his talking head next to the screen (the Jeff Su / Ben AI layout). One Tella clip per beat. | Session 1 |
| `[IPAD: what to draw]` | He writes or annotates on the iPad. Either filmed (hands and writing) or the iPad screen shared. Used for mental models, diagrams, annotating a design or a timeline. Say which: `[IPAD film: …]` or `[IPAD share: …]`. | Film: Session 2. Share: Session 1 |
| `[VO: over what]` | Voice-over recorded with the dictaphone, over an animation or a slide. | Voice-over list |
| `[SLIDE n: description]` | Full-screen slide shown in Tella. | Built before Session 1 |
| `[B-ROLL: description]` | iPad, hands, desk, plants, environment. | Session 2 |
| `[TEXT: style]` | Overlay added in the edit. Three styles only: step marker, split screen (face + bullets), fullscreen diagram with face-cam PiP. | Edit |

Slides: transition slides (steps, section title, big stat, before/after, highlighted text, end card) can be built with `tella-transition-slide`. Other slides come from the Claude-made deck. Default style: cream background, square grid, Notion-style illustration, Smart Creator design system. A slide with a number follows the same proof rule as the script.

In Notion, Samy colour-codes the directions: purple for screen share, blue or yellow for slides.

## Writing directions

- Put the tag on its own line, before the lines it covers. It holds until the next tag.
- `[SCREEN]` says which app or file is open and what to click, in order. If Samy did not give the exact URL or button name, write `[CHECK]` (his own scripts say "specify actual URL", "verify exactly how to do it").
- One `[SCREEN]` beat is one take. If a demo has 5 stages, write 5 beats. He records them as separate Tella clips.
- Prompts shown on screen are written out in full in the script, in a code block, so he can paste them while recording.
- Camera at the intro, chapter openers, honest limits and outro. Screen, iPad or slides the rest of the time. More than about 45 s of `[CAM]` in a row needs a cutaway (`[B-ROLL]`, `[SLIDE]` or `[TEXT: split screen]`).
- A quick aside to camera inside a screen section is fine: `[CAM]` for one or two lines, then back to `[SCREEN]`. His design script does this ("One key advice also…").

## Sessions

Samy batches by setup, not by script order. The script ends with one list per session, built from the tags, in script order, each line numbered with the section it belongs to.

| List | Contains | What each line says |
|---|---|---|
| Session 1: screen | Every `[SCREEN]` and `[IPAD share]` beat | App or file open, what to click, the prompt to paste, the narration lines to say over it |
| Session 2: camera | Every `[CAM]` line, `[IPAD film]` and `[B-ROLL]` | The exact lines to read, in batch |
| Voice-over | Every `[VO]` | What it plays over, the lines |
| Slides | Every `[SLIDE]` | Slide number, one-line description, what it shows, build skill (`tella-transition-slide` or deck) |
| Prep | Files, accounts, repos, demo data to have ready before Session 1 | One item per line |
