// Refreshes the committed CV assets from the private CV repo.
//
//   npm run sync:cv                      # looks in ../resume/cv
//   CV_DIR=~/path/to/cv npm run sync:cv
//
// public/cv.pdf and public/logos/ are committed, so the site builds anywhere
// without this; run it after rebuilding cv.pdf from cv.tex.
import { cp, mkdir, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const cvDir = resolve(here, '..', process.env.CV_DIR ?? '../resume/cv');

const jobs = [
  { from: resolve(cvDir, 'cv.pdf'), to: resolve(here, '../public/cv.pdf') },
  { from: resolve(cvDir, 'logos'), to: resolve(here, '../public/logos') },
];

let copied = 0;
for (const { from, to } of jobs) {
  try {
    await access(from);
  } catch {
    console.warn(`[sync-cv] not found, skipped: ${from}`);
    continue;
  }
  await mkdir(dirname(to), { recursive: true });
  await cp(from, to, { recursive: true });
  console.log(`[sync-cv] ${from} -> ${to}`);
  copied++;
}
if (!copied) {
  console.warn(`[sync-cv] nothing copied. Set CV_DIR to the CV repo's cv/ directory.`);
  process.exitCode = 1;
}
