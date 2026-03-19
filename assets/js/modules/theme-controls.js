import { setupMermaid } from "./mermaid.js";
import { THEME_GROUPS, THEME_LABELS, renderThemeIcon } from "./theme-config.js";

let themeDropdownCloseHandlerAttached = false;

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

export { createThemeDropdown, setupThemeControls };
