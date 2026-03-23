/**
 * POST /api/update-json
 * Updates JSON data in local files (dev) or GitHub repository (production)
 */

import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { createErrorResponse, createGitHubErrorResponse } from "@/lib/api-response";
import { createGitHubAPI } from "@/lib/github-api";
import { validateAdminPassword } from "@/lib/runtime-env";
import type { APIResponse, JSONUpdatePayload } from "@/types/cms";

/**
 * Handle POST request to update JSON
 * - Development: Write to local filesystem
 * - Production: Update via GitHub API
 * @param request - Next.js request object
 * @returns JSON response with update status
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    let payload: JSONUpdatePayload;
    try {
      payload = (await request.json()) as JSONUpdatePayload;
    } catch {
      return createErrorResponse(400, "Invalid request body");
    }

    // Validate required fields
    if (!payload.filePath || !payload.content || !payload.password) {
      return createErrorResponse(
        400,
        "Missing required fields: filePath, content, password"
      );
    }

    // Validate password
    if (!validateAdminPassword(payload.password)) {
      return createErrorResponse(401, "Invalid password");
    }

    // Validate JSON content
    try {
      JSON.parse(payload.content);
    } catch {
      return createErrorResponse(400, "Invalid JSON content");
    }

    // In development, write to local filesystem
    if (process.env.NODE_ENV === "development") {
      try {
        const fullPath = join(process.cwd(), payload.filePath);
        // Format JSON with 2-space indentation for readability
        const formattedContent = JSON.stringify(JSON.parse(payload.content), null, 2);
        await writeFile(fullPath, formattedContent, "utf-8");

        const successResponse: APIResponse = {
          success: true,
          data: {
            sha: "local-dev",
            path: payload.filePath,
          },
          message: "File updated successfully (local development)",
        };

        return NextResponse.json(successResponse);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Failed to write file";
        return createErrorResponse(500, `Failed to write local file: ${errorMsg}`);
      }
    } else {
      // In production, update via GitHub
      try {
        const github = createGitHubAPI();

        // Get current file to retrieve SHA
        const currentFile = await github.getFile(payload.filePath);
        const resolvedPath = currentFile.path || payload.filePath;

        // Update file
        const updatedFile = await github.putFile(
          resolvedPath,
          payload.content,
          "Update JSON data via CMS",
          currentFile.sha
        );

        const successResponse: APIResponse = {
          success: true,
          data: {
            sha: updatedFile.sha,
            path: updatedFile.path,
          },
          message: "File updated successfully (GitHub)",
        };

        return NextResponse.json(successResponse);
      } catch (error) {
        return createGitHubErrorResponse(
          "update-json",
          error,
          "Failed to update via GitHub"
        );
      }
    }
  } catch (error) {
    return createErrorResponse(
      500,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}
