import { getState, patch } from '../core/store.js';
import { go } from '../core/router.js';

export function renderLogin(root) {
  const s = getState();
  const julia = s.moradores.find(m => m.nome.startsWith('Julia')) || s.moradores[0];

  root.innerHTML = `
    <div class="login">
      <div class="login-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:8px">
          <div class="login-brand" style="margin:0">
            <div class="logo">♻️</div>
            <div>
              <h1>EcoPlastic</h1>
              <small style="color:var(--c-muted)">Recycle-as-a-Service · ${s.condominio.nome}</small>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
            <a href="../ecoplastic.html" style="color:var(--c-muted);font-size:12px;text-decoration:none;padding:6px 10px;border:1px solid var(--c-border);border-radius:8px">📑 apresentação do projeto</a>
          </div>
        </div>
        <p class="login-sub">Escolha o perfil para iniciar a demonstração.</p>

        <div class="login-personas">
          <button class="persona-card" data-pick="sindico">
            <div class="ico">🏢</div>
            <h3>Síndico — Marcos Vieira</h3>
            <p>Acesso ao painel de gestão: dashboard, coletas, financeiro, ranking, ESG.</p>
          </button>
          <button class="persona-card" data-pick="morador" data-mid="${julia.id}">
            <div class="ico">📱</div>
            <h3>Morador — ${julia.nome}</h3>
            <p>Apto ${julia.apto} · ${julia.pontos} pts · App de descartes e recompensas.</p>
          </button>
        </div>

        <div class="login-other">
          <label for="otherMorador">Entrar como outro morador:</label>
          <select id="otherMorador">
            <option value="">— selecionar —</option>
            ${s.moradores.map(m => `<option value="${m.id}">${m.nome} (apto ${m.apto})</option>`).join('')}
          </select>
          <button class="btn primary" id="goOther">Entrar</button>
        </div>
      </div>
    </div>
  `;

  root.querySelectorAll('.persona-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const persona = btn.dataset.pick;
      const mid = btn.dataset.mid || null;
      patch('persona', persona);
      if (persona === 'morador') patch('currentMoradorId', mid);
      go(persona === 'sindico' ? '/admin/dashboard' : '/morador/inicio');
    });
  });

  const sel = root.querySelector('#otherMorador');
  root.querySelector('#goOther').addEventListener('click', () => {
    if (!sel.value) return;
    patch('persona', 'morador');
    patch('currentMoradorId', sel.value);
    go('/morador/inicio');
  });
}
