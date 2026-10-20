const dateFormat = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** Deterministic (UTC) so server and client render the same string. */
export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}
