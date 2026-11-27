[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/Ikball53/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/Ikball53/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

# DealHound

A static, no-network Black Friday / Cyber Monday deal finder. Everything runs
locally in the browser — no API calls, no tracking, no backend.

## What it covers

Thirty real deals, checked on 27 November 2026, across Best Buy, Amazon,
Walmart, Target, Disney+, and Apple TV. Each deal lists the product, the
store, a link to the store listing, the sale price, the usual price, the
discount, the date it was checked, the source, and a verdict: Real Deal,
Strong Price, or Routine Sale.

## Finding a deal

Search by product name, or narrow the list by category, store, and discount
size. A cross-store comparison strip sits at the top, so the same product at
different stores can be judged side by side at a glance. Deals marked Real
Deal are the ones where the sale price beats the usual price by a clear
margin; Routine Sale means the discount is the kind that shows up often.

## Running it

Open `app/index.html` directly in a browser, or serve the `app/` folder with
any static server:

```sh
python3 -m http.server -d app
```

`main.ts` hands this site in for the make.fun bounty.

## Bounty

Built for the make.fun Black Friday deal-finder bounty:

https://make.fun/bounty/black-friday-deal-finder-01
