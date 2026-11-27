// finder.js — renders the deal grid and runs search, filters and sorting.
// Reads DEALS from deals.js. All state lives in the URL query string so a
// filtered view can be linked and screenshotted (?q=, ?category=, ?store=,
// ?minoff=, ?verdict=, ?sort=).
const VERDICT_LABEL = {
  real: "REAL DEAL",
  strong: "STRONG PRICE",
  routine: "ROUTINE SALE"
};

const VERDICT_CLASS = {
  real: "verdict-real",
  strong: "verdict-strong",
  routine: "verdict-routine"
};

function discountOf(deal) {
  return Math.round((1 - deal.sale / deal.usual) * 100);
}

function savedOf(deal) {
  return deal.usual - deal.sale;
}

function money(n) {
  return "$" + n.toFixed(2).replace(/\.00$/, "");
}

function readState() {
  const params = new URLSearchParams(location.search);
  return {
    q: (params.get("q") || "").trim().toLowerCase(),
    category: params.get("category") || "All",
    store: params.get("store") || "All",
    minoff: parseInt(params.get("minoff") || "0", 10) || 0,
    verdict: params.get("verdict") || "all",
    sort: params.get("sort") || "saving"
  };
}

function applyFilters(state) {
  let list = DEALS.filter(function (deal) {
    if (state.category !== "All" && deal.category !== state.category) return false;
    if (state.store !== "All" && deal.store !== state.store) return false;
    if (discountOf(deal) < state.minoff) return false;
    if (state.verdict !== "all" && deal.verdict !== state.verdict) return false;
    if (state.q) {
      const hay = (deal.product + " " + deal.brand + " " + deal.store + " " + deal.category).toLowerCase();
      if (!hay.includes(state.q)) return false;
    }
    return true;
  });
  const bySaving = function (a, b) { return savedOf(b) - savedOf(a); };
  const byPercent = function (a, b) { return discountOf(b) - discountOf(a); };
  const byPrice = function (a, b) { return a.sale - b.sale; };
  const byName = function (a, b) { return a.product.localeCompare(b.product); };
  if (state.sort === "percent") list.sort(byPercent);
  else if (state.sort === "price") list.sort(byPrice);
  else if (state.sort === "name") list.sort(byName);
  else list.sort(bySaving);
  return list;
}

function dealCard(deal) {
  const pct = discountOf(deal);
  const card = document.createElement("article");
  card.className = "deal-card";
  card.dataset.verdict = deal.verdict;
  card.innerHTML =
    '<div class="deal-top">' +
      '<span class="deal-category">' + deal.category + '</span>' +
      '<span class="deal-store">' + deal.store + '</span>' +
    '</div>' +
    '<h3 class="deal-name">' + deal.product + '</h3>' +
    '<div class="deal-prices">' +
      '<span class="deal-sale">' + money(deal.sale) + '</span>' +
      '<span class="deal-usual">was ' + money(deal.usual) + '</span>' +
      '<span class="deal-off">-' + pct + '%</span>' +
    '</div>' +
    '<p class="deal-save">You save ' + money(savedOf(deal)) + '</p>' +
    '<p class="deal-verdict ' + VERDICT_CLASS[deal.verdict] + '">' +
      VERDICT_LABEL[deal.verdict] + ' — ' + deal.evidence +
    '</p>' +
    '<p class="deal-note">' + deal.note + '</p>' +
    '<p class="deal-checked">Price checked ' + deal.checked + ' · ' + deal.source + '</p>' +
    '<a class="deal-link" href="' + deal.link + '" target="_blank" rel="noopener">View at ' + deal.store + ' &rarr;</a>';
  return card;
}

function renderCounts(state, shown) {
  const count = document.getElementById("result-count");
  const total = DEALS.length;
  count.textContent = shown.length === total
    ? "Showing all " + total + " deals"
    : "Showing " + shown.length + " of " + total + " deals";
  const clear = document.getElementById("clear-filters");
  const filtering = state.q || state.category !== "All" || state.store !== "All" ||
    state.minoff > 0 || state.verdict !== "all";
  clear.hidden = !filtering;
}

function renderGrid(state) {
  const shown = applyFilters(state);
  const grid = document.getElementById("deal-grid");
  grid.innerHTML = "";
  if (shown.length === 0) {
    grid.innerHTML = '<p class="no-results">No deals match those filters. Try clearing the search or lowering the discount.</p>';
  } else {
    shown.forEach(function (deal) { grid.appendChild(dealCard(deal)); });
  }
  renderCounts(state, shown);
}

function fillOptions(state) {
  const categories = ["All"].concat(Array.from(new Set(DEALS.map(function (d) { return d.category; })))).sort();
  const stores = ["All"].concat(Array.from(new Set(DEALS.map(function (d) { return d.store; })))).sort();
  const catSel = document.getElementById("filter-category");
  const storeSel = document.getElementById("filter-store");
  categories.forEach(function (c) {
    const opt = document.createElement("option");
    opt.value = c; opt.textContent = c === "All" ? "All categories" : c;
    catSel.appendChild(opt);
  });
  stores.forEach(function (s) {
    const opt = document.createElement("option");
    opt.value = s; opt.textContent = s === "All" ? "All stores" : s;
    storeSel.appendChild(opt);
  });
  catSel.value = state.category;
  storeSel.value = state.store;
  document.getElementById("filter-minoff").value = String(state.minoff);
  document.getElementById("filter-sort").value = state.sort;
  document.getElementById("search-box").value = state.q;
  document.querySelectorAll("#verdict-chips button").forEach(function (btn) {
    btn.setAttribute("aria-pressed", btn.dataset.verdict === state.verdict ? "true" : "false");
  });
}

function pushState(state) {
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  if (state.category !== "All") params.set("category", state.category);
  if (state.store !== "All") params.set("store", state.store);
  if (state.minoff > 0) params.set("minoff", String(state.minoff));
  if (state.verdict !== "all") params.set("verdict", state.verdict);
  if (state.sort !== "saving") params.set("sort", state.sort);
  const query = params.toString();
  history.replaceState(null, "", query ? "?" + query : location.pathname);
}

function bindControls(state) {
  const update = function (patch) {
    Object.assign(state, patch);
    pushState(state);
    renderGrid(state);
    document.querySelectorAll("#verdict-chips button").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.dataset.verdict === state.verdict ? "true" : "false");
    });
  };
  document.getElementById("search-box").addEventListener("input", function (e) {
    update({ q: e.target.value.trim().toLowerCase() });
  });
  document.getElementById("filter-category").addEventListener("change", function (e) {
    update({ category: e.target.value });
  });
  document.getElementById("filter-store").addEventListener("change", function (e) {
    update({ store: e.target.value });
  });
  document.getElementById("filter-minoff").addEventListener("change", function (e) {
    update({ minoff: parseInt(e.target.value, 10) || 0 });
  });
  document.getElementById("filter-sort").addEventListener("change", function (e) {
    update({ sort: e.target.value });
  });
  document.querySelectorAll("#verdict-chips button").forEach(function (btn) {
    btn.addEventListener("click", function () { update({ verdict: btn.dataset.verdict }); });
  });
  document.getElementById("clear-filters").addEventListener("click", function () {
    Object.assign(state, { q: "", category: "All", store: "All", minoff: 0, verdict: "all", sort: "saving" });
    document.getElementById("search-box").value = "";
    document.getElementById("filter-category").value = "All";
    document.getElementById("filter-store").value = "All";
    document.getElementById("filter-minoff").value = "0";
    document.getElementById("filter-sort").value = "saving";
    pushState(state);
    renderGrid(state);
    document.querySelectorAll("#verdict-chips button").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.dataset.verdict === "all" ? "true" : "false");
    });
  });
}

function initFinder() {
  const state = readState();
  fillOptions(state);
  renderGrid(state);
  bindControls(state);
}

document.addEventListener("DOMContentLoaded", initFinder);
