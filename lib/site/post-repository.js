const path = require("path");
const matter = require("gray-matter");

class PostRepository {
  constructor({ context, fileSystem, markdownRenderer, textUtils }) {
    this.context = context;
    this.fileSystem = fileSystem;
    this.markdownRenderer = markdownRenderer;
    this.textUtils = textUtils;
  }

  listPosts() {
    const files = this.fileSystem.getMarkdownFiles(this.context.contentDir);
    const posts = files
      .map((filePath) => this.parseFile(filePath))
      .filter(Boolean)
      .sort((left, right) => new Date(right.date) - new Date(left.date));

    this.attachNavigation(posts);
    return posts;
  }

  parseFile(filePath) {
    const source = this.fileSystem.readText(filePath);
    const { data, content } = matter(source);
    this.validatePost(filePath, data);
    const relativeSourcePath = path.relative(this.context.rootDir, filePath).replace(/\\/g, "/");

    const relativeContentPath = relativeSourcePath.replace(/^content\//, "");
    const segments = relativeContentPath.split("/");
    const filename = path.basename(filePath, ".md");
    const kind = this.getContentKind(relativeSourcePath);
    const collectionSlug = kind === "tutorial" ? segments[0] : "posts";
    const moduleSlug = kind === "tutorial" ? segments[2] || "" : "";
    const slug = data.slug ? this.textUtils.slugify(data.slug) : this.textUtils.slugify(filename);
    const tags = this.textUtils.normalizeTags(data.tags);
    const inferredTitle = this.textUtils.extractFirstHeading(content) || this.getFilenameLabel(filename);
    const plainContent = this.textUtils.stripMarkdown(content);
    const makeExcerpt = (text, maxLen = 180) => {
      if (text.length <= maxLen) return text;
      const cut = text.lastIndexOf(" ", maxLen);
      return (cut > 0 ? text.slice(0, cut) : text.slice(0, maxLen)) + "…";
    };
    const excerpt = data.excerpt || makeExcerpt(plainContent);
    const title = data.title || inferredTitle;

    const rawDate = data.date ? new Date(data.date) : null;
    const isValidDate = rawDate && !isNaN(rawDate.getTime());
    if (data.date && !isValidDate) {
      console.warn(`[WARN] Invalid date format in: ${filePath}`);
    } else if (!data.date) {
      console.warn(`[WARN] Missing date in: ${filePath}`);
    }

    const date = isValidDate ? rawDate.toISOString() : new Date(0).toISOString();

    const post = {
      title,
      date,
      formattedDate: isValidDate ? this.textUtils.formatDate(date) : "Unknown Date",
      author: data.author || "",
      category: data.category || "",
      cover: data.cover || "",
      readingTime: data.readingTime || this.textUtils.calculateReadingTime(content),
      description: data.description || excerpt,
      excerpt,
      slug,
      tags,
      kind,
      kindLabel: kind === "blog" ? "Blog" : "Guide",
      filename,
      filenameLabel: this.getFilenameLabel(filename),
      filenameOrder: this.textUtils.readOrderPrefix(filename),
      collectionSlug,
      collectionLabel: this.getCollectionLabel(collectionSlug),
      moduleSlug,
      moduleLabel: this.getModuleLabel(moduleSlug),
      relativeContentPath,
      contentHtml: this.textUtils.removeLeadingTitleHeading(this.markdownRenderer.render(content), title),
      sourcePath: relativeSourcePath
    };

    post.url = this.context.buildPostHref(post);
    post.outputPath = this.context.buildPostUrl(post);
    post.canonicalPath = post.outputPath.replace(/\/index\.html$/, "");

    return post;

  }

  attachNavigation(posts) {
    const blogs = posts
      .filter((post) => post.kind === "blog")
      .sort((left, right) => new Date(left.date) - new Date(right.date));

    const tutorials = posts
      .filter((post) => post.kind === "tutorial")
      .sort((left, right) => this.compareTutorialPosts(left, right));

    for (const sequence of [blogs, tutorials]) {
      sequence.forEach((post, index) => {
        post.previousPost = sequence[index - 1] || null;
        post.nextPost = sequence[index + 1] || null;
      });
    }
  }

  compareTutorialPosts(left, right) {
    if (left.collectionSlug !== right.collectionSlug) {
      return left.collectionSlug.localeCompare(right.collectionSlug);
    }

    if (left.moduleSlug !== right.moduleSlug) {
      return left.moduleSlug.localeCompare(right.moduleSlug);
    }

    if (left.filenameOrder !== right.filenameOrder) {
      return left.filenameOrder - right.filenameOrder;
    }

    return left.filename.localeCompare(right.filename);
  }

  getContentKind(relativeSourcePath) {
    return relativeSourcePath.startsWith("content/posts/") ? "blog" : "tutorial";
  }

  getCollectionLabel(collectionSlug) {
    return this.textUtils.titleCase(String(collectionSlug || "").replace(/-learning$/i, ""));
  }

  getModuleLabel(moduleSlug) {
    return this.textUtils.titleCase(this.textUtils.stripLeadingOrder(moduleSlug));
  }

  getFilenameLabel(filename) {
    const stripped = this.textUtils.stripLeadingOrder(filename);
    return this.textUtils.titleCase(stripped || filename);
  }

  validatePost(filePath, data) {
    const required = ["title", "date"];
    required.forEach((field) => {
      if (!data[field]) {
        console.warn(`[WARN] Missing "${field}" in ${filePath}`);
      }
    });
  }
}


module.exports = { PostRepository };
