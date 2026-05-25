# drops/

Scratch folder for files you want Claude to read.

## How to use

Drop anything in here that you'd like me to look at — CSVs, screenshots, scraped
HTML, old template files, exports from G2 / Apify / Outscraper, notes, anything.
Commit them and I'll pick them up automatically when the session starts.

```
drops/
├── businesses-raw.csv        # original scrape with all columns
├── template-original.zip     # if you want to keep a copy of the original template
├── notes.md                  # any free-form context for me
└── screenshots/              # design refs, competitor sites, etc.
```

## Rules of the road

- **Privacy:** files here are visible to anyone with repo access. If the repo is
  public, the drops are public. Flip the repo to private in GitHub settings if
  the data is sensitive (lead lists, emails, phone numbers).
- **File size limit:** GitHub blocks single files larger than **100 MB**. For
  bigger files (videos, big image sets), use Git LFS or share an external link
  (Drive/Dropbox) in `drops/notes.md` and I'll fetch it.
- **Not used by the build:** nothing in this folder is read by `scripts/build.js`.
  The build only reads `data/businesses.csv`. When a CSV is ready to drive the
  build, copy or move it from `drops/` to `data/businesses.csv`.
- **Safe to delete:** once I've extracted what I need into the real folders
  (`data/`, `template/`), the originals can stay here as backups or be deleted.

## Tell me when something lands

After you commit a drop, ping me in chat with what you added so I know to look:

> "Dropped the raw CSV at `drops/businesses-raw.csv` — 1,200 rows from Apify."
