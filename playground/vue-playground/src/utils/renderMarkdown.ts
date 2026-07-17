import { normalizeCodeLanguage } from './highlightCode';

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const inlineFormat = (text: string): string => {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return out;
};

const isTableRow = (line: string) => /^\|.+\|$/.test(line.trim());
const isTableSep = (line: string) => /^\|[\s:|-]+\|$/.test(line.trim());

export type MarkdownBlock =
  | { kind: 'html'; html: string }
  | { kind: 'code'; code: string; language: string };

/**
 * Split markdown into HTML fragments and fenced code blocks so Vue can
 * mount the shared CodeBlock component for ```lang fences.
 */
export const parseMarkdownBlocks = (source: string): MarkdownBlock[] => {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: MarkdownBlock[] = [];
  const htmlBuf: string[] = [];
  let i = 0;

  const flushHtml = () => {
    if (!htmlBuf.length) return;
    blocks.push({ kind: 'html', html: htmlBuf.join('\n') });
    htmlBuf.length = 0;
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      flushHtml();
      const langRaw = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      blocks.push({
        kind: 'code',
        code: codeLines.join('\n'),
        language: normalizeCodeLanguage(langRaw),
      });
      i += 1;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      htmlBuf.push('<hr />');
      i += 1;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      htmlBuf.push(`<h3>${inlineFormat(trimmed.slice(4))}</h3>`);
      i += 1;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      htmlBuf.push(`<h2>${inlineFormat(trimmed.slice(3))}</h2>`);
      i += 1;
      continue;
    }

    if (trimmed.startsWith('# ')) {
      htmlBuf.push(`<h1>${inlineFormat(trimmed.slice(2))}</h1>`);
      i += 1;
      continue;
    }

    if (trimmed.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteLines.push(inlineFormat(lines[i].trim().slice(2)));
        i += 1;
      }
      htmlBuf.push(`<blockquote>${quoteLines.join('<br />')}</blockquote>`);
      continue;
    }

    if (isTableRow(trimmed)) {
      const tableLines: string[] = [];
      while (i < lines.length && isTableRow(lines[i].trim())) {
        tableLines.push(lines[i].trim());
        i += 1;
      }
      const rows = tableLines
        .filter((row) => !isTableSep(row))
        .map((row) =>
          row
            .slice(1, -1)
            .split('|')
            .map((cell) => cell.trim()),
        );
      if (rows.length) {
        const [head, ...body] = rows;
        const parts: string[] = ['<table><thead><tr>'];
        head.forEach((cell) => {
          parts.push(`<th>${inlineFormat(cell)}</th>`);
        });
        parts.push('</tr></thead><tbody>');
        body.forEach((row) => {
          parts.push('<tr>');
          row.forEach((cell) => {
            parts.push(`<td>${inlineFormat(cell)}</td>`);
          });
          parts.push('</tr>');
        });
        parts.push('</tbody></table>');
        htmlBuf.push(parts.join(''));
      }
      continue;
    }

    if (/^[-*] /.test(trimmed)) {
      const parts: string[] = ['<ul>'];
      while (i < lines.length && /^[-*] /.test(lines[i].trim())) {
        parts.push(`<li>${inlineFormat(lines[i].trim().slice(2))}</li>`);
        i += 1;
      }
      parts.push('</ul>');
      htmlBuf.push(parts.join(''));
      continue;
    }

    // Numbered lists (common in notes)
    if (/^\d+\. /.test(trimmed)) {
      const parts: string[] = ['<ol>'];
      while (i < lines.length && /^\d+\. /.test(lines[i].trim())) {
        parts.push(`<li>${inlineFormat(lines[i].trim().replace(/^\d+\.\s*/, ''))}</li>`);
        i += 1;
      }
      parts.push('</ol>');
      htmlBuf.push(parts.join(''));
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('> ') &&
      !lines[i].trim().startsWith('```') &&
      !/^[-*] /.test(lines[i].trim()) &&
      !/^\d+\. /.test(lines[i].trim()) &&
      !isTableRow(lines[i].trim()) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(inlineFormat(lines[i]));
      i += 1;
    }
    htmlBuf.push(`<p>${paraLines.join('<br />')}</p>`);
  }

  flushHtml();
  return blocks;
};

/** Legacy full-HTML renderer (keeps fences as plain pre/code). Prefer parseMarkdownBlocks. */
export const renderMarkdown = (source: string): string => {
  return parseMarkdownBlocks(source)
    .map((block) => {
      if (block.kind === 'html') return block.html;
      return `<pre><code>${escapeHtml(block.code)}</code></pre>`;
    })
    .join('\n');
};
