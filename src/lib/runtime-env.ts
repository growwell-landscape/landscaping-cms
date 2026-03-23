import { timingSafeEqual } from "crypto";

const ALLOWED_GITHUB_BRANCHES = new Set(["dev", "main"]);

export interface GitHubRuntimeConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

function normalizeOptionalValue(value: string | undefined): string {
  return value?.trim() || "";
}

function compareSecrets(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}

export function validateAdminPassword(password: string): boolean {
  const adminPassword = normalizeOptionalValue(process.env.ADMIN_PASSWORD);
  if (!adminPassword) {
    console.error("[admin-auth] ADMIN_PASSWORD is not configured");
    return false;
  }

  return compareSecrets(password, adminPassword);
}

export function getGitHubRuntimeConfig(): GitHubRuntimeConfig {
  const token = normalizeOptionalValue(process.env.GITHUB_TOKEN);
  const owner = normalizeOptionalValue(process.env.GITHUB_OWNER);
  const repo = normalizeOptionalValue(process.env.GITHUB_REPO);
  const branch = normalizeOptionalValue(process.env.GITHUB_BRANCH) || "main";
  const deploymentTarget = normalizeOptionalValue(process.env.DEPLOY_TARGET);
  const vercelCommitRef = normalizeOptionalValue(process.env.VERCEL_GIT_COMMIT_REF);

  if (!token || !owner || !repo) {
    throw new Error(
      "Missing required GitHub environment variables: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO"
    );
  }

  if (!ALLOWED_GITHUB_BRANCHES.has(branch)) {
    throw new Error(
      `Unsupported GITHUB_BRANCH '${branch}'. Allowed values: dev, main`
    );
  }

  if (deploymentTarget === "dev" && branch !== "dev") {
    throw new Error("DEPLOY_TARGET=dev requires GITHUB_BRANCH=dev");
  }

  if (deploymentTarget === "prod" && branch !== "main") {
    throw new Error("DEPLOY_TARGET=prod requires GITHUB_BRANCH=main");
  }

  if (vercelCommitRef && vercelCommitRef !== branch) {
    throw new Error(
      `Runtime branch mismatch: VERCEL_GIT_COMMIT_REF='${vercelCommitRef}' does not match GITHUB_BRANCH='${branch}'`
    );
  }

  return { token, owner, repo, branch };
}

export function canUseGitHubContentSource(): boolean {
  return Boolean(
    normalizeOptionalValue(process.env.GITHUB_TOKEN) &&
      normalizeOptionalValue(process.env.GITHUB_OWNER) &&
      normalizeOptionalValue(process.env.GITHUB_REPO)
  );
}

