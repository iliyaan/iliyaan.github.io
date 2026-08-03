// Renders post list entries from posts.json into a container.
// Usage: <div id="post-list" data-limit="1"></div>
(function () {
  var container = document.getElementById("post-list");
  if (!container) return;

  var prefix = container.getAttribute("data-prefix") || "";
  var limit = parseInt(container.getAttribute("data-limit"), 10) || Infinity;

  fetch(prefix + "posts.json")
    .then(function (res) { return res.json(); })
    .then(function (posts) {
      posts.slice(0, limit).forEach(function (post) {
        var entry = document.createElement("div");
        entry.className = "post-entry";
        entry.innerHTML =
          '<div class="post-date">' + post.date + "</div>" +
          '<div class="post-title"><a href="' + prefix + "posts/" + post.slug + '.html">' + post.title + "</a></div>" +
          '<p class="post-excerpt">' + post.excerpt + "</p>";
        container.appendChild(entry);
      });
    });
})();
