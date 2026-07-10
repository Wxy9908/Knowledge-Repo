import { spawn } from 'node:child_process';
import path from 'node:path';
import type { Plugin, ViteDevServer } from 'vite';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const SYNC_SCRIPT = path.join(REPO_ROOT, 'scripts/sync-catalog.mjs');
const WATCH_TARGETS = [
  path.join(REPO_ROOT, 'tracks'),
  path.join(REPO_ROOT, 'catalog.yaml'),
];

const shouldSync = (file: string) =>
  file.includes(`${path.sep}tracks${path.sep}`) || file.endsWith(`${path.sep}catalog.yaml`);

export function syncCatalogPlugin(): Plugin {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let syncing = false;
  let pending = false;
  let devServer: ViteDevServer | null = null;

  const runSync = () =>
    new Promise<void>((resolve) => {
      const child = spawn(process.execPath, [SYNC_SCRIPT], {
        cwd: REPO_ROOT,
        stdio: 'inherit',
      });
      child.on('close', () => resolve());
    });

  const scheduleSync = (reason: string) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      if (syncing) {
        pending = true;
        return;
      }
      syncing = true;
      console.log(`[sync-catalog] ${reason}`);
      await runSync();
      devServer?.ws.send({ type: 'full-reload' });
      syncing = false;
      if (pending) {
        pending = false;
        scheduleSync('retry after pending changes');
      }
    }, 400);
  };

  return {
    name: 'sync-catalog',
    async buildStart() {
      console.log('[sync-catalog] initial sync');
      await runSync();
    },
    configureServer(server) {
      devServer = server;
      WATCH_TARGETS.forEach((target) => server.watcher.add(target));

      const onFsEvent = (file: string) => {
        if (shouldSync(file)) scheduleSync(`sync after change: ${path.relative(REPO_ROOT, file)}`);
      };

      server.watcher.on('change', onFsEvent);
      server.watcher.on('add', onFsEvent);
      server.watcher.on('unlink', onFsEvent);
    },
  };
}
