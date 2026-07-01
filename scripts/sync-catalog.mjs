import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TRACKS_DIR = path.join(ROOT, 'tracks');
const CATALOG_YAML = path.join(ROOT, 'catalog.yaml');
const OUT_DIR = path.join(ROOT, 'playground', 'vue-playground', 'src', 'generated');
const OUT_FILE = path.join(OUT_DIR, 'catalog.json');

const readYaml = (filePath) => parse(fs.readFileSync(filePath, 'utf8'));

const listNoteFiles = (trackDir) => {
  const notesDir = path.join(trackDir, 'notes');
  if (!fs.existsSync(notesDir)) return [];
  return fs.readdirSync(notesDir)
    .filter((name) => name.endsWith('.md') || name.endsWith('.html'))
    .map((name) => ({ name, path: `notes/${name}` }));
};

const listUnits = (trackDir) => {
  const unitsDir = path.join(trackDir, 'units');
  if (!fs.existsSync(unitsDir)) return [];
  return fs.readdirSync(unitsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({
      id: d.name,
      path: `units/${d.name}`,
      hasReview: fs.existsSync(path.join(unitsDir, d.name, 'review.md')),
    }));
};

const buildStats = (tracks) => {
  const byDepth = {};
  const byCategory = {};
  const byStatus = {};
  tracks.forEach((track) => {
    byDepth[track.depth] = (byDepth[track.depth] || 0) + 1;
    byCategory[track.category] = (byCategory[track.category] || 0) + 1;
    byStatus[track.status] = (byStatus[track.status] || 0) + 1;
  });
  return { total: tracks.length, byDepth, byCategory, byStatus };
};

const getReviewReminders = (tracks, withinDays = 7) => {
  const now = new Date();
  const limit = new Date(now);
  limit.setDate(limit.getDate() + withinDays);
  return tracks
    .filter((track) => track.next_review)
    .map((track) => ({ ...track, nextReviewDate: new Date(track.next_review) }))
    .filter((track) => track.nextReviewDate <= limit)
    .sort((a, b) => a.nextReviewDate - b.nextReviewDate)
    .map(({ nextReviewDate, ...track }) => ({
      ...track,
      overdue: nextReviewDate < now,
    }));
};

const main = () => {
  const catalogBase = fs.existsSync(CATALOG_YAML) ? readYaml(CATALOG_YAML) : { version: 1, tracks: [] };
  const trackIds = catalogBase.tracks || [];
  const tracks = trackIds.map((id) => {
    const trackDir = path.join(TRACKS_DIR, id);
    const metaPath = path.join(trackDir, 'meta.yaml');
    if (!fs.existsSync(metaPath)) return null;
    const meta = readYaml(metaPath);
    const noteFiles = listNoteFiles(trackDir);
    const units = listUnits(trackDir);
    return { ...meta, id: meta.id || id, noteFiles, units, unitCount: units.length, noteCount: noteFiles.length };
  }).filter(Boolean);

  const output = {
    version: catalogBase.version || 1,
    updated: new Date().toISOString().slice(0, 10),
    tags_index: catalogBase.tags_index || {},
    depth_index: catalogBase.depth_index || {},
    category_index: catalogBase.category_index || {},
    stats: buildStats(tracks),
    reviewReminders: getReviewReminders(tracks),
    tracks,
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2) + '\n', 'utf8');
  console.log(`[sync-catalog] wrote ${tracks.length} tracks`);
};

main();
