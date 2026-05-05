const root = () => document.getElementById('toast-root');

function show(type, title, msg) {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<div class="t-title">${title}</div>${msg ? `<div class="t-msg">${msg}</div>` : ''}`;
  root().appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    el.style.transition = 'all .2s';
    setTimeout(() => el.remove(), 220);
  }, 3500);
  // Cap at 4
  while (root().children.length > 4) root().firstChild.remove();
}

export const toast = {
  success: (title, msg) => show('success', title, msg),
  info: (title, msg) => show('info', title, msg),
  error: (title, msg) => show('error', title, msg)
};
