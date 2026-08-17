/** Public files from `/public`, with Vite `base` (needed on GitHub Pages). */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL;
  const trimmed = path.replace(/^\//, "");
  return `${base}${trimmed}`;
}

export function routerBasepath(): string | undefined {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return base.length > 0 ? base : undefined;
}
