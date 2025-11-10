let bubbleAnimationFrame;
let bubbleCount = isMobile() ? 30 : 200; 

function isMobile() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function generateBubbles() {
    if (isMobile() && !document.getElementById('bubble-container')) return;
    
    const container = document.getElementById('bubble-container');
    if (!container) return;

    if (bubbleAnimationFrame) {
        cancelAnimationFrame(bubbleAnimationFrame);
    }
    
    container.innerHTML = '';

    if (isMobile()) {
        createBubblesBatch(container, 0);
    } else {
        for (let i = 0; i < bubbleCount; i++) {
            createBubble(container, i);
        }
    }
    
    setTimeout(() => {
        if (window.currentTheme === 'water') {
            generateBubbles();
        }
    }, isMobile() ? 120000 : 60000);
}

function createBubblesBatch(container, index) {
    if (index >= bubbleCount) return;
    
    const batchSize = Math.min(12, bubbleCount - index);
    for (let i = 0; i < batchSize; i++) {
        createBubble(container, index + i);
    }
    
    setTimeout(() => {
        createBubblesBatch(container, index + batchSize);
    }, 16);
}

function createBubble(container, index) {
    const bubble = document.createElement('div');
    const bubbleType = Math.floor(Math.random() * 4) + 1;
    bubble.className = `bubble type-${bubbleType}`;
    
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.top = `${Math.random() * (isMobile() ? 100 : 120)}%`;
    
    const horizontalDrift = (Math.random() - 0.5) * (isMobile() ? 25 : 50);
    bubble.style.setProperty('--drift', `${horizontalDrift}px`);
    
    const riseDelay = Math.random() * (isMobile() ? 5 : 10);
    const glowDelay = Math.random() * (isMobile() ? 3 : 5);
    const fadeDelay = Math.random() * (isMobile() ? 4 : 8);
    
    bubble.style.animationDelay = `${riseDelay}s, ${glowDelay}s, ${fadeDelay}s`;
    
    if (!isMobile()) {
        bubble.style.willChange = 'transform, opacity';
    }
    
    container.appendChild(bubble);
}

function executeWater() {
    let btn;
    if (window.currentTheme === 'water') {
        btn = document.getElementById('btn-execute-water');
    }
    
    if (btn && btn.disabled) return;
    if (btn) btn.disabled = true;

    resetAll();

    const random = Math.random();
    const aSurvives = random < 1/3;
    const cSurvives = !aSurvives;

    setTimeout(() => {
        executePrisonerWater('b');
        showNotification('💧 Узник B утонул в глубинах', 'danger');
    }, 300);

    setTimeout(() => {
        if (aSurvives) {
            executePrisonerWater('c');
            highlightSurvivorWater('a');
            showNotification('💧 C утонул • A СПАСЁН!', 'success');
        } 
        else {
            executePrisonerWater('a');
            highlightSurvivorWater('c');
            showNotification('💧 A утонул • C СПАСЁН!', 'success');
        }
    }, 2200);

    setTimeout(() => {
        if (btn) btn.disabled = false;
    }, 5000);
}

function executePrisonerWater(prisonerId) {
    const prisoner = document.getElementById(`prisoner-${prisonerId}-water`);
    const head = prisoner?.querySelector('.head-main');
    const splash = document.getElementById(`splash-${prisonerId}`);
    const bubbles = document.getElementById(`bubbles-${prisonerId}`);

    if (prisoner) {
        prisoner.classList.add('executing', 'dead');
    }
    if (head) {
        head.classList.add('falling');
    }
    if (splash) {
        splash.classList.add('active');
        bubbles?.classList.add('active');
    }
}

function highlightSurvivorWater(prisonerId) {
    const prisoner = document.getElementById(`prisoner-${prisonerId}-water`);
    if (prisoner) {
        prisoner.style.filter = 'drop-shadow(0 0 40px rgba(74, 144, 226, 0.9)) brightness(1.3)';
        prisoner.style.animation = 'survivor-glow-water 2s ease-in-out infinite alternate';
    }
}

if (!document.querySelector('#water-styles')) {
    const waterStyle = document.createElement('style');
    waterStyle.id = 'water-styles';
    waterStyle.textContent = `
        @keyframes survivor-glow-water {
            from {
                filter: drop-shadow(0 0 20px rgba(74, 144, 226, 0.7)) brightness(1.2);
            }
            to {
                filter: drop-shadow(0 0 40px rgba(74, 144, 226, 0.9)) brightness(1.4);
            }
        }
        
        .bubble.type-1 {
            animation: 
                bubble-rise ${isMobile() ? 15 : 25}s infinite,
                bubble-pulse-glow ${isMobile() ? 5 : 8}s infinite,
                bubble-fade ${isMobile() ? 6 : 10}s infinite,
                bubble-drift ${isMobile() ? 25 : 40}s infinite;
        }
        
        .bubble.type-2 {
            animation: 
                bubble-rise ${isMobile() ? 20 : 35}s infinite,
                bubble-pulse-glow ${isMobile() ? 7 : 10}s infinite,
                bubble-fade ${isMobile() ? 8 : 12}s infinite,
                bubble-drift ${isMobile() ? 30 : 50}s infinite;
        }
        
        .bubble.type-3 {
            animation: 
                bubble-rise ${isMobile() ? 25 : 45}s infinite,
                bubble-pulse-glow ${isMobile() ? 4 : 6}s infinite,
                bubble-fade ${isMobile() ? 5 : 8}s infinite,
                bubble-drift ${isMobile() ? 35 : 60}s infinite;
        }
        
        .bubble.type-4 {
            animation: 
                bubble-rise ${isMobile() ? 18 : 30}s infinite,
                bubble-pulse-glow ${isMobile() ? 8 : 12}s infinite,
                bubble-fade ${isMobile() ? 10 : 15}s infinite,
                bubble-drift ${isMobile() ? 28 : 45}s infinite;
        }
    `;
    document.head.appendChild(waterStyle);
}

function optimizeBubblesForMobile() {
    if (isMobile() && window.currentTheme === 'water' && typeof generateBubbles === 'function') {
        bubbleCount = 30;
        if (bubbleAnimationFrame) {
            cancelAnimationFrame(bubbleAnimationFrame);
        }
        setTimeout(generateBubbles, 100);
    }
}

window.addEventListener('load', optimizeBubblesForMobile);

window.addEventListener('resize', optimizeBubblesForMobile);

