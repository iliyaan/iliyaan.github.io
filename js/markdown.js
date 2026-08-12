// Minimal markdown parser: frontmatter + headings, bold/italic, links,
// inline code, code fences, lists, blockquotes, paragraphs.
function parseMarkdown(raw) {
  var meta = {};
  var body = raw;

  var fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (fmMatch) {
    fmMatch[1].split(/\r?\n/).forEach(function (line) {
      var m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (m) meta[m[1].trim()] = m[2].trim();
    });
    body = fmMatch[2];
  }

  return { meta: meta, html: renderMarkdown(body) };
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

var PYTHON_KEYWORDS = /^(False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)$/;

function highlightPython(code) {
  var re = /(#.*)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+\.?\d*\b)|([A-Za-z_]\w*)/g;
  var out = "";
  var last = 0;
  var m;
  while ((m = re.exec(code))) {
    out += escapeHtml(code.slice(last, m.index));
    if (m[1]) out += '<span class="tok-comment">' + escapeHtml(m[1]) + "</span>";
    else if (m[2]) out += '<span class="tok-string">' + escapeHtml(m[2]) + "</span>";
    else if (m[3]) out += '<span class="tok-number">' + escapeHtml(m[3]) + "</span>";
    else if (m[4]) {
      out += PYTHON_KEYWORDS.test(m[4])
        ? '<span class="tok-keyword">' + m[4] + "</span>"
        : escapeHtml(m[4]);
    }
    last = re.lastIndex;
  }
  out += escapeHtml(code.slice(last));
  return out;
}

function renderInline(text) {
  text = escapeHtml(text);
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)(?:\{width=([^}]+)\})?/g, function (m, alt, src, width) {
    var style = width ? ' style="width:' + width + '"' : "";
    return '<img src="' + src + '" alt="' + alt + '"' + style + ">";
  });
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return text;
}

function renderMarkdown(md) {
  var lines = md.replace(/\r\n/g, "\n").split("\n");
  var html = [];
  var i = 0;
  var listOpen = false;

  function closeList() {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  }

  while (i < lines.length) {
    var line = lines[i];

    var fenceOpen = line.match(/^```(\w*)/);
    if (fenceOpen) {
      var lang = fenceOpen[1];
      var code = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        code.push(lines[i]);
        i++;
      }
      closeList();
      var codeText = code.join("\n");
      var rendered = lang === "python" ? highlightPython(codeText) : escapeHtml(codeText);
      var cls = lang ? ' class="language-' + lang + '"' : "";
      html.push("<pre><code" + cls + ">" + rendered + "</code></pre>");
      i++;
      continue;
    }

    var heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      closeList();
      var level = heading[1].length + 1; // h1 reserved for post title
      html.push("<h" + level + ">" + renderInline(heading[2]) + "</h" + level + ">");
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      closeList();
      var quote = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      html.push("<blockquote><p>" + renderInline(quote.join(" ")) + "</p></blockquote>");
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push("<li>" + renderInline(line.replace(/^[-*]\s+/, "")) + "</li>");
      i++;
      continue;
    }

    if (line.trim() === "") {
      closeList();
      i++;
      continue;
    }

    closeList();
    var para = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,3})\s+/.test(lines[i]) && !/^[-*]\s+/.test(lines[i]) && !/^```/.test(lines[i]) && !/^>\s?/.test(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    html.push("<p>" + renderInline(para.join(" ")) + "</p>");
  }

  closeList();
  return html.join("\n");
}
