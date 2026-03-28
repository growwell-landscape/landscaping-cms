# Landscaping CMS

Landscaping CMS is a Next.js 15 project with:

- a public marketing website
- a protected `/admin` CMS for content editing
- a GitHub-backed publish flow for deployed environments

## Admin guide

For dashboard usage, editable sections, token renewal notes, and deployment-hook reference, check:

- `https://growwell-landscape.com/admin/info`

## Requirements

- Node.js `>= 24.13.1`
- pnpm `10.32.1`

Install pnpm if needed:

```bash
npm install -g pnpm@10.32.1
```

## How to run the application

1. Clone the repository.
2. Copy `.env.example` to `.env.local`.
3. Install dependencies:

```bash
pnpm install
```

4. Start the development server:

```bash
pnpm dev
```

5. Open:

- Site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

## Available scripts

- `pnpm dev`: run local development
- `pnpm build`: build production app
- `pnpm start`: start built app
- `pnpm lint`: run lint checks

## Authentication and environment variables

Main values from `.env.local`:

```env
ADMIN_PASSWORD=your_secure_password_here
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### Local development

Use this when running locally:

```env
NODE_ENV=development
ADMIN_PASSWORD=your_secure_password_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Behavior:

- admin APIs are protected by `ADMIN_PASSWORD`
- content reads and writes happen directly on local files
- no GitHub commit is created

### Deployed GitHub-backed publishing

Use these values in production-like environments:

```env
NODE_ENV=production
ADMIN_PASSWORD=your_secure_password_here
NEXT_PUBLIC_API_URL=https://yourdomain.com
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=your_github_username_or_org
GITHUB_REPO=your_repository_name
GITHUB_BRANCH=main
```

Behavior:

- admin APIs still require `ADMIN_PASSWORD`
- content is read from GitHub
- publish actions create real commits in the configured repository branch

## How authentication works

There are two main protection layers:

- `ADMIN_PASSWORD`: required by admin read/write APIs
- `GITHUB_TOKEN`: required only when the app needs to read or publish through GitHub in deployed mode

In short:

- without `ADMIN_PASSWORD`, admin actions fail
- without `GITHUB_TOKEN` in `production`, GitHub-backed content loading and publishing fail

## How content is managed

Editable content lives in:

- `src/data/content/admin.config.json`
- `src/data/content/services.json`
- `src/data/content/projects.json`
- `src/data/content/translations.json`

Media uploads live in:

- `public/uploads`

Allowed CMS file handling is controlled by:

- `src/lib/cms-utils.ts`

## How the GitHub APIs work

This is the most important part of the project.

In deployed mode, the CMS does not save content by editing the server filesystem. Instead, it talks to GitHub through the GitHub API.

Main flow:

1. The admin dashboard collects staged JSON changes, media uploads, and media deletions.
2. The batch publish API at `src/app/api/update-json-batch/route.ts` validates `ADMIN_PASSWORD`.
3. If `NODE_ENV=development`, it writes directly to local files.
4. If `NODE_ENV=production`, it creates a GitHub API client from `src/lib/github-api.ts`.
5. The app sends content updates to GitHub using `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, and `GITHUB_BRANCH`.
6. GitHub receives the updates and a commit is created in the configured branch.

## How `src/lib/github-api.ts` manages GitHub operations

`src/lib/github-api.ts` is the GitHub wrapper used by the CMS.

It handles:

- reading files from the repository
- creating or updating files
- deleting files
- batching multiple file operations into one publish commit
- resolving repository paths safely for reads and writes

For batch publish operations, the wrapper:

- creates blobs for changed files
- builds a new Git tree
- creates a commit
- moves the branch reference forward

That is why dashboard publish actions can update repository content without anyone running Git manually on the server.

## Local vs deployed behavior

### `NODE_ENV=development`

- reads from local JSON files
- writes changes to local JSON files and `public/uploads`
- best for development and testing

### `NODE_ENV=production`

- reads content from GitHub
- publishes content through GitHub API commits
- intended for deployed environments

If GitHub content loading fails in production, the app can fall back to bundled content depending on the loader path.

## Deployment notes

Important values must align:

- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`
- the Vercel project that is serving the site

If those do not match, publishing may succeed in GitHub but the live website may not show the expected content.

Webhook and deploy-hook setup may also exist for auto-builds, but for dashboard usage and editing instructions, use:

- `https://growwell-landscape.com/admin/info`

## Important source files

- `src/app/admin/page.tsx`: admin dashboard UI
- `src/hooks/useAdminCMS.ts`: main admin editing state
- `src/app/api/update-json-batch/route.ts`: batch publish endpoint
- `src/lib/github-api.ts`: GitHub API wrapper
- `src/lib/config-loader.ts`: content loading logic
- `src/data/content/*`: editable JSON content

## Quick troubleshooting

### `pnpm install` fails on Windows with `EPERM`

- stop the dev server
- close editors using this repo
- remove `node_modules`
- run `pnpm install` again

### Admin changes are not showing on the deployed site

Check:

- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`
- `GITHUB_TOKEN`
- Vercel project/environment variable setup

### Local admin save does not create a GitHub commit

That is expected in `NODE_ENV=development`.
