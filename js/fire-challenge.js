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
  if (btnEstaciones) btnEstaciones.addEventListener('click', () => { hideAll(); estaciones.classList.remove('hidden'); });
  if (btnParticipantes) btnParticipantes.addEventListener('click', () => { hideAll(); participantes.classList.remove('hidden'); });

  // Modal for estaciones
  let modal;
  if (openStationsModal) {
    modal = createStationsModal();
    document.body.appendChild(modal);
    openStationsModal.addEventListener('click', () => modal.classList.add('open'));
  }

  // Station page: if page has data-station-index attribute, show nav arrows when ?recorrido=1 is present
  const stationIndexEl = document.querySelector('[data-station-index]');
  if (stationIndexEl) {
    const idx = parseInt(stationIndexEl.getAttribute('data-station-index'), 10);
    const params = new URLSearchParams(window.location.search);
    const recorrido = params.get('recorrido');
    if (recorrido === '1') {
      addStationNav(idx);
    }
  }

  // If this is a station page without data-station-index, try infer from filename (fallback)
  if (!stationIndexEl) {
    const m = window.location.pathname.match(/station(\d+)\.html$/);
    if (m) {
      const idx = parseInt(m[1], 10);
      const params = new URLSearchParams(window.location.search);
      if (params.get('recorrido') === '1') addStationNav(idx);
    }
  }

  function createStationsModal() {
    const wrapper = document.createElement('div');
    wrapper.className = 'stations-modal';
    wrapper.innerHTML = `
      <div class="stations-modal-backdrop" tabindex="-1"></div>
      <div class="stations-modal-panel" role="dialog" aria-modal="true">
        <h4>Estaciones - Fire Challenge 2026</h4>
        <p>Elige "Recorrido de Competencia" para navegar secuencialmente, o elige una estación individual.</p>
        <div class="stations-list">
          <a href="station1.html?recorrido=1">Recorrido de Competencia</a>
          <a href="station1.html">Estación #1</a>
          <a href="station2.html">Estación #2</a>
          <a href="station3.html">Estación #3</a>
          <a href="station4.html">Estación #4</a>
          <a href="station5.html">Estación #5</a>
          <a href="station6.html">Estación #6</a>
        </div>
        <div style="text-align:right; margin-top:12px;"><button class="primary" id="close-stations">Cerrar</button></div>
      </div>
    `;

    // close behavior
    wrapper.querySelector('.stations-modal-backdrop').addEventListener('click', () => wrapper.classList.remove('open'));
    wrapper.querySelector('#close-stations').addEventListener('click', () => wrapper.classList.remove('open'));

    return wrapper;
  }

  function addStationNav(idx) {
    const container = document.querySelector('#main-content');
    if (!container) return;
    const nav = document.createElement('div');
    nav.className = 'station-nav';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'nav-arrow';
    prevBtn.textContent = '← Anterior';
    prevBtn.disabled = idx <= 1;
    prevBtn.addEventListener('click', () => {
      if (idx > 1) {
        const target = `station${idx-1}.html?recorrido=1`;
        window.location.href = target;
      }
    });

    const nextBtn = document.createElement('button');
    nextBtn.className = 'nav-arrow';
    nextBtn.textContent = 'Siguiente →';
    nextBtn.disabled = idx >= 6;
    nextBtn.addEventListener('click', () => {
      if (idx < 6) {
        const target = `station${idx+1}.html?recorrido=1`;
        window.location.href = target;
      }
    });

    nav.appendChild(prevBtn);
    nav.appendChild(nextBtn);

    container.appendChild(nav);
  }

});
