var bgClasses = ["pizza-trippy", "trippy-pizza", "tile-pizza"]
var bgClass = ""
var count = -1
var found = false
var isAudioPlaying = false
var audioEl = document.getElementById("gimme-pizza")

function setBg(removeClass) {
  if (count++ < 10) {
    if (removeClass) {
      document.body.classList.remove(bgClass)
      console.log(count)
    }
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

setBg(false)

document.addEventListener("click", function () {
  if (!found) {
    if (isAudioPlaying) {
      audioEl.pause()
    }
    else {
      audioEl.play()
    }
    isAudioPlaying = !isAudioPlaying
    setBg(true)
  }
})

console.log("Welcome to my website! Try clicking.")
