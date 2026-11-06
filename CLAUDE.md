# richard-havin-fun

Static site for richard.pizza. Gulp build, Netlify deploy. Source is small: one JS file, one Sass file, one HTML page.

## Build quirks
- `dist/` is generated. The build runs `del.sync` on it first, so any edit there is destroyed on the next build. Edit `src/` only. It is not tracked in git.
- The Sass task uses `sass.logError`, so a broken SCSS file logs the error and the build still exits 0. Compile-check separately: `./node_modules/.bin/sass --no-source-map src/sass/styles.scss > /dev/null`
- JSHint runs during the build but only reports. It does not fail the build.
- `gulp-cli` must be installed globally. Node 20 via `.nvmrc`. Yarn is the lockfile in use.
- `yarn start` builds, serves `dist/` on browser-sync (localhost:3000), and reloads on changes to `src/`.
- `src/js/modernizr.js` is a generated vendor file. Do not hand-edit it.

## Code style
- JS: no semicolons (`asi: true` in package.json jshintConfig). Match that.
- Plain ES5-style `var` and functions in `app.js`. No bundler, no modules.
- Two-space indent, double quotes.

## Site behavior
- The page is an easter egg. Each click swaps a background video and plays audio. On the tenth click the video is removed and the real content in `#main` is shown.
- Lighthouse and PageSpeed user agents get the static content directly (see `useGifs` in `app.js`). Keep that check intact or Lighthouse scores drop.
- GA events are sent via `gtag` on non-localhost only.

## Deploy
- Netlify builds `main` with `npm run build` and publishes `dist/`. The Lighthouse plugin runs on every deploy.
- Redirects for the alternate domains and security headers live in `netlify.toml`.

## Commits
- Prefixes in use: `fix:`, `improvement:`, `chore:`. Optional scope in parens, e.g. `chore(netlify):`.
- Version bumps are bare `2.x.y` commits from `npm version`. The version is baked into the file banners by the build.
