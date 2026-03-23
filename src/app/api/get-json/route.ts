/**
 * GET /api/get-json
 * Fetches JSON data from local files (dev) or GitHub repository (production)
 */

import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { createErrorResponse, createGitHubErrorResponse } from "@/lib/api-response";
import { createGitHubAPI } from "@/lib/github-api";
import { CMS_FILES } from "@/lib/cms-utils";
import { validateAdminPassword } from "@/lib/runtime-env";
import type { APIResponse } from "@/types/cms";

const ADMIN_PASSWORD_HEADER = "x-admin-password";
const ALLOWED_FILE_PATHS = new Set<string>(Object.values(CMS_FILES));

/**
 * Handle GET request to fetch JSON
 * - Development: Read from local filesystem
 * - Production: Fetch from GitHub API
 * @param request - Next.js request object
 * @returns JSON response with file content
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const providedPassword = request.headers.get(ADMIN_PASSWORD_HEADER) || "";
    if (!validateAdminPassword(providedPassword)) {
      return createErrorResponse(401, "Invalid password", "no-store");
    }

    // Get filePath from query parameters
    const filePath = request.nextUrl.searchParams.get("filePath");

    if (!filePath) {
      return createErrorResponse(400, "filePath query parameter is required");
    }
    if (!ALLOWED_FILE_PATHS.has(filePath)) {
      return createErrorResponse(400, "Invalid file path");
    }

    let jsonData: unknown;
    let sha = "";

    // In development, read from local filesystem
    if (process.env.NODE_ENV === "development") {
      try {
        // Get the file path relative to project root
        const fullPath = join(process.cwd(), filePath);
        const fileContent = await readFile(fullPath, "utf-8");
        jsonData = JSON.parse(fileContent);
        sha = "local-dev"; // Mock SHA for development
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to read file";
        return createErrorResponse(404, `Failed to read local file: ${errorMsg}`);
      }
    } else {
      // In production, fetch from GitHub
      try {
        const github = createGitHubAPI();
        const fileData = await github.getFile(filePath);

        if (!fileData.content) {
          return createErrorResponse(404, "File content not found");
        }

        const decodedContent = Buffer.from(
          fileData.content,
          "base64"
        ).toString("utf-8");
        jsonData = JSON.parse(decodedContent);
        sha = fileData.sha || "";
      } catch (error) {
        return createGitHubErrorResponse(
          "get-json",
          error,
          "Failed to fetch from GitHub"
        );
      }
    }

    const successResponse: APIResponse = {
      success: true,
      data: {
        content: jsonData,
        sha,
      },
      message: "File fetched successfully",
    };

    return NextResponse.json(successResponse, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return createErrorResponse(
      500,
      error instanceof Error ? error.message : "Internal server error",
      "no-store"
    );
  }
}
