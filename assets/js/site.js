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

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    buttons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.themeOption === theme);
    });
    const activeButton = buttons.find((button) => button.dataset.themeOption === theme);
    if (label && activeButton?.dataset.themeLabel) {
      label.textContent = activeButton.dataset.themeLabel;
    }
    try {
      localStorage.setItem("blog-theme", theme);
    } catch {}
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
  };

  const activeTheme = root.dataset.theme || "sand";
  applyTheme(activeTheme);

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      applyTheme(button.dataset.themeOption || "sand");
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

  const headings = Array.from(container.children).filter(
    (node) => node instanceof HTMLElement && /^H[2-4]$/.test(node.tagName)
  );

  headings.forEach((heading, index) => {
    if (!heading.parentNode || heading.closest(".collapsible-section")) {
      return;
    }

    const nextHeading = headings[index + 1] || null;
    const section = document.createElement("section");
    section.className = "collapsible-section";
    section.dataset.level = heading.tagName.slice(1);

    if (heading.id) {
      section.id = heading.id;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "collapsible-toggle";

    const title = heading.cloneNode(true);
    title.classList.add("collapsible-heading");
    title.removeAttribute("id");

    const icon = document.createElement("span");
    icon.className = "collapsible-icon";
    icon.setAttribute("aria-hidden", "true");

    const content = document.createElement("div");
    content.className = "collapsible-content";

    const inner = document.createElement("div");
    inner.className = "collapsible-inner";
    content.appendChild(inner);

    button.append(title, icon);
    heading.replaceWith(section);
    section.append(button, content);

    let current = section.nextSibling;
    while (current && current !== nextHeading) {
      const next = current.nextSibling;
      inner.appendChild(current);
      current = next;
    }

    if (!inner.childNodes.length) {
      section.replaceWith(heading);
      return;
    }

    const isOpen = index === 0;
    section.classList.toggle("is-open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));

    button.addEventListener("click", () => {
      const expanded = section.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(expanded));
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
      pre.dataset.mermaidSource = pre.textContent || "";
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

  const computedStyles = getComputedStyle(document.documentElement);
  const diagramFontFamily = computedStyles.getPropertyValue("--diagram-font-family").trim();
  const currentTheme = document.documentElement.dataset.theme === "slate" ? "dark" : "base";
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: currentTheme,
    look: "handDrawn",
    fontFamily: diagramFontFamily || "Arial, sans-serif",
    themeVariables: {
      fontFamily: diagramFontFamily || "Arial, sans-serif",
      fontSize: "18px",
      primaryColor: computedStyles.getPropertyValue("--card-bg").trim(),
      primaryTextColor: computedStyles.getPropertyValue("--pico-h1-color").trim(),
      primaryBorderColor: computedStyles.getPropertyValue("--surface-strong").trim(),
      lineColor: computedStyles.getPropertyValue("--pico-color").trim(),
      secondaryColor: computedStyles.getPropertyValue("--soft-bg").trim(),
      tertiaryColor: computedStyles.getPropertyValue("--panel-bg").trim(),
      background: computedStyles.getPropertyValue("--code-bg").trim()
    }
  });

  mermaidBlocks.forEach(async (block, index) => {
    const source = block.dataset.mermaidSource || block.textContent || "";
    if (!source.trim()) {
      return;
    }

    try {
      block.innerHTML = "";
      const { svg } = await mermaid.render(`mermaid-${index}-${Date.now()}`, source);
      block.innerHTML = svg;
      block.dataset.mermaidStatus = "ready";
    } catch (error) {
      block.textContent = source;
      block.dataset.mermaidStatus = "error";
      block.setAttribute("title", error instanceof Error ? error.message : "Diagram render failed");
    }
  });
}

function setupThemeReactivity() {
  document.addEventListener("themechange", () => {
    setupMermaid();
  });
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
  setupThemeReactivity();
  setupMermaid();
  document.querySelectorAll(".reveal-on-scroll").forEach((node) => node.classList.add("is-visible"));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSiteUi);
} else {
  initSiteUi();
}
