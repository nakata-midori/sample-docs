const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { execSync } = require('child_process');
const { OpenAI } = require('openai');

const DOCS_DIR = path.join(process.cwd(), 'docs');
const STATIC_DIR = path.join(process.cwd(), 'static');
const BASE_URL = 'https://nakata-midori.github.io/sample-docs';
const SITE_JSON_PATH = path.join(STATIC_DIR, 'site-directory.json');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

function getChangedDocsFiles(baseBranch, headBranch) {
  try {
    // base...head間の差分に含まれるdocs配下のファイル一覧を取得
    const out = execSync(`git fetch origin ${baseBranch} && git fetch origin ${headBranch} && git diff --name-only origin/${baseBranch}...origin/${headBranch} docs/`).toString();
    return out.split('\n').filter(f => f.endsWith('.md') || f.endsWith('.mdx')).map(f => path.resolve(f));
  } catch (e) {
    return [];
  }
}

async function fetchSummaryWithOpenAI(content) {
  try {
    const systemPrompt = 'あなたは日本語のドキュメント要約AIです。与えられた内容から「要約」「キーワード（3～10個、日本語で）」「カテゴリ（1単語、日本語）」をJSON形式で出力してください。例: {"summary": "...", "keywords": ["...", "..."], "category": "..."}';
    const userPrompt = `内容:\n${content}`;
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 512,
      temperature: 0.2,
    });
    let text = response.choices[0].message.content;
    // コードブロック（```json ... ```）形式で返る場合の除去処理
    if (text.startsWith('```')) {
      text = text.replace(/^```[a-zA-Z]*\n?|```$/g, '').trim();
    }
    // バッククォートや不要な改行を除去
    text = text.replace(/^```json|```$/g, '').trim();
    // JSONパース
    return JSON.parse(text);
  } catch (e) {
    console.error('OpenAI API error or JSON parse error:', e);
    return { summary: '', keywords: [], category: '' };
  }
}

function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}

async function main() {
  // コマンドライン引数からbase, headブランチ名、全件更新フラグを取得
  const baseBranch = process.argv[2] || 'main';
  const headBranch = process.argv[3] || 'HEAD';
  const updateAll = process.argv[4] === '--all';

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

  const changedFiles = updateAll ? getAllMarkdownFiles(DOCS_DIR) : getChangedDocsFiles(baseBranch, headBranch);
  const files = getAllMarkdownFiles(DOCS_DIR);
  const pages = [];
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8');
    const id = getPageId(file);
    const url = getPageUrl(file);
    const title = extractTitle(raw, id);
    let summary = extractSummary(raw);
    let keywords = [];
    let category = '';
    const prev = prevPagesMap[id];
    let lastModified;
    if (
      prev &&
      !changedFiles.includes(path.resolve(file))
    ) {
      summary = prev.summary;
      keywords = prev.keywords || [];
      category = prev.category || '';
      lastModified = prev.lastModified;
    } else {
      const ai = await fetchSummaryWithOpenAI(raw);
      summary = ai.summary || summary;
      keywords = ai.keywords || [];
      category = ai.category || '';
      lastModified = getLastModified(file);
    }
    pages.push({
      id,
      title,
      url,
      summary,
      keywords,
      category,
      lastModified,
    });
  }
  const siteDirectory = {
    title: 'Sample Documentation Site',
    description: 'サンプルドキュメンテーションサイト',
    baseUrl: BASE_URL,
    pages,
  };
  fs.mkdirSync(STATIC_DIR, { recursive: true });
  fs.writeFileSync(SITE_JSON_PATH, JSON.stringify(siteDirectory, null, 2), 'utf-8');
  console.log('site-directory.json generated!');
}

main();
