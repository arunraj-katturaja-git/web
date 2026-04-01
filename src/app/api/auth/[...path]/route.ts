import { NextRequest } from "next/server";
import { getCommerceApiBase } from "@/lib/backend";

const ALLOWED_PATHS = new Set([
  "users/guest-session",
  "users/request-otp",
  "users/verify-otp",
  "users/session",
  "users/logout",
]);

async function proxyAuthRequest(
  request: NextRequest,
  pathSegments: string[],
): Promise<Response> {
  const targetPath = pathSegments.join("/");

  if (!ALLOWED_PATHS.has(targetPath)) {
    return Response.json({ success: false, error: "Unsupported auth route." }, { status: 404 });
  }

  const targetUrl = new URL(targetPath, `${getCommerceApiBase()}/`);
  const body = request.method === "GET" ? undefined : await request.text();
  const authorization = request.headers.get("authorization");

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body,
    cache: "no-store",
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyAuthRequest(request, path);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyAuthRequest(request, path);
}
