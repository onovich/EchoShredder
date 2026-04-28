const state = {
  phase: 'input',
  text: '',
  timerId: null,
};

const appShell = document.querySelector('.app-shell');
const input = document.getElementById('inputText');
const shredButton = document.getElementById('shredButton');
const resetButton = document.getElementById('resetButton');
const resultPanel = document.getElementById('resultPanel');
const echoText = document.getElementById('echoText');
const charCount = document.getElementById('charCount');
const particles = document.getElementById('particles');

const keywordBuckets = [
  {
    match: ['累', '疲惫', '加班', '困', '熬夜'],
    echoes: ['倦意已裁断', '疲态已下线', '今晚只留静电', '耗损到此为止'],
  },
  {
    match: ['焦虑', '不安', '慌', '压力', '紧张'],
    echoes: ['噪声已熔断', '心跳正在归零', '焦灼已被格式化', '系统恢复静默'],
  },
  {
    match: ['前任', '分手', '失恋', '喜欢', '关系'],
    echoes: ['旧爱已碎档', '回忆停止自启', '旧频段已断开', '你已撤出旧梦'],
  },
  {
    match: ['工作', '老板', '同事', '会议', 'KPI'],
    echoes: ['工位噪点已清', '无效指令已删', '会议残响已停', '今日只保留你'],
  },
  {
    match: ['钱', '贫穷', '账单', '房租', '消费'],
    echoes: ['窘迫已被切段', '账单声浪已静', '焦灼不再计费', '赤字情绪已清'],
  },
];

const fallbackEchoes = [
  '记录已抹除',
  '旧念到此熄屏',
  '噪点已被回收',
  '残响停止续写',
  '你正重新上电',
  '烦恼已离开缓存',
];

function pickEcho(text) {
  const normalized = text.trim().toLowerCase();

  for (const bucket of keywordBuckets) {
    if (bucket.match.some((keyword) => normalized.includes(keyword))) {
      return bucket.echoes[hashText(normalized) % bucket.echoes.length];
    }
  }

  return fallbackEchoes[hashText(normalized) % fallbackEchoes.length];
}

function hashText(text) {
  let hash = 0;
  for (const char of text) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

function setPhase(phase) {
  state.phase = phase;
  appShell.dataset.phase = phase;
  resultPanel.classList.toggle('hidden', phase !== 'result');
  shredButton.classList.toggle('hidden', phase !== 'input');
  resetButton.classList.toggle('hidden', phase !== 'result');
  input.readOnly = phase !== 'input';
}

function renderCount() {
  const length = state.text.length;
  charCount.textContent = `${length} / 220`;
  shredButton.disabled = !state.text.trim() || state.phase !== 'input';
}

function burstParticles() {
  particles.innerHTML = '';
  for (let index = 0; index < 18; index += 1) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.style.setProperty('--x', `${(Math.random() - 0.5) * 220}px`);
    particle.style.setProperty('--y', `${Math.random() * 90 + 30}px`);
    particle.style.setProperty('--delay', `${index * 18}ms`);
    particles.appendChild(particle);
  }
}

function startShredding() {
  if (!state.text.trim() || state.phase !== 'input') {
    return;
  }

  setPhase('shredding');
  burstParticles();

  window.clearTimeout(state.timerId);
  state.timerId = window.setTimeout(() => {
    echoText.textContent = pickEcho(state.text);
    setPhase('result');
  }, 900);
}

function reset() {
  state.text = '';
  input.value = '';
  echoText.textContent = '记录已抹除';
  particles.innerHTML = '';
  window.clearTimeout(state.timerId);
  setPhase('input');
  renderCount();
  input.focus();
}

input.addEventListener('input', (event) => {
  state.text = event.target.value;
  renderCount();
});

input.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    startShredding();
  }
});

shredButton.addEventListener('click', startShredding);
resetButton.addEventListener('click', reset);

setPhase('input');
renderCount();