export function skeletonRows(n = 5) {
  let html = '';
  for (let i = 0; i < n; i++) {
    html += `<div class="skeleton" style="height:42px;margin-bottom:8px"></div>`;
  }
  return html;
}

export function skeletonCard() {
  return `<div class="skeleton" style="height:120px"></div>`;
}
