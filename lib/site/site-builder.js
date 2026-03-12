const path = require("path");
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
    this.fileSystem.resetDir(this.context.publicDir);

    const posts = this.postRepository.listPosts();
    this.generatePostPages(posts);
    this.generateIndexPages(posts);
    this.generateTagPages(posts);
    this.generateSearchIndex(posts);
    this.generateSitemap(posts);
    this.copyAssets();

    console.log(`Built ${posts.length} post(s) into ${this.context.publicDir}`);
  }

  generatePostPages(posts) {
    posts.forEach((post) => {
      this.writeRelative(post.outputPath, this.pageRenderer.renderPostPage(post));
    });
  }

  generateIndexPages(posts) {
    const blogPosts = posts.filter((post) => post.kind === "blog");
    const paginatedPosts = this.textUtils.paginate(blogPosts, this.context.config.postsPerPage);

    if (paginatedPosts.length === 0) {
      paginatedPosts.push([]);
    }

    paginatedPosts.forEach((pagePosts, index) => {
      const pageNumber = index + 1;
      const outputPath = pageNumber === 1 ? "index.html" : `page/${pageNumber}/index.html`;

      this.writeRelative(
        outputPath,
        this.pageRenderer.renderIndexPage({
          posts,
          pagePosts,
          pageNumber,
          totalPages: paginatedPosts.length
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
          pageNumber === 1
            ? `tags/${tagSlug}/index.html`
            : `tags/${tagSlug}/page/${pageNumber}/index.html`;

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

  generateSitemap(posts) {
    const urls = ["", ...posts.map((post) => post.canonicalPath)];

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
