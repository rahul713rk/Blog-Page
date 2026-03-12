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

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function removeLeadingTitleHeading(contentHtml, title) {
  const headingPattern = new RegExp(
    `^\\s*<h1\\b[^>]*>${escapeRegExp(String(title || ""))}<\\/h1>\\s*`,
    "i"
  );

  return String(contentHtml || "").replace(headingPattern, "");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

function calculateReadingTime(content) {
  const words = String(content || "").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function trimSlashes(value) {
  return String(value || "").replace(/^\/+|\/+$/g, "");
}

function renderTemplate(template, data) {
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => data[key] ?? "");
}

function paginate(items, perPage) {
  const pages = [];

  for (let index = 0; index < items.length; index += perPage) {
    pages.push(items.slice(index, index + perPage));
  }

  return pages;
}

module.exports = {
  calculateReadingTime,
  escapeHtml,
  extractFirstHeading,
  formatDate,
  normalizeTags,
  paginate,
  readOrderPrefix,
  removeLeadingTitleHeading,
  renderMetaLine,
  renderTemplate,
  slugify,
  stripLeadingOrder,
  stripMarkdown,
  titleCase,
  trimSlashes
};
