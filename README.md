# Your site

No build step, no dependencies. Edit directly and push to GitHub — posts are
written in Markdown and rendered in the browser by a small local JS parser
(`js/markdown.js`).

    index.html          → Home page (about + recent posts)
    blog.html            → Full list of posts
    posts.json            → Manifest of posts (slug, title, date, excerpt)
    posts/post-1.md        → Sample post content (Markdown)
    posts/post-1.html      → Sample post page shell (loads the .md file)
    js/markdown.js          → Markdown → HTML parser
    js/post.js               → Renders a single post page from its .md file (incl. reading time)
    js/blog-list.js           → Renders post lists on index.html / blog.html
    js/theme.js                → Dark mode toggle (remembers your choice via localStorage)
    css/style.css                → All styling (colors as CSS variables for light/dark)
    images/profile.jpeg         → Header logo — replace with your own
    images/pfp.jpeg             → About-section face photo — replace with your own
    files/Iliyaan_Bhulani_CV_2026.pdf → CV/resume, linked from the header "CV" link

## Steps

1. Replace `images/profile.jpeg` (header logo) and `images/pfp.jpeg` (about
   photo) with your own images (same filenames).
2. Replace `files/Iliyaan_Bhulani_CV_2026.pdf` with your actual resume (same
   filename) — it's linked from the "CV" nav item in the header.
3. On `index.html`, update the LinkedIn/GitHub/X/email links in the
   "Check out my blog" section (the `href` on each icon).
4. Edit the about text in `index.html` and the sample post in
   `posts/post-1.md` to your own words.
5. To add a post:
   - Create `posts/your-slug.md` with frontmatter + content, e.g.:
     ```
     ---
     title: My New Post
     date: September 2026
     excerpt: A short one-line summary.
     ---

     Post content goes here, written in Markdown.
     ```
   - Copy `posts/post-1.html` to `posts/your-slug.html` and change
     `window.POST_SLUG = "post-1"` to `"your-slug"` (and the `<title>` if you
     like — it gets overwritten automatically once the post loads).
   - Add a matching entry to `posts.json`.

## Publish to GitHub Pages

    git init
    git add .
    git commit -m "Initial site"
    git branch -M main
    git remote add origin https://github.com/your-username/your-repo.git
    git push -u origin main

Then on GitHub: **Settings → Pages** → Source: "Deploy from a branch" → branch
`main`, folder `/ (root)` → Save. Your site goes live at
`https://your-username.github.io/your-repo` (or `https://your-username.github.io`
if the repo is named exactly that).

Note: because posts load via `fetch()`, opening `index.html` directly from
disk (`file://`) will fail to load posts in some browsers. Use GitHub Pages,
or run a local server (`python3 -m http.server`) to preview.

## Dark mode

Dark is the default theme for every visitor. The toggle button in the header
lets them switch to light, and their choice is remembered (`localStorage`) on
future visits. Colors live as CSS variables in `css/style.css` — the `:root`
block is the dark palette (default), `:root[data-theme="light"]` is the
light override.

## Link previews (Open Graph tags)

Each page has `og:title` / `og:description` / `og:image` tags in `<head>` so
links look right when shared on Slack/X/iMessage. The `og:image` paths are
relative — once the site has a real domain, consider switching them to full
URLs (e.g. `https://you.github.io/images/pfp.jpeg`) since some platforms
don't resolve relative image paths correctly.
