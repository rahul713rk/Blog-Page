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
    if (language === "mermaid") {
      return `<pre class="mermaid">${escapeHtml(code)}</pre>`;
    }
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

function extractFirstHeading(content) {
  const match = String(content || "").match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

function stripMarkdown(value) {
  return String(value || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function removeLeadingTitleHeading(contentHtml, title) {
  const headingPattern = new RegExp(
    `^\\s*<h1>${escapeRegExp(String(title || ""))}<\\/h1>\\s*`,
    "i"
  );
  return String(contentHtml || "").replace(headingPattern, "");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderMetaLine(items) {
  const parts = items.filter(Boolean).map((item) => `<small>${escapeHtml(item)}</small>`);
  return parts.length ? `<p class="post-meta">${parts.join("")}</p>` : "";
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

function titleCase(value) {
  return String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function stripLeadingOrder(value) {
  return String(value || "").replace(/^\d+[-_.\s]*/, "");
}

function readOrderPrefix(value) {
  const match = String(value || "").match(/^(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function getContentKind(relativeSourcePath) {
  return relativeSourcePath.startsWith("content/posts/") ? "blog" : "tutorial";
}

function getCollectionLabel(collectionSlug) {
  return titleCase(String(collectionSlug || "").replace(/-learning$/i, ""));
}

function getModuleLabel(moduleSlug) {
  return titleCase(stripLeadingOrder(moduleSlug));
}

function getFilenameLabel(filename) {
  const stripped = stripLeadingOrder(filename);
  return titleCase(stripped || filename);
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
  const posts = files
    .map((filePath) => {
      const source = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(source);
      if (data.draft === true) {
        return null;
      }
      const relativeSourcePath = path.relative(rootDir, filePath).replace(/\\/g, "/");
      const relativeContentPath = relativeSourcePath.replace(/^content\//, "");
      const segments = relativeContentPath.split("/");
      const filename = path.basename(filePath, ".md");
      const kind = getContentKind(relativeSourcePath);
      const collectionSlug = kind === "tutorial" ? segments[0] : "posts";
      const moduleSlug = kind === "tutorial" ? segments[2] || "" : "";
      const slug = data.slug ? slugify(data.slug) : slugify(path.basename(filePath, ".md"));
      const tags = normalizeTags(data.tags);
      const inferredTitle = extractFirstHeading(content) || getFilenameLabel(filename);
      const plainContent = stripMarkdown(content);
      const excerpt = data.excerpt || plainContent.slice(0, 180);
      return {
        title: data.title || inferredTitle,
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
        kind,
        kindLabel: kind === "blog" ? "Blog" : "Tutorial",
        filename,
        filenameLabel: getFilenameLabel(filename),
        filenameOrder: readOrderPrefix(filename),
        collectionSlug,
        collectionLabel: getCollectionLabel(collectionSlug),
        moduleSlug,
        moduleLabel: getModuleLabel(moduleSlug),
        relativeContentPath,
        contentHtml: removeLeadingTitleHeading(md.render(content), data.title || inferredTitle),
        url: buildPostHref(slug),
        canonicalPath: `posts/${slug}`,
        outputPath: buildPostUrl(slug),
        sourcePath: relativeSourcePath
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  attachPostNavigation(posts);
  return posts;
}

function renderPostCard(post) {
  const tags = post.tags
    .map((tag) => `<a href="${tagHref(slugify(tag))}" class="tag-link">#${escapeHtml(tag)}</a>`)
    .join(" ");

  const metaLine = renderMetaLine([
    post.formattedDate,
    post.readingTime,
    `${post.collectionLabel}${post.moduleLabel ? ` / ${post.moduleLabel}` : ""}`
  ]);
  const secondaryLabel = post.kind === "tutorial" ? `Lesson ${post.filenameOrder}` : post.kindLabel;

  return `
    <article class="post-card ${post.kind}-card reveal-on-scroll">
      <header class="post-card-header">
        <div class="eyebrow-row">
          <span class="kind-pill">${escapeHtml(post.kindLabel)}</span>
          <span class="filename-pill">${escapeHtml(secondaryLabel)}</span>
        </div>
        <h2><a href="${post.url}">${escapeHtml(post.title)}</a></h2>
        ${metaLine}
      </header>
      <p>${escapeHtml(post.description)}</p>
      <footer class="post-card-footer">
        <p class="tag-row">${tags}</p>
        <a class="text-link" href="${post.url}">Open ${escapeHtml(post.kindLabel.toLowerCase())}</a>
      </footer>
    </article>
  `;
}

function renderPagerLink(post, label, direction) {
  if (!post) {
    return `<span class="page-jump is-disabled ${direction}">${escapeHtml(label)}</span>`;
  }

  return `
    <a class="page-jump ${direction}" href="${post.url}">
      <span class="jump-label">${escapeHtml(label)}</span>
      <strong>${escapeHtml(post.title)}</strong>
      <small>${escapeHtml(post.moduleLabel || post.collectionLabel)}</small>
    </a>
  `;
}

function renderPostPager(post) {
  return `
    <nav class="page-jumps" aria-label="Article navigation">
      ${renderPagerLink(post.previousPost, "Previous", "prev")}
      ${renderPagerLink(post.nextPost, "Next", "next")}
    </nav>
  `;
}

function buildTutorialTracks(posts) {
  const tutorials = posts
    .filter((post) => post.kind === "tutorial")
    .sort((a, b) => {
      if (a.collectionLabel !== b.collectionLabel) {
        return a.collectionLabel.localeCompare(b.collectionLabel);
      }
      if (a.moduleSlug !== b.moduleSlug) {
        return a.moduleSlug.localeCompare(b.moduleSlug);
      }
      if (a.filenameOrder !== b.filenameOrder) {
        return a.filenameOrder - b.filenameOrder;
      }
      return a.filename.localeCompare(b.filename);
    });

  const tracks = new Map();

  for (const post of tutorials) {
    if (!tracks.has(post.collectionSlug)) {
      tracks.set(post.collectionSlug, {
        label: post.collectionLabel,
        modules: new Map()
      });
    }

    const track = tracks.get(post.collectionSlug);
    if (!track.modules.has(post.moduleSlug)) {
      track.modules.set(post.moduleSlug, {
        label: post.moduleLabel || "General",
        posts: []
      });
    }

    track.modules.get(post.moduleSlug).posts.push(post);
  }

  return Array.from(tracks.values()).map((track) => ({
    label: track.label,
    modules: Array.from(track.modules.values())
  }));
}

function renderTutorialTracks(posts) {
  const tracks = buildTutorialTracks(posts);
  return tracks
    .map((track) => {
      const modulesHtml = track.modules
        .map((module) => {
          const lessons = module.posts
            .map(
              (post) => `
                <li class="tutorial-item">
                  <a href="${post.url}">
                    <span class="tutorial-filename">Lesson ${escapeHtml(String(post.filenameOrder))}</span>
                    <span class="tutorial-title">${escapeHtml(post.title)}</span>
                  </a>
                </li>
              `
            )
            .join("");

          return `
            <section class="tutorial-module">
              <header>
                <h3>${escapeHtml(module.label)}</h3>
                <p>${module.posts.length} lesson${module.posts.length === 1 ? "" : "s"}</p>
              </header>
              <ol>
                ${lessons}
              </ol>
            </section>
          `;
        })
        .join("");

      return `
        <article class="tutorial-track reveal-on-scroll">
          <header class="track-header">
            <h2>${escapeHtml(track.label)}</h2>
            <p>Structured tutorial path grouped by module and filename order.</p>
          </header>
          <div class="tutorial-module-grid">
            ${modulesHtml}
          </div>
        </article>
      `;
    })
    .join("");
}

function attachPostNavigation(posts) {
  const blogs = posts
    .filter((post) => post.kind === "blog")
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const tutorials = posts
    .filter((post) => post.kind === "tutorial")
    .sort((a, b) => {
      if (a.collectionSlug !== b.collectionSlug) {
        return a.collectionSlug.localeCompare(b.collectionSlug);
      }
      if (a.moduleSlug !== b.moduleSlug) {
        return a.moduleSlug.localeCompare(b.moduleSlug);
      }
      if (a.filenameOrder !== b.filenameOrder) {
        return a.filenameOrder - b.filenameOrder;
      }
      return a.filename.localeCompare(b.filename);
    });

  for (const sequence of [blogs, tutorials]) {
    sequence.forEach((post, index) => {
      post.previousPost = sequence[index - 1] || null;
      post.nextPost = sequence[index + 1] || null;
    });
  }
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
      postMetaPrimary: renderMetaLine([post.formattedDate, post.author, post.readingTime]),
      postMetaSecondary: renderMetaLine([post.collectionLabel, post.moduleLabel, post.category]),
      postKind: escapeHtml(post.kindLabel),
      postFilename: escapeHtml(post.kind === "tutorial" ? `Lesson ${post.filenameOrder}` : post.kindLabel),
      postCover: post.cover ? `<img src="${escapeHtml(post.cover)}" alt="${escapeHtml(post.title)}">` : "",
      postBody: post.contentHtml,
      postTags: tagLinks,
      postNavTop: renderPostPager(post),
      postNavBottom: renderPostPager(post)
    });

    writeFile(
      post.outputPath,
      wrapPage({
        title: `${post.title} | ${config.siteName}`,
        description: post.description,
        content,
        canonicalPath: post.canonicalPath,
        head: `<script defer src="${withSitePath("assets/js/site.js")}"></script>`
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
  const blogPosts = posts.filter((post) => post.kind === "blog");
  const paginatedPosts = paginate(blogPosts, config.postsPerPage);
  if (paginatedPosts.length === 0) {
    paginatedPosts.push([]);
  }

  paginatedPosts.forEach((pagePosts, index) => {
    const pageNumber = index + 1;
    const postsHtml = pagePosts.map(renderPostCard).join("\n");
    const pagination = renderPagination("/", pageNumber, paginatedPosts.length);
    const tutorialTracks = pageNumber === 1 ? renderTutorialTracks(posts) : "";
    const searchMarkup = pageNumber === 1
      ? `
        <section class="search-panel reveal-on-scroll">
          <label for="search-input">Search posts</label>
          <input id="search-input" type="search" placeholder="Search by title, tag, or content">
          <div id="search-results"></div>
        </section>
      `
      : "";

    const content = render(indexTemplate, {
      pageTitle: pageNumber === 1 ? "Blogs And Tutorials" : `Blog Archive · Page ${pageNumber}`,
      intro:
        pageNumber === 1
          ? "Browse standalone blog posts, then continue into grouped tutorial tracks built from your guide filenames and module folders."
          : escapeHtml(config.siteDescription),
      posts: postsHtml,
      pagination,
      search: searchMarkup,
      tutorials: tutorialTracks,
      blogCount: String(blogPosts.length),
      tutorialCount: String(posts.length - blogPosts.length)
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
        head:
          pageNumber === 1
            ? `
              <script defer src="${withSitePath("assets/js/site.js")}"></script>
              <script defer src="${withSitePath("assets/js/search.js")}"></script>
            `
            : `<script defer src="${withSitePath("assets/js/site.js")}"></script>`
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
          canonicalPath,
          head: `<script defer src="${withSitePath("assets/js/site.js")}"></script>`
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
    ...posts.map((post) => post.canonicalPath)
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
