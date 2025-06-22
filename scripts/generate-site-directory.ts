const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const DOCS_DIR = path.join(process.cwd(), 'docs');
const STATIC_DIR = path.join(process.cwd(), 'static');
const BASE_URL = 'https://nakata-midori.github.io/sample-docs';
const SITE_JSON_PATH = path.join(STATIC_DIR, 'site-directory.json');

function getAllMarkdownFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(filePath));
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      results.push(filePath);
    }
  });
  return results;
}

function extractSummary(content) {
  const { data, content: body } = matter(content);
  if (data.description) return data.description;
  const match = body.match(/# .+\n+([^#\n]+)/);
  if (match) return match[1].trim();
  return body.split('\n').find((line) => line.trim())?.trim() || '';
}

function getPageId(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

function getPageUrl(filePath) {
  const rel = path.relative(DOCS_DIR, filePath).replace(/\\/g, '/').replace(/\.(md|mdx)$/, '');
  return `${BASE_URL}/docs/${rel}`;
}

function getLastModified(filePath) {
  const stat = fs.statSync(filePath);
  return new Date(stat.mtime).toISOString();
}

function extractTitle(content, fallback) {
  const { data, content: body } = matter(content);
  if (data.title) return data.title;
  const match = body.match(/^# (.+)$/m);
  if (match) return match[1].trim();
  return fallback;
}

function isPageContentEqual(a, b) {
  // 比較対象: title, summary, keywords, category
  return (
    a.title === b.title &&
    a.summary === b.summary &&
    JSON.stringify(a.keywords || []) === JSON.stringify(b.keywords || []) &&
    (a.category || '') === (b.category || '')
  );
}

function main() {
  let prevPagesMap = {};
  if (fs.existsSync(SITE_JSON_PATH)) {
    try {
      const prev = JSON.parse(fs.readFileSync(SITE_JSON_PATH, 'utf-8'));
      for (const p of prev.pages || []) {
        prevPagesMap[p.id] = p;
      }
    } catch (e) {
      // ignore parse error
    }
  }

  const files = getAllMarkdownFiles(DOCS_DIR);
  const pages = files.map((file) => {
    const raw = fs.readFileSync(file, 'utf-8');
    const id = getPageId(file);
    const url = getPageUrl(file);
    const title = extractTitle(raw, id);
    const summary = extractSummary(raw);
    const keywords = [];
    const category = '';
    const prev = prevPagesMap[id];
    let lastModified;
    if (
      prev &&
      isPageContentEqual({ title, summary, keywords, category }, prev)
    ) {
      lastModified = prev.lastModified;
    } else {
      lastModified = getLastModified(file);
    }
    return {
      id,
      title,
      url,
      summary,
      keywords,
      category,
      lastModified,
    };
  });
  const siteDirectory = {
    title: 'Sample Documentation Site',
    description: 'サンプルドキュメンテーションサイト',
    baseUrl: BASE_URL,
    pages,
  };
  if (!fs.existsSync(STATIC_DIR)) fs.mkdirSync(STATIC_DIR);
  fs.writeFileSync(SITE_JSON_PATH, JSON.stringify(siteDirectory, null, 2), 'utf-8');
  console.log('site-directory.json generated!');
}

main();
