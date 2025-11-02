function simulateThreePrisoners(numSimulations) {
  let aSurvives = 0;
  let cSurvives = 0;
  let totalRelevant = 0;

  for (let i = 0; i < numSimulations; i++) {
    // Случайным образом выбираем, кто будет помилован (0=A, 1=B, 2=C)
    const pardoned = Math.floor(Math.random() * 3);
    let guardNames = -1;

    // Стражник называет одного из тех, кого казнят
    if (pardoned === 0) {
      // A помилован, стражник может назвать B или C случайным образом
      guardNames = Math.random() < 0.5 ? 1 : 2;
    } 
    else if (pardoned === 1) {
      // B помилован, стражник должен назвать C
      guardNames = 2;
    } 
    else {
      // C помилован, стражник должен назвать B
      guardNames = 1;
    }

    // Мы рассматриваем только случаи, когда стражник назвал B
    if (guardNames === 1) {
      totalRelevant++;
      
      if (pardoned === 0) {
        aSurvives++; // A помилован, B назван
      } 
      else if (pardoned === 2) {
        cSurvives++; // C помилован, B назван
      }
    }
  }

  const probA = totalRelevant > 0 ? (aSurvives / totalRelevant) * 100 : 0;
  const probC = totalRelevant > 0 ? (cSurvives / totalRelevant) * 100 : 0;

  return {
    probA: probA.toFixed(2),
    probC: probC.toFixed(2),
    probB: '0.00',
    totalSimulations: numSimulations,
    totalRelevant,
    aSurvives,
    cSurvives
  };
}

function updateResults(results) {
    const resultsSection = document.getElementById('results-section');
    if (!resultsSection.innerHTML.trim()) {
        resultsSection.innerHTML = `
            <h2 class="results-title">Результаты симуляции</h2>
            <p class="results-subtitle">На основе случаев, когда стражник назвал узника B</p>

            <div class="results-stats">
                <div class="stat-item">
                    <span class="stat-label">Всего симуляций:</span>
                    <span class="stat-value" id="stat-total">0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Случаев, когда назван B:</span>
                    <span class="stat-value" id="stat-b-named">0</span>
                </div>
            </div>

            <div class="results-grid">
                <div class="result-card">
                    <div class="result-label">Узник A выживает</div>
                    <div class="result-value" id="prob-a-value">0.00%</div>
                    <div class="result-count" id="count-a">Выживаний: 0</div>
                </div>
                <div class="result-card">
                    <div class="result-label">Узник C выживает</div>
                    <div class="result-value" id="prob-c-value">0.00%</div>
                    <div class="result-count" id="count-c">Выживаний: 0</div>
                </div>
            </div>

            <div class="progress-container">
                <div class="result-label">Вероятность выживания узника A</div>
                <div class="progress-bar">
                    <div class="progress-bar-fill" id="prob-a-bar" style="width: 0%"></div>
                </div>
            </div>

            <div class="progress-container">
                <div class="result-label">Вероятность выживания узника C</div>
                <div class="progress-bar">
                    <div class="progress-bar-fill" id="prob-c-bar" style="width: 0%"></div>
                </div>
            </div>

            <div class="theory-explanation">
                <h3>Объяснение парадокса</h3>
                <p>Когда стражник называет узника B, это не меняет шансы узника A (остается 1/3), но шансы узника C возрастают до 2/3.</p>
                <p>Это происходит потому, что:</p>
                <ul>
                    <li>Если помилован A (вероятность 1/3), стражник случайно выбирает между B и C, и в половине таких случаев назовет B.</li>
                    <li>Если помилован C (вероятность 1/3), стражник всегда назовет B.</li>
                    <li>Если помилован B (вероятность 1/3), стражник назвал бы C, поэтому этот случай не учитывается.</li>
                </ul>
                <p>Таким образом, в 2/3 случаев, когда стражник называет B, помилован C.</p>
            </div>
        `;
    }

    const elements = {
        'stat-total': results.totalSimulations.toLocaleString(),
        'stat-b-named': results.totalRelevant.toLocaleString(),
        'prob-a-value': results.probA + '%',
        'count-a': `Выживаний: ${results.aSurvives.toLocaleString()}`,
        'prob-c-value': results.probC + '%',
        'count-c': `Выживаний: ${results.cSurvives.toLocaleString()}`
    };

    Object.entries(elements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    });

    const probABar = document.getElementById('prob-a-bar');
    const probCBar = document.getElementById('prob-c-bar');
    if (probABar) probABar.style.width = Math.min(100, parseFloat(results.probA)) + '%';
    if (probCBar) probCBar.style.width = Math.min(100, parseFloat(results.probC)) + '%';

    if (resultsSection) {
        resultsSection.classList.remove('hidden');
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

function runSimulation() {
  if (window.isSimulating) return;
  
  const input = document.getElementById('sim-input');
  let numSims = parseInt(input.value);

  if (isNaN(numSims) || numSims < 1000) {
    showNotification('Введите корректное число (минимум 1000)', 'error');
    input.value = '10000';
    return;
  }

  if (numSims > 1000000) {
    showNotification('Максимум 1,000,000 симуляций', 'warning');
    numSims = 1000000;
    input.value = numSims;
  }

  const loadingOverlay = document.getElementById('loading-overlay');
  const btn = document.getElementById('btn-simulate');
  window.isSimulating = true;
  btn.disabled = true;
  
  if (loadingOverlay) loadingOverlay.classList.remove('hidden');

  // Используем setTimeout чтобы дать браузеру обновить UI перед началом тяжелых вычислений!
  setTimeout(() => {
    try {
      const results = simulateThreePrisoners(numSims);
      updateResults(results);
      showNotification(`Симуляция завершена! Проанализировано ${results.totalRelevant.toLocaleString()} релевантных случаев`, 'success');
    } 
    catch (error) {
      console.error('Simulation error:', error);
      showNotification('Ошибка при выполнении симуляции', 'error');
    } 
    finally {
      if (loadingOverlay) loadingOverlay.classList.add('hidden');
      btn.disabled = false;
      window.isSimulating = false;
    }
  }, 100);
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  if (type === 'error' || type === 'danger') {
    notification.style.background = 'linear-gradient(135deg, #BC430D 0%, #F09410 100%)';
  } 
  else if (type === 'success') {
    notification.style.background = 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)';
  } 
  else if (type === 'warning') {
    notification.style.background = 'linear-gradient(135deg, #F39C12 0%, #E67E22 100%)';
  } 
  else {
    notification.style.background = 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)';
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

