# Content Rules & Style Guide

This document defines the standards for all articles and guides in this blog.

## Directory Structure

- **Blog Posts**: Must be placed in `content/posts/`.
- **Guides**: Must be placed in `content/<collection-name>/<module-name>/`.
    - Example: `content/system-design/01-networking/`

## File Naming

- Use `kebab-case` for all filenames (e.g., `the-benefits-of-rust.md`).
- **Guides ONLY**: Prefix filenames with a two-digit number to control ordering (e.g., `01-introduction.md`, `02-core-concepts.md`).

## Frontmatter Requirements

Every Markdown file must start with YAML frontmatter.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | String | Yes | The title of the post. |
| `date` | YYYY-MM-DD | Yes | Publication date. |
| `tags` | Array | Yes | List of tags (e.g., `[linux, bash]`). |
| `category` | String | Yes | Main category for the post. |
| `description`| String | No | SEO/Snippet text. Auto-generated from content if missing. |
| `author` | String | No | Defaults to site owner if omitted. |
| `cover` | Path | No | Path to cover image (e.g., `/assets/img/posts/hero.jpg`). |
| `readingTime`| String | No | Auto-calculated if omitted. |
| `draft` | Boolean | No | Set to `true` to hide from build. |
| `slug` | String | No | URL path component. Defaults to filename. |

## Markdown Features

### Headers
- **H1 (`#`)**: Do NOT use `#` in your content if it is identical to the `title` in frontmatter. The system automatically adds the title H1 and will strip a duplicate H1 from the body.
- **Hierarchy**: Use `##`, `###`, etc., logically. Heading IDs are auto-generated based on text.

### Code Blocks
- Always specify a language for syntax highlighting (e.g., ` ```javascript `).
- Supported languages include: `javascript`, `typescript`, `python`, `bash`, `go`, `rust`, `docker`, `sql`, etc.

### Diagrams
- Use Mermaid for diagrams.
- Example:
  ```mermaid
  graph TD;
      A-->B;
      A-->C;
  ```

### Links & Images
- **External Links**: Open in a new tab automatically.
- **Images**: Use standard markdown `![alt](url)`. Images are automatically lazy-loaded.

### Admonitions (Callouts)
- Use bold text or blockquotes for important notes, as no specific plugin is currently installed for custom callouts.
