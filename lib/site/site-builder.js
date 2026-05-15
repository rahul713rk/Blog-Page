const path = require("path");
const fs = require("fs");
const lunr = require("lunr");
const fileSystem = require("./file-system");
const textUtils = require("./text-utils");
const { createSiteContext } = require("./site-context");
const { createMarkdownRenderer } = require("./markdown-renderer");
const { TemplateRepository } = require("./template-repository");
const { PostRepository } = require("./post-repository");
const { PageRenderer } = require("./page-renderer");

class SiteBuilder {
  constructor({ context, fileSystemApi, postRepository, pageRenderer, textUtilsApi }) {
    this.context = context;
    this.fileSystem = fileSystemApi;
    this.postRepository = postRepository;
    this.pageRenderer = pageRenderer;
    this.textUtils = textUtilsApi;
  }

  build() {
    const cachePath = path.join(this.context.rootDir, ".build-cache.json");
    let cache = {};
    try {
      if (fs.existsSync(cachePath)) {
        cache = JSON.parse(fs.readFileSync(cachePath, "utf8"));
      }
    } catch {}

    const templateFiles = fs.readdirSync(this.context.templatesDir);
    const templateMtimes = templateFiles
      .map((f) => fs.statSync(path.join(this.context.templatesDir, f)).mtimeMs)
      .reduce((a, b) => a + b, 0);

    const posts = this.postRepository.listPosts();
    const newCache = { __templateHash: templateMtimes };
    let skippedCount = 0;
    const startTime = Date.now();

    const forceRebuild = cache.__templateHash !== templateMtimes;

    posts.forEach((post) => {
      const fullPath = path.join(this.context.rootDir, post.sourcePath);
      const mtime = fs.statSync(fullPath).mtimeMs;
      newCache[post.sourcePath] = mtime;

      if (
        !forceRebuild &&
        cache[post.sourcePath] === mtime &&
        fs.existsSync(path.join(this.context.publicDir, post.outputPath))
      ) {
        skippedCount++;
        return;
      }
      this.writeRelative(post.outputPath, this.pageRenderer.renderPostPage(post));
    });

    this.generateIndexPages(posts);
    this.generateTagPages(posts);
    this.generateSearchIndex(posts);
    this.generateSitemap(posts);
    this.generateRssFeed(posts);
    this.copyAssets();

    fs.writeFileSync(cachePath, JSON.stringify(newCache, null, 2));

    const duration = (Date.now() - startTime) / 1000;
    const blogCount = posts.filter((p) => p.kind === "blog").length;
    const tutorialCount = posts.filter((p) => p.kind === "tutorial").length;
    const collections = new Set(posts.filter((p) => p.collectionSlug).map((p) => p.collectionSlug));

    console.log(`\nBuild complete in ${duration.toFixed(2)}s`);
    console.log(`- Rendered: ${posts.length - skippedCount}`);
    console.log(`- Skipped (cached): ${skippedCount}`);
    console.log(`- Content: ${blogCount} blogs, ${tutorialCount} lessons across ${collections.size} collections`);
  }

  generateRssFeed(posts) {
    const blogPosts = posts.filter((p) => p.kind === "blog").slice(0, 20);

    const items = blogPosts
      .map(
        (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${this.context.joinUrl(this.context.config.baseUrl, p.canonicalPath)}</link>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${p.description}]]></description>
    </item>`
      )
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${this.context.config.siteName}</title>
    <link>${this.context.config.baseUrl}</link>
    <description>${this.context.config.siteDescription}</description>
    ${items}
  </channel>
</rss>`;

    this.writeRelative("feed.xml", xml);
  }

  generateIndexPages(posts) {
    const blogPosts = posts.filter((post) => post.kind === "blog");
    const paginatedPosts = this.textUtils.paginate(blogPosts, this.context.config.postsPerPage);

    if (paginatedPosts.length === 0) {
      paginatedPosts.push([]);
    }

    const tutorialTracksHtml = this.pageRenderer.renderTutorialTracks(posts);

    paginatedPosts.forEach((pagePosts, index) => {
      const pageNumber = index + 1;
      const outputPath = pageNumber === 1 ? "index.html" : `page/${pageNumber}/index.html`;

      this.writeRelative(
        outputPath,
        this.pageRenderer.renderIndexPage({
          posts,
          pagePosts,
          pageNumber,
          totalPages: paginatedPosts.length,
          tutorialTracksHtml
        })
      );
    });
  }

  generateTagPages(posts) {
    const tagMap = new Map();

    for (const post of posts) {
      for (const tag of post.tags) {
        const tagName = String(tag || "").trim();
        const tagSlug = this.textUtils.slugify(tagName);
        if (!tagSlug) {
          continue;
        }

        if (!tagMap.has(tagSlug)) {
          tagMap.set(tagSlug, { name: tagName, posts: [] });
        }

        tagMap.get(tagSlug).posts.push(post);
      }
    }

    for (const [tagSlug, tagData] of tagMap.entries()) {
      const pages = this.textUtils.paginate(tagData.posts, this.context.config.postsPerPage);

      pages.forEach((pagePosts, index) => {
        const pageNumber = index + 1;
        const outputPath =
          pageNumber === 1 ? `tags/${tagSlug}/index.html` : `tags/${tagSlug}/page/${pageNumber}/index.html`;

        this.writeRelative(
          outputPath,
          this.pageRenderer.renderTagPage({
            tagName: tagData.name,
            pagePosts,
            pageNumber,
            totalPages: pages.length,
            tagSlug
          })
        );
      });
    }
  }

  generateSearchIndex(posts) {
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

    this.writeRelative(
      "search-index.json",
      JSON.stringify({
        index: index.toJSON(),
        documents
      })
    );
  }

  generateSitemap(posts) {
    const blogPosts = posts.filter((post) => post.kind === "blog");
    const totalPages = Math.ceil(blogPosts.length / (this.context.config.postsPerPage || 10));
    const indexPages = Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((n) => n > 1)
      .map((n) => `page/${n}`);

    const urls = ["", ...indexPages, ...posts.map((post) => post.canonicalPath)];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((item) => {
    const loc = item ? this.context.joinUrl(this.context.config.baseUrl, item) : this.context.config.baseUrl;
    return `  <url><loc>${this.textUtils.escapeHtml(loc)}</loc></url>`;
  })
  .join("\n")}
</urlset>`;

    this.writeRelative("sitemap.xml", xml);
  }

  copyAssets() {
    this.fileSystem.copyDir(this.context.assetsDir, path.join(this.context.publicDir, "assets"));
    this.writeRelative(".nojekyll", "");
  }

  writeRelative(relativePath, content) {
    this.fileSystem.writeText(path.join(this.context.publicDir, relativePath), content);
  }
}

function createSiteBuilder(rootDir) {
  const context = createSiteContext(rootDir);
  const markdownRenderer = createMarkdownRenderer({ escapeHtml: textUtils.escapeHtml });
  const templates = new TemplateRepository({
    templatesDir: context.templatesDir,
    readText: fileSystem.readText,
    renderTemplate: textUtils.renderTemplate
  });
  const postRepository = new PostRepository({
    context,
    fileSystem,
    markdownRenderer,
    textUtils
  });
  const pageRenderer = new PageRenderer({
    context,
    templates,
    textUtils
  });

  return new SiteBuilder({
    context,
    fileSystemApi: fileSystem,
    postRepository,
    pageRenderer,
    textUtilsApi: textUtils
  });
}

module.exports = {
  SiteBuilder,
  createSiteBuilder
};
