const MarkdownIt = require("markdown-it");
const Prism = require("prismjs");
const loadLanguages = require("prismjs/components/");

loadLanguages([
  "markup",
  "css",
  "scss",
  "clike",
  "javascript",
  "jsx",
  "typescript",
  "tsx",
  "bash",
  "shell-session",
  "powershell",
  "json",
  "yaml",
  "toml",
  "ini",
  "diff",
  "git",
  "docker",
  "sql",
  "java",
  "kotlin",
  "groovy",
  "c",
  "cpp",
  "csharp",
  "go",
  "rust",
  "python",
  "ruby",
  "php",
  "scala",
  "swift",
  "markdown",
  "regex",
  "properties"
]);

const LANGUAGE_ALIASES = {
  html: "markup",
  xml: "markup",
  svg: "markup",
  md: "markdown",
  yml: "yaml",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  console: "bash",
  env: "properties",
  hcl: "toml",
  tf: "toml",
  tfvars: "toml",
  dockerfile: "docker",
  plaintext: "text",
  text: "text",
  ps1: "powershell",
  bat: "powershell",
  cmd: "powershell",
  kt: "kotlin",
  cs: "csharp",
  py: "python",
  rb: "ruby",
  js: "javascript",
  ts: "typescript"
};

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeLanguage(language) {
  const normalized = String(language || "")
    .trim()
    .toLowerCase();
  const aliased = LANGUAGE_ALIASES[normalized] || normalized;
  if (!aliased || aliased === "text") {
    return "text";
  }

  return Prism.languages[aliased] ? aliased : "text";
}

function createMarkdownRenderer({ escapeHtml }) {
  const markdownRenderer = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight(code, language) {
      if (language === "mermaid") {
        return `<pre class="mermaid">${escapeHtml(code)}</pre>`;
      }

      const prismLanguage = normalizeLanguage(language);
      if (prismLanguage === "text") {
        return `<pre class="language-text"><code class="language-text">${escapeHtml(code)}</code></pre>`;
      }

      const highlighted = Prism.highlight(code, Prism.languages[prismLanguage], prismLanguage);
      return `<pre class="language-${prismLanguage}"><code class="language-${prismLanguage}">${highlighted}</code></pre>`;
    }
  });

  const defaultHeadingOpen =
    markdownRenderer.renderer.rules.heading_open ||
    ((tokens, index, options, env, self) => self.renderToken(tokens, index, options));
  const defaultLinkOpen =
    markdownRenderer.renderer.rules.link_open ||
    ((tokens, index, options, env, self) => self.renderToken(tokens, index, options));
  const defaultImage =
    markdownRenderer.renderer.rules.image ||
    ((tokens, index, options, env, self) => self.renderToken(tokens, index, options));

  markdownRenderer.renderer.rules.heading_open = (tokens, index, options, env, self) => {
    env = env || {};
    const inlineToken = tokens[index + 1];
    const rawTitle = inlineToken?.content || "";
    const baseSlug = slugify(rawTitle) || `section-${index}`;
    env.__headingIds = env.__headingIds || {};
    const currentCount = env.__headingIds[baseSlug] || 0;
    env.__headingIds[baseSlug] = currentCount + 1;
    const headingId = currentCount ? `${baseSlug}-${currentCount + 1}` : baseSlug;

    tokens[index].attrSet("id", headingId);
    return defaultHeadingOpen(tokens, index, options, env, self);
  };

  markdownRenderer.renderer.rules.link_open = (tokens, index, options, env, self) => {
    env = env || {};
    const href = tokens[index].attrGet("href") || "";
    if (/^https?:\/\//i.test(href)) {
      tokens[index].attrSet("target", "_blank");
      tokens[index].attrSet("rel", "noopener noreferrer");
    }

    return defaultLinkOpen(tokens, index, options, env, self);
  };

  markdownRenderer.renderer.rules.image = (tokens, index, options, env, self) => {
    env = env || {};
    tokens[index].attrSet("loading", "lazy");
    tokens[index].attrSet("decoding", "async");
    return defaultImage(tokens, index, options, env, self);
  };

  return markdownRenderer;
}

module.exports = { createMarkdownRenderer };
