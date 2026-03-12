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
      head
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
        ? `<img src="${this.textUtils.escapeHtml(post.cover)}" alt="${this.textUtils.escapeHtml(post.title)}">`
        : "",
      postBody: post.contentHtml,
      postTags: tagLinks,
      postNavTop: this.renderPostPager(post),
      postNavBottom: this.renderPostPager(post)
    });

    return this.wrapPage({
      title: `${post.title} | ${this.context.config.siteName}`,
      description: post.description,
      content,
      canonicalPath: post.canonicalPath,
      head: `<script defer src="${this.context.withSitePath("assets/js/site.js")}"></script>`
    });
  }

  renderIndexPage({ posts, pagePosts, pageNumber, totalPages }) {
    const blogPosts = posts.filter((post) => post.kind === "blog");
    const guideCount = posts.length - blogPosts.length;
    const postsHtml = pagePosts.map((post) => this.renderPostCard(post)).join("\n");
    const pagination = this.renderPagination("/", pageNumber, totalPages);
    const hero =
      pageNumber === 1 ? this.renderHomeHero(blogPosts.length, guideCount) : this.renderArchiveHero(pageNumber);
    const latestArticle = pageNumber === 1 ? this.renderLatestArticle(posts[0]) : "";
    const search = pageNumber === 1 ? this.renderSearchSection() : "";
    const tagDirectory = pageNumber === 1 ? this.renderTagDirectory(posts) : "";
    const library =
      pageNumber === 1
        ? this.renderHomeLibrary(postsHtml, pagination, this.renderTutorialTracks(posts))
        : this.renderArchiveLibrary(postsHtml, pagination);
    const about = pageNumber === 1 ? this.renderAboutSection(posts) : "";

    const content = this.templates.render("index.html", {
      hero,
      latestArticle,
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
      head:
        pageNumber === 1
          ? `
              <script defer src="${this.context.withSitePath("assets/js/site.js")}"></script>
              <script defer src="${this.context.withSitePath("assets/js/search.js")}"></script>
            `
          : `<script defer src="${this.context.withSitePath("assets/js/site.js")}"></script>`
    });
  }

  renderTagPage({ tagName, pagePosts, pageNumber, totalPages, tagSlug }) {
    const postsHtml = pagePosts.map((post) => this.renderPostCard(post)).join("\n");
    const content = this.templates.render("tag.html", {
      tagName: this.textUtils.escapeHtml(tagName),
      posts: postsHtml,
      pagination: this.renderPagination(`tags/${tagSlug}`, pageNumber, totalPages)
    });

    return this.wrapPage({
      title: `${tagName} | ${this.context.config.siteName}`,
      description: `Posts tagged ${tagName}`,
      content,
      canonicalPath: pageNumber === 1 ? `tags/${tagSlug}` : `tags/${tagSlug}/page/${pageNumber}`,
      head: `<script defer src="${this.context.withSitePath("assets/js/site.js")}"></script>`
    });
  }

  renderPostCard(post) {
    const tags = post.tags
      .map((tag) => {
        const tagSlug = this.textUtils.slugify(tag);
        return `<a href="${this.context.tagHref(tagSlug)}" class="tag-link">#${this.textUtils.escapeHtml(tag)}</a>`;
      })
      .join(" ");

    const metaLine = this.textUtils.renderMetaLine([
      post.formattedDate,
      post.readingTime,
      `${post.collectionLabel}${post.moduleLabel ? ` / ${post.moduleLabel}` : ""}`
    ]);
    const secondaryLabel = post.kind === "tutorial" ? `Lesson ${post.filenameOrder}` : post.kindLabel;

    return `
      <article class="post-card ${post.kind}-card reveal-on-scroll">
        <header class="post-card-header">
          <div class="eyebrow-row">
            <span class="kind-pill">${this.textUtils.escapeHtml(post.kindLabel)}</span>
            <span class="filename-pill">${this.textUtils.escapeHtml(secondaryLabel)}</span>
          </div>
          <h2><a href="${post.url}">${this.textUtils.escapeHtml(post.title)}</a></h2>
          ${metaLine}
        </header>
        <p>${this.textUtils.escapeHtml(post.description)}</p>
        <footer class="post-card-footer">
          <p class="tag-row">${tags}</p>
          <a class="text-link" href="${post.url}">Open ${this.textUtils.escapeHtml(post.kindLabel.toLowerCase())}</a>
        </footer>
      </article>
    `;
  }

  renderPostPager(post) {
    return `
      <nav class="page-jumps" aria-label="Article navigation">
        ${this.renderPagerLink(post.previousPost, "Previous", "prev")}
        ${this.renderPagerLink(post.nextPost, "Next", "next")}
      </nav>
    `;
  }

  renderPagerLink(post, label, direction) {
    if (!post) {
      return `<span class="page-jump is-disabled ${direction}">${this.textUtils.escapeHtml(label)}</span>`;
    }

    return `
      <a class="page-jump ${direction}" href="${post.url}">
        <span class="jump-label">${this.textUtils.escapeHtml(label)}</span>
        <strong>${this.textUtils.escapeHtml(post.title)}</strong>
        <small>${this.textUtils.escapeHtml(post.moduleLabel || post.collectionLabel)}</small>
      </a>
    `;
  }

  renderPagination(basePath, currentPage, totalPages) {
    if (totalPages <= 1) {
      return "";
    }

    const previousPage = currentPage > 1 ? this.buildPageHref(basePath, currentPage - 1) : "";
    const nextPage = currentPage < totalPages ? this.buildPageHref(basePath, currentPage + 1) : "";
    const options = Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;
      const selected = page === currentPage ? " selected" : "";
      return `<option value="${this.buildPageHref(basePath, page)}"${selected}>Page ${page}</option>`;
    }).join("");

    return `
      <nav class="pagination" aria-label="Pagination">
        ${
          previousPage
            ? `<a class="pagination-nav" href="${previousPage}" rel="prev">Prev</a>`
            : `<span class="pagination-nav is-disabled">Prev</span>`
        }
        <label class="pagination-select">
          <span>Page</span>
          <select data-pagination-select aria-label="Select page">
            ${options}
          </select>
        </label>
        ${
          nextPage
            ? `<a class="pagination-nav" href="${nextPage}" rel="next">Next</a>`
            : `<span class="pagination-nav is-disabled">Next</span>`
        }
      </nav>
    `;
  }

  buildPageHref(basePath, pageNumber) {
    if (basePath === "/") {
      return this.context.pageHref(pageNumber);
    }

    return pageNumber === 1
      ? this.context.withSitePath(basePath)
      : this.context.withSitePath(`${basePath}/page/${pageNumber}`);
  }

  collectTagSummaries(posts) {
    const tagMap = new Map();

    for (const post of posts) {
      for (const tag of post.tags) {
        const name = String(tag || "").trim();
        const tagSlug = this.textUtils.slugify(name);
        if (!name || !tagSlug) {
          continue;
        }

        if (!tagMap.has(tagSlug)) {
          tagMap.set(tagSlug, { name, slug: tagSlug, count: 0 });
        }

        tagMap.get(tagSlug).count += 1;
      }
    }

    return Array.from(tagMap.values()).sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.name.localeCompare(right.name);
    });
  }

  renderHomeHero(blogCount, guideCount) {
    return `
      <section class="home-hero reveal-on-scroll">
        <div class="hero-copy">
          <p class="section-kicker">Professional knowledge base</p>
          <h1>${this.textUtils.escapeHtml(this.context.config.siteName)}</h1>
          <p>${this.textUtils.escapeHtml(this.context.config.siteDescription)}</p>
        </div>
        <div class="stats-stack" aria-label="Site statistics">
          <article class="stat-card">
            <span class="stat-label">Articles</span>
            <strong>${blogCount}</strong>
            <small>Standalone blogs from content/posts</small>
          </article>
          <article class="stat-card">
            <span class="stat-label">Guides</span>
            <strong>${guideCount}</strong>
            <small>Structured learning content from content/*</small>
          </article>
        </div>
      </section>
    `;
  }

  renderArchiveHero(pageNumber) {
    return `
      <section class="content-section reveal-on-scroll">
        <header class="section-heading">
          <p class="section-kicker">Archive</p>
          <h1>Blog Archive${pageNumber > 1 ? ` · Page ${pageNumber}` : ""}</h1>
          <p>Browse the paginated list of standalone articles.</p>
        </header>
      </section>
    `;
  }

  renderLatestArticle(post) {
    if (!post) {
      return "";
    }

    const metaLine = this.textUtils.renderMetaLine([
      post.formattedDate,
      post.readingTime,
      `${post.collectionLabel}${post.moduleLabel ? ` / ${post.moduleLabel}` : ""}`
    ]);

    return `
      <section class="feature-section reveal-on-scroll">
        <article class="feature-card">
          <div class="feature-copy">
            <p class="section-kicker">Latest article</p>
            <div class="eyebrow-row">
              <span class="kind-pill">${this.textUtils.escapeHtml(post.kindLabel)}</span>
              <span class="filename-pill">${this.textUtils.escapeHtml(
                post.kind === "tutorial" ? post.collectionLabel : "Fresh Publish"
              )}</span>
            </div>
            <h2><a href="${post.url}">${this.textUtils.escapeHtml(post.title)}</a></h2>
            ${metaLine}
            <p>${this.textUtils.escapeHtml(post.description)}</p>
            <a class="text-link feature-link" href="${post.url}">Read latest article</a>
          </div>
        </article>
      </section>
    `;
  }

  renderSearchSection() {
    return `
      <section class="search-panel reveal-on-scroll">
        <header class="section-heading compact-heading">
          <p class="section-kicker">Search</p>
          <h2>Find a post fast</h2>
        </header>
        <label for="search-input">Search blogs and guides</label>
        <input id="search-input" type="search" placeholder="Search by title, tag, or content">
        <div id="search-results"></div>
      </section>
    `;
  }

  renderTagDirectory(posts) {
    const tags = this.collectTagSummaries(posts);
    if (!tags.length) {
      return "";
    }

    const tagsHtml = tags
      .map(
        (tag) => `
          <a class="tag-summary" href="${this.context.tagHref(tag.slug)}">
            <span>#${this.textUtils.escapeHtml(tag.name)}</span>
            <strong>${tag.count}</strong>
          </a>
        `
      )
      .join("");

    return `
      <section class="content-section reveal-on-scroll">
        <header class="section-heading">
          <p class="section-kicker">Tags</p>
          <h2>Browse by topic</h2>
          <p>Each tag shows how many posts are indexed under it.</p>
        </header>
        <div class="tag-directory">
          ${tagsHtml}
        </div>
      </section>
    `;
  }

  renderHomeLibrary(postsHtml, pagination, guidesHtml) {
    return `
      <section class="content-section content-library reveal-on-scroll">
        <header class="section-heading section-heading-split">
          <div>
            <p class="section-kicker">Library</p>
            <h2>Explore blogs and guides</h2>
            <p>Switch between standalone writing and structured guide collections.</p>
          </div>
          <div class="content-toggle" role="tablist" aria-label="Content type switcher">
            <button
              class="content-toggle-button is-active"
              type="button"
              data-content-toggle="blogs"
              aria-selected="true"
            >
              Blogs
            </button>
            <button
              class="content-toggle-button"
              type="button"
              data-content-toggle="guides"
              aria-selected="false"
            >
              Guides
            </button>
          </div>
        </header>
        <div class="content-panel is-active" data-content-panel="blogs" id="blogs-section">
          <div class="card-grid">
            ${postsHtml}
          </div>
          ${pagination}
        </div>
        <div class="content-panel" data-content-panel="guides" id="guides-section">
          ${guidesHtml}
        </div>
      </section>
    `;
  }

  renderArchiveLibrary(postsHtml, pagination) {
    return `
      <section class="content-section reveal-on-scroll">
        <header class="section-heading">
          <p class="section-kicker">Blogs</p>
          <h2>Archive entries</h2>
        </header>
        <div class="card-grid">
          ${postsHtml}
        </div>
        ${pagination}
      </section>
    `;
  }

  renderAboutSection(posts) {
    const tags = this.collectTagSummaries(posts);
    const guideCollections = new Set(
      posts.filter((post) => post.kind === "tutorial").map((post) => post.collectionSlug)
    );

    return `
      <section class="content-section about-section reveal-on-scroll" id="about-section">
        <header class="section-heading">
          <p class="section-kicker">About Me</p>
          <h2>${this.textUtils.escapeHtml(this.context.config.ownerName || "About the author")}</h2>
          <p>${this.textUtils.escapeHtml(this.context.config.ownerRole || "")}</p>
        </header>
        <div class="about-grid">
          <article class="about-card">
            <p class="about-copy">${this.textUtils.escapeHtml(
              this.context.config.aboutBlurb || this.context.config.siteDescription
            )}</p>
            <a class="text-link" href="${this.context.withSitePath("")}#blogs-section">Browse the library</a>
          </article>
          <div class="about-metrics" aria-label="Author snapshot">
            <article>
              <strong>${posts.length}</strong>
              <span>Total published entries</span>
            </article>
            <article>
              <strong>${guideCollections.size}</strong>
              <span>Guide collections</span>
            </article>
            <article>
              <strong>${tags.length}</strong>
              <span>Topics indexed by tag</span>
            </article>
          </div>
        </div>
      </section>
    `;
  }

  buildTutorialTracks(posts) {
    const tutorials = posts
      .filter((post) => post.kind === "tutorial")
      .sort((left, right) => {
        if (left.collectionLabel !== right.collectionLabel) {
          return left.collectionLabel.localeCompare(right.collectionLabel);
        }

        if (left.moduleSlug !== right.moduleSlug) {
          return left.moduleSlug.localeCompare(right.moduleSlug);
        }

        if (left.filenameOrder !== right.filenameOrder) {
          return left.filenameOrder - right.filenameOrder;
        }

        return left.filename.localeCompare(right.filename);
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

  renderTutorialTracks(posts) {
    const tracks = this.buildTutorialTracks(posts);

    return tracks
      .map((track) => {
        const modulesHtml = track.modules
          .map((module) => {
            const lessons = module.posts
              .map(
                (post) => `
                  <li class="tutorial-item">
                    <a href="${post.url}">
                      <span class="tutorial-filename">Lesson ${this.textUtils.escapeHtml(String(post.filenameOrder))}</span>
                      <span class="tutorial-title">${this.textUtils.escapeHtml(post.title)}</span>
                    </a>
                  </li>
                `
              )
              .join("");

            return `
              <section class="tutorial-module">
                <header>
                  <h3>${this.textUtils.escapeHtml(module.label)}</h3>
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
              <h2>${this.textUtils.escapeHtml(track.label)}</h2>
              <p>Structured guide path grouped by module and filename order.</p>
            </header>
            <div class="tutorial-module-grid">
              ${modulesHtml}
            </div>
          </article>
        `;
      })
      .join("");
  }
}

module.exports = { PageRenderer };
