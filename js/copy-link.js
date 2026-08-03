(function () {
  var btn = document.getElementById("copy-link");
  if (!btn) return;

  var defaultLabel = btn.textContent;

  btn.addEventListener("click", function () {
    navigator.clipboard.writeText(window.location.href).then(function () {
      btn.textContent = "Copied!";
      setTimeout(function () {
        btn.textContent = defaultLabel;
      }, 1500);
    });
  });
})();
