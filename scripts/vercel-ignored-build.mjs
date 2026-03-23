const expectedBranchArg = process.argv[2]?.trim();
const expectedBranch = expectedBranchArg || process.env.VERCEL_EXPECTED_BRANCH?.trim();
const currentBranch =
  process.env.VERCEL_GIT_COMMIT_REF?.trim() ||
  process.env.GITHUB_BRANCH?.trim() ||
  "";

if (!expectedBranch) {
  console.error(
    "[vercel-ignored-build] Missing expected branch. Pass it as an argument or set VERCEL_EXPECTED_BRANCH."
  );
  process.exit(1);
}

if (!currentBranch) {
  console.log(
    `[vercel-ignored-build] No commit ref was provided by the environment. Continuing build for expected branch '${expectedBranch}'.`
  );
  process.exit(1);
}

if (currentBranch !== expectedBranch) {
  console.log(
    `[vercel-ignored-build] Skipping build because branch '${currentBranch}' does not match expected '${expectedBranch}'.`
  );
  process.exit(0);
}

console.log(
  `[vercel-ignored-build] Continuing build for allowed branch '${currentBranch}'.`
);
process.exit(1);

