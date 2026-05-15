function renderHomeHero(blogCount) {
  return `
    <section class="home-hero reveal-on-scroll">
      <div class="hero-content">
        <h1>Building with Purpose.</h1>
        <p>Exploring the boundaries of technology through ${blogCount} deep-dive articles and guided learning tracks.</p>
      </div>
    </section>
  `;
}

function renderArchiveHero(pageNumber) {
  return `<section class="archive-hero reveal-on-scroll"><h1>Archive - Page ${pageNumber}</h1></section>`;
}

module.exports = {
  renderHomeHero,
  renderArchiveHero
};
