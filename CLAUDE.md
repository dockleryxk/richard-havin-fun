# richard-havin-fun

Static site for richard.pizza. Gulp build, Netlify deploy. Source is small: one JS file, one Sass file, and two HTML pages (`index.html` and a standalone `404.html`).

## Build quirks
- `dist/` is generated. The build deletes it first, so any edit there is destroyed on the next build. Edit `src/` only. It is not tracked in git.
- `yarn build` fails on a Sass compile error, any JSHint warning, or a missing `<!-- inline-css -->` placeholder. In watch mode (`yarn start`) these are only logged so the dev server keeps running, possibly serving an unstyled page until the next good save.
- The compiled CSS is inlined into `dist/index.html` by the `inlineStyles` task, which replaces the `<!-- inline-css -->` placeholder. Keep that placeholder in `src/static/index.html`.
- `copyFiles` reads with `{ encoding: false }`. Gulp 5 decodes files as UTF-8 by default, which corrupts the audio, video, image, and font files.
- `gtag` is a global defined by the inline script in `src/static/index.html`. `app.js` calls it, so keep it a top-level function declaration there, not inside a function or block.
- Node 24 via `.nvmrc`. Gulp runs from `node_modules`; no global install. Yarn is the lockfile in use.
- `yarn start` builds, serves `dist/` on browser-sync (localhost:3000), and rebuilds only the changed part of `src/`. Deleting a file under `src/static/` deletes its copy in `dist/`.
- The Claude Code hooks in `.claude/settings.json` run only for the Edit and Write tools. Edits made through Bash skip the `dist/` guard and the lint check, so run `yarn build` after them.

## Code style
- JS: no semicolons (`asi: true` in package.json jshintConfig). Match that.
- Plain ES5-style `var` and functions in `app.js`, wrapped in one IIFE. No bundler, no modules.
- Two-space indent, double quotes.

## Site behavior
- The page is an easter egg. An inline script in `<head>` adds `html.pizza` before first paint unless the visitor prefers reduced motion. Under `.pizza`, CSS hides `#main` and shows a full-screen video with a transparent full-screen button over it.
- Each press of that button (click, Enter, or Space) swaps the clip and toggles the song. The tenth press, or the keyboard-only "Skip to content" link, removes `.pizza`, shows `#main` (which includes the song player), and moves focus to `#main`.
- Fallbacks: if `app.min.js` fails to load, its `onerror` removes `.pizza`. If the skip link is followed without `app.js` handling it, `:has(#main:target)` CSS ends the intro.
- GA events: `pizza_click` for presses 1 to 9 (value = press number), `found_content` on the tenth press, `skip_pizza` from the skip link (value = presses so far).
- No user-agent detection. Lighthouse audits the same page visitors get.
- GA: `gtag` queues into `dataLayer` everywhere, but `gtag.js` is only loaded on `www.richard.pizza`, after the window `load` event. Events from other hosts go nowhere.

## Deploy
- Netlify builds `main` with `npm run build` and publishes `dist/`. The Lighthouse plugin runs on every deploy and reports scores without blocking.
- Redirects for the alternate domains and the `netlify.app` subdomain, and the security and cache headers, live in `netlify.toml`.
- `/assets/*` is cached for a week. Rename a media or font file when replacing its contents.

## Commits
- Prefixes in use: `fix:`, `improvement:`, `chore:`. Optional scope in parens, e.g. `chore(netlify):`.
- Version bumps are bare `2.x.y` commits from `npm version`. The version is baked into the file banners by the build.
