export function getMediaSrc(url?: string): string | undefined {
  if (!url) {
    return undefined;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return `/api/media?url=${encodeURIComponent(url)}`;
  }

  return url;
}

export function isRemoteMediaUrl(url?: string): boolean {
  return Boolean(url && (url.startsWith("http://") || url.startsWith("https://")));
}
