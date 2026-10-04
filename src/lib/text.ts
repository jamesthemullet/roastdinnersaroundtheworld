export function cleanExcerpt(text: string | undefined): string | undefined {
  if (!text) return text;
  return text.replace(/\s*\[…\]\s*$/, "").trimEnd();
}
