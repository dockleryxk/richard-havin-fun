// Pizza intro easter egg: each press of the full-screen button swaps a looping clip and toggles the song.
// The tenth press (or the skip link) reveals #main. Runs only when the inline head script set html.pizza.
(function () {
  var videoSources = ["pizza-trippy", "trippy-pizza", "tile-pizza"]
  var currentIndex
  var count = 0
  var isProd = location.hostname === "www.richard.pizza"
  var fontStyles = "font-family:'Raleway', sans-serif; font-weight: bold;"
  var fontSize = 10
  var rootEl = document.documentElement
  var mainEl = document.getElementById("main")
  var audioEl = document.getElementById("gimme-pizza")
  var videoEl = document.getElementById("pizza-animations")
  var pizzaButton = document.getElementById("pizza-button")
  var skipLink = document.getElementById("skip-pizza")
  var av1SourceEl
  var webmSourceEl
  var mp4SourceEl

  // Pick a clip index different from the one playing now
  function getRandomVideo() {
    var newIndex = currentIndex

    while (newIndex === currentIndex) {
      newIndex = Math.floor(Math.random() * videoSources.length)
    }

    currentIndex = newIndex
    return videoSources[newIndex]
  }

  // Create a <source> with a fixed type; swapVideo only changes its src. The browser takes the first type it can play.
  function addSource(type) {
    var sourceEl = document.createElement("source")
    sourceEl.setAttribute("type", type)
    videoEl.appendChild(sourceEl)
    return sourceEl
  }

  // Point the video at a new clip and return its name
  function swapVideo() {
    var selected = getRandomVideo()

    av1SourceEl.setAttribute("src", "/assets/videos/" + selected + ".av1.mp4")
    webmSourceEl.setAttribute("src", "/assets/videos/" + selected + ".webm")
    mp4SourceEl.setAttribute("src", "/assets/videos/" + selected + ".mp4")
    videoEl.load()
    // A later press can interrupt this play() with load(); the resulting AbortError is expected
    videoEl.play().catch(function () {})

    return selected
  }

  // End the intro: show the content (with the song player) and move focus to it
  function reveal() {
    rootEl.classList.remove("pizza")
    videoEl.pause()
    pizzaButton.removeEventListener("click", onPizza)
    mainEl.focus()

    if (isProd) {
      console.clear()
    }
    if (count === 10) {
      console.log("%cthat's a lot of clicking you did there!!", fontStyles + "font-size: 50px; color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)")
    }
    console.log("%cenjoy the tunes", "font-family:'Raleway', sans-serif; font-style: italic; font-size: 10px;")
  }

  // One press of the pizza button
  function onPizza() {
    count++
    console.log("%c" + count, fontStyles + "font-size: " + fontSize + "px")
    fontSize += 5

    // Odd presses play the song and even presses pause it; the tenth press keeps it playing for the reveal
    if (!audioEl.paused && count < 10) {
      audioEl.pause()
    } else {
      audioEl.play().catch(function () {})
    }

    if (count === 10) {
      gtag("event", "found_content", { "event_category": "pizza_v1" })
      reveal()
    } else {
      gtag("event", "pizza_click", {
        "event_category": "pizza_v1",
        "event_label": swapVideo(),
        "value": count
      })
    }
  }

  // Start the first clip and wire up the controls
  if (rootEl.classList.contains("pizza")) {
    // Smallest first: AV1 (level 3.0 covers every clip), then VP9 WebM, then H.264 MP4
    av1SourceEl = addSource("video/mp4; codecs=av01.0.04M.08")
    webmSourceEl = addSource("video/webm")
    mp4SourceEl = addSource("video/mp4")
    swapVideo()
    pizzaButton.addEventListener("click", onPizza)
    skipLink.addEventListener("click", function (event) {
      event.preventDefault()
      gtag("event", "skip_pizza", { "event_category": "pizza_v1", "value": count })
      reveal()
    })
    console.log("Welcome to my website! Try clicking.")
  }
})()
