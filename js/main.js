window.currentTheme = 'fire';
window.isSimulating = false;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    
    if (typeof generateSparks === 'function') {
        console.log('Generating sparks...');
        generateSparks();
    } 
    else {
        console.error('generateSparks function not found!');
    }
    
    updateButtonHandlers('fire');
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const theme = btn.getAttribute('data-theme');
            console.log('Switching to theme:', theme);
            switchTheme(theme);
        });
    });

    initializeUI();
});

function initializeUI() {
    console.log('Initializing UI...');
    
    if (!document.getElementById('loading-overlay')) {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'hidden';
        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-core"></div>
                </div>
                <div class="loading-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="loading-details">
                        <span class="loading-text">Запуск симуляции...</span>
                        <span class="loading-percentage">0%</span>
                    </div>
                </div>
                <div class="loading-stats">
                    <div class="stat-item">
                        <span class="stat-label">Выполнено симуляций:</span>
                        <span class="stat-value" id="loading-counter">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Релевантных случаев:</span>
                        <span class="stat-value" id="loading-relevant">0</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(loadingOverlay);
    }
}

function showLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        const progressFill = overlay.querySelector('.progress-fill');
        const percentage = overlay.querySelector('.loading-percentage');
        const counter = overlay.querySelector('#loading-counter');
        const relevant = overlay.querySelector('#loading-relevant');
        const text = overlay.querySelector('.loading-text');
        
        if (progressFill) progressFill.style.width = '0%';
        if (percentage) percentage.textContent = '0%';
        if (counter) counter.textContent = '0';
        if (relevant) relevant.textContent = '0';
        if (text) text.textContent = 'Подготовка симуляции...';
        
        overlay.classList.remove('hidden');
        
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);
    }
}

function updateLoadingProgress(progress, current, total, relevant) {
    const overlay = document.getElementById('loading-overlay');
    if (!overlay) return;
    
    const progressFill = overlay.querySelector('.progress-fill');
    const percentage = overlay.querySelector('.loading-percentage');
    const counter = overlay.querySelector('#loading-counter');
    const relevantEl = overlay.querySelector('#loading-relevant');
    const text = overlay.querySelector('.loading-text');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
        progressFill.style.transition = 'width 0.3s ease';
    }
    if (percentage) percentage.textContent = `${Math.round(progress)}%`;
    if (counter) counter.textContent = current.toLocaleString();
    if (relevantEl) relevantEl.textContent = relevant.toLocaleString();
    
    if (text) {
        if (progress < 30) {
            text.textContent = 'Запуск симуляции...';
        } 
        else if (progress < 60) {
            text.textContent = 'Анализ вероятностей...';
        } 
        else if (progress < 90) {
            text.textContent = 'Обработка результатов...';
        } 
        else {
            text.textContent = 'Завершение...';
        }
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 500);
    }
}

function switchTheme(theme) {
    if (window.currentTheme === theme) return;
    
    console.log('Switching theme from', window.currentTheme, 'to', theme);
    window.currentTheme = theme;
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
    
    const themes = ['fire', 'water', 'earth', 'air'];
    themes.forEach(t => {
        const elements = document.querySelectorAll(`.theme-${t}`);
        const isActive = t === theme;
        
        elements.forEach(el => {
            el.style.display = isActive ? '' : 'none';
        });
    });
    
    document.body.className = `body-${theme}`;
    
    document.getElementById('spark-container').style.display = theme === 'fire' ? '' : 'none';
    document.getElementById('bubble-container').style.display = theme === 'water' ? '' : 'none';
    document.getElementById('particle-container').style.display = theme === 'earth' ? '' : 'none';
    document.getElementById('air-particle-container').style.display = theme === 'air' ? '' : 'none';
    
    if (theme === 'fire' && typeof generateSparks === 'function') {
        console.log('Reinitializing fire effects...');
        setTimeout(() => generateSparks(), 100);
    } 
    else if (theme === 'water' && typeof generateBubbles === 'function') {
        console.log('Reinitializing water effects...');
        setTimeout(() => generateBubbles(), 100);
    } 
    else if (theme === 'earth' && typeof generateParticles === 'function') {
        console.log('Reinitializing earth effects...');
        setTimeout(() => generateParticles(), 100);
    } 
    else if (theme === 'air' && typeof generateAirParticles === 'function') {
        console.log('Reinitializing air effects...');
        setTimeout(() => generateAirParticles(), 100);
    }
    updateButtonHandlers(theme);
}

function updateButtonHandlers(theme) {
    console.log('Updating button handlers for theme:', theme);
    
    replaceButtonWithNewHandlers('btn-simulate');
    replaceButtonWithNewHandlers('btn-execute-fire');
    replaceButtonWithNewHandlers('btn-simulate-water');
    replaceButtonWithNewHandlers('btn-execute-water');
    replaceButtonWithNewHandlers('btn-simulate-earth'); 
    replaceButtonWithNewHandlers('btn-execute-earth'); 
    replaceButtonWithNewHandlers('btn-simulate-air');
    replaceButtonWithNewHandlers('btn-execute-air');
    
    if (theme === 'fire') {
        const simBtn = document.getElementById('btn-simulate');
        const executeBtn = document.getElementById('btn-execute-fire');
        
        if (simBtn) simBtn.addEventListener('click', runSimulation);
        if (executeBtn) executeBtn.addEventListener('click', executeNow);
    } 
    else if (theme === 'water') {
        const simBtn = document.getElementById('btn-simulate-water');
        const executeBtn = document.getElementById('btn-execute-water');
        
        if (simBtn) simBtn.addEventListener('click', runSimulation);
        if (executeBtn) executeBtn.addEventListener('click', executeNow);
    } 
    else if (theme === 'earth') {
        const simBtn = document.getElementById('btn-simulate-earth');
        const executeBtn = document.getElementById('btn-execute-earth');
        
        if (simBtn) simBtn.addEventListener('click', runSimulation);
        if (executeBtn) executeBtn.addEventListener('click', executeNow);
    } 
    else if (theme === 'air') {
        const simBtn = document.getElementById('btn-simulate-air');
        const executeBtn = document.getElementById('btn-execute-air');
        
        if (simBtn) simBtn.addEventListener('click', runSimulation);
        if (executeBtn) executeBtn.addEventListener('click', executeNow);
    }
}

function replaceButtonWithNewHandlers(buttonId) {
    const oldButton = document.getElementById(buttonId);
    if (oldButton) {
        const newButton = oldButton.cloneNode(true);
        oldButton.parentNode.replaceChild(newButton, oldButton);
    }
}

function executeNow() {
    console.log('Execution started for theme:', window.currentTheme);
    
    if (window.currentTheme === 'fire' && typeof executeFire === 'function') {
        executeFire();
    } 
    else if (window.currentTheme === 'water' && typeof executeWater === 'function') {
        executeWater();
    } 
    else if (window.currentTheme === 'earth' && typeof executeEarth === 'function') {
        executeEarth();
    } 
    else if (window.currentTheme === 'air' && typeof executeAir === 'function') {
        executeAir();
    }
}

function runSimulation() {
    if (window.isSimulating) {
        console.log('Simulation already running');
        return;
    }
    
    console.log('Starting simulation...');
    
    let input;
    if (window.currentTheme === 'fire') {
        input = document.getElementById('sim-input');
    } 
    else if (window.currentTheme === 'water') {
        input = document.getElementById('sim-input-water');
    } 
    else if (window.currentTheme === 'earth') {
        input = document.getElementById('sim-input-earth');
    } 
    else if (window.currentTheme === 'air') {
        input = document.getElementById('sim-input-air');
    }
    
    if (!input) {
        console.error('Input element not found for theme:', window.currentTheme);
        showNotification('Ошибка: элемент ввода не найден', 'error');
        return;
    }
    
    let numSims = parseInt(input.value);
    console.log('Number of simulations:', numSims);

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

    const btn = window.currentTheme === 'fire' 
        ? document.getElementById('btn-simulate')
        : document.getElementById('btn-simulate-water');
    
    window.isSimulating = true;
    if (btn) btn.disabled = true;
    
    showLoadingOverlay();
    console.log('Loading overlay shown');

    simulateWithProgress(numSims);
}

function simulateWithProgress(totalSimulations) {
    let current = 0;
    let aSurvives = 0;
    let cSurvives = 0;
    let totalRelevant = 0;
    
    const updateInterval = Math.max(100, Math.floor(totalSimulations / 100)); 
    
    function simulateBatch() {
        const batchSize = Math.min(10000, totalSimulations - current);
        const end = current + batchSize;
        
        for (let i = current; i < end; i++) {
            const pardoned = Math.floor(Math.random() * 3);
            let guardNames = -1;

            if (pardoned === 0) {
                guardNames = Math.random() < 0.5 ? 1 : 2;
            } 
            else if (pardoned === 1) {
                guardNames = 2;
            } 
            else {
                guardNames = 1;
            }

            if (guardNames === 1) {
                totalRelevant++;
                if (pardoned === 0) {
                    aSurvives++;
                } 
                else if (pardoned === 2) {
                    cSurvives++;
                }
            }
            
            current++;
            
            if (current % updateInterval === 0 || current === totalSimulations) {
                const progress = (current / totalSimulations) * 100;
                updateLoadingProgress(progress, current, totalSimulations, totalRelevant);
            }
        }
        
        if (current < totalSimulations) {
            setTimeout(simulateBatch, 0);
        } 
        else {
            finishSimulation();
        }
    }
    
    function finishSimulation() {
        const probA = totalRelevant > 0 ? (aSurvives / totalRelevant) * 100 : 0;
        const probC = totalRelevant > 0 ? (cSurvives / totalRelevant) * 100 : 0;

        const results = {
            probA: probA.toFixed(2),
            probC: probC.toFixed(2),
            probB: '0.00',
            totalSimulations: totalSimulations,
            totalRelevant,
            aSurvives,
            cSurvives
        };
        
        console.log('Simulation results:', results);
        updateResults(results);
        
        setTimeout(() => {
            hideLoadingOverlay();
            
            const btn = window.currentTheme === 'fire' 
                ? document.getElementById('btn-simulate')
                : document.getElementById('btn-simulate-water');
                
            if (btn) btn.disabled = false;
            window.isSimulating = false;
            
            showNotification(`Симуляция завершена! Проанализировано ${results.totalRelevant.toLocaleString()} релевантных случаев`, 'success');
            console.log('Simulation finished');
        }, 500);
    }
    
    setTimeout(simulateBatch, 100);
}

function showNotification(message, type) {
    console.log('Showing notification:', message);
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        z-index: 10000;
        font-family: var(--font-family-mono);
        font-weight: bold;
        color: white;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
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
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function resetAll() {
    document.querySelectorAll('.prisoner-container').forEach(container => {
        container.classList.remove('executing', 'dead');
        container.style.filter = '';
        container.style.animation = '';
    });
    
    document.querySelectorAll('.head-main').forEach(head => {
        head.classList.remove('falling');
    });
    
    document.querySelectorAll('.fire-burst, .smoke-cloud, .water-splash, .bubble-burst').forEach(el => {
        el.classList.remove('active');
    });
}

// Обработчик изменения размера окна
window.addEventListener('resize', () => {
    console.log('Window resized');
    if (window.currentTheme === 'fire' && typeof generateSparks === 'function') {
        setTimeout(() => generateSparks(), 100);
    } 
    else if (window.currentTheme === 'water' && typeof generateBubbles === 'function') {
        setTimeout(() => generateBubbles(), 100);
    }
});

console.log('Main.js loaded successfully');

function optimizeBubblesForMobile() {
    if (window.innerWidth <= 768 && window.currentTheme === 'water' && typeof generateBubbles === 'function') {
        const originalGenerateBubbles = generateBubbles;
        window.generateBubbles = function() {
            bubbleCount = 120; 
            originalGenerateBubbles();
            window.generateBubbles = originalGenerateBubbles;
        };
    }
}

window.addEventListener('load', optimizeBubblesForMobile);
window.addEventListener('resize', optimizeBubblesForMobile);