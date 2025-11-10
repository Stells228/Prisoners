let sparkAnimationFrame;
let sparkCount = isMobile() ? 20 : 150; 

function isMobile() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function generateSparks() {
    if (isMobile() && !document.getElementById('spark-container')) return;
    
    const container = document.getElementById('spark-container');
    if (!container) return;

    if (sparkAnimationFrame) {
        cancelAnimationFrame(sparkAnimationFrame);
    }
    
    container.innerHTML = '';

    if (isMobile()) {
        createSparksBatch(container, 0);
    } else {
        for (let i = 0; i < sparkCount; i++) {
            createSpark(container, i);
        }
    }
    
    setTimeout(() => {
        if (window.currentTheme === 'fire') {
            generateSparks();
        }
    }, isMobile() ? 30000 : 15000);
}

function createSparksBatch(container, index) {
    if (index >= sparkCount) return;
    
    const batchSize = Math.min(6, sparkCount - index);
    for (let i = 0; i < batchSize; i++) {
        createSpark(container, index + i);
    }
    
    setTimeout(() => {
        createSparksBatch(container, index + batchSize);
    }, 16);
}

function createSpark(container, index) {
    const spark = document.createElement('div');
    const sparkType = Math.floor(Math.random() * 2) + 1; 
    spark.className = `spark type-${sparkType}`;
    
    const startX = (Math.random() - 0.5) * (isMobile() ? 60 : 100);
    const startY = (Math.random() - 0.5) * (isMobile() ? 60 : 100);
    const midX = startX + (Math.random() - 0.5) * (isMobile() ? 20 : 40);
    const midY = startY + (Math.random() - 0.5) * (isMobile() ? 20 : 40);
    
    spark.style.setProperty('--start-x', startX);
    spark.style.setProperty('--start-y', startY);
    spark.style.setProperty('--mid-x', midX);
    spark.style.setProperty('--mid-y', midY);
    spark.style.setProperty('--end-x', startX);
    spark.style.setProperty('--end-y', startY);
    spark.style.setProperty('--delay', Math.random() * (isMobile() ? 3 : 5));
    
    spark.style.left = `${Math.random() * 100}%`;
    spark.style.top = `${Math.random() * 100}%`;
    
    if (!isMobile()) {
        spark.style.willChange = 'transform, opacity';
    }
    
    container.appendChild(spark);
}

function handleResize() {
    if (window.currentTheme === 'fire' && typeof generateSparks === 'function') {
        generateSparks();
    }
}

function executeFire() {
    const btn = document.getElementById('btn-execute-fire');
    if (btn.disabled) return;
    
    btn.disabled = true;

    resetAll();

    const random = Math.random();
    const aSurvives = random < 1/3;
    const cSurvives = !aSurvives;

    setTimeout(() => {
        executePrisoner('b');
        showNotification('🔥 Узник B сгорел в огне', 'danger');
    }, 300);

    setTimeout(() => {
        if (aSurvives) {
            executePrisoner('c');
            highlightSurvivor('a');
            showNotification('🔥 C сгорел в огне • A СПАСЁН!', 'success');
        } 
        else {
            executePrisoner('a');
            highlightSurvivor('c');
            showNotification('🔥 A сгорел в огне • C СПАСЁН!', 'success');
        }
    }, 2200);

    setTimeout(() => {
        btn.disabled = false;
    }, 5000);
}

function executePrisoner(prisonerId) {
    const prisoner = document.getElementById(`prisoner-${prisonerId}`);
    const head = prisoner?.querySelector('.head-main');
    const fire = document.getElementById(`fire-${prisonerId}`);
    const smoke = document.getElementById(`smoke-${prisonerId}`);

    if (prisoner) {
        prisoner.classList.add('executing', 'dead');
    }
    if (head) {
        head.classList.add('falling');
    }
    if (fire) {
        fire.classList.add('active');
        smoke?.classList.add('active');
    }
}

function highlightSurvivor(prisonerId) {
    const prisoner = document.getElementById(`prisoner-${prisonerId}`);
    if (prisoner) {
        prisoner.style.filter = 'drop-shadow(0 0 40px rgba(240, 148, 16, 0.9)) brightness(1.3)';
        prisoner.style.animation = 'survivor-glow 2s ease-in-out infinite alternate';
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes survivor-glow {
        from {
            filter: drop-shadow(0 0 20px rgba(240, 148, 16, 0.7)) brightness(1.2);
        }
        to {
            filter: drop-shadow(0 0 40px rgba(240, 148, 16, 0.9)) brightness(1.4);
        }
    }
`;
document.head.appendChild(style);

function optimizeSparksForMobile() {
    if (isMobile() && window.currentTheme === 'fire' && typeof generateSparks === 'function') {
        sparkCount = 40;
        if (sparkAnimationFrame) {
            cancelAnimationFrame(sparkAnimationFrame);
        }
        setTimeout(generateSparks, 100);
    }
}

window.addEventListener('load', optimizeSparksForMobile);
window.addEventListener('resize', optimizeSparksForMobile);
window.addEventListener('resize', handleResize);
