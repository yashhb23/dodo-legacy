let trimmed = (url || '').trim();
if (!trimmed) return '';

// Fix: Ensure protocol exists, otherwise browser treats it as relative path (causing 405 on Vercel)
if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
  trimmed = `https://${trimmed}`;
}

return trimmed.replace(/\/+$/, '');
}

export function getApiBaseUrl() {
  return normalizeBaseUrl(process.env.REACT_APP_API_URL);
}

export async function apiJson(path, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const detail =
      typeof data === 'object' && data && 'detail' in data ? data.detail : undefined;
    throw new Error(typeof detail === 'string' ? detail : `Request failed (${res.status})`);
  }

  return data;
}

