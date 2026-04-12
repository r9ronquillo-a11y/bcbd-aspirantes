// JS for Fire Challenge pages: modal, section toggles, and recorrido navigation

// Expose a safe `window.initStopwatch` wrapper early so pages that call it
// before this script finishes loading won't lose the request. Calls are
// queued and flushed once the real `initStopwatch` is available.
window.__fc_pending_inits = window.__fc_pending_inits || [];
if (!window.initStopwatch) {
  window.initStopwatch = function(idx) {
    if (typeof window.__fc_initStopwatch_real === 'function') {
      try { return window.__fc_initStopwatch_real(idx); } catch(e) { console.warn('initStopwatch call failed', e); }
    }
    window.__fc_pending_inits.push(idx);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const MAX_STATIONS = 5;
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
  const stationIndexEl = document.querySelector('[data-station-index]');
  if (stationIndexEl) {
    const idx = parseInt(stationIndexEl.getAttribute('data-station-index'), 10);
    // Always show station nav on station pages to allow manual navigation.
    addStationNav(idx);
    initStopwatch(idx);
  } else {
    // fallback: try infer from pathname like Estaciones/estacionN/index.html
    const m = window.location.pathname.match(/estacion(\d+)\/index\.html$/i);
    if (m) {
      const idx = parseInt(m[1], 10);
      const params = new URLSearchParams(window.location.search);
      if (params.get('recorrido') === '1') {
        addStationNav(idx);
        initStopwatch(idx);
      }
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
    nextBtn.disabled = idx >= MAX_STATIONS;
    nextBtn.innerHTML = '<span class="arrow-text">Siguiente</span><span class="arrow-icon">→</span>';

    nextBtn.addEventListener('click', () => {
      if (idx < MAX_STATIONS) {
        const segs = window.location.pathname.split('/').filter(s => s.length>0);
        const estIndex = segs.findIndex(s => s.toLowerCase() === 'estaciones');
        const prefix = estIndex >= 0 ? '/' + segs.slice(0, estIndex+1).join('/') + '/' : '/Estaciones/';
        const target = prefix + `estacion${idx+1}/index.html?recorrido=1`;
        window.location.href = target;
      }
    });

    console.debug('addStationNav: adding station nav for index', idx);
    // append to body so buttons are fixed at screen edges
    const wrapper = document.createElement('div');
    wrapper.className = 'station-nav';
    wrapper.appendChild(prevBtn);
    wrapper.appendChild(nextBtn);
    document.body.appendChild(wrapper);
  }

  // Stopwatch for station pages — records to localStorage key `fc_results`
  function initStopwatch(idx) {
    try {
      // diagnostics: log invocation
      console.log('initStopwatch called for idx', idx, 'readyState', document.readyState);
      // avoid duplicating the panel
      if (document.querySelector('.stopwatch-panel')) { console.log('initStopwatch: panel already exists, skipping'); return; }
      const container = document.createElement('div');
      container.className = 'stopwatch-panel';
      // make it visually obvious while debugging
      container.style.cssText = 'background: rgba(255,255,255,0.98); border: 2px solid #b71c1c; padding:12px; border-radius:8px; margin:12px 0; box-shadow:0 6px 18px rgba(0,0,0,0.06);';
      console.log('initStopwatch: creating container');
      container.innerHTML = '\n      <div class="sw-row">\n        <input id="participant-name" placeholder="Nombre participante" />\n        <div id="sw-display" class="sw-display">00:00:00</div>\n      </div>\n      <div class="sw-row">\n        <button id="sw-start" class="primary">Iniciar</button>\n        <button id="sw-stop">Detener</button>\n        <button id="sw-reset">Reset</button>\n        <button id="sw-next">Siguiente</button>\n      </div>\n    ';
      const main = document.getElementById('main-content') || document.body;
      // try to place the panel just before the station steps (so it appears above "Pasos")
      const stationSteps = main.querySelector('.station-steps');
      console.log('initStopwatch: stationSteps=', stationSteps);
      if (stationSteps && stationSteps.parentNode) {
        stationSteps.parentNode.insertBefore(container, stationSteps);
        console.log('initStopwatch: inserted before stationSteps');
      } else {
        const firstSection = main.querySelector('section');
        if (firstSection) {
          main.insertBefore(container, firstSection);
          console.log('initStopwatch: inserted before first section');
        } else {
          main.appendChild(container);
          console.log('initStopwatch: appended to main');
        }
      }
      console.log('initStopwatch: injected panel for station', idx, container, 'parent:', container.parentNode);

      let centis = 0, timerId = null;
      function formatTime(c) {
        const cs = c % 100;
        const totalSec = Math.floor(c/100);
        const secs = totalSec % 60;
        const mins = Math.floor(totalSec/60);
        return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}:${String(cs).padStart(2,'0')}`;
      }
      const disp = container.querySelector('#sw-display');
      const input = container.querySelector('#participant-name');
      const btnStart = container.querySelector('#sw-start');
      const btnStop = container.querySelector('#sw-stop');
      const btnReset = container.querySelector('#sw-reset');
      const btnNext = container.querySelector('#sw-next');

      function tick() { centis++; disp.textContent = formatTime(centis); }

      btnStart.addEventListener('click', () => {
        if (timerId) return;
        timerId = setInterval(tick, 10);
        btnStart.disabled = true; btnStop.disabled = false;
      });
      function doStop() {
        if (timerId) { clearInterval(timerId); timerId = null; }
        btnStart.disabled = false; btnStop.disabled = true;
        const name = input.value.trim() || 'Anónimo';
        recordResult(name, idx, centis, formatTime(centis));
      }
      btnStop.addEventListener('click', doStop);
      btnReset.addEventListener('click', () => { if (timerId) { clearInterval(timerId); timerId=null; } centis=0; disp.textContent='00:00:00'; btnStart.disabled=false; btnStop.disabled=true; });
      btnNext.addEventListener('click', () => { doStop(); if (idx < MAX_STATIONS) { const segs = window.location.pathname.split('/').filter(s => s.length>0); const estIndex = segs.findIndex(s => s.toLowerCase() === 'estaciones'); const prefix = estIndex >= 0 ? '/' + segs.slice(0, estIndex+1).join('/') + '/' : '/Estaciones/'; window.location.href = prefix + `estacion${idx+1}/index.html?recorrido=1`; } });

      // initial state
      disp.textContent = '00:00:00'; btnStop.disabled = true;
    } catch(e) { console.warn('initStopwatch failed',e); }
  }

  function recordResult(name, station, centis, timeStr) {
    try {
      const key = 'fc_results';
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      list.push({name, station, centis, time: timeStr, ts: (new Date()).toISOString()});
      localStorage.setItem(key, JSON.stringify(list));
      console.debug('Recorded result', name, station, timeStr);
    } catch(e) { console.warn('recordResult failed',e); }
  }

  // expose for debugging / page-level calls and flush any queued calls
  try {
    window.__fc_initStopwatch_real = initStopwatch;
    if (!window.__fc_pending_inits) window.__fc_pending_inits = [];
    window.__fc_pending_inits.forEach(i => {
      try { window.__fc_initStopwatch_real(i); } catch(e) { console.warn('pending initStopwatch failed', e); }
    });
    window.__fc_pending_inits = [];
    window.initStopwatch = function(idx) { try { return window.__fc_initStopwatch_real(idx); } catch(e) { console.warn('initStopwatch call failed', e); } };
    console.debug && console.debug('initStopwatch exposed');
  } catch(e) {}

});
