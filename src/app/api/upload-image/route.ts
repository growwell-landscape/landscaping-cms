/**
 * POST /api/upload-image
 * Uploads media files to GitHub repository
 */

import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { createErrorResponse, createGitHubErrorResponse } from "@/lib/api-response";
import { createGitHubAPI } from "@/lib/github-api";
import { validateAdminPassword } from "@/lib/runtime-env";
import type { APIResponse, ImageUploadPayload } from "@/types/cms";

/**
 * Validate upload file name
 * @param fileName - File name to validate
 * @returns True if file name is valid
 */
function validateFileName(fileName: string): boolean {
  // Only allow alphanumeric, dash, underscore, and dot
  const validNamePattern =
    /^[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp|mp4|webm|ogg|mov)$/i;
  return validNamePattern.test(fileName);
}

/**
 * Validate upload folder
 * @param folder - Folder path to validate
 * @returns True if folder is valid
 */
function validateFolder(folder: string): boolean {
  if (!folder) return true;
  if (folder.includes("..")) return false;
  if (folder.startsWith("/") || folder.endsWith("/")) return false;
  return /^[a-zA-Z0-9/_-]+$/.test(folder);
}

/**
 * Handle POST request to upload media to GitHub
 * @param request - Next.js request object
 * @returns JSON response with upload status and media path
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    let payload: ImageUploadPayload;
    try {
      payload = (await request.json()) as ImageUploadPayload;
    } catch {
      return createErrorResponse(400, "Invalid request body");
    }

    // Validate required fields
    if (!payload.fileName || !payload.base64Content || !payload.password) {
      return createErrorResponse(
        400,
        "Missing required fields: fileName, base64Content, password"
      );
    }

    // Validate password
    if (!validateAdminPassword(payload.password)) {
      return createErrorResponse(401, "Invalid password");
    }

    // Validate file name
    if (!validateFileName(payload.fileName)) {
      return createErrorResponse(
        400,
        "Invalid file name. Only alphanumeric, dash, underscore allowed. Must end with .jpg, .jpeg, .png, .webp, .mp4, .webm, .ogg, or .mov"
      );
    }

    if (payload.folder && !validateFolder(payload.folder)) {
      return createErrorResponse(400, "Invalid folder path");
    }

    const folderSegment = payload.folder ? `/${payload.folder}` : "";
    const filePath = `public/uploads${folderSegment}/${payload.fileName}`;
    const publicPath = `/uploads${folderSegment}/${payload.fileName}`;

    if (process.env.NODE_ENV === "development") {
      const fullPath = join(process.cwd(), filePath);
      await mkdir(dirname(fullPath), { recursive: true });
      await writeFile(fullPath, Buffer.from(payload.base64Content, "base64"));

      const successResponse: APIResponse = {
        success: true,
        data: {
          path: publicPath,
          sha: "local-dev",
          fileName: payload.fileName,
        },
        message: "Media uploaded successfully (local development)",
      };

      return NextResponse.json(successResponse);
    }

    // Initialize GitHub API
    const github = createGitHubAPI();
    let sha: string | undefined;

    try {
      const existingFile = await github.getFile(filePath);
      sha = existingFile.sha;
    } catch {
      sha = undefined;
    }

    // Upload media
    const uploadedFile = await github.putFile(
      filePath,
      payload.base64Content,
      `Upload media: ${payload.fileName}`,
      sha,
      { contentEncoding: "base64" }
    );

    const successResponse: APIResponse = {
      success: true,
      data: {
        path: publicPath,
        sha: uploadedFile.sha,
        fileName: payload.fileName,
      },
      message: "Media uploaded successfully",
    };

    return NextResponse.json(successResponse);
  } catch (error) {
    return createGitHubErrorResponse(
      "upload-image",
      error,
      "Internal server error"
    );
  }
}
