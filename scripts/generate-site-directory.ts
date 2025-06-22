const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const DOCS_DIR = path.join(process.cwd(), 'docs');
const STATIC_DIR = path.join(process.cwd(), 'static');
const BASE_URL = 'https://nakata-midori.github.io/sample-docs';

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

function main() {
  const files = getAllMarkdownFiles(DOCS_DIR);
  const pages = files.map((file) => {
    const raw = fs.readFileSync(file, 'utf-8');
    const id = getPageId(file);
    const url = getPageUrl(file);
    const lastModified = getLastModified(file);
    const title = extractTitle(raw, id);
    const summary = extractSummary(raw);
    return {
      id,
      title,
      url,
      summary,
      keywords: [],
      category: '',
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
  fs.writeFileSync(path.join(STATIC_DIR, 'site-directory.json'), JSON.stringify(siteDirectory, null, 2), 'utf-8');
  console.log('site-directory.json generated!');
}

main();
