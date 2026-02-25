/** Join class names, filtering falsy values */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/** Format a year range or single year */
export function formatYear(year: string): string {
  return year
}
