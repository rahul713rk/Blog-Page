function setupScrollTopButton() {
  const button = document.querySelector(".scroll-top-button");
  if (!button) {
    return;
  }

  const toggleVisibility = () => {
    button.classList.toggle("is-visible", window.scrollY > 320);
  };

  window.addEventListener("scroll", toggleVisibility, { passive: true });
  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  toggleVisibility();
}

function setupThemeSwitcher() {
  const root = document.documentElement;
  const buttons = Array.from(document.querySelectorAll("[data-theme-option]"));
  const dropdown = document.querySelector(".theme-dropdown");
  const label = document.querySelector(".theme-trigger-label");
  if (!buttons.length) {
    return;
  }

  const legacyThemeMap = { sand: "default", slate: "dark", paper: "default" };
  const supportedThemes = new Set(["default", "dark", "rainbow", "computer", "colorblind"]);
  const applyTheme = (theme) => {
    const nextTheme = supportedThemes.has(theme) ? theme : legacyThemeMap[theme] || "default";
    root.dataset.theme = nextTheme;
    buttons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.themeOption === nextTheme);
    });
    const activeButton = buttons.find((button) => button.dataset.themeOption === nextTheme);
    if (label && activeButton?.dataset.themeLabel) {
      label.textContent = activeButton.dataset.themeLabel;
    }
    try {
      localStorage.setItem("blog-theme", nextTheme);
    } catch {}
  };

  const activeTheme = legacyThemeMap[root.dataset.theme] || root.dataset.theme || "default";
  applyTheme(activeTheme);

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      applyTheme(button.dataset.themeOption || "default");
      if (dropdown) {
        dropdown.open = false;
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!dropdown?.open) {
      return;
    }
    if (!dropdown.contains(event.target)) {
      dropdown.open = false;
    }
  });
}

function setupContentToggle() {
  const buttons = Array.from(document.querySelectorAll("[data-content-toggle]"));
  const panels = Array.from(document.querySelectorAll("[data-content-panel]"));
  if (!buttons.length || !panels.length) {
    return;
  }

  const applyPanel = (panelName) => {
    buttons.forEach((button) => {
      const isActive = button.dataset.contentToggle === panelName;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.contentPanel === panelName);
    });
  };

  const panelFromHash = () => (window.location.hash === "#guides-section" ? "guides" : "blogs");

  applyPanel(panelFromHash());

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const panelName = button.dataset.contentToggle || "blogs";
      applyPanel(panelName);

      const targetId = panelName === "guides" ? "guides-section" : "blogs-section";
      const target = document.getElementById(targetId);
      if (target) {
        history.replaceState(null, "", `#${targetId}`);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  window.addEventListener("hashchange", () => {
    applyPanel(panelFromHash());
  });
}

function setupPaginationSelects() {
  document.querySelectorAll("[data-pagination-select]").forEach((select) => {
    select.addEventListener("change", () => {
      if (select.value) {
        window.location.assign(select.value);
      }
    });
  });
}

function buildHeadingCollapsibles() {
  const container = document.querySelector(".article-body");
  if (!container) {
    return;
  }

  [2, 1].forEach((level) => {
    const headings = Array.from(container.querySelectorAll(`h${level}`));
    headings.forEach((heading) => {
      if (!heading.parentNode || heading.closest(".collapsible-section")) {
        return;
      }

      const section = document.createElement("section");
      section.className = "collapsible-section";
      section.dataset.level = String(level);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "collapsible-toggle";
      button.setAttribute("aria-controls", `${heading.id || `section-${level}`}-content`);
      button.setAttribute("aria-expanded", "false");
      button.innerHTML = `
        <span class="collapsible-heading">${heading.textContent}</span>
        <span class="collapsible-icon" aria-hidden="true"></span>
      `;

      const content = document.createElement("div");
      content.className = "collapsible-content";
      content.id = `${heading.id || `section-${level}`}-content`;

      const inner = document.createElement("div");
      inner.className = "collapsible-inner";
      content.appendChild(inner);

      heading.replaceWith(section);
      section.appendChild(button);
      section.appendChild(content);

      let current = section.nextSibling;
      while (current) {
        const next = current.nextSibling;
        if (
          current.nodeType === Node.ELEMENT_NODE &&
          /^H[1-6]$/.test(current.tagName) &&
          Number(current.tagName.slice(1)) <= level
        ) {
          break;
        }
        inner.appendChild(current);
        current = next;
      }

      button.addEventListener("click", () => {
        const isOpen = section.classList.toggle("is-open");
        button.setAttribute("aria-expanded", String(isOpen));
      });
    });
  });
}

function setupQuestionAnswerMask() {
  const articleBody = document.querySelector(".article-body");
  if (!articleBody) {
    return;
  }

  const targets = Array.from(articleBody.querySelectorAll("h2, h3, h4, p, li")).filter((node) =>
    /\?|exercise|answer|solution|faq|question/i.test(node.textContent || "")
  );

  if (!targets.length) {
    return;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "qa-toggle";
  button.textContent = "Hide Q&A / exercise answers";

  let hidden = false;
  button.addEventListener("click", () => {
    hidden = !hidden;
    button.textContent = hidden ? "Show Q&A / exercise answers" : "Hide Q&A / exercise answers";
    targets.forEach((node) => {
      if (/answer|solution/i.test(node.textContent || "")) {
        node.classList.toggle("is-qa-hidden", hidden);
      }
    });
  });

  articleBody.prepend(button);
}

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  return new Promise((resolve, reject) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      resolve();
    } catch (error) {
      reject(error);
    } finally {
      textarea.remove();
    }
  });
}

function getCodeLanguage(pre) {
  const code = pre.querySelector("code");
  const classNames = `${pre.className} ${code?.className || ""}`;
  const match = classNames.match(/language-([a-z0-9-]+)/i);
  if (!match) {
    return "Code";
  }

  return match[1]
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function setupCodeBlocks() {
  document.querySelectorAll(".article-body pre").forEach((pre) => {
    if (pre.closest(".code-block-shell, .diagram-shell")) {
      return;
    }

    if (pre.classList.contains("mermaid")) {
      const shell = document.createElement("section");
      shell.className = "diagram-shell";
      shell.innerHTML = `
        <header class="diagram-toolbar">
          <span class="diagram-label">Diagram</span>
        </header>
      `;
      pre.replaceWith(shell);
      shell.appendChild(pre);
      return;
    }

    const shell = document.createElement("section");
    shell.className = "code-block-shell";

    const toolbar = document.createElement("header");
    toolbar.className = "code-block-toolbar";

    const label = document.createElement("span");
    label.className = "code-block-language";
    label.textContent = getCodeLanguage(pre);

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "code-copy-button";
    copyButton.textContent = "Copy code";

    copyButton.addEventListener("click", async () => {
      const code = pre.querySelector("code");
      const source = code ? code.textContent || "" : pre.textContent || "";
      const originalLabel = copyButton.textContent;

      try {
        await copyText(source);
        copyButton.textContent = "Copied";
      } catch {
        copyButton.textContent = "Copy failed";
      }

      window.setTimeout(() => {
        copyButton.textContent = originalLabel;
      }, 1600);
    });

    toolbar.append(label, copyButton);

    pre.replaceWith(shell);
    shell.append(toolbar, pre);
  });
}

function setupRevealOnScroll() {
  const nodes = document.querySelectorAll(".reveal-on-scroll");
  if (!nodes.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  nodes.forEach((node) => observer.observe(node));
}

function setupMermaid() {
  const mermaidBlocks = document.querySelectorAll(".mermaid");
  if (!mermaidBlocks.length || typeof mermaid === "undefined") {
    return;
  }

  const mermaidThemeMap = {
    default: "base",
    dark: "dark",
    rainbow: "base",
    computer: "dark",
    colorblind: "base"
  };
  const currentTheme = mermaidThemeMap[document.documentElement.dataset.theme] || "base";
  const computedStyles = getComputedStyle(document.documentElement);
  const diagramFontFamily = computedStyles.getPropertyValue("--diagram-font-family").trim();
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: currentTheme,
    fontFamily: diagramFontFamily || "Arial, sans-serif",
    themeVariables: {
      fontFamily: diagramFontFamily || "Arial, sans-serif",
      fontSize: "18px"
    }
  });
  mermaid.run({ nodes: mermaidBlocks });
}

function initSiteUi() {
  setupThemeSwitcher();
  setupContentToggle();
  setupPaginationSelects();
  setupScrollTopButton();
  buildHeadingCollapsibles();
  setupQuestionAnswerMask();
  setupCodeBlocks();
  setupRevealOnScroll();
  setupMermaid();
  document.querySelectorAll(".reveal-on-scroll").forEach((node) => node.classList.add("is-visible"));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSiteUi);
} else {
  initSiteUi();
}
