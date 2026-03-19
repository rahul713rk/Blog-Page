import { setupCodeBlocks } from "./modules/code-blocks.js";
import { setupContentUi } from "./modules/content-ui.js";
import { setupMermaid } from "./modules/mermaid.js";
import { setupThemeControls } from "./modules/theme-controls.js";

function initSiteUi() {
  setupContentUi();
  setupCodeBlocks();
  setupThemeControls();
  setupMermaid();
  document.querySelectorAll(".reveal-on-scroll").forEach((node) => node.classList.add("is-visible"));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSiteUi);
} else {
  initSiteUi();
}
