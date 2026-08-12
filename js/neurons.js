// Subtle animated network of "neurons" (dots) connected by lines that
// occasionally pulse, drawn behind the page content.
(function () {
  var canvas = document.getElementById("neuron-bg");
  if (!canvas) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ctx = canvas.getContext("2d");
  var nodes = [];
  var anchorNodes = [];
  var pulses = [];
  var width, height, dpr;

  function refreshAnchors() {
    var els = document.querySelectorAll(".post-thumb");
    anchorNodes = Array.prototype.map.call(els, function (el) {
      return { el: el, x: 0, y: 0, anchor: true, glow: 0 };
    });
    updateAnchorPositions();
  }

  function updateAnchorPositions() {
    for (var i = 0; i < anchorNodes.length; i++) {
      var a = anchorNodes[i];
      var r = a.el.getBoundingClientRect();
      a.x = r.left + r.width / 2;
      a.y = r.top + r.height / 2;
    }
  }

  function themeColor(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var count = Math.min(60, Math.round((width * height) / 22000));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15
      });
    }
  }

  function maybeSpawnPulse() {
    var all = nodes.concat(anchorNodes);
    if (Math.random() > 0.02 || all.length < 2) return;
    var a = all[Math.floor(Math.random() * all.length)];
    var closest = null, closestDist = Infinity;
    for (var i = 0; i < all.length; i++) {
      var b = all[i];
      if (b === a) continue;
      var d = (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
      if (d < closestDist) { closestDist = d; closest = b; }
    }
    if (closest && closestDist < 200 * 200) {
      pulses.push({ from: a, to: closest, t: 0 });
    }
  }

  function step() {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    }
    updateAnchorPositions();
    for (var p = pulses.length - 1; p >= 0; p--) {
      pulses[p].t += 0.02;
      if (pulses[p].t >= 1) {
        if (pulses[p].to.anchor) pulses[p].to.glow = 1;
        pulses.splice(p, 1);
      }
    }
    for (var g = 0; g < anchorNodes.length; g++) {
      var an = anchorNodes[g];
      if (an.glow > 0) an.glow = Math.max(0, an.glow - 0.03);
      an.el.style.setProperty("--glow", an.glow.toFixed(3));
    }
    maybeSpawnPulse();
  }

  function draw() {
    var bg = themeColor("--bg");
    var lineColor = themeColor("--border");
    var dotColor = themeColor("--icon");
    var pulseColor = themeColor("--link");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    var allNodes = nodes.concat(anchorNodes);
    for (var i = 0; i < allNodes.length; i++) {
      for (var j = i + 1; j < allNodes.length; j++) {
        var a = allNodes[i], b = allNodes[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.strokeStyle = lineColor;
          ctx.globalAlpha = (1 - dist / 140) * 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 0.6;
    ctx.fillStyle = dotColor;
    for (var k = 0; k < nodes.length; k++) {
      ctx.beginPath();
      ctx.arc(nodes[k].x, nodes[k].y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = pulseColor;
    for (var q = 0; q < pulses.length; q++) {
      var pu = pulses[q];
      var x = pu.from.x + (pu.to.x - pu.from.x) * pu.t;
      var y = pu.from.y + (pu.to.y - pu.from.y) * pu.t;
      ctx.beginPath();
      ctx.arc(x, y, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  var running = true;
  function loop() {
    if (!running) return;
    step();
    draw();
    requestAnimationFrame(loop);
  }

  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    if (running) requestAnimationFrame(loop);
  });

  window.addEventListener("resize", resize);
  window.addEventListener("posts-rendered", refreshAnchors);
  resize();
  refreshAnchors();

  if (reduceMotion) {
    draw();
  } else {
    loop();
  }
})();
