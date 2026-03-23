import { NextResponse } from "next/server";

import { GitHubAPIError } from "@/lib/github-api";
import type { APIResponse } from "@/types/cms";

type LogMetaValue = boolean | number | string | undefined;

export function createErrorResponse(
  status: number,
  error: string,
  cacheControl?: string
): NextResponse {
  const response: APIResponse = {
    success: false,
    error,
    status,
  };

  return NextResponse.json(response, {
    status,
    headers: cacheControl ? { "Cache-Control": cacheControl } : undefined,
  });
}

export function logRouteEvent(
  context: string,
  message: string,
  metadata?: Record<string, LogMetaValue>
): void {
  if (metadata) {
    console.error(`[${context}] ${message}`, metadata);
    return;
  }

  console.error(`[${context}] ${message}`);
}

export function createGitHubErrorResponse(
  context: string,
  error: unknown,
  fallbackMessage: string,
  cacheControl?: string
): NextResponse {
  if (error instanceof GitHubAPIError) {
    logRouteEvent(context, error.message, {
      branch: error.branch,
      operation: error.operation,
      owner: error.owner,
      repo: error.repo,
      status: error.status,
    });

    return createErrorResponse(error.status, error.message, cacheControl);
  }

  const message = error instanceof Error ? error.message : fallbackMessage;
  logRouteEvent(context, message);
  return createErrorResponse(500, message, cacheControl);
}
