// Minimal inline-markdown renderer for resume.yaml text fields.
// Supports **bold**, [label](url) and `code` — nothing else, on purpose.
const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export function inline(text: string): string {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(
      /\[([^\]]+)\]\(((?:https?:|mailto:)[^)\s]+)\)/g,
      '<a href="$2" rel="noopener">$1</a>',
    );
}
