// Utility helpers for normalizing display text and fixing common mojibake

// Fix frequent UTF-8→Latin1 mis-decoding sequences (mojibake)
export function fixMojibake(input: string): string {
  if (!input) return input;
  return input
    // Dashes
    .replace(/â€“/g, '–')
    .replace(/â€”/g, '—')
    // Quotes
    .replace(/â€˜|â€™/g, "'")
    .replace(/â€œ|â€/g, '"')
    // Ellipsis and bullet
    .replace(/â€¦/g, '…')
    .replace(/â€¢/g, '•')
    // NBSP artifact and stray Â
    .replace(/Â\s/g, ' ')
    .replace(/Â/g, '')
    // Occasionally seen when minus is broken
    .replace(/âˆ’/g, '-')
    ;
}

// Replace various dash/minus variants with ASCII hyphen-minus and clean spaces
export function normalizeDisplayText(input: string): string {
  if (!input) return input;
  let s = fixMojibake(input);
  // Normalize dashes/minus signs to '-'
  const dashRegex = /[\u2010\u2011\u2012\u2013\u2014\u2212\uFE58\uFE63\uFF0D]/g; // hyphen, nb hyphen, figure, en, em, minus, small em dash, small hyphen-minus, fullwidth hyphen-minus
  s = s.replace(dashRegex, '-');

  // Normalize spaces: non-breaking spaces and narrow no-break spaces to regular space
  s = s.replace(/[\u00A0\u202F]/g, ' ');

  // Remove control characters (C0/C1) except \n and \t
  s = s.replace(/[\u0000-\u001F\u007F-\u009F]/g, (ch) => (ch === '\n' || ch === '\t' ? ch : ''));

  return s;
}

// Convenience: trim and collapse multiple spaces
export function tidyWhitespace(input: string): string {
  if (!input) return input;
  return normalizeDisplayText(input).replace(/\s+/g, ' ').trim();
}

// One-shot normalizer for UI display
export function normalizeForDisplay(input: string): string {
  return tidyWhitespace(input);
}

// For Markdown: preserve line breaks and intra-line spacing while fixing mojibake
export function normalizeForMarkdown(input: string): string {
  return normalizeDisplayText(input);
}