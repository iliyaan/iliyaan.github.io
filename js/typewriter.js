// Types out the tagline like a terminal prompt. Text lives in a
// screen-reader-only span so this is purely a visual effect.
(function () {
  var el = document.querySelector("[data-typewriter]");
  if (!el) return;

  var text = el.getAttribute("data-typewriter");
  var target = el.querySelector(".typewriter-text");
  if (!target) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    target.textContent = text;
    return;
  }

  var i = 0;
  function type() {
    target.textContent = text.slice(0, i);
    i++;
    if (i <= text.length) setTimeout(type, 35);
  }
  type();
})();
