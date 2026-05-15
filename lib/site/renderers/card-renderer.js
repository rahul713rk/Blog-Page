function renderPostCard(post, { context, textUtils }) {
  const tags = post.tags
    .map((tag) => {
      const tagSlug = textUtils.slugify(tag);
      return `<a href="${context.tagHref(tagSlug)}" class="tag-link">#${textUtils.escapeHtml(tag)}</a>`;
    })
    .join(" ");

  const metaLine = textUtils.renderMetaLine([
    post.formattedDate,
    post.readingTime,
    `${post.collectionLabel}${post.moduleLabel ? ` / ${post.moduleLabel}` : ""}`
  ]);
  const secondaryLabel = post.kind === "tutorial" ? `Lesson ${post.filenameOrder}` : post.kindLabel;

  return `
    <article class="post-card ${post.kind}-card reveal-on-scroll">
      <header class="post-card-header">
        <div class="eyebrow-row">
          <span class="kind-pill">${textUtils.escapeHtml(post.kindLabel)}</span>
          <span class="filename-pill">${textUtils.escapeHtml(secondaryLabel)}</span>
        </div>
        <h2><a href="${post.url}">${textUtils.escapeHtml(post.title)}</a></h2>
        ${metaLine}
      </header>
      <p>${textUtils.escapeHtml(post.description)}</p>
      <footer class="post-card-footer">
        <p class="tag-row">${tags}</p>
        <a class="text-link" href="${post.url}">Open ${textUtils.escapeHtml(post.kindLabel.toLowerCase())}</a>
      </footer>
    </article>
  `;
}

function renderPostPager(post, { textUtils }) {
  const prev = post.previousPost
    ? `<a href="${post.previousPost.url}" class="pager-link prev"><span>&larr; Prev</span><strong>${textUtils.escapeHtml(
        post.previousPost.title
      )}</strong></a>`
    : "<div></div>";
  const next = post.nextPost
    ? `<a href="${post.nextPost.url}" class="pager-link next"><span>Next &rarr;</span><strong>${textUtils.escapeHtml(
        post.nextPost.title
      )}</strong></a>`
    : "<div></div>";

  return `<nav class="post-pager">${prev}${next}</nav>`;
}

module.exports = {
  renderPostCard,
  renderPostPager
};
