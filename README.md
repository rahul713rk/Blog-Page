# Minimal GitHub Pages SSG

A minimal static site generator that converts Markdown posts into a GitHub Pages-ready blog.

## Structure

```text
project/
├── .github/workflows/build.yml
├── assets/
│   ├── css/site.css
│   └── js/search.js
├── build.js
├── config.json
├── content/
│   └── posts/hello-world.md
├── package.json
├── public/
├── templates/
│   ├── index.html
│   ├── layout.html
│   ├── post.html
│   └── tag.html
└── README.md
```

## Features

- Markdown parsing with `markdown-it`
- Frontmatter with `gray-matter`
- Prism.js syntax highlighting
- PicoCSS via CDN
- Blog index page
- Tags
- Pagination
- `sitemap.xml`
- Lunr search index generation
- GitHub Actions deployment to GitHub Pages

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

Generated files are written to `public/`.

## Content format

Create Markdown files anywhere under `content/`. Metadata goes in YAML frontmatter at the top of the file.

```md
---
title: "System Design Foundations"
description: "best SEO description"
date: 2026-03-10
author: Rahul Kumar
tags: [system design]
category: system design
cover: ""
readingTime: ""
draft: false
slug: system-design-1
---

# Your content
```

Supported fields:

- `title`
- `description`
- `date`
- `author`
- `tags`
- `category`
- `cover`
- `readingTime`
- `draft`
- `slug`

## Config

Edit `config.json`:

```json
{
  "siteName": "Minimal Blog",
  "siteDescription": "A minimal static blog generated from Markdown.",
  "baseUrl": "https://rahul713rk.github.io/Blog-Page",
  "postsPerPage": 5
}
```

## Output

Running the build creates:

- `public/index.html`
- `public/posts/<slug>/index.html`
- `public/tags/<tag>/index.html`
- `public/page/<n>/index.html`
- `public/search-index.json`
- `public/sitemap.xml`

## GitHub Pages

1. Push the project to GitHub.
2. In repository settings, enable GitHub Pages and set source to GitHub Actions.
3. Set `baseUrl` in `config.json` to `https://rahul713rk.github.io/Blog-Page`.
4. Push to `main` to trigger deployment.

## Extend later

- Add more templates
- Add RSS generation
- Add drafts or series support
- Add custom collections under `content/`
