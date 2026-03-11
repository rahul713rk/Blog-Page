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
  const buttons = document.querySelectorAll("[data-theme-option]");
  if (!buttons.length) {
    return;
  }

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    buttons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.themeOption === theme);
    });
    try {
      localStorage.setItem("blog-theme", theme);
    } catch {}
  };

  const activeTheme = root.dataset.theme || "sand";
  applyTheme(activeTheme);

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      applyTheme(button.dataset.themeOption || "sand");
    });
  });
}

function buildHeadingCollapsibles() {
  const container = document.querySelector(".article-body");
  if (!container) {
    return;
  }

  [4, 3, 2].forEach((level) => {
    const headings = Array.from(container.querySelectorAll(`h${level}`));
    headings.forEach((heading) => {
      if (heading.dataset.collapsibleReady === "true" || heading.closest(".collapsible-toggle")) {
        return;
      }

      const section = document.createElement("section");
      section.className = "collapsible-section is-open";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "collapsible-toggle";
      button.setAttribute("aria-expanded", "true");
      button.innerHTML = `<span>${heading.textContent}</span>`;

      const content = document.createElement("div");
      content.className = "collapsible-content";

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
        content.appendChild(current);
        current = next;
      }

      content.style.maxHeight = `${content.scrollHeight}px`;
      section.dataset.level = String(level);

      button.addEventListener("click", () => {
        const isOpen = section.classList.toggle("is-open");
        button.setAttribute("aria-expanded", String(isOpen));
        content.style.maxHeight = isOpen ? `${content.scrollHeight}px` : "0px";
      });
    });
  });
}

function setupQuestionAnswerMask() {
  const articleBody = document.querySelector(".article-body");
  if (!articleBody) {
    return;
  }

  const targets = Array.from(
    articleBody.querySelectorAll("h2, h3, h4, p, li")
  ).filter((node) => /\?|exercise|answer|solution|faq|question/i.test(node.textContent || ""));

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

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: "neutral"
  });
  mermaid.run({ nodes: mermaidBlocks });
}

function initSiteUi() {
  setupThemeSwitcher();
  setupScrollTopButton();
  buildHeadingCollapsibles();
  setupQuestionAnswerMask();
  setupRevealOnScroll();
  setupMermaid();
  document.querySelectorAll(".reveal-on-scroll").forEach((node) => node.classList.add("is-visible"));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSiteUi);
} else {
  initSiteUi();
}
