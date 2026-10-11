# Diadem & Co. website

React 19 + TypeScript + Vite + Tailwind CSS v4. Every page is pre-rendered to static HTML at build time.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/ (static files, ready to upload)
npm run preview  # serve the production build locally
```

## Editing content

All copy lives in `src/content/` — no page code needs to change.

| What                         | Where                                      |
| ---------------------------- | ------------------------------------------ |
| Contact details, menu links  | `src/content/site.ts`                      |
| Home page sections           | `src/content/home.ts`                      |
| About page                   | `src/content/about.ts`                     |
| Services (+ their FAQs)      | `src/content/services.ts`                  |
| General FAQs                 | `src/content/faq.ts`                       |
| Contact page and form fields | `src/content/contact.ts`                   |
| Blog posts                   | `src/content/blog/*.md`                    |
| Privacy policy, terms        | `src/content/legal/*.md`                   |
| Images                       | `src/assets/images/` (WebP, ≤1400 px wide) |

**Add a blog post:** create `src/content/blog/<url-slug>.md`. It appears at `/<url-slug>/`, on the blog page, its category page, the home page and the sitemap automatically.

```md
---
title: 'Post title'
date: 2026-10-10
excerpt: 'One or two sentences shown on cards and in search results.'
categories: ['Insurance & Risk Management']
image: my-image.webp # file in src/assets/images/blog/
---

Post body in Markdown…
```

**Add a service:** add an entry to `services` in `src/content/services.ts`. It gets a page at `/service/<slug>/`; set `featured: true` to list it on the home page, services page, footer and contact form.

## Contact form

Set `VITE_CONTACT_ENDPOINT` (see `.env.example`) to any service that accepts a JSON POST, such as Formspree. Without it, the form opens the visitor's email app instead.

## Deploying

- **Vercel / Netlify:** connect the GitHub repo; build command `npm run build`, output `dist`.
- **Apache (current host):** upload the contents of `dist/`. The included `.htaccess` handles 404s, HTTPS and caching.
