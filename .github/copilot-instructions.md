# BCBD Aspirantes — Workspace Instructions

This repository is a static educational website for the BCBD aspirantes project. It is built with plain HTML, CSS, and JavaScript, with no frontend framework or package manager configuration.

## What to know first

- The site is static and primarily Spanish.
- There is no `package.json`, no build tool, and no automated test configuration in this repo.
- The site uses `partials/header.html` and `partials/footer.html` loaded dynamically by `js/layout.js`.
- `js/layout.js` also handles relative path normalization for GitHub Pages and file-based previews.

## Key files and directories

- `index.html` — main landing page.
- `partials/header.html`, `partials/footer.html` — shared page chrome.
- `css/styles.css` — global styling.
- `js/layout.js` — header/footer injection, path normalization, and navigation helper logic.
- `js/home.js` — homepage data and interactive card behavior.
- Section directories such as `brigadas/`, `competencias-preparacion/`, `fundamentos-tecnicos/`, `herramientas/`, `historia/`, `info/`, `institucion/`, `instruccion-formal/`, `operaciones/`, `recursos-operativos/`, and `sistema-de-comando-de-incidentes/` contain content pages.

## How to work here

- Edit HTML pages directly.
- Keep shared header/footer markup in `partials/` and let `js/layout.js` inject it.
- Use relative links in the header/footer and content so `layout.js` can normalize them correctly.
- For local preview, open `index.html` in a browser or use a simple static server / VS Code Live Server.
- Preserve the Spanish content tone and terminology when updating text.

## Conventions

- Pages are organized as file-based sections under the workspace root.
- Shared layout is not templated by a build system; it is injected at runtime.
- Keep scripts and styles minimal and avoid introducing framework dependencies unless explicitly requested.

## What to avoid

- Don’t assume a Node.js/npm workflow or package-based build process.
- Don’t change shared markup without checking `partials/header.html` and `partials/footer.html` first.
- Avoid hardcoded absolute asset paths that start with `/` unless you understand GitHub Pages path handling.

## Example prompts

- "Update `partials/header.html` and `js/layout.js` so the navigation supports a new section under `recursos-operativos/`."
- "Improve the path fallback logic in `js/layout.js` to reduce duplicate fetch attempts for `partials/header.html`."
- "Add a new subsection page for `competencias-preparacion/` using the existing site layout and Spanish style."

## Next customization ideas

- Create an `AGENTS.md` or enhanced workspace instructions for repository contributors if the site grows beyond a static content website.
- Add a prompt-specific helper file for editing Spanish content consistently, especially for page copy and terminology.
