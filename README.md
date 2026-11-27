# DealHound — Black Friday 2026 Deal Finder

A static deal finder for Black Friday and Cyber Monday 2026, built for the
make.fun `black-friday-deal-finder-01` bounty.

## What it is

DealHound lists 30 real deals checked on Friday 27 November 2026 across
Amazon, Best Buy, Walmart, Target, Disney+ and Apple TV — TVs, laptops,
audio, wearables, gaming, home, kitchen, toys, streaming, beauty and phones.
Every card shows the product, the store, a link to the product at that store,
the sale price, the usual price, the computed discount, the dollars saved, the
source that reported the price, and the date it was checked.

Each deal carries an honest verdict:

- **Real deal** — a new low or the lowest price seen this season.
- **Strong price** — a genuinely good cut, but not a record.
- **Routine sale** — a small cut; fine if you need it now, not a reason to rush.

Search, category, store, minimum-discount and verdict filters all work, plus
sorting by dollars saved, discount, price or name. A comparison strip shows
three products found at two stores each, cheapest first. Filters live in the
URL query string, so any filtered view can be linked (`?q=dyson`,
`?verdict=real`, `?category=TVs`).

## How it is built

- `app/` — the static site, no build step, no network requests. `deals.js`
  holds the deal data, `finder.js` renders and filters it, `compare.js`
  renders the cross-store comparison, `stats.js` fills the header stats.
- `main.ts` — the Node 22 entry program: copies `app/` and `screenshots/`
  to the output directory and writes `dossier.json` with the kit's
  `buildDossier`.
- `screenshots/` — real renders of the running site (desktop + phone).

## Run it

Serve `app/` with any static server and open `index.html`, for example:

```
python3 -m http.server 8080 --directory app
```

Then open http://localhost:8080/ in a desktop or phone browser.
