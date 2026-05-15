function renderTutorialTracks(posts, { textUtils }) {
  const tutorialPosts = posts.filter((post) => post.kind === "tutorial");
  const tracks = new Map();

  tutorialPosts.forEach((post) => {
    if (!tracks.has(post.collectionSlug)) {
      tracks.set(post.collectionSlug, {
        label: post.collectionLabel,
        modules: new Map()
      });
    }

    const collection = tracks.get(post.collectionSlug);
    if (!collection.modules.has(post.moduleSlug)) {
      collection.modules.set(post.moduleSlug, {
        label: post.moduleLabel,
        slug: post.moduleSlug,
        posts: []
      });
    }

    collection.modules.get(post.moduleSlug).posts.push(post);
  });

  return Array.from(tracks.values())
    .map((track) => {
      const modules = Array.from(track.modules.values())
        .map((module) => {
          const lessonList = module.posts
            .map((post) => `<li><a href="${post.url}">${textUtils.escapeHtml(post.title)}</a></li>`)
            .join("");

          const firstLesson = module.posts[0];
          const cta = firstLesson ? `<a class="text-link" href="${firstLesson.url}">Start → Lesson 1</a>` : "";

          const moduleId = `module-${module.slug}`;
          return `
          <section class="tutorial-module reveal-on-scroll">
            <header class="section-heading-split">
              <button 
                class="section-toggle-button" 
                type="button" 
                data-collapsible-trigger="${moduleId}"
                data-open-label="Hide lessons"
                data-close-label="Show lessons"
                aria-expanded="false"
              >
                <h3>${textUtils.escapeHtml(module.label)}</h3>
                <span class="section-toggle-icon" aria-hidden="true"></span>
              </button>
              ${cta}
            </header>
            <div class="section-collapse" data-collapsible-panel="${moduleId}">
              <div class="section-collapse-inner">
                <ul>${lessonList}</ul>
              </div>
            </div>
          </section>
        `;
        })
        .join("");

      return `
      <article class="tutorial-track reveal-on-scroll">
        <header class="track-header"><h2>${textUtils.escapeHtml(track.label)}</h2></header>
        <div class="track-body">${modules}</div>
      </article>
    `;
    })
    .join("");
}

module.exports = {
  renderTutorialTracks
};
