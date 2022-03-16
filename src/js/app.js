var bgs = ["pizza-trippy.gif", "trippy-pizza.gif", "tile-pizza.gif"]
var count = 0

function setBg() {
  var bg = bgs[Math.floor(Math.random() * bgs.length)]
  document.body.style.backgroundImage = "url(static/img/" + bg + ")"
}

window.addEventListener("load", function () {
  setBg()
})

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
  setBg()
})
