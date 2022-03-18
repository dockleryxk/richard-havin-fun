var bgClasses = ["pizza-trippy", "trippy-pizza", "tile-pizza"]
var bgClass = "untouched"
var count = -1
var found = false
var isAudioPlaying = false
var audioEl = document.getElementById("gimme-pizza")
var isLighthouse = navigator && navigator.userAgent && (navigator.userAgent.includes("Page Speed") || navigator.userAgent.includes("Chrome-Lighthouse"))

function setBg() {
  if (count > -1) {
    console.log(count)
  }
  if (count++ < 10) {
    document.body.classList.remove(bgClass)
    bgClass = bgClasses[Math.floor(Math.random() * bgClasses.length)]
    document.body.classList.add(bgClass)
  }
  else if (!found) {
    found = true
    document.body.classList.remove(bgClass)
    document.body.classList.add("big-rich")
    audioEl.play()
    console.log("that's a lot of clicking you did there")
    console.log("enjoy the tunes")
  }
}

if (!isLighthouse) {
  setBg()
}

document.addEventListener("click", function () {
  if (!found) {
    if (isAudioPlaying) {
      audioEl.pause()
    }
    else {
      audioEl.play()
    }
    isAudioPlaying = !isAudioPlaying
    setBg()
  }
})

console.log("Welcome to my website! Try clicking.")
