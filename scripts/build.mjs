import { mkdir, readFile, rm, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { createDemo } from 'commitflix/demo';
import { git, history, diff } from 'commitflix';

const root = await createDemo();
try {
  const commits = (await history(root)).reverse();
  const snapshots = await Promise.all(commits.map(async (commit, index) => ({
    id: commit.id,
    short: commit.short,
    message: commit.message,
    number: index + 1,
    html: await git(root, ['show', `${commit.id}:index.html`])
  })));
  const comparisons = {};
  for (let a = 0; a < snapshots.length; a++) {
    for (let b = 0; b < snapshots.length; b++) {
      if (a === b) continue;
      const result = await diff(root, snapshots[a].id, snapshots[b].id);
      comparisons[`${a}-${b}`] = { stat: result.stat, patch: result.patch };
    }
  }
  await mkdir('dist', { recursive: true });
  await Promise.all([
    copyFile('site/index.html', 'dist/index.html'),
    copyFile('site/style.css', 'dist/style.css'),
    copyFile('site/app.js', 'dist/app.js'),
    writeFile('dist/data.json', JSON.stringify({ snapshots, comparisons }, null, 2))
  ]);
  console.log(`Built live walkthrough from ${snapshots.length} actual CommitFlix demo commits.`);
} finally {
  await rm(root, { recursive: true, force: true });
}
