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
const SCHEDULES_DIR = path.join(OUT_DIR, 'schedules');
const NOTES_DIR = path.join(OUT_DIR, 'notes');

const readYaml = (filePath) => parse(fs.readFileSync(filePath, 'utf8'));

const loadSchedule = (trackDir, trackId) => {
  const schedulePath = path.join(trackDir, 'schedule.yaml');
  if (!fs.existsSync(schedulePath)) return null;
  const data = readYaml(schedulePath);
  return { ...data, trackId };
};

const writeScheduleJson = (trackId, schedule) => {
  fs.mkdirSync(SCHEDULES_DIR, { recursive: true });
  const outPath = path.join(SCHEDULES_DIR, `${trackId}.json`);
  fs.writeFileSync(outPath, JSON.stringify(schedule, null, 2) + '\n', 'utf8');
  return outPath;
};

const writeScheduleMarkdown = (trackDir, schedule) => {
  const lines = [
    `# ${schedule.title}`,
    '',
    `> ${schedule.subtitle ?? ''} · ${schedule.hoursPerDay ?? ''}`,
    '',
    '**平台打开（推荐）**：Dashboard → Flowable 轨道 → [21 天学习计划](/tracks/flowable/schedule)',
    '',
    '---',
    '',
  ];

  for (const phase of schedule.phases ?? []) {
    lines.push(`## ${phase.name}（Day ${phase.dayRange[0]}–${phase.dayRange[1]}）`);
    if (phase.goal) lines.push(`> ${phase.goal}`);
    lines.push('');
  }

  lines.push('---', '', '## 每日清单', '');

  for (const day of schedule.days ?? []) {
    const phase = (schedule.phases ?? []).find((p) => p.id === day.phase);
    lines.push(`### Day ${day.day} · ${day.title}`);
    lines.push(`- **阶段**：${phase?.name ?? day.phase}`);
    lines.push(`- **时长**：${day.duration}`);
    if (day.objectives?.length) {
      lines.push('- **目标**：');
      day.objectives.forEach((o) => lines.push(`  - ${o}`));
    }
    if (day.resources?.length) {
      lines.push('- **资源**：');
      day.resources.forEach((r) => {
        const req = r.required ? '【必读】' : '';
        if (r.url.startsWith('http')) lines.push(`  - ${req}[${r.title}](${r.url})`);
        else lines.push(`  - ${req}${r.title} \`${r.url}\``);
      });
    }
    if (day.tasks?.length) {
      lines.push('- **任务**：');
      day.tasks.forEach((t) => lines.push(`  - [ ] ${t.text}`));
    }
    const questions = day.selfTest?.questions ?? [];
    const practical = day.selfTest?.practical ?? [];
    if (questions.length || practical.length) {
      lines.push('- **自测**：');
      questions.forEach((q) => lines.push(`  - [ ] ${q.text}`));
      practical.forEach((p) => lines.push(`  - [ ] （实操）${p.text}`));
    }
    lines.push('');
  }

  lines.push(
    '---',
    '',
    '## 定制化说明',
    '',
    '在平台学习计划页中：',
    '',
    '1. 自测项可标记 **掌握 / 不熟 / 跳过**',
    '2. 标记「不熟」的项会在 **后续聚焦日** 自动生成「针对性巩固」区块',
    '3. 打卡后可在「明日预告」看到将巩固的内容',
    '4. 进度保存在浏览器 localStorage，可随时跳天学习',
    '',
  );

  const mdPath = path.join(trackDir, 'schedule.md');
  fs.writeFileSync(mdPath, lines.join('\n'), 'utf8');
};

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

const noteSlug = (filename) => filename.replace(/\.(md|html)$/, '');

const noteTitle = (meta, notePath, filename) => {
  const indexed = (meta.notes ?? []).find((n) => n.path === notePath);
  if (indexed?.title) return indexed.title;
  return filename.replace(/\.md$/, '').replace(/-/g, ' ');
};

const isNotePublic = (meta, notePath) => {
  const indexed = (meta.notes ?? []).find((n) => n.path === notePath);
  if (!indexed) return true;
  return indexed.platform !== false;
};

const syncTrackNotes = (trackDir, trackId, meta) => {
  const noteFiles = listNoteFiles(trackDir).filter(({ path: notePath }) => isNotePublic(meta, notePath));
  if (!noteFiles.length) return null;

  const notes = noteFiles.map(({ name, path: notePath }) => {
    const absPath = path.join(trackDir, notePath);
    const stat = fs.statSync(absPath);
    return {
      slug: noteSlug(name),
      name,
      path: notePath,
      title: noteTitle(meta, notePath, name),
      content: fs.readFileSync(absPath, 'utf8'),
      updated: stat.mtime.toISOString().slice(0, 10),
    };
  });

  fs.mkdirSync(NOTES_DIR, { recursive: true });
  const payload = {
    trackId,
    updated: new Date().toISOString().slice(0, 10),
    notes,
  };
  const outPath = path.join(NOTES_DIR, `${trackId}.json`);
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  return notes.map(({ slug, name, path: notePath, title, updated }) => ({
    slug,
    name,
    path: notePath,
    title,
    updated,
    route: `/tracks/${trackId}/notes/${slug}`,
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
    const syncedNotes = syncTrackNotes(trackDir, id, meta);
    const units = listUnits(trackDir);
    const schedule = loadSchedule(trackDir, id);
    let scheduleSummary = null;
    if (schedule) {
      writeScheduleJson(id, schedule);
      writeScheduleMarkdown(trackDir, schedule);
      scheduleSummary = {
        route: `/tracks/${id}/schedule`,
        title: schedule.title,
        totalDays: schedule.totalDays,
        subtitle: schedule.subtitle,
      };
    }
    return {
      ...meta,
      id: meta.id || id,
      noteFiles,
      syncedNotes,
      units,
      unitCount: units.length,
      noteCount: syncedNotes?.length ?? noteFiles.length,
      schedule: scheduleSummary,
    };
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
  const scheduleCount = tracks.filter((t) => t.schedule).length;
  const noteCount = tracks.filter((t) => t.syncedNotes?.length).length;
  console.log(`[sync-catalog] wrote ${tracks.length} tracks, ${scheduleCount} schedules, ${noteCount} note bundles`);
};

main();
