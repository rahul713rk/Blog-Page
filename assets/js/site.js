import { setupCodeBlocks } from "./modules/code-blocks.js";
import { setupContentUi } from "./modules/content-ui.js";
import { setupMermaid } from "./modules/mermaid.js";
import { setupThemeControls } from "./modules/theme-controls.js";

function initSiteUi() {
  setupContentUi();
  setupCodeBlocks();
  setupThemeControls();
  setupMermaid();

}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSiteUi);
} else {
  initSiteUi();
}
