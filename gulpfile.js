/**
 * Build for richard.pizza: lint and minify app.js, compile Sass and inline it into index.html,
 * copy static files, and write the sitemap. Based on https://github.com/cferdinandi/gulp-boilerplate
 */

/**
 * Settings
 * Turn on/off build features
 */

var settings = {
  clean: true,
  copy: true,
  reload: true,
  sitemap: true,
  scripts: true,
  styles: true
}

/**
 * Paths to project folders
 */

var paths = {
  input: "src/",
  output: "dist/",
  scripts: {
    input: "src/js/*.js",
    output: "dist/js/"
  },
  styles: {
    input: "src/sass/**/*.{scss,sass}",
    output: "dist/css/",
    built: "dist/css/styles.min.css"
  },
  copy: {
    base: "src/static/",
    input: "src/static/**/*",
    output: "dist/"
  },
  html: "src/static/index.html",
  reload: "./dist/"
}

/**
 * Template for banner to add to file headers
 */

var banner = {
  main:
    "/*!" +
    " <%= packageJson.name %> v<%= packageJson.version %>" +
    " | (c) " + new Date().getFullYear() + " <%= packageJson.author.name %>" +
    " | <%= packageJson.license %> License" +
    " | <%= packageJson.repository.url %>" +
    " */\n"
}

/**
 * Gulp packages
 */

// General
var { src, dest, watch, series, parallel } = require("gulp")
var fs = require("fs")
var path = require("path")
var rename = require("gulp-rename")
var header = require("gulp-header")
var replace = require("gulp-replace")
var packageJson = require("./package.json")

// Scripts
var jshint = require("gulp-jshint")
var terser = require("gulp-terser")

// Sitemap
var sitemap = require("gulp-sitemap")

// Styles
var sass = require("gulp-sass")(require("sass"))
var postcss = require("gulp-postcss")
var prefix = require("autoprefixer")
var minify = require("cssnano")

// BrowserSync
var browserSync = require("browser-sync")

// Set by enableWatchMode before the first watch build, so lint, Sass, and inlining errors are logged instead of stopping the dev server
var isWatching = false

/**
 * Gulp Tasks
 */

// Remove pre-existing content from output folders
var cleanDist = function (done) {
  // Make sure this feature is activated before running
  if (!settings.clean) {
    return done()
  }

  // Clean the dist folder
  fs.rmSync(paths.output, { recursive: true, force: true })

  // Signal completion
  return done()
}

// Minify scripts
var buildScripts = function (done) {
  // Make sure this feature is activated before running
  if (!settings.scripts) {
    return done()
  }

  return src(paths.scripts.input)
    .pipe(rename({ suffix: ".min" }))
    .pipe(terser())
    .pipe(header(banner.main, { packageJson: packageJson }))
    .pipe(dest(paths.scripts.output))
}

// Lint scripts; any warning fails the build outside watch mode
var lintScripts = function (done) {
  // Make sure this feature is activated before running
  if (!settings.scripts) {
    return done()
  }

  var stream = src(paths.scripts.input)
    .pipe(jshint(packageJson.jshintConfig))
    .pipe(jshint.reporter("jshint-stylish"))

  return isWatching ? stream : stream.pipe(jshint.reporter("fail"))
}

// Compile, prefix, and minify Sass; a compile error fails the build outside watch mode
var buildStyles = function (done) {
  // Make sure this feature is activated before running
  if (!settings.styles) {
    return done()
  }

  var compileSass = sass({ style: "compressed" })
  if (isWatching) {
    compileSass.on("error", sass.logError)
  }

  return src(paths.styles.input)
    .pipe(compileSass)
    .pipe(postcss([prefix(), minify()]))
    .pipe(header(banner.main, { packageJson: packageJson }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest(paths.styles.output))
}

// Copy static files into output folder; encoding false keeps media files as raw bytes.
// index.html is skipped when styles are on, because inlineStyles writes it.
var copyFiles = function (done) {
  // Make sure this feature is activated before running
  if (!settings.copy) {
    return done()
  }

  var globs = settings.styles ? [paths.copy.input, "!" + paths.html] : paths.copy.input
  return src(globs, { encoding: false })
    .pipe(dest(paths.copy.output))
}

// Write dist/index.html from the source page, replacing the inline-css placeholder with the built stylesheet.
// A missing placeholder or stylesheet fails the build, or is logged in watch mode.
var inlineStyles = function (done) {
  // Make sure this feature is activated before running
  if (!settings.styles || !settings.copy) {
    return done()
  }

  var placeholder = "<!-- inline-css -->"
  var problem = null
  var css = ""

  // The page must contain the placeholder exactly once
  if (fs.readFileSync(paths.html, "utf8").split(placeholder).length !== 2) {
    problem = paths.html + " must contain exactly one " + placeholder + " placeholder"
  }

  // The stylesheet is missing when Sass failed during a watch build
  if (fs.existsSync(paths.styles.built)) {
    css = fs.readFileSync(paths.styles.built, "utf8").trim()
  } else {
    problem = problem || paths.styles.built + " was not built"
  }

  if (problem && !isWatching) {
    return done(new Error(problem))
  }
  if (problem) {
    console.error("inlineStyles: " + problem)
  }

  // A string search is split and joined by gulp-replace, so the CSS is inserted literally
  return src(paths.html)
    .pipe(replace(placeholder, "<style>" + css + "</style>"))
    .pipe(dest(paths.output))
}

// Build the sitemap
var buildSitemap = function (done) {
  // Make sure this feature is activated before running
  if (!settings.sitemap) {
    return done()
  }

  // https://github.com/pgilad/gulp-sitemap#options
  return src(paths.copy.input + ".html", { read: false })
    .pipe(sitemap({ siteUrl: "https://www.richard.pizza" }))
    .pipe(dest(paths.output))
}

// Serve dist/ with BrowserSync
var startServer = function (done) {
  // Make sure this feature is activated before running
  if (!settings.reload) {
    return done()
  }

  // Initialize BrowserSync
  browserSync.init({
    server: {
      baseDir: paths.reload
    }
  })

  // Signal completion
  done()
}

// Reload the browser when files change
var reloadBrowser = function (done) {
  if (!settings.reload) {
    return done()
  }

  browserSync.reload()
  done()
}

// Rebuild only what changed; CSS is inlined into index.html, so style changes re-inline and reload
var watchSource = function (done) {
  watch(paths.styles.input, series(buildStyles, inlineStyles, reloadBrowser))
  watch(paths.scripts.input, series(parallel(lintScripts, buildScripts), reloadBrowser))
  var staticWatcher = watch(paths.copy.input, series(parallel(copyFiles, buildSitemap), inlineStyles, reloadBrowser))

  // Mirror deletions from src/static so the dev server matches a clean build
  staticWatcher.on("unlink", function (file) {
    fs.rmSync(path.join(paths.output, path.relative(paths.copy.base, file)), { force: true })
  })
  staticWatcher.on("unlinkDir", function (dir) {
    fs.rmSync(path.join(paths.output, path.relative(paths.copy.base, dir)), { recursive: true, force: true })
  })

  done()
}

// Switch on watch-mode error handling before the first build runs
var enableWatchMode = function (done) {
  isWatching = true
  done()
}

/**
 * Export Tasks
 */

// Default task
// gulp
exports.default = series(
  cleanDist,
  parallel(
    buildScripts,
    lintScripts,
    buildStyles,
    copyFiles,
    buildSitemap
  ),
  inlineStyles
)

// Watch and reload
// gulp watch
exports.watch = series(
  enableWatchMode,
  exports.default,
  startServer,
  watchSource
)
