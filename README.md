# 📚 Technical Learning Blog Engine

A modern, high-performance static site generator (SSG) tailered for technical writing. This engine converts Markdown content into a sleek, responsive, and SEO-optimized blog, featuring deep Mermaid diagram integration and a comprehensive search system.

## 🚀 Key Features

- **Standardized Content**: Strict compliance with [content standards](standards/content-rules.md) for consistent formatting across all posts and guides.
- **Advanced Markdown**: Enhanced with `markdown-it`, including support for footnotes, anchors, and GitHub-flavored markdown.
- **Mermaid Diagrams**: Native support for complex architecture diagrams, flowcharts, and mindmaps directly within Markdown.
- **Technical Guides**: Specialized rendering for structured learning tracks and tutorial series.
- **Blazing Fast Search**: Client-side full-text search powered by Lunr.js.
- **Multi-Theme Support**: Dark and light modes with specialized themes like Abyss and GitHub Dark.
- **SEO Ready**: Automatically generated JSON-LD, OpenGraph tags, and sitemaps.

## 🛠️ Project Structure

```text
.
├── assets/             # Global CSS, JS, and SVG icons
├── content/            # Markdown content source
│   ├── posts/          # Independent technical articles
│   └── <collection>/   # Structured learning guides
├── lib/                # SSG core logic and renderers
├── templates/          # HTML templates (Layout, Post, Index)
├── standards/          # Style guides and blueprints
├── config.json         # Global site configuration
└── build.js            # SSG entry point
```

## 🏁 Getting Started

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- npm

### Installation

```bash
npm install
```

### Development & Build

To generate the static site into the `public/` directory:

```bash
npm run build
```

The generated files can then be served using any static web server or deployed directly to GitHub Pages.

## 📖 Content Creation

New articles should be placed in `content/posts/` and follow the `post-blueprint.md` standard.

**Example Frontmatter:**

```md
---
title: "Article Title"
description: "Concise summary for SEO"
date: 2026-05-15
author: "Rahul Kumar"
tags: [DSA, Algorithms]
category: "Computer Science"
slug: "article-slug"
---
```

## 🌍 Deployment

This project is configured for automated deployment via GitHub Actions. Simply push to the `main` branch to trigger the production build and deployment to GitHub Pages.

---
*Maintained by [Rahul Kumar](https://github.com/rahul713rk)*
