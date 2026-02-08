type ReadingTime = {
  minutes: number;
  words: number;
};

function stripMarkdown(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/[#>*_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countCjk(text: string) {
  const m = text.match(/[\u4E00-\u9FFF\u3400-\u4DBF\u3040-\u30FF\uAC00-\uD7AF]/g);
  return m ? m.length : 0;
}

export function readingTime(markdownBody: string): ReadingTime {
  const text = stripMarkdown(markdownBody);
  const cjkChars = countCjk(text);
  const latinWords = text
    .replace(/[\u4E00-\u9FFF\u3400-\u4DBF\u3040-\u30FF\uAC00-\uD7AF]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const words = latinWords + Math.ceil(cjkChars / 2);
  const minutes = Math.max(1, Math.ceil(words / 200));
  return { minutes, words };
}

