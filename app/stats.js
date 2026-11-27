// stats.js — fills the header stats bar from DEALS: deal count, stores and
// categories covered, biggest saving and total dollars saved.
function moneyWhole(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function renderStats() {
  if (typeof DEALS === "undefined") return;
  const stores = new Set(DEALS.map(function (d) { return d.store; })).size;
  const categories = new Set(DEALS.map(function (d) { return d.category; })).size;
  let biggest = DEALS[0];
  let biggestPctDeal = DEALS[0];
  let totalSaved = 0;
  DEALS.forEach(function (deal) {
    const saved = deal.usual - deal.sale;
    const pct = 1 - deal.sale / deal.usual;
    totalSaved += saved;
    if (saved > biggest.usual - biggest.sale) biggest = deal;
    if (pct > 1 - biggestPctDeal.sale / biggestPctDeal.usual) biggestPctDeal = deal;
  });
  const biggestPct = Math.round((1 - biggestPctDeal.sale / biggestPctDeal.usual) * 100);
  const set = function (id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  set("stat-deals", String(DEALS.length));
  set("stat-stores", String(stores));
  set("stat-categories", String(categories));
  set("stat-biggest", "-" + biggestPct + "%");
  set("stat-saved", moneyWhole(totalSaved));
  set("stat-biggest-name", biggest.product);
}

document.addEventListener("DOMContentLoaded", renderStats);
