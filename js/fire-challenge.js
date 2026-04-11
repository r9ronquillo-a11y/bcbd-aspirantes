// JS for Fire Challenge pages: modal, section toggles, and recorrido navigation

document.addEventListener('DOMContentLoaded', () => {
  // Section toggles on index
  const btnReglas = document.getElementById('btn-reglas');
  const btnEstaciones = document.getElementById('btn-estaciones');
  const btnParticipantes = document.getElementById('btn-participantes');
  const reglas = document.getElementById('reglas');
  const estaciones = document.getElementById('estaciones');
  const participantes = document.getElementById('participantes');
  const openStationsModal = document.getElementById('open-stations-modal');

  function hideAll() {
    [reglas, estaciones, participantes].forEach(el => el && el.classList.add('hidden'));
  }

  if (btnReglas) btnReglas.addEventListener('click', () => { hideAll(); reglas.classList.remove('hidden'); });
  if (btnEstaciones) btnEstaciones.addEventListener('click', () => {
    hideAll();
    estaciones.classList.remove('hidden');
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      const panel = modal.querySelector('.stations-modal-panel');
      if (panel) panel.focus();
    }
  });
  if (btnParticipantes) btnParticipantes.addEventListener('click', () => { hideAll(); participantes.classList.remove('hidden'); });

  // Modal for estaciones — use static modal in DOM with id `stations-modal`
  let modal = document.getElementById('stations-modal');
  if (openStationsModal) {
    openStationsModal.addEventListener('click', () => {
      if (modal) {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        // focus for accessibility
        const panel = modal.querySelector('.stations-modal-panel');
        if (panel) panel.focus();
      }
    });
  }

  // Station page: if page has data-station-index attribute, show nav arrows when ?recorrido=1 is present
  // Station page: if page has data-station-index attribute, show nav arrows when ?recorrido=1 is present
  const stationIndexEl = document.querySelector('[data-station-index]');
  if (stationIndexEl) {
    const idx = parseInt(stationIndexEl.getAttribute('data-station-index'), 10);
    const params = new URLSearchParams(window.location.search);
    const recorrido = params.get('recorrido');
    if (recorrido === '1') {
      addStationNav(idx);
    }
  } else {
    // fallback: try infer from pathname like Estaciones/estacionN/index.html
    const m = window.location.pathname.match(/estacion(\d+)\/index\.html$/i);
    if (m) {
      const idx = parseInt(m[1], 10);
      const params = new URLSearchParams(window.location.search);
      if (params.get('recorrido') === '1') addStationNav(idx);
    }
  }

  // Close handlers for static modal (backdrop and data-close attributes)
  if (modal) {
    modal.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.dataset && target.dataset.close !== undefined) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
    // allow backdrop clicks (backdrop has data-close)
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); } });
  }

  function addStationNav(idx) {
    // remove existing nav if any
    const existing = document.querySelector('.station-nav');
    if (existing) existing.remove();

    const prevBtn = document.createElement('button');
    prevBtn.className = 'nav-arrow prev-arrow';
    prevBtn.disabled = idx <= 1;
    prevBtn.innerHTML = '<span class="arrow-icon">←</span><span class="arrow-text">Anterior</span>';

    prevBtn.addEventListener('click', () => {
      if (idx > 1) {
        const segs = window.location.pathname.split('/').filter(s => s.length>0);
        const estIndex = segs.findIndex(s => s.toLowerCase() === 'estaciones');
        const prefix = estIndex >= 0 ? '/' + segs.slice(0, estIndex+1).join('/') + '/' : '/Estaciones/';
        const target = prefix + `estacion${idx-1}/index.html?recorrido=1`;
        window.location.href = target;
      }
    });

    const nextBtn = document.createElement('button');
    nextBtn.className = 'nav-arrow next-arrow';
    nextBtn.disabled = idx >= 6;
    nextBtn.innerHTML = '<span class="arrow-text">Siguiente</span><span class="arrow-icon">→</span>';

    nextBtn.addEventListener('click', () => {
      if (idx < 6) {
        const segs = window.location.pathname.split('/').filter(s => s.length>0);
        const estIndex = segs.findIndex(s => s.toLowerCase() === 'estaciones');
        const prefix = estIndex >= 0 ? '/' + segs.slice(0, estIndex+1).join('/') + '/' : '/Estaciones/';
        const target = prefix + `estacion${idx+1}/index.html?recorrido=1`;
        window.location.href = target;
      }
    });

    // append to body so buttons are fixed at screen edges
    const wrapper = document.createElement('div');
    wrapper.className = 'station-nav';
    wrapper.appendChild(prevBtn);
    wrapper.appendChild(nextBtn);
    document.body.appendChild(wrapper);
  }

});
