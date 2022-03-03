window.addEventListener("load", function () {
  var bgs = ["pizza-trippy.gif", "trippy-pizza.gif", "tile-pizza.gif"]
  var bg = bgs[Math.floor(Math.random() * bgs.length)]
  document.body.style.backgroundImage = "url(static/img/" + bg + ")"
})
