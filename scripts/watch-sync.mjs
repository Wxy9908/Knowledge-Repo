import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SYNC_SCRIPT = path.join(ROOT, 'scripts/sync-catalog.mjs');
const TRACKS_DIR = path.join(ROOT, 'tracks');
const CATALOG_YAML = path.join(ROOT, 'catalog.yaml');

let debounceTimer = null;
let syncing = false;
let pending = false;

const runSync = () =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, [SYNC_SCRIPT], { cwd: ROOT, stdio: 'inherit' });
    child.on('close', () => resolve());
  });

const scheduleSync = (reason) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    if (syncing) {
      pending = true;
      return;
    }
    syncing = true;
    console.log(`[watch-sync] ${reason}`);
    await runSync();
    syncing = false;
    if (pending) {
      pending = false;
      scheduleSync('retry after pending changes');
    }
  }, 400);
};

const shouldWatch = (filename) => {
  const normalized = filename.replace(/\\/g, '/');
  if (normalized.endsWith('schedule.md')) return false;
  return normalized.endsWith('.md') || normalized.endsWith('.yaml') || normalized.endsWith('.html');
};

const watchDir = (dir) => {
  fs.watch(dir, { recursive: true }, (_event, filename) => {
    if (!filename || !shouldWatch(filename)) return;
    scheduleSync(`tracks change: ${filename}`);
  });
};

console.log('[watch-sync] watching tracks/ and catalog.yaml …');
runSync().then(() => {
  watchDir(TRACKS_DIR);
  fs.watch(CATALOG_YAML, () => scheduleSync('catalog.yaml changed'));
});
