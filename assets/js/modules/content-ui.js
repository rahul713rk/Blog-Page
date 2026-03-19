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

function setupContentUi() {
  setupSectionCollapses();
  setupContentToggle();
  setupPaginationSelects();
  setupScrollTopButton();
  buildHeadingCollapsibles();
  setupQuestionAnswerMask();
  setupRevealOnScroll();
}

export { setupContentUi, setupRevealOnScroll };
