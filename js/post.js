// Renders a single post page from its markdown file.
// Expects window.POST_SLUG to be set before this script runs.
(function () {
  var slug = window.POST_SLUG;
  if (!slug) return;

  fetch(slug + ".md")
    .then(function (res) { return res.text(); })
    .then(function (raw) {
      var parsed = parseMarkdown(raw);
      var meta = parsed.meta;

      if (meta.title) {
        document.title = meta.title + " — Iliyaan";
        var h1 = document.getElementById("post-title");
        if (h1) h1.textContent = meta.title;
      }
      if (meta.date) {
        var dateEl = document.getElementById("post-date");
        if (dateEl) dateEl.textContent = meta.date;
      }

      var body = document.getElementById("post-body");
      if (body) body.innerHTML = parsed.html;

      var timeEl = document.getElementById("post-reading-time");
      if (timeEl) {
        var words = raw.replace(/^---[\s\S]*?---/, "").trim().split(/\s+/).filter(Boolean).length;
        var minutes = Math.max(1, Math.round(words / 200));
        timeEl.textContent = minutes + " min read";
      }
    });
})();
