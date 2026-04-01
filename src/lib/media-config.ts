const LOCAL_MEDIA_HOSTS = ["localhost:1337", "127.0.0.1:1337"];

function collectHosts(value: string | undefined, hosts: Set<string>) {
  if (!value) {
    return;
  }

  for (const candidate of value.split(/[\s,]+/)) {
    const normalizedCandidate = candidate.trim();
    if (!normalizedCandidate) {
      continue;
    }

    try {
      hosts.add(new URL(normalizedCandidate).host);
    } catch {
      hosts.add(normalizedCandidate.replace(/^https?:\/\//, "").replace(/\/+$/, ""));
    }
  }
}

export function getAllowedMediaHosts(): Set<string> {
  const hosts = new Set<string>();

  collectHosts(process.env.NEXT_PUBLIC_STRAPI_URL, hosts);
  collectHosts(process.env.STRAPI_URL, hosts);
  collectHosts(process.env.MEDIA_ALLOWED_ORIGINS, hosts);

  if (process.env.NODE_ENV !== "production" || hosts.size === 0) {
    for (const host of LOCAL_MEDIA_HOSTS) {
      hosts.add(host);
    }
  }

  return hosts;
}
