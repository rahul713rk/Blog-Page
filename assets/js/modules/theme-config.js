const CLASSIC_THEME_NAMES = ["github-dark", "abyss", "light-modern", "light-plus"];

const THEME_LABELS = {
  "github-dark": "GitHub Dark",
  abyss: "Abyss",
  "light-modern": "Light Modern",
  "light-plus": "Light+"
};

const THEME_ICON_FILES = {
  "github-dark": "theme-github-dark.svg",
  abyss: "theme-abyss.svg",
  "light-modern": "theme-light-modern.svg",
  "light-plus": "theme-light-plus.svg"
};

const THEME_GROUPS = {
  page: {
    datasetKey: "theme",
    storageKey: "blog-theme",
    defaultTheme: "github-dark",
    supportedThemes: CLASSIC_THEME_NAMES,
    triggerLabel: "Site theme switcher"
  },
  code: {
    datasetKey: "codeTheme",
    storageKey: "blog-code-theme",
    defaultTheme: "github-dark",
    supportedThemes: CLASSIC_THEME_NAMES,
    triggerLabel: "Code theme switcher"
  },
  diagram: {
    datasetKey: "diagramTheme",
    storageKey: "blog-diagram-theme",
    defaultTheme: "github-dark",
    supportedThemes: CLASSIC_THEME_NAMES,
    triggerLabel: "Diagram theme switcher"
  }
};

function getSitePath() {
  return document.body?.dataset.sitePath || "";
}

function getThemeIconSrc(themeName) {
  const iconFile = THEME_ICON_FILES[themeName] || THEME_ICON_FILES["github-dark"];
  return `${getSitePath()}/assets/icons/${iconFile}`;
}

const THEME_ABBREVIATIONS = {
  "github-dark": "GD",
  abyss: "AB",
  "light-modern": "LM",
  "light-plus": "LP"
};

function renderThemeIcon(themeName) {
  return `<span class="theme-text-icon">${THEME_ABBREVIATIONS[themeName] || "TH"}</span>`;
}

export { CLASSIC_THEME_NAMES, THEME_GROUPS, THEME_LABELS, getThemeIconSrc, renderThemeIcon };
