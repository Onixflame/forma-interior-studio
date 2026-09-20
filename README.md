# FORMA Interior Studio

FORMA is a fictional interior design and renovation studio. This repository contains a finished portfolio demonstration with three languages (EN/CS/RU), light/dark/system themes, projects, services, editorial content, a USD estimate calculator, a locally saved project selection, and an honest demo contact form that does not submit data.

## Quick Start

Node.js 24 and npm 11 are recommended because the project was originally built with these versions.

```bash
npm ci
npm run dev
```

Open `http://127.0.0.1:3000/en/` after the development server starts. The Russian version is available at `/ru/` and the Czech version at `/cs/`.

If `node_modules` was copied from another computer or operating system, remove it and run `npm ci` again. Native Next.js and Sharp packages are platform-dependent.

## Validation

Run the basic checks with:

```bash
npm run typecheck
npm run lint
npm test
```

Build and preview the static export with:

```bash
npm run build
npm run preview
```

`npm run preview` serves only the generated `out/` directory at `http://localhost:3000/en/`, which makes it useful for checking the exported version of the site.

After `npm run build`, run the end-to-end tests with:

```bash
npm run test:e2e
```

Playwright starts `npm run preview` automatically. On Windows, the default browser path is `C:/Program Files/Google/Chrome/Application/chrome.exe`. Set `CHROME_PATH` if Chrome is installed elsewhere.

## Site Modes

`.env.example` contains:

```env
SITE_MODE=demo
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SITE_MODE=demo` enables the interactive demonstration form, but the form does not submit anything. Names, email addresses, phone numbers, messages, and free-form notes are not stored in `localStorage` or sent to a server.

`SITE_MODE=production` intentionally blocks lead intake until a real backend, validation, spam protection, storage, notifications, and data-processing policy are in place. This portfolio project does not include a CRM, database, or email delivery service.

`NEXT_PUBLIC_SITE_URL` is used for canonical URLs, Open Graph metadata, the sitemap, and robots directives. Replace it with the real HTTPS domain before publishing. The demo currently uses `noindex,follow`.

## Content Structure

The main content is kept separate from the UI:

- `src/lib/content.ts` contains projects, services, process steps, and FAQs.
- `src/lib/articles.ts` contains the three editorial articles.
- `src/lib/i18n.ts` contains shared EN/CS/RU interface strings.
- `src/lib/pricing.ts` contains the demonstration estimate formula.
- `src/lib/routes.ts` contains the static routes.
- `manifest.json` documents source images, dimensions, alt text, and intended use.

To add a project, create an entry in `projects` in `src/lib/content.ts`, add its images to `public/images/projects/<folder>/`, and register them in `manifest.json`. The project routes are included in static generation automatically through `src/lib/routes.ts`.

To add an article, create an entry in `src/lib/articles.ts` with a unique `slug`, localized title/excerpt/sections, and an existing image.

This version has no web editor or CMS. Content is edited in typed local files.

## Estimate Formula

The current demonstration rates are defined in `src/lib/pricing.ts`:

- Essential: 600-800 USD/m²
- Complete: 900-1200 USD/m²
- Signature: 1400-1800 USD/m²

Property-condition and property-type multipliers are applied, then the result is rounded to the nearest 100 USD. The example `70 m² / apartment / shell / Complete` produces `63,000-84,000 USD`.

This is not a commercial offer or a real quotation.

## Images

`public/images/projects` contains eight source PNG files at 1536x1024 and generated WebP variants at 480/768/1024/1536 widths. The `scripts/images.mjs` script reuses existing WebP files and does not require Sharp during a normal run.

If a source PNG changes and the derived files need to be regenerated:

```bash
REBUILD_IMAGES=1 npm run build
```

In Windows PowerShell:

```powershell
$env:REBUILD_IMAGES="1"; npm run build
```

Image provenance and limitations are documented in `ASSETS.md`.

## Browser Storage

`localStorage` is used only for the theme, saved project IDs, calculator parameters, and the saved estimate. Contact details, form messages, and free-form notes are never stored there.

The "Clear my project" action removes the saved selection and estimate. If `localStorage` is unavailable, the site continues to work in memory for the current session.

## Important Limitations

- FORMA is a fictional company; projects and prices are for demonstration only.
- The form does not submit leads or create bookings.
- The images are AI-generated concepts, not photographs of completed projects.
- The interface targets WCAG 2.2 AA, but this is not a certified compliance statement.
- The Russian and Czech copy has been manually edited, but the translations are not presented as professional native-speaker proofreading.
- A real commercial launch would require a backend, privacy and legal review, security headers/CSP, monitoring, backups, and verification of all real content and pricing.
