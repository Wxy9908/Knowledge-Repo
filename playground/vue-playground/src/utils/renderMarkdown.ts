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

export const renderMarkdown = (source: string): string => {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(escapeHtml(lines[i]));
        i += 1;
      }
      html.push(`<pre><code>${codeLines.join('\n')}</code></pre>`);
      i += 1;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      html.push('<hr />');
      i += 1;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      html.push(`<h3>${inlineFormat(trimmed.slice(4))}</h3>`);
      i += 1;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      html.push(`<h2>${inlineFormat(trimmed.slice(3))}</h2>`);
      i += 1;
      continue;
    }

    if (trimmed.startsWith('# ')) {
      html.push(`<h1>${inlineFormat(trimmed.slice(2))}</h1>`);
      i += 1;
      continue;
    }

    if (trimmed.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteLines.push(inlineFormat(lines[i].trim().slice(2)));
        i += 1;
      }
      html.push(`<blockquote>${quoteLines.join('<br />')}</blockquote>`);
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
        html.push('<table><thead><tr>');
        head.forEach((cell) => {
          html.push(`<th>${inlineFormat(cell)}</th>`);
        });
        html.push('</tr></thead><tbody>');
        body.forEach((row) => {
          html.push('<tr>');
          row.forEach((cell) => {
            html.push(`<td>${inlineFormat(cell)}</td>`);
          });
          html.push('</tr>');
        });
        html.push('</tbody></table>');
      }
      continue;
    }

    if (/^[-*] /.test(trimmed)) {
      html.push('<ul>');
      while (i < lines.length && /^[-*] /.test(lines[i].trim())) {
        html.push(`<li>${inlineFormat(lines[i].trim().slice(2))}</li>`);
        i += 1;
      }
      html.push('</ul>');
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
      !isTableRow(lines[i].trim()) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(inlineFormat(lines[i]));
      i += 1;
    }
    html.push(`<p>${paraLines.join('<br />')}</p>`);
  }

  return html.join('\n');
};
