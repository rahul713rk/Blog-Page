const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const MarkdownIt = require("markdown-it");
const Prism = require("prismjs");
const loadLanguages = require("prismjs/components/");
const lunr = require("lunr");

loadLanguages(["markup", "css", "clike", "javascript", "bash", "json"]);

const rootDir = __dirname;
const config = readJson(path.join(rootDir, "config.json"));
const sitePath = getPathPrefix(config.baseUrl);
const contentDir = path.join(rootDir, "content");
const templatesDir = path.join(rootDir, "templates");
const assetsDir = path.join(rootDir, "assets");
const publicDir = path.join(rootDir, "public");

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(code, language) {
    const prismLanguage = language && Prism.languages[language] ? language : "markup";
    const highlighted = Prism.highlight(code, Prism.languages[prismLanguage], prismLanguage);
    return `<pre class="language-${prismLanguage}"><code class="language-${prismLanguage}">${highlighted}</code></pre>`;
  }
});

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function resetDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  ensureDir(dirPath);
}

function readTemplate(name) {
  return fs.readFileSync(path.join(templatesDir, name), "utf8");
}

function writeFile(relativePath, content) {
  const outputPath = path.join(publicDir, relativePath);
  ensureDir(path.dirname(outputPath));
  fs.writeFileSync(outputPath, content, "utf8");
}

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    return;
  }

  ensureDir(destDir);
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function getMarkdownFiles(dirPath) {
  const files = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
    } else if (entry.isFile() && fullPath.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeTags(tags) {
  if (!tags) {
    return [];
  }
  return Array.isArray(tags) ? tags.map(String) : [String(tags)];
}

function calculateReadingTime(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function trimSlashes(value) {
  return String(value || "").replace(/^\/+|\/+$/g, "");
}

function joinUrl(base, relative) {
  const cleanBase = String(base || "").replace(/\/+$/, "");
  const cleanRelative = trimSlashes(relative);
  return cleanRelative ? `${cleanBase}/${cleanRelative}` : cleanBase;
}

function getPathPrefix(baseUrl) {
  try {
    const pathname = new URL(baseUrl).pathname.replace(/\/+$/, "");
    return pathname === "/" ? "" : pathname;
  } catch {
    return "";
  }
}

function withSitePath(relative) {
  const cleanRelative = trimSlashes(relative);
  if (!cleanRelative) {
    return sitePath || "/";
  }
  return `${sitePath}/${cleanRelative}` || `/${cleanRelative}`;
}

function render(template, data) {
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => data[key] ?? "");
}

function buildPostUrl(slug) {
  return `posts/${slug}/index.html`;
}

function buildPostHref(slug) {
  return withSitePath(`posts/${slug}`);
}

function pageHref(pageNumber) {
  return pageNumber === 1 ? withSitePath("") : withSitePath(`page/${pageNumber}`);
}

function tagHref(tagSlug, pageNumber = 1) {
  return pageNumber === 1
    ? withSitePath(`tags/${tagSlug}`)
    : withSitePath(`tags/${tagSlug}/page/${pageNumber}`);
}

function parsePosts() {
  const files = getMarkdownFiles(contentDir);
  return files
    .map((filePath) => {
      const source = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(source);
      if (data.draft === true) {
        return null;
      }
      const slug = data.slug ? slugify(data.slug) : slugify(path.basename(filePath, ".md"));
      const tags = normalizeTags(data.tags);
      const excerpt = data.excerpt || content.replace(/\s+/g, " ").trim().slice(0, 180);
      return {
        title: data.title || slug,
        date: data.date || new Date().toISOString(),
        formattedDate: formatDate(data.date),
        author: data.author || "",
        category: data.category || "",
        cover: data.cover || "",
        readingTime: data.readingTime || calculateReadingTime(content),
        description: data.description || excerpt,
        excerpt,
        slug,
        tags,
        contentHtml: md.render(content),
        url: buildPostHref(slug),
        outputPath: buildPostUrl(slug),
        sourcePath: path.relative(rootDir, filePath).replace(/\\/g, "/")
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderPostCard(post) {
  const tags = post.tags
    .map((tag) => `<a href="${tagHref(slugify(tag))}" class="tag-link">#${escapeHtml(tag)}</a>`)
    .join(" ");

  return `
    <article>
      <header>
        <h2><a href="${post.url}">${escapeHtml(post.title)}</a></h2>
        <p><small>${escapeHtml(post.formattedDate)}</small></p>
      </header>
      <p>${escapeHtml(post.description)}</p>
      <p>${tags}</p>
    </article>
  `;
}

function renderPagination(basePath, currentPage, totalPages) {
  if (totalPages <= 1) {
    return "";
  }

  const links = [];
  for (let page = 1; page <= totalPages; page += 1) {
    let href;
    if (basePath === "/") {
      href = pageHref(page);
    } else {
      href = page === 1 ? withSitePath(basePath) : withSitePath(`${basePath}/page/${page}`);
    }
    const label = page === currentPage ? `<strong>${page}</strong>` : `${page}`;
    links.push(`<a href="${href}">${label}</a>`);
  }

  return `<nav class="pagination">${links.join(" ")}</nav>`;
}

function wrapPage({ title, description, content, canonicalPath = "", head = "" }) {
  const layoutTemplate = readTemplate("layout.html");
  return render(layoutTemplate, {
    title: escapeHtml(title),
    description: escapeHtml(description || config.siteDescription),
    content,
    siteName: escapeHtml(config.siteName),
    baseUrl: config.baseUrl,
    canonicalUrl: canonicalPath ? joinUrl(config.baseUrl, canonicalPath) : config.baseUrl,
    sitePath,
    year: String(new Date().getFullYear()),
    head
  });
}

function generatePostPages(posts) {
  const postTemplate = readTemplate("post.html");

  for (const post of posts) {
    const tagLinks = post.tags
      .map((tag) => `<a href="${tagHref(slugify(tag))}" class="tag-link">#${escapeHtml(tag)}</a>`)
      .join(" ");

    const content = render(postTemplate, {
      postTitle: escapeHtml(post.title),
      postDate: escapeHtml(post.formattedDate),
      postAuthor: escapeHtml(post.author),
      postCategory: escapeHtml(post.category),
      postReadingTime: escapeHtml(post.readingTime),
      postCover: post.cover ? `<img src="${escapeHtml(post.cover)}" alt="${escapeHtml(post.title)}">` : "",
      postBody: post.contentHtml,
      postTags: tagLinks
    });

    writeFile(
      post.outputPath,
      wrapPage({
        title: `${post.title} | ${config.siteName}`,
        description: post.description,
        content,
        canonicalPath: trimSlashes(post.url)
      })
    );
  }
}

function paginate(items, perPage) {
  const pages = [];
  for (let index = 0; index < items.length; index += perPage) {
    pages.push(items.slice(index, index + perPage));
  }
  return pages;
}

function generateIndexPages(posts) {
  const indexTemplate = readTemplate("index.html");
  const paginatedPosts = paginate(posts, config.postsPerPage);

  paginatedPosts.forEach((pagePosts, index) => {
    const pageNumber = index + 1;
    const postsHtml = pagePosts.map(renderPostCard).join("\n");
    const pagination = renderPagination("/", pageNumber, paginatedPosts.length);
    const searchMarkup = pageNumber === 1
      ? `
        <section>
          <label for="search-input">Search posts</label>
          <input id="search-input" type="search" placeholder="Search by title, tag, or content">
          <div id="search-results"></div>
        </section>
      `
      : "";

    const content = render(indexTemplate, {
      pageTitle: pageNumber === 1 ? "Latest Posts" : `Page ${pageNumber}`,
      intro: escapeHtml(config.siteDescription),
      posts: postsHtml,
      pagination,
      search: searchMarkup
    });

    const outputPath = pageNumber === 1 ? "index.html" : `page/${pageNumber}/index.html`;
    const canonicalPath = pageNumber === 1 ? "" : `page/${pageNumber}`;
    writeFile(
      outputPath,
      wrapPage({
        title: pageNumber === 1 ? config.siteName : `${config.siteName} | Page ${pageNumber}`,
        description: config.siteDescription,
        content,
        canonicalPath,
        head: pageNumber === 1 ? `<script defer src="${withSitePath("assets/js/search.js")}"></script>` : ""
      })
    );
  });
}

function generateTagPages(posts) {
  const tagTemplate = readTemplate("tag.html");
  const tagMap = new Map();

  for (const post of posts) {
    for (const tag of post.tags) {
      const tagSlug = slugify(tag);
      if (!tagMap.has(tagSlug)) {
        tagMap.set(tagSlug, { name: tag, posts: [] });
      }
      tagMap.get(tagSlug).posts.push(post);
    }
  }

  for (const [tagSlug, tagData] of tagMap.entries()) {
    const pages = paginate(tagData.posts, config.postsPerPage);

    pages.forEach((pagePosts, index) => {
      const pageNumber = index + 1;
      const postsHtml = pagePosts.map(renderPostCard).join("\n");
      const basePath = `/tags/${tagSlug}/`;
      const tagBasePath = `tags/${tagSlug}`;
      const pagination = renderPagination(tagBasePath, pageNumber, pages.length);
      const content = render(tagTemplate, {
        tagName: escapeHtml(tagData.name),
        posts: postsHtml,
        pagination
      });

      const outputPath =
        pageNumber === 1
          ? `tags/${tagSlug}/index.html`
          : `tags/${tagSlug}/page/${pageNumber}/index.html`;

      const canonicalPath =
        pageNumber === 1 ? `tags/${tagSlug}` : `tags/${tagSlug}/page/${pageNumber}`;

      writeFile(
        outputPath,
        wrapPage({
          title: `${tagData.name} | ${config.siteName}`,
          description: `Posts tagged ${tagData.name}`,
          content,
          canonicalPath
        })
      );
    });
  }
}

function generateSearchIndex(posts) {
  const documents = posts.map((post) => ({
    id: post.slug,
    title: post.title,
    description: post.description,
    tags: post.tags.join(" "),
    content: post.contentHtml.replace(/<[^>]+>/g, " "),
    url: post.url
  }));

  const index = lunr(function createIndex() {
    this.ref("id");
    this.field("title");
    this.field("description");
    this.field("tags");
    this.field("content");
    documents.forEach((doc) => this.add(doc));
  });

  writeFile(
    "search-index.json",
    JSON.stringify(
      {
        index: index.toJSON(),
        documents
      },
      null,
      2
    )
  );
}

function generateSitemap(posts) {
  const urls = [
    "",
    ...posts.map((post) => trimSlashes(post.url))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((item) => {
    const loc = item ? joinUrl(config.baseUrl, item) : config.baseUrl;
    return `  <url><loc>${escapeHtml(loc)}</loc></url>`;
  })
  .join("\n")}
</urlset>`;

  writeFile("sitemap.xml", xml);
}

function copyAssets() {
  copyDir(assetsDir, path.join(publicDir, "assets"));
  writeFile(".nojekyll", "");
}

function build() {
  resetDir(publicDir);
  const posts = parsePosts();
  generatePostPages(posts);
  generateIndexPages(posts);
  generateTagPages(posts);
  generateSearchIndex(posts);
  generateSitemap(posts);
  copyAssets();
  console.log(`Built ${posts.length} post(s) into ${publicDir}`);
}

build();
