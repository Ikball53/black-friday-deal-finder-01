// compare.js — renders the cross-store price comparison strip: the same
// product checked at two stores, cheapest first, from COMPARES in deals.js.
function moneyShort(n) {
  return "$" + n.toFixed(2).replace(/\.00$/, "");
}

function renderCompare() {
  const wrap = document.getElementById("compare-list");
  if (!wrap || typeof COMPARES === "undefined") return;
  COMPARES.forEach(function (item) {
    const rows = item.rows.slice().sort(function (a, b) { return a.price - b.price; });
    const cheapest = rows[0].price;
    const block = document.createElement("div");
    block.className = "compare-item";
    let html = '<h3>' + item.product + '</h3><ul class="compare-rows">';
    rows.forEach(function (row, i) {
      const diff = row.price - cheapest;
      html += '<li>' +
        '<span class="compare-store">' + row.store + '</span>' +
        '<span class="compare-price">' + moneyShort(row.price) + '</span>' +
        (i === 0
          ? '<span class="compare-best">Cheapest</span>'
          : '<span class="compare-diff">+' + moneyShort(diff) + ' more</span>') +
        '</li>';
    });
    html += '</ul><p class="compare-note">' + item.note + '</p>';
    block.innerHTML = html;
    wrap.appendChild(block);
  });
}

document.addEventListener("DOMContentLoaded", renderCompare);
