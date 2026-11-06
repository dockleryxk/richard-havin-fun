// Pizza intro easter egg: each press of the full-screen button shows a different looping clip and toggles the song.
// The tenth press (or the skip link) reveals #main. Runs only when the inline head script set html.pizza.
(function () {
  var count = 0
  var isProd = location.hostname === "www.richard.pizza"
  var fontStyles = "font-family:'Raleway', sans-serif; font-weight: bold;"
  var fontSize = 10
  var rootEl = document.documentElement
  var mainEl = document.getElementById("main")
  var audioEl = document.getElementById("gimme-pizza")
  // One <video> per clip, declared in the markup; app.js adds the sources and raises one clip at a time
  var videoEls = document.querySelectorAll(".pizza-animation")
  var activeEl = null
  var pizzaButton = document.getElementById("pizza-button")
  var skipLink = document.getElementById("skip-pizza")

  // Pick a clip element different from the one showing now
  function getRandomVideo() {
    var nextEl = activeEl

    while (nextEl === activeEl) {
      nextEl = videoEls[Math.floor(Math.random() * videoEls.length)]
    }

    return nextEl
  }

  // Add a <source> with a fixed type; the browser takes the first type it can play
  function addSource(videoEl, type, src) {
    var sourceEl = document.createElement("source")
    sourceEl.setAttribute("type", type)
    sourceEl.setAttribute("src", src)
    videoEl.appendChild(sourceEl)
  }

  // Raise a different clip and return its name. Nothing is reloaded: swapping sources on one element rebuilds
  // its video layer, and WebKit paints the new clip's first frames letterboxed inside the old clip's box.
  function swapVideo() {
    var nextEl = getRandomVideo()

    if (activeEl) {
      activeEl.pause()
      activeEl.classList.remove("is-active")
    }

    activeEl = nextEl
    activeEl.classList.add("is-active")
    // A quick next press pauses this element before play() settles; the resulting AbortError is expected
    activeEl.play().catch(function () {})

    return activeEl.getAttribute("data-clip")
  }

  // Give every clip its sources so it loads and autoplays, then park the inactive ones on their first frame.
  // Smallest first: AV1 (level 3.0 covers every clip), then VP9 WebM, then H.264 MP4.
  function loadVideos() {
    Array.prototype.forEach.call(videoEls, function (videoEl) {
      var clip = "/assets/videos/" + videoEl.getAttribute("data-clip")

      videoEl.addEventListener("loadeddata", function () {
        if (videoEl !== activeEl) {
          videoEl.pause()
        }
      })
      addSource(videoEl, "video/mp4; codecs=av01.0.04M.08", clip + ".av1.mp4")
      addSource(videoEl, "video/webm", clip + ".webm")
      addSource(videoEl, "video/mp4", clip + ".mp4")
    })
  }

  // End the intro: show the content (with the song player) and move focus to it
  function reveal() {
    rootEl.classList.remove("pizza")
    activeEl.pause()
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

  // Load every clip, raise the first one, and wire up the controls
  if (rootEl.classList.contains("pizza")) {
    loadVideos()
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
