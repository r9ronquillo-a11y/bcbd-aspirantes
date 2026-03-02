const isGitHub = window.location.hostname.includes("github.io");

const basePath = isGitHub
  ? "/bcbd-aspirantes/"
  : "/";

function safePrefixHref(href) {
  if (!href) return href;

  // Do not modify absolute URLs, anchors, or protocol links
  if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }

  // If href already starts with a slash, treat as absolute path on current host
  if (href.startsWith("/")) return href;

  // Convert relative links to root-relative using basePath.
  // This ensures header/footer links always point to the site's root paths
  // regardless of the current page nesting or whether the site is served via file://
  const cleaned = href.replace(/^\.\//, '').replace(/^\//, '');
  return (basePath === '/' ? '/' : basePath) + cleaned;
}

// Helper: try fetching a partial from several relative levels (handles nested pages and file:// use)
function tryFetchPartial(partialPath, callback) {
  const maxDepth = 6; // pages won't be deeper than this
  const candidates = [];
  // same-folder: ./partials/...
  candidates.push(partialPath);
  // go up 1..maxDepth levels
  for (let i = 1; i <= maxDepth; i++) {
    candidates.push('../'.repeat(i) + partialPath);
  }

  // Also try using basePath as an absolute fallback
  candidates.push(basePath + partialPath);

  // Try sequentially until one succeeds
  (function tryNext(i) {
    if (i >= candidates.length) {
      console.error('No se pudo cargar partial:', partialPath);
      return;
    }
    console.debug('tryFetchPartial: probando candidato ->', candidates[i]);
    fetch(candidates[i]).then(res => {
      if (!res.ok) throw new Error('no-ok');
      return res.text();
    }).then(html => callback(null, html, candidates[i]))
    .catch(() => tryNext(i+1));
  })(0);
}

// Load header partial (with fallbacks)
tryFetchPartial('partials/header.html', (err, html, usedPath) => {
  if (err) return console.error('Error cargando header:', err);
  const headerEl = document.getElementById("header");
  if (headerEl) headerEl.innerHTML = html;

  // Ajustar enlaces dentro del header
  const links = document.querySelectorAll("#header a");
  links.forEach(link => {
    const originalHref = link.getAttribute("href");
    const newHref = safePrefixHref(originalHref);
    if (newHref !== originalHref) link.setAttribute("href", newHref);
  });

  // Add scroll listener to toggle header scrolled state (shadow)
  const headerNode = document.querySelector('.site-header');
  if (headerNode) {
    const onScroll = () => {
      if (window.scrollY > 8) headerNode.classList.add('site-header--scrolled');
      else headerNode.classList.remove('site-header--scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // run once to set initial state
    onScroll();
  }
});

// Load footer partial into #footer if present, otherwise append as before
// Load footer partial (with fallbacks)
tryFetchPartial('partials/footer.html', (err, html, usedPath) => {
  if (err) return console.error('Error cargando footer:', err);
  const footerPlaceholder = document.getElementById("footer");
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = html;
    // If footer contains links, adjust them as well
    const links = footerPlaceholder.querySelectorAll("a");
    links.forEach(link => {
      const originalHref = link.getAttribute("href");
      const newHref = safePrefixHref(originalHref);
      if (newHref !== originalHref) link.setAttribute("href", newHref);
    });
    return;
  }

  // Fallback: append footer if none exists on the page
  if (!document.querySelector(".footer")) {
    const div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div.firstElementChild);
  }
});
