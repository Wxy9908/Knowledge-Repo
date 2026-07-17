export type PlatformFont = 'sans' | 'mono';

const FALLBACK_SANS =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif';

const FALLBACK_MONO =
  'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, "Liberation Mono", monospace';

/** Read platform font stacks from CSS variables (--font-sans / --font-mono in main.css). */
export function getPlatformFont(which: PlatformFont = 'sans'): string {
  if (typeof document === 'undefined') {
    return which === 'mono' ? FALLBACK_MONO : FALLBACK_SANS;
  }

  const prop = which === 'mono' ? '--font-mono' : '--font-sans';
  const value = getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
  return value || (which === 'mono' ? FALLBACK_MONO : FALLBACK_SANS);
}
