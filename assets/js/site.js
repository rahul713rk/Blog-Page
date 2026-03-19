const THEME_ICONS = {
  default: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3v3"></path>
      <path d="M12 18v3"></path>
      <path d="M3 12h3"></path>
      <path d="M18 12h3"></path>
      <path d="M5.64 5.64l2.12 2.12"></path>
      <path d="M16.24 16.24l2.12 2.12"></path>
      <path d="M5.64 18.36l2.12-2.12"></path>
      <path d="M16.24 7.76l2.12-2.12"></path>
      <circle cx="12" cy="12" r="4.2"></circle>
    </svg>
  `,
  dark: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 15.5A6.5 6.5 0 0 1 8.5 6a7.5 7.5 0 1 0 9.5 9.5Z"></path>
    </svg>
  `,
  computer: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="12" rx="2"></rect>
      <path d="M8 20h8"></path>
      <path d="M12 16v4"></path>
    </svg>
  `,
  "github-light": `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8"></circle>
      <path d="M12 8v8"></path>
      <path d="M8 12h8"></path>
    </svg>
  `,
  "light-plus": `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="10" cy="10" r="4.5"></circle>
      <path d="M10 2.5v2"></path>
      <path d="M10 15.5v2"></path>
      <path d="M2.5 10h2"></path>
      <path d="M15.5 10h2"></path>
      <path d="M17.5 17.5v4"></path>
      <path d="M15.5 19.5h4"></path>
    </svg>
  `,
  "light-modern": `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3l1.5 3.8L17 8.2l-3.5 1.3L12 13.5l-1.5-4L7 8.2l3.5-1.4L12 3Z"></path>
      <path d="M18.5 13.5l.9 2.2 2.1.8-2.1.8-.9 2.2-.9-2.2-2.1-.8 2.1-.8.9-2.2Z"></path>
      <path d="M7 14l1.1 2.8L11 18l-2.9 1.2L7 22l-1.1-2.8L3 18l2.9-1.2L7 14Z"></path>
    </svg>
  `,
  abyss: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 15.5A6.5 6.5 0 0 1 8.5 6a7.5 7.5 0 1 0 9.5 9.5Z"></path>
      <path d="M16.5 4.5v1.5"></path>
      <path d="M16.5 9v1.5"></path>
      <path d="M14.25 7.25h1.5"></path>
      <path d="M18.75 7.25h1.5"></path>
    </svg>
  `
};

const THEME_LABELS = {
  default: "Default",
  dark: "Dark",
  computer: "Computer",
  "github-light": "GitHub Light",
  "light-plus": "Light+",
  "light-modern": "Light Modern",
  abyss: "Abyss"
};

const THEME_GROUPS = {
  page: {
    datasetKey: "theme",
    storageKey: "blog-theme",
    defaultTheme: "default",
    supportedThemes: ["default", "dark", "computer"],
    triggerLabel: "Site theme switcher"
  },
  code: {
    datasetKey: "codeTheme",
    storageKey: "blog-code-theme",
    defaultTheme: "github-light",
    supportedThemes: ["github-light", "light-plus", "light-modern", "abyss"],
    triggerLabel: "Code theme switcher"
  },
  diagram: {
    datasetKey: "diagramTheme",
    storageKey: "blog-diagram-theme",
    defaultTheme: "github-light",
    supportedThemes: ["github-light", "light-plus", "light-modern", "abyss"],
    triggerLabel: "Diagram theme switcher"
  }
};

let themeDropdownCloseHandlerAttached = false;

function renderThemeIcon(themeName) {
  return THEME_ICONS[themeName] || THEME_ICONS.default;
}

function syncThemeDropdown(dropdown, activeTheme) {
  if (!dropdown) {
    return;
  }

  dropdown.querySelectorAll("[data-theme-option]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.themeOption === activeTheme);
  });

  const iconHost = dropdown.querySelector("[data-theme-active-icon]");
  if (iconHost) {
    iconHost.innerHTML = renderThemeIcon(activeTheme);
  }
}

function createThemeDropdown(groupName) {
  const config = THEME_GROUPS[groupName];
  if (!config) {
    return null;
  }

  const dropdown = document.createElement("details");
  dropdown.className = "theme-dropdown block-theme-dropdown";
  dropdown.dataset.themeGroup = groupName;

  const optionsMarkup = config.supportedThemes
    .map(
      (themeName) => `
        <button class="theme-option" type="button" data-theme-option="${themeName}" aria-label="${THEME_LABELS[themeName]} theme" title="${THEME_LABELS[themeName]}">
          <span class="theme-option-icon" aria-hidden="true">
            ${renderThemeIcon(themeName)}
          </span>
        </button>
      `
    )
    .join("");

  dropdown.innerHTML = `
    <summary class="theme-trigger theme-trigger--compact" aria-label="${config.triggerLabel}">
      <span class="theme-trigger-icon" data-theme-active-icon aria-hidden="true">
        ${renderThemeIcon(config.defaultTheme)}
      </span>
    </summary>
    <div class="theme-menu" role="menu" aria-label="${config.triggerLabel}">
      ${optionsMarkup}
    </div>
  `;

  return dropdown;
}

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

function setupThemeControls() {
  const root = document.documentElement;
  const dropdowns = Array.from(document.querySelectorAll("[data-theme-group]"));
  if (!dropdowns.length) {
    return;
  }

  const applyTheme = (groupName, themeName) => {
    const config = THEME_GROUPS[groupName];
    if (!config) {
      return;
    }

    const nextTheme = config.supportedThemes.includes(themeName) ? themeName : config.defaultTheme;
    root.dataset[config.datasetKey] = nextTheme;

    document.querySelectorAll(`[data-theme-group="${groupName}"]`).forEach((dropdown) => {
      syncThemeDropdown(dropdown, nextTheme);
    });

    try {
      localStorage.setItem(config.storageKey, nextTheme);
    } catch {}

    if (groupName === "page" || groupName === "diagram") {
      setupMermaid();
    }
  };

  dropdowns.forEach((dropdown) => {
    if (dropdown.dataset.themeBound === "true") {
      return;
    }

    dropdown.dataset.themeBound = "true";
    const groupName = dropdown.dataset.themeGroup;
    const config = THEME_GROUPS[groupName];
    if (!config) {
      return;
    }

    dropdown.querySelectorAll("[data-theme-option]").forEach((button) => {
      button.addEventListener("click", () => {
        applyTheme(groupName, button.dataset.themeOption || config.defaultTheme);
        dropdown.open = false;
      });
    });

    dropdown.addEventListener("toggle", () => {
      if (!dropdown.open) {
        return;
      }

      document.querySelectorAll("[data-theme-group]").forEach((otherDropdown) => {
        if (otherDropdown !== dropdown) {
          otherDropdown.open = false;
        }
      });
    });
  });

  Object.entries(THEME_GROUPS).forEach(([groupName, config]) => {
    if (!document.querySelector(`[data-theme-group="${groupName}"]`)) {
      return;
    }

    const activeTheme = config.supportedThemes.includes(root.dataset[config.datasetKey])
      ? root.dataset[config.datasetKey]
      : config.defaultTheme;
    applyTheme(groupName, activeTheme);
  });

  if (!themeDropdownCloseHandlerAttached) {
    themeDropdownCloseHandlerAttached = true;
    document.addEventListener("click", (event) => {
      document.querySelectorAll("[data-theme-group]").forEach((dropdown) => {
        if (dropdown.open && !dropdown.contains(event.target)) {
          dropdown.open = false;
        }
      });
    });
  }
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

      const toolbar = document.createElement("header");
      toolbar.className = "diagram-toolbar";

      const label = document.createElement("span");
      label.className = "diagram-label";
      label.textContent = "Diagram";

      const actions = document.createElement("div");
      actions.className = "diagram-toolbar-actions";
      const themeDropdown = createThemeDropdown("diagram");
      if (themeDropdown) {
        actions.appendChild(themeDropdown);
      }

      toolbar.append(label, actions);

      const host = document.createElement("div");
      host.className = "mermaid-host";
      host.dataset.mermaidSource = source;

      pre.replaceWith(shell);
      shell.append(toolbar, host);
      return;
    }

    const shell = document.createElement("section");
    shell.className = "code-block-shell";

    const toolbar = document.createElement("header");
    toolbar.className = "code-block-toolbar";

    const label = document.createElement("span");
    label.className = "code-block-language";
    label.textContent = getCodeLanguage(pre);

    const actions = document.createElement("div");
    actions.className = "code-block-actions";

    const themeDropdown = createThemeDropdown("code");
    if (themeDropdown) {
      actions.appendChild(themeDropdown);
    }

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

    actions.appendChild(copyButton);
    toolbar.append(label, actions);

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
    fontFamily: diagramFontFamily || "inherit",
    themeVariables: {
      fontFamily: diagramFontFamily || "inherit",
      fontSize: "16px",
      background: "transparent",
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
      cScale2: "#64748b"
    }
  });

  mermaidHosts.forEach(async (host, index) => {
    const source = host.dataset.mermaidSource || "";
    if (!source.trim()) {
      return;
    }

    try {
      const pageTheme = document.documentElement.dataset.theme || "default";
      const diagramTheme = document.documentElement.dataset.diagramTheme || "github-light";
      const renderId = `mermaid-diagram-${index}-${pageTheme}-${diagramTheme}`;
      const { svg } = await mermaid.render(renderId, source);
      host.innerHTML = svg;
    } catch (error) {
      host.innerHTML = `<pre>${String(error.message || error)}</pre>`;
    }
  });
}

function initSiteUi() {
  setupSectionCollapses();
  setupContentToggle();
  setupPaginationSelects();
  setupScrollTopButton();
  buildHeadingCollapsibles();
  setupQuestionAnswerMask();
  setupCodeBlocks();
  setupThemeControls();
  setupRevealOnScroll();
  setupMermaid();
  document.querySelectorAll(".reveal-on-scroll").forEach((node) => node.classList.add("is-visible"));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSiteUi);
} else {
  initSiteUi();
}
