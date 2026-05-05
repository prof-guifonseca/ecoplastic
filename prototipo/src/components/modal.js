const dlg = () => document.getElementById('modal-root');

export function openModal({ title, body, actions = [], wide = false }) {
  return new Promise((resolve) => {
    const el = dlg();
    el.style.maxWidth = wide ? '720px' : '560px';
    const card = document.createElement('div');
    card.className = 'modal-card';
    card.innerHTML = `
      <div class="modal-head">
        <h3>${title}</h3>
        <button class="close" type="button" aria-label="Fechar">×</button>
      </div>
      <div class="modal-body"></div>
      <div class="modal-foot"></div>
    `;
    const bodyEl = card.querySelector('.modal-body');
    const footEl = card.querySelector('.modal-foot');
    if (typeof body === 'string') bodyEl.innerHTML = body;
    else if (body instanceof Node) bodyEl.appendChild(body);

    const close = (result) => {
      el.close();
      el.innerHTML = '';
      el.removeEventListener('click', onBackdrop);
      resolve(result);
    };

    actions.forEach(a => {
      const b = document.createElement('button');
      b.className = `btn ${a.variant || ''}`;
      b.type = 'button';
      b.textContent = a.label;
      b.addEventListener('click', () => {
        const r = a.onClick?.();
        if (r instanceof Promise) {
          b.disabled = true;
          r.then(v => close(v ?? a.value)).catch(() => { b.disabled = false; });
        } else if (r !== false) {
          close(r ?? a.value);
        }
      });
      footEl.appendChild(b);
    });

    card.querySelector('.close').addEventListener('click', () => close(null));

    const onBackdrop = (e) => { if (e.target === el) close(null); };
    el.addEventListener('click', onBackdrop);

    el.innerHTML = '';
    el.appendChild(card);
    el.showModal();
  });
}

export function confirm({ title, message, confirmLabel = 'Confirmar', danger = false }) {
  return openModal({
    title,
    body: `<p style="margin:0;color:var(--c-muted)">${message}</p>`,
    actions: [
      { label: 'Cancelar', value: false },
      { label: confirmLabel, variant: danger ? 'danger' : 'primary', value: true }
    ]
  });
}
