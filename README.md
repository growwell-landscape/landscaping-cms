# Landscaping CMS

Landscaping CMS is a Next.js 15 application that combines:

- a public marketing website for a landscaping business
- a protected `/admin` CMS used to edit content, media, SEO, theme, and language settings
- a GitHub-backed publishing flow for deployed environments

Client-facing admin documentation:

- [ADMIN_DASHBOARD.md](C:/Users/dines/Documents/GitHub/landscaping-cms/ADMIN_DASHBOARD.md)

The project is designed to work in two modes:

- `development`: content is read from and written to local JSON/media files on disk
- `production`: content is read from GitHub and publish actions create real commits in the configured repository branch

## Tech stack

- Next.js `15.3.9`
- React `18`
- TypeScript
- Tailwind CSS
- pnpm `10.32.1`

## Required tools

Install these before working on the repo:

- Node.js `>= 24.13.1`
- pnpm `10.32.1`

Recommended install options for pnpm:

```bash
npm install -g pnpm@10.32.1
```

Or, if you prefer Corepack:

```bash
corepack enable
corepack prepare pnpm@10.32.1 --activate
```

Verify your setup:

```bash
node --version
pnpm --version
```

Expected result:

- Node should be `24.13.1` or newer
- pnpm should be `10.32.1`

## Quick start

1. Clone the repository.
2. Install Node.js `>= 24.13.1`.
3. Install pnpm `10.32.1`.
4. Copy `.env.example` to `.env.local`.
5. Set `NODE_ENV=development` in `.env.local` for normal local work.
6. Install dependencies with `pnpm install`.
7. Start the dev server with `pnpm dev`.
8. Open `http://localhost:3000`.
9. Open `http://localhost:3000/admin` to use the CMS.

## Local development setup

### 1. Install dependencies

```bash
pnpm install
```

If you are on Windows and `pnpm install` fails with an `EPERM` rename error inside `node_modules`, close any running dev server and the editor window using this repo, remove `node_modules`, and run `pnpm install` again.

### 2. Create your local environment file

Copy:

```bash
.env.example -> .env.local
```

Minimum local setup:

```env
ADMIN_PASSWORD=your_secure_password_here
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

In normal local development, GitHub credentials are not required because the app reads and writes content directly from the local filesystem.

### 3. Run the app

```bash
pnpm dev
```

Open:

- Site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

### 4. Optional checks

```bash
pnpm lint
pnpm build
pnpm start
```

## Available scripts

- `pnpm dev`: run the Next.js dev server
- `pnpm build`: build the app for production
- `pnpm start`: run the production server after build
- `pnpm lint`: run linting

## Environment variables

The full template lives in [`.env.example`](C:/Users/dines/Documents/GitHub/landscaping-cms/.env.example).

### Required for local development

- `ADMIN_PASSWORD`: password used to access protected admin APIs
- `NEXT_PUBLIC_API_URL`: usually `http://localhost:3000`
- `NODE_ENV=development`

### Required for deployed GitHub-backed publishing

- `GITHUB_TOKEN`: GitHub Personal Access Token with repo write access
- `GITHUB_OWNER`: repo owner or organization
- `GITHUB_REPO`: repo name
- `GITHUB_BRANCH`: branch the CMS should publish to, must be `dev` or `main`
- `DEPLOY_TARGET`: recommended Vercel runtime guard, set to `dev` on `landscaping-cms-dev` and `prod` on `landscaping-cms-prod`
- `ADMIN_PASSWORD`: required for admin access and writes

### Optional

- `NEXT_PUBLIC_SITE_URL`: used for canonical URLs, sitemap, robots, and social metadata
- `CONTENT_CACHE_TTL_SECONDS`: runtime cache TTL for production content reads
- `CORS_ORIGINS`: custom CORS allowlist

## How the app works

### Public site

The website uses the App Router and lives under [src/app](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app). The public-facing routes are mostly inside [src/app/(site)](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app/(site)).

Main responsibilities:

- layout and metadata: [src/app/(site)/layout.tsx](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app/(site)/layout.tsx)
- home page: [src/app/(site)/page.tsx](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app/(site)/page.tsx)
- services pages: [src/app/(site)/services](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app/(site)/services)
- contact page: [src/app/(site)/contact](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app/(site)/contact)
- sitemap and robots: [src/app/sitemap.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app/sitemap.ts), [src/app/robots.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app/robots.ts)

### Admin CMS

The admin UI lives under [src/app/admin](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app/admin) and the main CMS state is managed by [src/hooks/useAdminCMS.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/hooks/useAdminCMS.ts).

The admin area lets editors:

- update site configuration
- edit services and projects
- manage translations and enabled languages
- upload and remove media
- publish all staged changes together

### Data source

Content is stored in JSON files under [src/data/content](C:/Users/dines/Documents/GitHub/landscaping-cms/src/data/content):

- [src/data/content/admin.config.json](C:/Users/dines/Documents/GitHub/landscaping-cms/src/data/content/admin.config.json): branding, theme, SEO, contact info, languages
- [src/data/content/services.json](C:/Users/dines/Documents/GitHub/landscaping-cms/src/data/content/services.json): service catalog
- [src/data/content/projects.json](C:/Users/dines/Documents/GitHub/landscaping-cms/src/data/content/projects.json): portfolio/projects
- [src/data/content/translations.json](C:/Users/dines/Documents/GitHub/landscaping-cms/src/data/content/translations.json): translated UI/content strings

The allowed CMS file list is defined in [src/lib/cms-utils.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/lib/cms-utils.ts).

### Content loading

[src/lib/config-loader.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/lib/config-loader.ts) is the central content-loading layer.

It does three important things:

- in `development`, it reads JSON directly from local disk
- in `production`, it tries to read current content from GitHub
- if GitHub fetch fails in production, it falls back to bundled JSON

That means local development is simple, but the deployed app can stay in sync with CMS commits made through GitHub.

## Repo structure

High-value folders:

- [src/app](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app): routes, layouts, APIs
- [src/components/site](C:/Users/dines/Documents/GitHub/landscaping-cms/src/components/site): public site UI
- [src/components/admin](C:/Users/dines/Documents/GitHub/landscaping-cms/src/components/admin): admin UI
- [src/hooks](C:/Users/dines/Documents/GitHub/landscaping-cms/src/hooks): CMS state and helper hooks
- [src/lib](C:/Users/dines/Documents/GitHub/landscaping-cms/src/lib): loaders, GitHub API wrapper, SEO, i18n, theme helpers
- [src/types](C:/Users/dines/Documents/GitHub/landscaping-cms/src/types): shared TypeScript models
- [src/data/content](C:/Users/dines/Documents/GitHub/landscaping-cms/src/data/content): editable CMS data
- [public/uploads](C:/Users/dines/Documents/GitHub/landscaping-cms/public/uploads): uploaded media
- [.github/workflows](C:/Users/dines/Documents/GitHub/landscaping-cms/.github/workflows): deployment automation

Path aliases are configured in [tsconfig.json](C:/Users/dines/Documents/GitHub/landscaping-cms/tsconfig.json). Most app code imports through `@/...`.

## Step-by-step local workflow

### Standard developer workflow

1. Run `pnpm install`.
2. Create `.env.local`.
3. Set `NODE_ENV=development`.
4. Run `pnpm dev`.
5. Make content or code changes.
6. Test the public site at `/`.
7. Test admin behavior at `/admin`.
8. Run `pnpm lint`.
9. Run `pnpm build` before pushing larger changes.

### If you are editing content locally through the CMS

When `NODE_ENV=development`:

- JSON updates are written directly to files in [src/data/content](C:/Users/dines/Documents/GitHub/landscaping-cms/src/data/content)
- uploaded media is written into [public/uploads](C:/Users/dines/Documents/GitHub/landscaping-cms/public/uploads)
- no GitHub commit is created
- the API responds with placeholder commit info like `local-dev-batch`

This is ideal for building and testing without needing live GitHub credentials.

### If you want to test real GitHub commits locally

You can switch to production-like behavior locally by setting:

```env
NODE_ENV=production
GITHUB_TOKEN=...
GITHUB_OWNER=...
GITHUB_REPO=...
GITHUB_BRANCH=main
DEPLOY_TARGET=prod
ADMIN_PASSWORD=...
NEXT_PUBLIC_API_URL=http://localhost:3000
```

In that mode, publish actions use the GitHub API instead of local file writes.

## How CMS publishing and auto commits work

This is one of the most important parts of the repo.

### The key idea

Editors do not manually run `git add` or `git commit` from the admin UI. Instead, the app creates commits through the GitHub API when the CMS is running in production mode.

### Main publish endpoint

The batch publish flow is implemented in [src/app/api/update-json-batch/route.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app/api/update-json-batch/route.ts).

When an editor clicks the main publish action:

1. The admin UI collects all staged JSON updates.
2. It also collects media uploads and media deletions queued in the same session.
3. The server validates the admin password.
4. In `development`, files are written directly to disk.
5. In `production`, the server calls the GitHub wrapper in [src/lib/github-api.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/lib/github-api.ts).
6. The GitHub wrapper creates blobs, builds a new tree, creates a new commit, and moves the branch ref forward.

### Commit behavior

One publish action creates one batch commit for all staged changes.

Typical commit message format:

```text
CMS publish: X json, Y uploads, Z deletions
```

This means:

- one save can update multiple JSON files
- media uploads can be included in that same commit
- media deletions can be included in that same commit
- the public site can then read the latest content from GitHub

### Media upload behavior

[src/app/api/upload-image/route.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app/api/upload-image/route.ts) handles direct media uploads.

- in `development`, files are written to [public/uploads](C:/Users/dines/Documents/GitHub/landscaping-cms/public/uploads)
- in `production`, files are uploaded to GitHub with commit messages like `Upload media: filename.ext`

### Media delete behavior

[src/app/api/delete-image/route.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app/api/delete-image/route.ts) removes media files. In production, it also uses the GitHub API.

### Why this matters for teammates

If someone opens this repo and wonders, "Why did content change in GitHub without anyone committing locally?" the answer is:

- the CMS can create commits remotely through GitHub API calls
- those commits are driven by admin publish actions
- the deployed site is intentionally wired to consume that GitHub-backed content

## Deployment and redeploy flow

Deployment behavior is intentionally controlled.

### Vercel config

[vercel.json](C:/Users/dines/Documents/GitHub/landscaping-cms/vercel.json) sets:

```json
{
  "git": {
    "deploymentEnabled": {
      "*": false,
      "main": true,
      "dev": true
    }
  }
}
```

So Vercel Git auto-deploy is disabled for every branch except `main` and `dev`.

### Strict two-project mapping

Use exactly two Vercel projects:

- `landscaping-cms-dev`
  Set `GITHUB_BRANCH=dev`
  Set `DEPLOY_TARGET=dev`
  Configure the Ignored Build Step as `pnpm vercel:ignored-build dev`
- `landscaping-cms-prod`
  Set `GITHUB_BRANCH=main`
  Set `DEPLOY_TARGET=prod`
  Configure the Ignored Build Step as `pnpm vercel:ignored-build main`

### GitHub Actions redeploy flow

[.github/workflows/vercel-dev-redeploy.yml](C:/Users/dines/Documents/GitHub/landscaping-cms/.github/workflows/vercel-dev-redeploy.yml) triggers the dev hook only for `dev`.

[.github/workflows/vercel-prod-redeploy.yml](C:/Users/dines/Documents/GitHub/landscaping-cms/.github/workflows/vercel-prod-redeploy.yml) triggers the prod hook only for `main`.

[.github/workflows/vercel-branch-redeploy.yml](C:/Users/dines/Documents/GitHub/landscaping-cms/.github/workflows/vercel-branch-redeploy.yml) supports manual redeploys with branch validation.

The automated workflows enforce:

- push to `main` -> production redeploy
- push to `dev` -> development redeploy
- no other branches trigger deployment hooks
- hook failures surface the returned HTTP status
- logs include repo, branch, and environment context without printing secrets

The push workflows skip media-only commits whose messages start with:

- `Upload media:`
- `Delete image:`
- `Delete unused media:`

That helps avoid unnecessary redeploys for media-only operations.

### Required GitHub secrets for deploy hooks

Add these repository secrets:

- `VERCEL_PROD_DEPLOY_HOOK_URL`
- `VERCEL_DEV_DEPLOY_HOOK_URL`

### Required Vercel project environment variables

In `landscaping-cms-dev`:

- `NODE_ENV=production`
- `GITHUB_OWNER=<your owner or org>`
- `GITHUB_REPO=<your repo>`
- `GITHUB_BRANCH=dev`
- `DEPLOY_TARGET=dev`
- `ADMIN_PASSWORD=<dev admin password>`
- `GITHUB_TOKEN=<token with repo access>`

In `landscaping-cms-prod`:

- `NODE_ENV=production`
- `GITHUB_OWNER=<your owner or org>`
- `GITHUB_REPO=<your repo>`
- `GITHUB_BRANCH=main`
- `DEPLOY_TARGET=prod`
- `ADMIN_PASSWORD=<prod admin password>`
- `GITHUB_TOKEN=<token with repo access>`

### Important branch alignment rule

These must point to the same repo/branch strategy:

- Vercel project
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`
- `DEPLOY_TARGET`

If they do not line up, the CMS may publish successfully but the deployed site may not show the expected content.

## Admin security model

Admin write endpoints validate `ADMIN_PASSWORD`.

Important API routes:

- [src/app/api/get-json/route.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app/api/get-json/route.ts)
- [src/app/api/update-json/route.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app/api/update-json/route.ts)
- [src/app/api/update-json-batch/route.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app/api/update-json-batch/route.ts)
- [src/app/api/upload-image/route.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app/api/upload-image/route.ts)
- [src/app/api/delete-image/route.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app/api/delete-image/route.ts)

The admin UI does not replace backend protection. The password is still checked server-side before writes happen.

For deployed environments, password comparison now uses a timing-safe server-side check and GitHub failures are mapped to clearer HTTP responses:

- `401`: invalid or expired GitHub authentication
- `403`: forbidden or rate-limited
- `404`: repo, branch, or file not found
- `409`: branch update conflict

## Localization and translation

The site supports multiple languages. Language configuration is normalized in [src/lib/config-loader.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/lib/config-loader.ts) and site language behavior lives in [src/lib/site-i18n.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/lib/site-i18n.ts).

Translation content is stored in [src/data/content/translations.json](C:/Users/dines/Documents/GitHub/landscaping-cms/src/data/content/translations.json).

There is also a translation helper API at [src/app/api/translate/route.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app/api/translate/route.ts), which uses Google Translate for batch translation support in the CMS.

## Common troubleshooting

### `pnpm install` fails on Windows with `EPERM`

Usually caused by file locks in `node_modules`.

Try:

1. stop the dev server
2. close the editor window using the repo
3. remove `node_modules`
4. run `pnpm install` again

### Admin changes are not showing on the deployed site

Check:

1. `GITHUB_OWNER`, `GITHUB_REPO`, and `GITHUB_BRANCH`
2. Vercel project branch alignment
3. `DEPLOY_TARGET` matches the Vercel project
4. the latest GitHub commit exists on the same branch
5. `CONTENT_CACHE_TTL_SECONDS` is not masking a recent change temporarily

## Deployment checklist

Before going live, verify all of the following:

1. `dev` is connected only to `landscaping-cms-dev`.
2. `main` is connected only to `landscaping-cms-prod`.
3. No other branches are enabled in [vercel.json](C:/Users/dines/Documents/GitHub/landscaping-cms/vercel.json).
4. `landscaping-cms-dev` uses Ignored Build Step `pnpm vercel:ignored-build dev`.
5. `landscaping-cms-prod` uses Ignored Build Step `pnpm vercel:ignored-build main`.
6. Dev and prod Vercel projects have different `ADMIN_PASSWORD` values.
7. Dev and prod Vercel projects each set the correct `GITHUB_BRANCH` and `DEPLOY_TARGET`.
8. GitHub repository secrets include both deploy hook URLs.
9. A push to `dev` triggers only [.github/workflows/vercel-dev-redeploy.yml](C:/Users/dines/Documents/GitHub/landscaping-cms/.github/workflows/vercel-dev-redeploy.yml).
10. A push to `main` triggers only [.github/workflows/vercel-prod-redeploy.yml](C:/Users/dines/Documents/GitHub/landscaping-cms/.github/workflows/vercel-prod-redeploy.yml).
11. A CMS publish from the dev site writes to `dev`, and a CMS publish from the prod site writes to `main`.
12. Manual redeploys are run through [.github/workflows/vercel-branch-redeploy.yml](C:/Users/dines/Documents/GitHub/landscaping-cms/.github/workflows/vercel-branch-redeploy.yml) from the matching branch only.

### Local CMS save does not create a GitHub commit

That is expected when `NODE_ENV=development`. Local development writes to disk only.

## Suggested onboarding checklist for a new teammate

1. Read this README once end to end.
2. Open [package.json](C:/Users/dines/Documents/GitHub/landscaping-cms/package.json) and confirm Node/pnpm versions.
3. Open [src/lib/config-loader.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/lib/config-loader.ts) to understand local vs production content loading.
4. Open [src/app/api/update-json-batch/route.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/app/api/update-json-batch/route.ts) to understand publish behavior.
5. Open [src/lib/github-api.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/lib/github-api.ts) to understand remote commit creation.
6. Open [src/hooks/useAdminCMS.ts](C:/Users/dines/Documents/GitHub/landscaping-cms/src/hooks/useAdminCMS.ts) to understand the admin editing workflow.
7. Run the app locally and publish a test content change in `development` mode.

## Notes

- App code primarily lives under `src/`.
- Content is intentionally stored in versioned JSON files so it can be reviewed in Git.
- The CMS is not only an editor UI; it is also part of the repository publishing workflow.

If you keep those three ideas in mind, the rest of the repo becomes much easier to navigate.
