var bgClasses = ["pizza-trippy", "trippy-pizza", "tile-pizza"]
var bgClass = "untouched"
var count = 0
var isAudioPlaying = false
var audioEl = document.getElementById("gimme-pizza")
var useGifs = !(navigator && navigator.userAgent && (navigator.userAgent.includes("Page Speed") || navigator.userAgent.includes("Chrome-Lighthouse")))

function setBg() {
  if (count === 10) {
    document.body.classList.remove(bgClass)
    document.body.classList.add("big-rich")
    console.log("that's a lot of clicking you did there")
    console.log("enjoy the tunes")
    document.getElementById("main").classList.remove("d-none")

    try {
      gtag("event", "found_content", { "event_category": "pizza_v1" })
    } catch (e) {
      console.error(e)
    }
  }
  else {
    document.body.classList.remove(bgClass)
    bgClass = bgClasses[Math.floor(Math.random() * bgClasses.length)]
    document.body.classList.add(bgClass)
  }
}

if (useGifs) {
  setBg()
}

document.addEventListener("click", function () {
  if (count++ < 10) {
    console.log(count)
    isAudioPlaying && count < 10 ? audioEl.pause() : audioEl.play() // jshint ignore:line
    isAudioPlaying = !isAudioPlaying
    setBg()
  }

  try {
    gtag("event", "pizza_click", {
      "event_category": "pizza_v1",
      "event_label": bgClass,
      "value": count
    })
  } catch (e) {
    console.error(e)
  }
})

console.log("Welcome to my website! Try clicking.")
