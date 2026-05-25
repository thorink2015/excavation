# notes/

Long-lived memory for this project. Read by Claude at the start of each session
since the container is ephemeral (every session starts fresh — without these
notes, prior decisions and credentials would be lost).

## Files

- `project.md` — what we're building, why, and the current state.
- `cloudflare.md` — account info, project name, URL pattern, deploy config.
- `csv-schema.md` — current shape of `data/businesses.csv` (real columns, gotchas, sample row).
- `template-source.md` — what the user dropped in `drops/`, what I extracted, what I changed.
- `decisions.md` — architectural choices and the reasoning, so we don't relitigate.
- `known-issues.md` — bugs found by the validator and what's still open.

## Rules

- Never put secrets here. Account IDs are fine. API tokens, passwords, cookies, private keys — never.
- Keep entries short. Bullets > paragraphs.
- When something changes, update the file. Stale notes are worse than no notes.
