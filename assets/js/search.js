function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function setupSearch() {
  const input = document.querySelector("#search-input");
  const results = document.querySelector("#search-results");
  const sitePath = document.body?.dataset.sitePath || "";

  if (!input || !results || typeof lunr === "undefined") {
    return;
  }

  let index, documents;
  try {
    const response = await fetch(`${sitePath}/search-index.json`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const payload = await response.json();
    index = lunr.Index.load(payload.index);
    documents = new Map(payload.documents.map((doc) => [doc.id, doc]));
  } catch (err) {
    console.error("Search index failed to load:", err);
    results.innerHTML = "<p>Search is unavailable right now.</p>";
    return;
  }

  input.addEventListener("input", () => {
    const query = input.value.trim();
    if (!query) {
      results.innerHTML = "";
      return;
    }

    const matches = index.search(`${query}* ${query}`);
    results.innerHTML = matches.length
      ? matches
          .map((match) => {
            const doc = documents.get(match.ref);
            return `
              <article>
                <h3><a href="${escapeHtml(doc.url)}">${escapeHtml(doc.title)}</a></h3>
                <p>${escapeHtml(doc.description)}</p>
              </article>
            `;
          })
          .join("")
      : "<p>No results found.</p>";
  });
}

setupSearch();
