import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('json', json);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('vue', xml);

export type CodeSnippetLanguage = 'typescript' | 'json' | 'vue';

const LANGUAGE_MAP: Record<CodeSnippetLanguage, string> = {
  typescript: 'typescript',
  json: 'json',
  vue: 'vue',
};

export const highlightCode = (code: string, language: CodeSnippetLanguage): string => {
  const lang = LANGUAGE_MAP[language];
  const { value } = hljs.highlight(code, { language: lang });
  return `<pre><code class="hljs language-${lang}">${value}</code></pre>`;
};
