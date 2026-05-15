const path = require("path");
const { readJson } = require("./file-system");
const { trimSlashes } = require("./text-utils");

function getPathPrefix(baseUrl) {
  try {
    const pathname = new URL(baseUrl).pathname.replace(/\/+$/, "");
    return pathname === "/" ? "" : pathname;
  } catch {
    return "";
  }
}

function joinUrl(base, relative) {
  const cleanBase = String(base || "").replace(/\/+$/, "");
  const cleanRelative = trimSlashes(relative);
  return cleanRelative ? `${cleanBase}/${cleanRelative}` : cleanBase;
}

function createSiteContext(rootDir) {
  const config = readJson(path.join(rootDir, "config.json"));
  const sitePath = getPathPrefix(config.baseUrl);

  return {
    rootDir,
    config,
    sitePath,
    contentDir: path.join(rootDir, "content"),
    templatesDir: path.join(rootDir, "templates"),
    assetsDir: path.join(rootDir, "assets"),
    publicDir: path.join(rootDir, "public"),
    joinUrl,
    withSitePath(relative) {
      const cleanRelative = trimSlashes(relative);
      if (!cleanRelative) {
        return sitePath || "/";
      }

      return sitePath ? `${sitePath}/${cleanRelative}` : `/${cleanRelative}`;
    },
    buildPostUrl(post) {
      if (post.kind === "tutorial") {
        return `guides/${post.collectionSlug}/${post.moduleSlug}/${post.slug}/index.html`;
      }
      return `posts/${post.slug}/index.html`;
    },
    buildPostHref(post) {
      if (post.kind === "tutorial") {
        return this.withSitePath(`guides/${post.collectionSlug}/${post.moduleSlug}/${post.slug}`);
      }
      return this.withSitePath(`posts/${post.slug}`);
    },

    pageHref(pageNumber) {
      return pageNumber === 1 ? this.withSitePath("") : this.withSitePath(`page/${pageNumber}`);
    },
    tagHref(tagSlug, pageNumber = 1) {
      return pageNumber === 1
        ? this.withSitePath(`tags/${tagSlug}`)
        : this.withSitePath(`tags/${tagSlug}/page/${pageNumber}`);
    }
  };
}

module.exports = { createSiteContext };
