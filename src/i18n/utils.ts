import { defaultLang, type LanguageCode } from './languages';

/**
 * Get the language from the URL path
 * @param url - The URL object
 * @returns The language code or default language
 */
export function getLangFromUrl(url: URL): LanguageCode {
  const [, lang] = url.pathname.split('/');
  if (lang && ['es', 'en'].includes(lang)) {
    return lang as LanguageCode;
  }
  return defaultLang;
}

/**
 * Get the localized path for a given path and language
 * @param path - The path (without language prefix)
 * @param lang - The language code
 * @param currentPathname - Optional current pathname to determine if we should use prefix
 * @returns The localized path
 */
export function getLocalizedPath(path: string, lang: LanguageCode, currentPathname?: string): string {
  // Normalize path - ensure it starts with / and remove trailing slashes (except root)
  const normalizedPath = path === '/' ? '/' : '/' + path.replace(/^\/+|\/+$/g, '');
  
  // Check if current URL has a language prefix
  const pathParts = currentPathname ? currentPathname.split('/').filter(Boolean) : [];
  const hasPrefix = pathParts.length > 0 && pathParts[0] === lang;
  
  // Always use prefix if current page has one, or if it's not the default language
  // For default language without prefix, don't add prefix (cleaner URLs)
  if (normalizedPath === '/') {
    return (hasPrefix || lang !== defaultLang) ? `/${lang}` : '/';
  }
  
  // If current page has prefix, maintain it. Otherwise, only use prefix for non-default languages
  return (hasPrefix || lang !== defaultLang) ? `/${lang}${normalizedPath}` : normalizedPath;
}

/**
 * Get the path without the language prefix
 * @param pathname - The full pathname
 * @returns The path without language prefix
 */
export function getPathWithoutLang(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && ['es', 'en'].includes(parts[0])) {
    return '/' + parts.slice(1).join('/') || '/';
  }
  return pathname || '/';
}

