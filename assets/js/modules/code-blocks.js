import { createThemeDropdown } from "./theme-controls.js";

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

  return match[1].replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
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

export { setupCodeBlocks };
