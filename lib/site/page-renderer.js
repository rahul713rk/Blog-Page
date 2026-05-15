const { renderHomeHero, renderArchiveHero } = require("./renderers/hero-renderer");
const { renderPostCard, renderPostPager } = require("./renderers/card-renderer");
const { renderTutorialTracks } = require("./renderers/tutorial-renderer");

class PageRenderer {
  constructor({ context, templates, textUtils }) {
    this.context = context;
    this.templates = templates;
    this.textUtils = textUtils;
  }

  wrapPage({ title, description, content, canonicalPath = "", head = "" }) {
    return this.templates.render("layout.html", {
      title: this.textUtils.escapeHtml(title),
      description: this.textUtils.escapeHtml(description || this.context.config.siteDescription),
      content,
      siteName: this.textUtils.escapeHtml(this.context.config.siteName),
      baseUrl: this.context.config.baseUrl,
      canonicalUrl: canonicalPath
        ? this.context.joinUrl(this.context.config.baseUrl, canonicalPath)
        : this.context.config.baseUrl,
      sitePath: this.context.sitePath,
      homeHref: this.context.withSitePath(""),
      year: String(new Date().getFullYear()),
      head,
      blogsActive: canonicalPath === "" || canonicalPath.startsWith("page/") ? 'aria-current="page"' : "",
      guidesActive: canonicalPath === "guides" || canonicalPath.startsWith("guides/") ? 'aria-current="page"' : "",
      aboutActive: canonicalPath === "about" || canonicalPath.endsWith("/about/index.html") ? 'aria-current="page"' : ""
    });
  }

  renderPostPage(post) {
    const tagLinks = post.tags
      .map((tag) => {
        const tagSlug = this.textUtils.slugify(tag);
        return `<a href="${this.context.tagHref(tagSlug)}" class="tag-link">#${this.textUtils.escapeHtml(tag)}</a>`;
      })
      .join(" ");

    const content = this.templates.render("post.html", {
      postTitle: this.textUtils.escapeHtml(post.title),
      postMetaPrimary: this.textUtils.renderMetaLine([post.formattedDate, post.author, post.readingTime]),
      postMetaSecondary: this.textUtils.renderMetaLine([post.collectionLabel, post.moduleLabel, post.category]),
      postKind: this.textUtils.escapeHtml(post.kindLabel),
      postFilename: this.textUtils.escapeHtml(
        post.kind === "tutorial" ? `Lesson ${post.filenameOrder}` : post.kindLabel
      ),
      postCover: post.cover
        ? `<div class="post-cover-frame"><img src="${this.textUtils.escapeHtml(post.cover)}" alt="${this.textUtils.escapeHtml(post.title)}" loading="lazy" decoding="async"></div>`
        : "",
      postBody: post.contentHtml,
      postTags: tagLinks,
      postNavTop: this.renderPostPager(post),
      postNavBottom: this.renderPostPager(post)
    });

    const jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      author: { "@type": "Person", name: post.author },
      publisher: { "@type": "Organization", name: this.context.config.siteName }
    });

    return this.wrapPage({
      title: `${post.title} | ${this.context.config.siteName}`,
      description: post.description,
      content,
      canonicalPath: post.canonicalPath,
      head: `
        <script type="application/ld+json">${jsonLd}</script>
        <script type="module" src="${this.context.withSitePath("assets/js/site.js")}"></script>
        <script src="https://cdn.jsdelivr.net/npm/lunr/lunr.min.js"></script>
        <script defer src="${this.context.withSitePath("assets/js/search.js")}"></script>
      `
    });
  }

  renderIndexPage({ posts, pagePosts, pageNumber, totalPages, tutorialTracksHtml }) {
    const blogPosts = posts.filter((post) => post.kind === "blog");
    const postsHtml = pagePosts.map((post) => this.renderPostCard(post)).join("\n");
    const pagination = this.renderPagination("/", pageNumber, totalPages);
    const hero = pageNumber === 1 ? this.renderHomeHero(blogPosts.length) : this.renderArchiveHero(pageNumber);
    const search = this.renderSearchSection();
    const tagDirectory = pageNumber === 1 ? this.renderTagDirectory(posts) : "";
    const library =
      pageNumber === 1
        ? this.renderHomeLibrary(postsHtml, pagination, tutorialTracksHtml || this.renderTutorialTracks(posts))
        : this.renderArchiveLibrary(postsHtml, pagination);
    const about = pageNumber === 1 ? this.renderAboutSection() : "";

    const content = this.templates.render("index.html", {
      hero,
      search,
      tagDirectory,
      library,
      about
    });

    return this.wrapPage({
      title: pageNumber === 1 ? this.context.config.siteName : `${this.context.config.siteName} | Page ${pageNumber}`,
      description: this.context.config.siteDescription,
      content,
      canonicalPath: pageNumber === 1 ? "" : `page/${pageNumber}`,
      head: `
        <script type="module" src="${this.context.withSitePath("assets/js/site.js")}"></script>
        <script src="https://cdn.jsdelivr.net/npm/lunr/lunr.min.js"></script>
        <script defer src="${this.context.withSitePath("assets/js/search.js")}"></script>
      `
    });
  }

  renderTagPage({ tagName, pagePosts, pageNumber, totalPages, tagSlug }) {
    const postsHtml = pagePosts.map((post) => this.renderPostCard(post)).join("\n");
    const search = this.renderSearchSection();
    const content = this.templates.render("tag.html", {
      tagName: this.textUtils.escapeHtml(tagName),
      search,
      posts: postsHtml,
      pagination: this.renderPagination(`tags/${tagSlug}`, pageNumber, totalPages)
    });

    return this.wrapPage({
      title: `${tagName} | ${this.context.config.siteName}`,
      description: `Browse ${pagePosts.length} posts tagged "${tagName}" on ${this.context.config.siteName}.`,
      content,
      canonicalPath: pageNumber === 1 ? `tags/${tagSlug}` : `tags/${tagSlug}/page/${pageNumber}`,
      head: `
        <script type="module" src="${this.context.withSitePath("assets/js/site.js")}"></script>
        <script src="https://cdn.jsdelivr.net/npm/lunr/lunr.min.js"></script>
        <script defer src="${this.context.withSitePath("assets/js/search.js")}"></script>
      `
    });
  }

  renderPostCard(post) {
    return renderPostCard(post, { context: this.context, textUtils: this.textUtils });
  }

  renderPostPager(post) {
    return renderPostPager(post, { textUtils: this.textUtils });
  }

  renderPagination(baseUrl, pageNumber, totalPages) {
    if (totalPages <= 1) return "";

    const prev =
      pageNumber > 1
        ? `<a href="${this.context.withSitePath(baseUrl + "/page/" + (pageNumber - 1))}" class="pagination-link">Prev</a>`
        : "";
    const next =
      pageNumber < totalPages
        ? `<a href="${this.context.withSitePath(baseUrl + "/page/" + (pageNumber + 1))}" class="pagination-link">Next</a>`
        : "";

    return `<nav class="pagination">
      ${prev}
      <span class="page-info">Page ${pageNumber} of ${totalPages}</span>
      ${next}
    </nav>`;
  }

  renderHomeHero(blogCount) {
    return renderHomeHero(blogCount);
  }

  renderArchiveHero(pageNumber) {
    return renderArchiveHero(pageNumber);
  }

  renderSearchSection() {
    return `
      <section class="search-panel reveal-on-scroll">
        <div class="search-box">
          <input type="text" id="search-input" placeholder="Search articles, guides, or benchmarks... (Press '/' to focus)" aria-label="Search content">
          <div id="search-results" class="search-results"></div>
        </div>
      </section>
    `;
  }

  renderTagDirectory(posts) {
    const tags = new Map();
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tags.set(tag, (tags.get(tag) || 0) + 1);
      });
    });

    const sortedTags = Array.from(tags.entries()).sort((a, b) => b[1] - a[1]);
    const tagHtml = sortedTags
      .map(([tag, count]) => {
        const tagSlug = this.textUtils.slugify(tag);
        return `<a href="${this.context.tagHref(tagSlug)}" class="tag-directory-link">${this.textUtils.escapeHtml(
          tag
        )} <small>(${count})</small></a>`;
      })
      .join("\n");

    return `
      <section class="tag-directory reveal-on-scroll">
        <header class="section-header">
          <h2>Browse by Tags</h2>
          <button 
            class="section-toggle-button is-open" 
            type="button" 
            data-collapsible-trigger="tag-directory"
            data-open-label="Hide tags"
            data-close-label="Show tags"
            aria-expanded="true" 
            aria-controls="tag-directory-panel"
          >
            <span>Hide tags</span>
            <span class="section-toggle-icon" aria-hidden="true"></span>
          </button>
        </header>
        <div id="tag-directory-panel" class="tag-directory-panel is-open">
          <div class="tag-cloud">${tagHtml}</div>
        </div>
      </section>
    `;
  }

  renderAboutSection() {
    return `
      <section class="about-section reveal-on-scroll" id="about-section">
        <div class="section-header"><h2>About Me</h2></div>
        <div class="about-content">
          <p>Software engineer passionate about systems architecture, browser performance, and building accessible, lightning-fast web experiences.</p>
        </div>
      </section>
    `;
  }

  renderHomeLibrary(postsHtml, pagination, tutorialTracksHtml) {
    return `
      <div class="home-library">
        <section class="posts-library reveal-on-scroll">
          <header class="section-header"><h2>Latest Posts</h2></header>
          <div class="post-grid">${postsHtml}</div>
          ${pagination}
        </section>
        <aside class="tracks-sidebar">${tutorialTracksHtml}</aside>
      </div>
    `;
  }

  renderArchiveLibrary(postsHtml, pagination) {
    return `
      <div class="archive-library">
        <section class="posts-library reveal-on-scroll">
          <div class="post-grid">${postsHtml}</div>
          ${pagination}
        </section>
      </div>
    `;
  }

  renderTutorialTracks(posts) {
    return renderTutorialTracks(posts, { textUtils: this.textUtils });
  }
}

module.exports = { PageRenderer };
