async function setupSearch() {
  const input = document.querySelector("#search-input");
  const results = document.querySelector("#search-results");
  const sitePath = document.body?.dataset.sitePath || "";

  if (!input || !results || typeof lunr === "undefined") {
    return;
  }

  const response = await fetch(`${sitePath}/search-index.json`);
  const payload = await response.json();
  const index = lunr.Index.load(payload.index);
  const documents = new Map(payload.documents.map((doc) => [doc.id, doc]));

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
                <h3><a href="${doc.url}">${doc.title}</a></h3>
                <p>${doc.description}</p>
              </article>
            `;
          })
          .join("")
      : "<p>No results found.</p>";
  });
}

setupSearch();
