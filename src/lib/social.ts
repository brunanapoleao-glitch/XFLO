const INSTAGRAM_HANDLE_PATTERN = /^[A-Za-z0-9._]{1,30}$/;

export function normalizeInstagram(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const handle = trimmed.replace(/^@/, '').replace(/\/+$/, '');
  if (INSTAGRAM_HANDLE_PATTERN.test(handle)) {
    return `https://www.instagram.com/${handle}/`;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return url.toString();
  } catch {
    return null;
  }
}
