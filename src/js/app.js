var bgClasses = ["pizza-trippy", "trippy-pizza", "tile-pizza"]
var bgClass = ""
var count = 0

function setBg(removeClass) {
  if (removeClass) {
    document.body.classList.remove(bgClass)
  }
  bgClass = bgClasses[Math.floor(Math.random() * bgClasses.length)]
  document.body.classList.add(bgClass)
}

setBg(false)

var isAudioPlaying = false
var audioEl = document.getElementById("gimme-pizza")
document.addEventListener("click", function () {
  if (isAudioPlaying) {
    audioEl.pause()
  }
  else {
    audioEl.play()
  }
  isAudioPlaying = !isAudioPlaying
  setBg(true)
})
