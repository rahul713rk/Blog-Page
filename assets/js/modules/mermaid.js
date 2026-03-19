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

function setupMermaid() {
  const mermaidHosts = Array.from(document.querySelectorAll(".mermaid-host"));
  if (!mermaidHosts.length || !ensureMermaidReady()) {
    return;
  }

  const computedStyles = getComputedStyle(document.documentElement);
  const diagramFontFamily = computedStyles.getPropertyValue("--diagram-font-family").trim();
  const mermaidText = computedStyles.getPropertyValue("--mermaid-text").trim() || "#f0f6fc";
  const mermaidContrast = computedStyles.getPropertyValue("--mermaid-contrast").trim() || "#0d1117";
  const mermaidBackground = computedStyles.getPropertyValue("--mermaid-bg").trim() || "#0d1117";
  const mermaidSurface = computedStyles.getPropertyValue("--mermaid-surface").trim() || "#161b22";
  const mermaidLine = computedStyles.getPropertyValue("--mermaid-line").trim() || "#30363d";
  const mermaidNode = computedStyles.getPropertyValue("--mermaid-node").trim() || "#58a6ff";
  const mermaidNodeAlt = computedStyles.getPropertyValue("--mermaid-node-alt").trim() || "#238636";

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
      const pageTheme = document.documentElement.dataset.theme || "github-dark";
      const diagramTheme = document.documentElement.dataset.diagramTheme || "github-dark";
      const renderId = `mermaid-diagram-${index}-${pageTheme}-${diagramTheme}`;
      const { svg } = await mermaid.render(renderId, source);
      host.innerHTML = svg;
    } catch (error) {
      host.innerHTML = `<pre>${String(error.message || error)}</pre>`;
    }
  });
}

export { setupMermaid };
