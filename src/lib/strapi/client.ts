interface BackendFetchOptions extends RequestInit {
  revalidate?: number;
}

export interface BackendResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
  error?: string;
}

const baseUrl =
  process.env.COMMERCE_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:5001/api';

export async function fetchBackend<T>(
  path: string,
  options: BackendFetchOptions = {},
): Promise<BackendResponse<T>> {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const url = new URL(normalizedPath, `${baseUrl}/`);
  const { revalidate = 120, headers, ...init } = options;

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...headers,
    },
    next: {
      revalidate,
    },
  });

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as BackendResponse<T>;
}
