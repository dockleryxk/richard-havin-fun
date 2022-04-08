/* jshint ignore:start */
var googleTagEnabled = !(navigator && navigator.userAgent && (navigator.userAgent.includes("Page Speed") || navigator.userAgent.includes("Chrome-Lighthouse")))
if (googleTagEnabled) {
  // Set initial gtag/js?id=<first ID> script to <head>
  var script = document.createElement("script")
  script.type = "text/javascript"
  script.async = true
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-9VGYSVTVXY"
  document.getElementsByTagName("head")[0].appendChild(script)

  window.dataLayer = window.dataLayer || []
  var gtag = function () { dataLayer.push(arguments) }
  gtag("js", new Date())
  gtag("config", "G-9VGYSVTVXY")
}
/* jshint ignore:end */
