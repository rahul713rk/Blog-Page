const MarkdownIt = require("markdown-it");
// const Prism = require("prismjs");
// const loadLanguages = require("prismjs/components/");

// loadLanguages(["markup", "css", "clike", "javascript", "bash", "json"]);

// function createMarkdownRenderer({ escapeHtml }) {
//   return new MarkdownIt({
//     html: true,
//     linkify: true,
//     typographer: true,
//     highlight(code, language) {
//       if (language === "mermaid") {
//         return `<pre class="mermaid">${escapeHtml(code)}</pre>`;
//       }

//       const prismLanguage = language && Prism.languages[language] ? language : "markup";
//       const highlighted = Prism.highlight(code, Prism.languages[prismLanguage], prismLanguage);
//       return `<pre class="language-${prismLanguage}"><code class="language-${prismLanguage}">${highlighted}</code></pre>`;
//     }
//   });
// }

module.exports = { MarkdownIt };
