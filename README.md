# Meng Visal — Developer Portfolio

A static, single-page portfolio for a Flutter engineer moving into Applied AI engineering.
Built with **Vue 3 (Composition API, `<script setup>`) · TypeScript (strict) · Vite · Tailwind CSS v4**,
deployed to **GitHub Pages** with GitHub Actions. No backend, no router, no runtime dependencies beyond Vue and an icon set.

- Light and dark themes (system preference followed, choice persisted)
- Anchor navigation with scroll-spy, accessible mobile menu, skip link, reduced-motion support
- All content lives in `src/data/*.ts`, separate from components
- Honest by design: unconfirmed content is flagged, nothing is shown that has not been configured

## Quick start

Requires Node `^22.18` or `>=24.12` and npm.

```bash
npm install        # install dependencies
npm run dev        # start the dev server (http://localhost:5173)
```

| Command              | What it does                                                    |
| -------------------- | --------------------------------------------------------------- |
| `npm run dev`        | Vite dev server with hot reload                                 |
| `npm run typecheck`  | `vue-tsc` on the app (`tsconfig.json`) and on Vite config files |
| `npm run lint`       | ESLint (flat config, Vue + TypeScript)                          |
| `npm run format`     | Prettier (write) — `format:check` verifies without writing      |
| `npm test`           | Vitest + Vue Test Utils (jsdom) — `test:watch` for watch mode   |
| `npm run build`      | Type check, then production build into `dist/`                  |
| `npm run build:only` | Production build without the type check step                    |
| `npm run preview`    | Serve `dist/` locally                                           |
| `npm run check`      | Everything CI cares about: types, lint, format, tests, build    |

## Project structure

```text
.
├── .github/workflows/deploy.yml   Build + deploy to GitHub Pages
├── public/                        Copied as-is: favicon.svg, apple-touch-icon.png, images/, (resume.pdf)
├── scripts/social/                HTML sources for the generated social image and touch icon
├── vite/                          Build-time site plugin (SEO tags, robots, sitemap, 404) + tests
├── src/
│   ├── assets/styles/             tokens.css (design tokens), base.css, main.css (Tailwind entry)
│   ├── components/
│   │   ├── layout/                AppHeader, AppFooter, AppSection
│   │   ├── common/                ProjectCard, ProjectFilter, ExperienceCard, SkillGroupCard, ...
│   │   └── ui/                    BaseButton, TagChip, StatusBadge, AppIcon, brand icons
│   ├── composables/               useTheme, useScrollSpy, useClipboard, useMediaQuery
│   ├── data/                      profile, experience, skills, projects, journey, navigation, site
│   ├── directives/                v-reveal (scroll fade-in)
│   ├── sections/                  Hero, About, Experience, Skills, Projects, AiJourney, Contact
│   ├── types/                     Types for every data file
│   ├── utils/                     assetUrl (base-aware paths), contact links, motion helpers
│   ├── __tests__/                 Component, composable and content-integrity tests
│   ├── App.vue
│   └── main.ts
├── index.html
├── vite.config.ts                 Base path, plugins, Vitest config
├── tsconfig.json / tsconfig.node.json
└── eslint.config.js, .prettierrc.json, .editorconfig
```

Deviations from the suggested layout, and why:

- **Vue Router is not used.** There is one page; anchor links need no history-mode routing, so refreshes always work on GitHub Pages.
- **VueUse is not used.** The three composables needed are ~30 lines each, so the dependency would only add weight.
- **`@lucide/vue` instead of `lucide-vue-next`.** `lucide-vue-next` is marked deprecated on npm in favour of `@lucide/vue`. Lucide 1.x also removed brand icons, so the GitHub and LinkedIn marks are two small inline SVG components.
- **System font stack, no web fonts.** Zero font requests and no layout shift.
- Extra folders: `vite/` (build plugin), `directives/`, `scripts/social/`.

## Configure your information

Everything visitors see comes from `src/data/`. Edit these files — no component changes needed.

| File                     | Controls                                                                 |
| ------------------------ | ------------------------------------------------------------------------ |
| `src/data/profile.ts`    | Name, role, headline, intro, About copy, email, GitHub, LinkedIn, photo  |
| `src/data/experience.ts` | Timeline entries (company, role, period, responsibilities, impact)       |
| `src/data/skills.ts`     | Skill categories (the `learning: true` group is labelled as in progress) |
| `src/data/projects.ts`   | Project cards and categories                                             |
| `src/data/journey.ts`    | AI roadmap, experiments, milestones, repositories                        |
| `src/data/site.ts`       | Page title, description, social image, JSON-LD expertise                 |
| `src/data/navigation.ts` | Section order and navigation labels                                      |

### What still needs your input

The site never invents facts, so these are placeholders or switched off until you set them:

| Item                      | Current state                                                        | How to set it                                                                                                             |
| ------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Email**                 | Not published; mailto link and "Copy email" button are hidden        | Set `email` in `profile.ts`                                                                                               |
| **LinkedIn**              | Not published; link hidden                                           | Set `linkedin` in `profile.ts`                                                                                            |
| **GitHub**                | `https://github.com/vdev-cmd`                                          | Confirm or change `github` in `profile.ts`                                                                                |
| **Resume**                | "Download Resume" button hidden                                      | Put your PDF at `public/resume.pdf`, then restart/rebuild (the button appears automatically)                              |
| **Photo**                 | Initials monogram shown                                              | Add `public/images/profile.webp` and set `photo` in `profile.ts`                                                          |
| **Employment**            | `[Company name]`, `[Start date] – Present`, flagged "Sample content" | Edit `experience.ts`, verify each line, delete `placeholder: true`                                                        |
| **Achievements / impact** | Not shown (the blocks only render when provided)                     | Add `achievements` / `impact` with verified facts only                                                                    |
| **Projects**              | Five sample entries flagged "Sample content" / "Planned"             | Replace in `projects.ts`; add `repoUrl` / `demoUrl` for **public** work only; screenshots go in `public/images/projects/` |
| **AI repositories**       | Empty state shown                                                    | Add entries to `journey.repositories` once public                                                                         |

The copy in About and AI Journey is a draft written from the profile you supplied. Read it and adjust the wording so it sounds like you.

Never publish proprietary source code, confidential data, internal screenshots, credentials or private repository URLs.

### Changing the look

Colours, spacing-independent tokens and the font stacks are defined once in `src/assets/styles/tokens.css`
(`:root` for light, `:root[data-theme='dark']` for dark) and exposed to Tailwind as semantic utilities
(`bg-bg`, `bg-surface`, `text-muted`, `border-line`, `text-primary-ink`, ...).

A test (`src/__tests__/contrast.test.ts`) reads `tokens.css` and fails if text drops below 4.5:1 or control/focus
colours below 3:1 in either theme, so palette tweaks are checked automatically.

### Regenerating the social image and touch icon

`public/images/og-cover.png` (1200×630) and `public/apple-touch-icon.png` (180×180) are rendered from
`scripts/social/*.html`. After editing the HTML, regenerate with any Chromium-based browser, for example on macOS:

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,630 \
  --screenshot="$PWD/public/images/og-cover.png" "file://$PWD/scripts/social/og-cover.html"
"$CHROME" --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=180,180 \
  --screenshot="$PWD/public/apple-touch-icon.png" "file://$PWD/scripts/social/apple-touch-icon.html"
```

## SEO and metadata

`vite/sitePlugin.ts` injects SEO tags into `index.html` at build time from `src/data/site.ts` and `profile.ts`:
title, description, canonical URL, Open Graph, Twitter/X card and JSON-LD `Person` data. It also emits
`robots.txt`, `sitemap.xml` and a `404.html` that links back to the site root.

Everything that needs an absolute URL (canonical, `og:url`, `og:image`, sitemap, JSON-LD `url`) is driven by one variable,
`VITE_SITE_URL`. When it is unset those tags are **omitted** rather than filled with placeholder URLs.
JSON-LD `knowsAbout` lists professional topics only — not the AI topics still being learned.

## Deployment (GitHub Pages)

The workflow in `.github/workflows/deploy.yml` runs on every push to `main` (and manually via **Run workflow**):
install → lint → test → type check + build → upload → deploy. The build job has read-only permissions; only the deploy job
gets `pages: write` and `id-token: write`.

### One-time setup

1. Push the repository to GitHub (this repo's remote is `vnotudev/my-portfolio`).
2. In the repository go to **Settings → Pages**, and under **Build and deployment → Source** choose **GitHub Actions**.
3. Push to `main`. Watch the run under the **Actions** tab; the deploy job prints the live URL.
4. First deployment only: if the `github-pages` environment requires approval, approve it under the run's summary.

### Which URL and base path?

You do not configure the base path by hand. The workflow passes the URL reported by GitHub Pages as `VITE_SITE_URL`,
and `vite.config.ts` derives the Vite `base` from its path:

| Setup                                                  | `VITE_SITE_URL`                           | Vite `base`      |
| ------------------------------------------------------ | ----------------------------------------- | ---------------- |
| Project site (this repo, `my-portfolio`)               | `https://vnotudev.github.io/my-portfolio` | `/my-portfolio/` |
| User/organisation site (repo named `<user>.github.io`) | `https://<user>.github.io`                | `/`              |
| Custom domain (**Settings → Pages → Custom domain**)   | `https://your-domain.dev`                 | `/`              |

Renaming the repository needs no code change; the next deploy picks up the new path. To override the inferred base set `VITE_BASE`.

### Verify a build locally before pushing

```bash
VITE_SITE_URL=https://vnotudev.github.io/my-portfolio npm run build
VITE_SITE_URL=https://vnotudev.github.io/my-portfolio npm run preview
# open http://localhost:4173/my-portfolio/
```

Check that `dist/index.html` references `/my-portfolio/assets/...` and contains the canonical URL. Building without
`VITE_SITE_URL` produces a root-based build with no absolute-URL metadata.

### Troubleshooting

- **Blank page or 404 for `/assets/...`** — the `base` does not match the URL the site is served from. Check `VITE_SITE_URL` in the workflow logs.
- **Workflow cannot deploy** — Pages source must be set to _GitHub Actions_ (step 2).
- **Pages shows the old site** — a deploy is only triggered by pushes to `main` or a manual run; confirm the run succeeded.
- **Page refresh or deep links** — there are no server routes: navigation uses `#anchors`, so refresh always works. Unknown paths get the generated `404.html`.
- **Resume button missing in production** — `public/resume.pdf` must be committed (it is evaluated at build time).

## Testing and quality

`npm test` runs 160 tests (Vitest, Vue Test Utils, jsdom) covering:

- navigation links and targets, active-section tracking, mobile menu (open/close, Escape, outside click, focus return, resize, listener cleanup)
- theme switching, persistence, system-preference following and storage failures
- project rendering, category filtering and the card's links, images and error fallback
- resume button presence, contact links, `mailto:` and copy-email success and failure paths
- content integrity (unique ids, honest statuses, no unapproved contact details, no invented numbers)
- Vite-side helpers: base-path derivation, SEO tags, JSON-LD, robots, sitemap, 404 page
- design-token contrast ratios for both themes

Accessibility features: semantic landmarks and heading order, a skip link, visible focus styles, labelled icon buttons,
`aria-current` for the active section, `aria-expanded`/`aria-controls` on the menu, polite live regions for copy and filter
feedback, `prefers-reduced-motion` support, and external links with `rel="noopener noreferrer"` and a screen-reader hint.

### Measured results

Lighthouse 13.5.0 against `vite preview` of a production build (`localhost`, headless Chrome 153; mobile uses Lighthouse's
simulated throttling):

| Category / metric                | Mobile        | Desktop       |
| -------------------------------- | ------------- | ------------- |
| Performance                      | 100           | 100           |
| Accessibility                    | 100           | 100           |
| Best Practices                   | 100           | 100           |
| SEO                              | 100           | 100           |
| First / Largest Contentful Paint | 1.2 s / 1.2 s | 0.3 s / 0.3 s |
| Total Blocking Time              | 0 ms          | 0 ms          |
| Cumulative Layout Shift          | 0             | 0             |

Production bundle: ~125 kB JavaScript (45 kB gzip) and ~35 kB CSS (7 kB gzip).

These are one-off lab measurements from a local server, not a guarantee. Re-run them against the deployed URL
(Chrome DevTools → Lighthouse, or `npx lighthouse <url>`); real-network results will differ.

## Known limitations

- Responsive layout, interactions and scroll behaviour were verified in headless Chrome only. Safari, Firefox and real phones were not tested.
- Screen-reader behaviour was not tested with VoiceOver, NVDA or JAWS; accessibility was checked with Lighthouse/axe rules, contrast calculations and DOM assertions.
- The project filter is shown once there are at least four projects (`FILTER_MIN_PROJECTS`). With the five sample projects it shows one project per category, so its usefulness grows as you add real projects.
- `npm audit` reports a high-severity advisory in a development-only dependency chain (`braces`, via the ESLint config). Production dependencies report none.
- The social preview image is a static render; edit `scripts/social/og-cover.html` and regenerate it if the headline changes.
