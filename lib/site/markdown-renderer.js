const MarkdownIt = require("markdown-it");

function createMarkdownRenderer({ escapeHtml }) {
  return new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight(code, language) {
      if (language === "mermaid") {
        return `<pre class="mermaid">${escapeHtml(code)}</pre>`;
      }

      const normalizedLanguage = String(language || "").trim().toLowerCase();
      const languageClass = normalizedLanguage ? ` language-${escapeHtml(normalizedLanguage)}` : "";
      const escapedCode = escapeHtml(code);
      return `<pre class="${languageClass.trim()}"><code class="${languageClass.trim()}">${escapedCode}</code></pre>`;
    }
  });
}

module.exports = { createMarkdownRenderer };
