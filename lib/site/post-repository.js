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
    if (data.draft === true) {
      return null;
    }

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
    const excerpt = data.excerpt || plainContent.slice(0, 180);
    const title = data.title || inferredTitle;

    return {
      title,
      date: data.date || new Date().toISOString(),
      formattedDate: this.textUtils.formatDate(data.date),
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
      url: this.context.buildPostHref(slug),
      canonicalPath: `posts/${slug}`,
      outputPath: this.context.buildPostUrl(slug),
      sourcePath: relativeSourcePath
    };
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
}

module.exports = { PostRepository };
