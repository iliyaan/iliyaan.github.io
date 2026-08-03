// Dark is the default theme; visitors can switch to light via the toggle.
(function () {
  var root = document.documentElement;

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  var btn = document.getElementById("theme-toggle");
  if (!btn) return;

  btn.addEventListener("click", function () {
    var isLight = root.getAttribute("data-theme") === "light";
    apply(isLight ? "dark" : "light");
  });
})();
