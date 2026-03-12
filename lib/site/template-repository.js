const path = require("path");

class TemplateRepository {
  constructor({ templatesDir, readText, renderTemplate }) {
    this.templatesDir = templatesDir;
    this.readText = readText;
    this.renderTemplate = renderTemplate;
    this.cache = new Map();
  }

  get(name) {
    if (!this.cache.has(name)) {
      this.cache.set(name, this.readText(path.join(this.templatesDir, name)));
    }

    return this.cache.get(name);
  }

  render(name, data) {
    return this.renderTemplate(this.get(name), data);
  }
}

module.exports = { TemplateRepository };
