/** Normalize optional string fields from API/forms so empty and literal "null" become SQL NULL. */
export function normalizeOptionalText(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  if (trimmed.toLowerCase() === "null") return null;
  return trimmed;
}
