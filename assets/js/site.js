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
  if (!buttons.length) {
    return;
  }

  const supportedThemes = new Set(["default", "dark", "computer"]);
  const applyTheme = (theme) => {
    const nextTheme = supportedThemes.has(theme) ? theme : "default";
    root.dataset.theme = nextTheme;
    buttons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.themeOption === nextTheme);
    });
    try {
      localStorage.setItem("blog-theme", nextTheme);
    } catch {}

    setupMermaid();
  };

  const activeTheme = supportedThemes.has(root.dataset.theme) ? root.dataset.theme : "default";
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

let mermaidLoadHookAttached = false;

function ensureMermaidReady() {
  if (typeof mermaid !== "undefined") {
    return true;
  }

  if (!mermaidLoadHookAttached) {
    mermaidLoadHookAttached = true;
    window.addEventListener(
      "load",
      () => {
        setupMermaid();
      },
      { once: true }
    );
  }

  return false;
}

function setupSectionCollapses() {
  const triggers = Array.from(document.querySelectorAll("[data-collapsible-trigger]"));
  if (!triggers.length) {
    return;
  }

  triggers.forEach((trigger) => {
    if (trigger.dataset.collapseBound === "true") {
      return;
    }

    const key = trigger.dataset.collapsibleTrigger;
    const panel = document.querySelector(`[data-collapsible-panel="${key}"]`);
    if (!panel) {
      return;
    }

    trigger.dataset.collapseBound = "true";
    trigger.addEventListener("click", () => {
      const isOpen = trigger.classList.toggle("is-open");
      panel.classList.toggle("is-open", isOpen);
      trigger.setAttribute("aria-expanded", String(isOpen));
      const label = trigger.querySelector("span");
      if (label) {
        label.textContent = isOpen ? "Hide tags" : "Show tags";
      }
    });
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

  const isQaSection = (text) => /q\s*&\s*a|faq|question|exercise/i.test(text || "");
  const isAnswerNode = (node) => /answer|solution/i.test(node.textContent || "");

  const mountToggle = ({ host, targets, compact = false }) => {
    if (!host || !targets.length) {
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = `qa-toggle${compact ? " is-compact" : ""}`;
    button.dataset.state = "visible";
    button.textContent = "Hide answers";

    let hidden = false;
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      hidden = !hidden;
      button.dataset.state = hidden ? "hidden" : "visible";
      button.textContent = hidden ? "Show answers" : "Hide answers";
      targets.forEach((node) => {
        node.classList.toggle("is-qa-hidden", hidden);
      });
    });

    host.appendChild(button);
  };

  Array.from(articleBody.querySelectorAll(".collapsible-section")).forEach((section) => {
    const heading = section.querySelector(":scope > .collapsible-toggle .collapsible-heading");
    const content = section.querySelector(":scope > .collapsible-content .collapsible-inner");
    if (!heading || !content || !isQaSection(heading.textContent || "")) {
      return;
    }

    const targets = Array.from(
      content.querySelectorAll("p, li, blockquote, pre, .code-block-shell, .diagram-shell, table")
    ).filter(isAnswerNode);

    mountToggle({
      host: section.querySelector(":scope > .collapsible-toggle"),
      targets,
      compact: true
    });
  });

  Array.from(articleBody.querySelectorAll("h3, h4, h5, h6")).forEach((heading) => {
    if (heading.closest(".collapsible-section") || !isQaSection(heading.textContent || "")) {
      return;
    }

    const level = Number(heading.tagName.slice(1));
    const targets = [];
    let current = heading.nextElementSibling;

    while (current) {
      if (/^H[1-6]$/.test(current.tagName) && Number(current.tagName.slice(1)) <= level) {
        break;
      }

      if (isAnswerNode(current)) {
        targets.push(current);
      }

      current = current.nextElementSibling;
    }

    if (!targets.length) {
      return;
    }

    const host = document.createElement("div");
    host.className = "qa-toggle-row";
    heading.insertAdjacentElement("afterend", host);
    mountToggle({ host, targets });
  });
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
      const source = pre.textContent || "";
      const host = document.createElement("div");
      host.className = "mermaid-host";
      host.dataset.mermaidSource = source;
      shell.innerHTML = `
        <header class="diagram-toolbar">
          <span class="diagram-label">Diagram</span>
        </header>
      `;
      pre.replaceWith(shell);
      shell.appendChild(host);
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
  const mermaidHosts = Array.from(document.querySelectorAll(".mermaid-host"));
  if (!mermaidHosts.length || !ensureMermaidReady()) {
    return;
  }

  const computedStyles = getComputedStyle(document.documentElement);
  const diagramFontFamily = computedStyles.getPropertyValue("--diagram-font-family").trim();
  const mermaidText = computedStyles.getPropertyValue("--mermaid-text").trim() || "#111111";
  const mermaidContrast = computedStyles.getPropertyValue("--mermaid-contrast").trim() || "#ffffff";
  const mermaidBackground = computedStyles.getPropertyValue("--mermaid-bg").trim() || "#f6f2ea";
  const mermaidSurface = computedStyles.getPropertyValue("--mermaid-surface").trim() || "#eee7dc";
  const mermaidLine = computedStyles.getPropertyValue("--mermaid-line").trim() || "#445663";
  const mermaidNode = computedStyles.getPropertyValue("--mermaid-node").trim() || "#255f46";
  const mermaidNodeAlt = computedStyles.getPropertyValue("--mermaid-node-alt").trim() || "#a96a26";

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: "base",
    fontFamily: diagramFontFamily || "Arial, sans-serif",
    themeVariables: {
      fontFamily: diagramFontFamily || "Arial, sans-serif",
      fontSize: "18px",
      background: mermaidBackground,
      primaryColor: mermaidNode,
      primaryTextColor: mermaidContrast,
      primaryBorderColor: mermaidLine,
      secondaryColor: mermaidNodeAlt,
      secondaryTextColor: mermaidContrast,
      secondaryBorderColor: mermaidLine,
      tertiaryColor: mermaidSurface,
      tertiaryTextColor: mermaidText,
      tertiaryBorderColor: mermaidLine,
      lineColor: mermaidLine,
      mainBkg: mermaidNode,
      secondBkg: mermaidNodeAlt,
      tertiaryBkg: mermaidSurface,
      clusterBkg: mermaidSurface,
      clusterBorder: mermaidLine,
      nodeBorder: mermaidLine,
      defaultLinkColor: mermaidLine,
      edgeLabelBackground: mermaidBackground,
      titleColor: mermaidText,
      textColor: mermaidText,
      actorTextColor: mermaidText,
      labelColor: mermaidText,
      signalColor: mermaidText,
      noteTextColor: mermaidText,
      noteBkgColor: mermaidSurface,
      noteBorderColor: mermaidLine,
      cScale0: mermaidNode,
      cScale1: mermaidNodeAlt,
      cScale2: mermaidSurface
    }
  });

  mermaidHosts.forEach(async (host, index) => {
    const source = host.dataset.mermaidSource || "";
    if (!source.trim()) {
      return;
    }

    try {
      const renderId = `mermaid-diagram-${index}-${document.documentElement.dataset.theme || "default"}`;
      const { svg } = await mermaid.render(renderId, source);
      host.innerHTML = svg;
    } catch (error) {
      host.innerHTML = `<pre>${String(error.message || error)}</pre>`;
    }
  });
}

function initSiteUi() {
  setupThemeSwitcher();
  setupSectionCollapses();
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
