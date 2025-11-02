let bubbleAnimationFrame;
let bubbleCount = 200; 

function generateBubbles() {
    const container = document.getElementById('bubble-container');
    if (!container) return;

    if (bubbleAnimationFrame) {
        cancelAnimationFrame(bubbleAnimationFrame);
    }
    
    container.innerHTML = '';

    for (let i = 0; i < bubbleCount; i++) {
        createBubble(container, i);
    }
    
    setTimeout(() => {
        if (window.currentTheme === 'water') {
            generateBubbles();
        }
    }, 60000); 
}

function createBubble(container, index) {
    const bubble = document.createElement('div');
    const bubbleType = Math.floor(Math.random() * 6) + 1; 
    bubble.className = `bubble type-${bubbleType}`;
    
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.top = `${Math.random() * 120}%`; 
    
    bubble.style.animationDelay = `${Math.random() * 20}s, ${Math.random() * 10}s, ${Math.random() * 15}s`;
    
    const horizontalDrift = (Math.random() - 0.5) * 50;
    bubble.style.setProperty('--drift', `${horizontalDrift}px`);
    
    const riseDelay = Math.random() * 10;
    const glowDelay = Math.random() * 5;
    const fadeDelay = Math.random() * 8;
    
    bubble.style.animationDelay = `${riseDelay}s, ${glowDelay}s, ${fadeDelay}s`;
    
    bubble.style.willChange = 'transform, opacity';
    
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
    const aSurvives = random < 1/3; // A выживает в 1/3 случаев
    const cSurvives = !aSurvives;   // C выживает в 2/3 случаев

    // Казнь B (первая) - всегда казнен, так как назван стражником
    setTimeout(() => {
        executePrisonerWater('b');
        showNotification('💧 Узник B утонул в глубинах', 'danger');
    }, 300);

    // Казнь второго узника (A или C)
    setTimeout(() => {
        if (aSurvives) {
            // C казнен, A выживает
            executePrisonerWater('c');
            highlightSurvivorWater('a');
            showNotification('💧 C утонул • A СПАСЁН!', 'success');
        } 
        else {
            // A казнен, C выживает  
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
                bubble-rise 25s infinite,
                bubble-pulse-glow 8s infinite,
                bubble-fade 10s infinite,
                bubble-drift 40s infinite;
        }
        
        .bubble.type-2 {
            animation: 
                bubble-rise 35s infinite,
                bubble-pulse-glow 10s infinite,
                bubble-fade 12s infinite,
                bubble-drift 50s infinite;
        }
        
        .bubble.type-3 {
            animation: 
                bubble-rise 45s infinite,
                bubble-pulse-glow 6s infinite,
                bubble-fade 8s infinite,
                bubble-drift 60s infinite;
        }
        
        .bubble.type-4 {
            animation: 
                bubble-rise 30s infinite,
                bubble-pulse-glow 12s infinite,
                bubble-fade 15s infinite,
                bubble-drift 45s infinite;
        }
        
        .bubble.type-5 {
            animation: 
                bubble-rise 40s infinite,
                bubble-pulse-glow 9s infinite,
                bubble-fade 11s infinite,
                bubble-drift 55s infinite;
        }
        
        .bubble.type-6 {
            animation: 
                bubble-rise 50s infinite,
                bubble-pulse-glow 15s infinite,
                bubble-fade 18s infinite,
                bubble-drift 70s infinite;
        }
        
        @keyframes bubble-drift {
            0%, 100% {
                transform: translateX(0);
            }
            25% {
                transform: translateX(calc(var(--drift, 0px) * 0.5));
            }
            50% {
                transform: translateX(var(--drift, 0px));
            }
            75% {
                transform: translateX(calc(var(--drift, 0px) * 0.5));
            }
        }
    `;
    document.head.appendChild(waterStyle);
}