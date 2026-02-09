import fs from 'node:fs';
import path from 'node:path';

function normalizePathSegment(input) {
  const raw = String(input || '').trim();
  const seg = raw.replace(/^\/+|\/+$/g, '');
  if (!seg) return 'admin';
  if (seg.includes('..') || seg.includes('\\')) {
    throw new Error('ADMIN_PATH 非法：不能包含 .. 或反斜杠');
  }
  return seg;
}

function replaceInFile(filePath, replacer) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, 'utf8');
  const next = replacer(raw);
  if (next !== raw) fs.writeFileSync(filePath, next, 'utf8');
}

const adminPath = normalizePathSegment(process.env.ADMIN_PATH);
const siteUrl = String(process.env.SITE_URL || '').trim();

const srcDir = path.resolve('public', 'admin');
if (!fs.existsSync(srcDir)) {
  // Nothing to do.
  process.exit(0);
}

// If ADMIN_PATH is not "admin", create an alias folder under public/<ADMIN_PATH>.
// This avoids breaking existing /admin while still allowing a custom entry.
if (adminPath !== 'admin') {
  const dstDir = path.resolve('public', adminPath);
  fs.cpSync(srcDir, dstDir, { recursive: true, force: true });
}

// Optional: fill YOUR_DOMAIN placeholders for convenience.
// (Config cannot import src/config/site.ts, so we rely on SITE_URL env.)
if (siteUrl) {
  const candidates = new Set([
    path.resolve('public', 'admin', 'config.yml'),
    adminPath !== 'admin' ? path.resolve('public', adminPath, 'config.yml') : null,
  ].filter(Boolean));

  for (const p of candidates) {
    replaceInFile(p, (raw) => raw.replaceAll('https://YOUR_DOMAIN', siteUrl));
  }
}

