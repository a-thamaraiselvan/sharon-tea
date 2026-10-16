export const resolveImageUrl = (url?: string | null, fallback = ''): string => {
  if (!url || typeof url !== 'string' || !url.trim()) return fallback;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
    const origin = apiBase.replace(/\/api(\/v1)?\/?$/, '');
    return `${origin}${cleanPath}`;
  }
  return trimmed;
};
