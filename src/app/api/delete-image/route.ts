/**
 * DELETE /api/delete-image
 * Deletes image from GitHub repository
 */

import { NextRequest, NextResponse } from "next/server";
import { createGitHubAPI } from "@/lib/github-api";
import type { APIResponse, ImageDeletePayload } from "@/types/cms";

/**
 * Validate admin password
 * @param password - Password to validate
 * @returns True if password is correct
 */
function validatePassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD environment variable not set");
    return false;
  }
  return password === adminPassword;
}

/**
 * Handle DELETE request to delete image from GitHub
 * @param request - Next.js request object
 * @returns JSON response with deletion status
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    let payload: ImageDeletePayload;
    try {
      payload = (await request.json()) as ImageDeletePayload;
    } catch {
      const response: APIResponse = {
        success: false,
        error: "Invalid request body",
        status: 400,
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate required fields
    if (!payload.filePath || !payload.password) {
      const response: APIResponse = {
        success: false,
        error: "Missing required fields: filePath, password",
        status: 400,
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate password
    if (!validatePassword(payload.password)) {
      const response: APIResponse = {
        success: false,
        error: "Invalid password",
        status: 401,
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Initialize GitHub API
    const github = createGitHubAPI();

    // Get file to retrieve SHA
    let fileData;
    try {
      fileData = await github.getFile(payload.filePath);
    } catch {
      const response: APIResponse = {
        success: false,
        error: `File not found: ${payload.filePath}`,
        status: 404,
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Delete file
    await github.deleteFile(
      payload.filePath,
      fileData.sha,
      `Delete image: ${payload.filePath}`
    );

    const successResponse: APIResponse = {
      success: true,
      data: {
        path: payload.filePath,
      },
      message: "Image deleted successfully",
    };

    return NextResponse.json(successResponse);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    const response: APIResponse = {
      success: false,
      error: errorMessage,
      status: 500,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
