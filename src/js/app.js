var videoSources = ["pizza-trippy", "trippy-pizza", "tile-pizza"]
var mp4Src
var webmSrc
var currentIndex
var selectedVideoSource
var count = 0
var isAudioPlaying = false
var sourceAppended = false
var audioEl
var videoEl
var mp4SourceEl
var webmSourceEl
var useGifs = !(navigator && navigator.userAgent && (navigator.userAgent.includes("Page Speed") || navigator.userAgent.includes("Chrome-Lighthouse")))
var isLocalhost = location.hostname === "localhost"
var fontStyles = "font-family:'Raleway', sans-serif; font-weight: bold;"
var fontSize = 10

function getRandomVideo() {
  var newIndex = currentIndex

  while (newIndex === currentIndex) {
    newIndex = Math.floor(Math.random() * videoSources.length)
  }

  currentIndex = newIndex
  return videoSources[newIndex]
}

function swapVideo() {
  selectedVideoSource = getRandomVideo()
  mp4Src = "/assets/videos/" + selectedVideoSource + ".mp4"
  webmSrc = "/assets/videos/" + selectedVideoSource + ".webm"

  if (sourceAppended) {
    videoEl.pause()
  }

  mp4SourceEl.setAttribute("src", mp4Src)
  mp4SourceEl.setAttribute("type", "video/mp4")
  webmSourceEl.setAttribute("src", webmSrc)
  webmSourceEl.setAttribute("type", "video/webm")

  if (!sourceAppended) {
    sourceAppended = true
    videoEl.appendChild(mp4SourceEl)
    videoEl.appendChild(webmSourceEl)
    videoEl.play()
  }
  else {
    videoEl.load()
    videoEl.play()
  }

  if (isLocalhost) {
    console.log(JSON.stringify({
      error: videoEl.error,
      networkState: videoEl.networkState,
      readyState: videoEl.readyState,
    }, null, 2))
  }
}

function removeVideo() {
  document.body.classList.add("big-rich")
  videoEl.classList.add("d-none")
  document.getElementById("main").classList.remove("d-none")
  videoEl.pause()

  if (!isLocalhost) {
    console.clear()
  }
  console.log("%cthat's a lot of clicking you did there!!", fontStyles + "font-size: 50px; color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)")
  console.log("%cenjoy the tunes", "font-family:'Raleway', sans-serif; font-style: italic; font-size: 10px;")
}

function setBg() {
  if (count === 10) {
    removeVideo()

    if (!isLocalhost) {
      try {
        gtag("event", "found_content", { "event_category": "pizza_v1" })
      } catch (e) {
        console.error(e)
      }
    }
  }
  else {
    swapVideo()
  }
}

if (useGifs) {
  document.getElementById("main").classList.add("d-none")
  audioEl = document.getElementById("gimme-pizza")
  videoEl = document.getElementById("pizza-animations")
  mp4SourceEl = document.createElement("source")
  webmSourceEl = document.createElement("source")
  setBg()
}

document.addEventListener("click", function () {
  if (count++ < 10) {
    console.log("%c" + count, fontStyles + "font-size: " + fontSize + "px")
    fontSize += 5
    isAudioPlaying && count < 10 ? audioEl.pause() : audioEl.play() // jshint ignore:line
    isAudioPlaying = !isAudioPlaying
    setBg()

    if (count === 1) {
      document.body.classList.remove("untouched")
      document.body.classList.add("touched")
    }
  }

  if (!isLocalhost) {
    try {
      gtag("event", "pizza_click", {
        "event_category": "pizza_v1",
        "event_label": bgClass,
        "value": count
      })
    } catch (e) {
      console.error(e)
    }
  }
})

console.log("Welcome to my website! Try clicking.")
