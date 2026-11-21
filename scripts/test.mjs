import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const data = JSON.parse(await readFile('dist/data.json', 'utf8'));
assert.equal(data.snapshots.length, 4);
assert.match(data.snapshots[0].html, /Add to cart/);
assert.match(data.snapshots[3].html, /Checkout soon/);
assert.match(data.comparisons['2-3'].patch, /Checkout soon/);
const help = execFileSync('node', ['node_modules/commitflix/bin/commitflix.js', '--help'], { encoding: 'utf8' });
assert.match(help, /Press play on any commit/);
console.log('Installed npm package generated all four snapshots, comparison patch, and CLI help.');
