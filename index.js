const checkBtn = document.getElementById('check-btn');
const proxyInput = document.getElementById('proxy-input');
const inputSection = document.getElementById('input-section');
const checkSection = document.getElementById('check-section');
const doneSection = document.getElementById('done-section');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const resultList = document.getElementById('result-list');
const statWorking = document.getElementById('stat-working');
const statDead = document.getElementById('stat-dead');
const output = document.getElementById('output');
const copyBtn = document.getElementById('copy-btn');
const resetBtn = document.getElementById('reset-btn');

let selectedType = 'http';

document.querySelectorAll('.toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.toggle').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedType = btn.dataset.type;
  });
});

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
];

checkBtn.addEventListener('click', startCheck);
resetBtn.addEventListener('click', resetUI);
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(output.value);
  copyBtn.textContent = 'Copied!';
  setTimeout(() => copyBtn.textContent = 'Copy All', 1500);
});

async function startCheck() {
  const lines = proxyInput.value
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && l.includes(':'));

  if (!lines.length) {
    alert('No proxies found. Format: ip:port');
    return;
  }

  inputSection.classList.add('hidden');
  checkSection.classList.remove('hidden');
  doneSection.classList.add('hidden');
  resultList.innerHTML = '';

  let working = 0;
  let dead = 0;
  const workingList = [];

  for (let i = 0; i < lines.length; i++) {
    const proxy = lines[i];
    const pct = ((i + 1) / lines.length) * 100;
    progressFill.style.width = pct + '%';
    progressText.textContent = `${i + 1} / ${lines.length}`;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const item = addResultItem(proxy, 'checking', 'Checking...');

    try {
      const result = await checkProxy(proxy, selectedType, 1000);
      if (result.ok) {
        working++;
        workingList.push(proxy);
        updateResultItem(item, 'working', `Working (${result.time}ms)`);
      } else {
        dead++;
        updateResultItem(item, 'dead', result.error || 'Timeout / Unreachable');
      }
    } catch {
      dead++;
      updateResultItem(item, 'dead', 'Error');
    }

    statWorking.textContent = `${working} Working`;
    statDead.textContent = `${dead} Dead`;
  }

  output.value = workingList.join('\n');
  checkSection.classList.add('hidden');
  doneSection.classList.remove('hidden');
}

function resetUI() {
  inputSection.classList.remove('hidden');
  checkSection.classList.add('hidden');
  doneSection.classList.add('hidden');
  progressFill.style.width = '0%';
  progressText.textContent = '0 / 0';
  resultList.innerHTML = '';
  statWorking.textContent = '0 Working';
  statDead.textContent = '0 Dead';
}

async function checkProxy(proxy, type, timeout) {
  const testUrl = type === 'https'
    ? 'https://httpbin.org/ip'
    : 'http://httpbin.org/ip';

  for (const corsProxy of CORS_PROXIES) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      const start = performance.now();
      const resp = await fetch(corsProxy + encodeURIComponent(testUrl), {
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (resp.ok) {
        const time = Math.round(performance.now() - start);
        return { ok: true, time };
      }
    } catch (e) {
      if (e.name === 'AbortError') {
        return { ok: false, error: 'Timeout' };
      }
    }
  }

  return { ok: false, error: 'Unreachable' };
}

function addResultItem(proxy, status, text) {
  const div = document.createElement('div');
  div.className = `result-item ${status}`;
  div.innerHTML = `
    <span>${escapeHtml(proxy)}</span>
    <span class="ping">${escapeHtml(text)}</span>
  `;
  resultList.prepend(div);
  return div;
}

function updateResultItem(el, status, text) {
  el.className = `result-item ${status}`;
  el.querySelector('.ping').textContent = text;
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
