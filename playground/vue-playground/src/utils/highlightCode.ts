import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import plaintext from 'highlight.js/lib/languages/plaintext';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('plaintext', plaintext);

/** Canonical language ids used by CodeBlock display + highlight.js */
export type CodeLanguage =
  | 'typescript'
  | 'javascript'
  | 'json'
  | 'vue'
  | 'bash'
  | 'text';

const ALIAS_TO_CANONICAL: Record<string, CodeLanguage> = {
  ts: 'typescript',
  typescript: 'typescript',
  js: 'javascript',
  javascript: 'javascript',
  json: 'json',
  vue: 'vue',
  html: 'vue',
  xml: 'vue',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  text: 'text',
  plaintext: 'text',
  plain: 'text',
  txt: 'text',
};

/** Map canonical id → highlight.js language name */
const HLJS_LANGUAGE: Record<CodeLanguage, string> = {
  typescript: 'typescript',
  javascript: 'javascript',
  json: 'json',
  vue: 'xml',
  bash: 'bash',
  text: 'plaintext',
};

export const normalizeCodeLanguage = (raw?: string): CodeLanguage => {
  if (!raw) return 'text';
  const key = raw.trim().toLowerCase();
  return ALIAS_TO_CANONICAL[key] ?? 'text';
};

export const highlightCode = (code: string, language?: string): string => {
  const canonical = normalizeCodeLanguage(language);
  const hljsLang = HLJS_LANGUAGE[canonical];
  const { value } = hljs.highlight(code, { language: hljsLang });
  return `<pre><code class="hljs language-${canonical}">${value}</code></pre>`;
};
