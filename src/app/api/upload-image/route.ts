/**
 * POST /api/upload-image
 * Uploads compressed image to GitHub repository
 */

import { NextRequest, NextResponse } from "next/server";
import { createGitHubAPI } from "@/lib/github-api";
import type { APIResponse, ImageUploadPayload } from "@/types/cms";

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
 * Validate image file name
 * @param fileName - File name to validate
 * @returns True if file name is valid
 */
function validateFileName(fileName: string): boolean {
  // Only allow alphanumeric, dash, underscore, and dot
  const validNamePattern = /^[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp)$/i;
  return validNamePattern.test(fileName);
}

/**
 * Handle POST request to upload image to GitHub
 * @param request - Next.js request object
 * @returns JSON response with upload status and image path
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    let payload: ImageUploadPayload;
    try {
      payload = (await request.json()) as ImageUploadPayload;
    } catch {
      const response: APIResponse = {
        success: false,
        error: "Invalid request body",
        status: 400,
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate required fields
    if (!payload.fileName || !payload.base64Content || !payload.password) {
      const response: APIResponse = {
        success: false,
        error: "Missing required fields: fileName, base64Content, password",
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

    // Validate file name
    if (!validateFileName(payload.fileName)) {
      const response: APIResponse = {
        success: false,
        error:
          "Invalid file name. Only alphanumeric, dash, underscore allowed. Must end with .jpg, .jpeg, .png, or .webp",
        status: 400,
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Build file path
    const filePath = `public/uploads/${payload.fileName}`;

    // Initialize GitHub API
    const github = createGitHubAPI();

    // Upload image
    const uploadedFile = await github.putFile(
      filePath,
      payload.base64Content,
      `Upload image: ${payload.fileName}`
    );

    const successResponse: APIResponse = {
      success: true,
      data: {
        path: `/${filePath.replace(/^public/, "")}`,
        sha: uploadedFile.sha,
        fileName: payload.fileName,
      },
      message: "Image uploaded successfully",
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
