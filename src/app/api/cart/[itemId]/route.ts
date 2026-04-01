import { NextRequest } from "next/server";
import { getCommerceApiBase } from "@/lib/backend";

function buildHeaders(request: NextRequest, hasBody: boolean): HeadersInit {
  return {
    Accept: "application/json",
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
    ...(request.headers.get("authorization")
      ? { Authorization: request.headers.get("authorization")! }
      : {}),
    ...(request.headers.get("x-guest-token")
      ? { "X-Guest-Token": request.headers.get("x-guest-token")! }
      : {}),
  };
}

async function proxyCartItemRequest(
  request: NextRequest,
  itemId: string,
) {
  const target = new URL(`cart/items/${itemId}`, `${getCommerceApiBase()}/`);
  target.search = request.nextUrl.search;
  const body = request.method === "DELETE" ? undefined : await request.text();

  const response = await fetch(target, {
    method: request.method,
    headers: buildHeaders(request, Boolean(body)),
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

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ itemId: string }> },
) {
  const { itemId } = await context.params;
  return proxyCartItemRequest(request, itemId);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ itemId: string }> },
) {
  const { itemId } = await context.params;
  return proxyCartItemRequest(request, itemId);
}
