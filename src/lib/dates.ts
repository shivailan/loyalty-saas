export function isoDateDaysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export function currentYear(): number {
  return new Date().getFullYear();
}
