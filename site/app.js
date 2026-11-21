const $ = selector => document.querySelector(selector);
const timeline = $('#timeline');
const preview = $('#preview');
const fromSelect = $('#from-version');
const toSelect = $('#to-version');
let data;
let active = 0;

function renderSelection() {
  const snapshot = data.snapshots[active];
  preview.srcdoc = snapshot.html;
  $('#active-title').textContent = snapshot.message;
  $('#active-sha').textContent = snapshot.short;
  timeline.querySelectorAll('button').forEach((button, index) => {
    button.classList.toggle('active', index === active);
    button.setAttribute('aria-pressed', String(index === active));
  });
}

function selectCommit(index) {
  active = (index + data.snapshots.length) % data.snapshots.length;
  renderSelection();
}

function renderComparison() {
  const key = `${fromSelect.value}-${toSelect.value}`;
  const result = data.comparisons[key];
  $('#diff-output').textContent = result ? `${result.stat}\n\n${result.patch}` : 'Choose two different commits to see their Git patch.';
}

async function start() {
  const response = await fetch('/data.json');
  if (!response.ok) throw new Error(`Could not load demo data (${response.status}).`);
  data = await response.json();
  for (const [index, snapshot] of data.snapshots.entries()) {
    const button = document.createElement('button');
    button.className = 'commit-card';
    button.type = 'button';
    button.innerHTML = `<span class="num">COMMIT 0${snapshot.number}</span><strong></strong><small></small>`;
    button.querySelector('strong').textContent = snapshot.message;
    button.querySelector('small').textContent = snapshot.short;
    button.addEventListener('click', () => selectCommit(index));
    timeline.append(button);
    for (const select of [fromSelect, toSelect]) {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = `0${snapshot.number} · ${snapshot.message}`;
      select.append(option);
    }
  }
  toSelect.value = String(data.snapshots.length - 1);
  fromSelect.addEventListener('change', renderComparison);
  toSelect.addEventListener('change', renderComparison);
  $('#previous').addEventListener('click', () => selectCommit(active - 1));
  $('#next').addEventListener('click', () => selectCommit(active + 1));
  selectCommit(0);
  renderComparison();
}

$('#copy-command').addEventListener('click', async event => {
  try {
    await navigator.clipboard.writeText('npx commitflix demo');
    event.currentTarget.textContent = 'Copied!';
    setTimeout(() => { event.currentTarget.textContent = 'Copy'; }, 1800);
  } catch { event.currentTarget.textContent = 'Copy failed'; }
});

start().catch(error => {
  $('#active-title').textContent = 'Demo could not load';
  $('#diff-output').textContent = error.message;
});
