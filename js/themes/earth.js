let particleAnimationFrame;
let particleCount = isMobile() ? 30 : 150; 

function isMobile() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function generateParticles() {
    if (isMobile() && !document.getElementById('particle-container')) return;
    
    const container = document.getElementById('particle-container');
    if (!container) return;

    if (particleAnimationFrame) {
        cancelAnimationFrame(particleAnimationFrame);
    }
    
    container.innerHTML = '';

    if (isMobile()) {
        createParticlesBatch(container, 0);
    } else {
        for (let i = 0; i < particleCount; i++) {
            createParticle(container, i);
        }
    }
    
    setTimeout(() => {
        if (window.currentTheme === 'earth') {
            generateParticles();
        }
    }, isMobile() ? 600000 : 300000);
}

function createParticlesBatch(container, index) {
    if (index >= particleCount) return;
    
    const batchSize = Math.min(8, particleCount - index);
    for (let i = 0; i < batchSize; i++) {
        createParticle(container, index + i);
    }
    
    setTimeout(() => {
        createParticlesBatch(container, index + batchSize);
    }, 16);
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    const particleType = Math.floor(Math.random() * 4) + 1; 
    particle.className = `particle type-${particleType}`;
    
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    const driftDelay = Math.random() * (isMobile() ? 20 : 60);
    const glowDelay = Math.random() * (isMobile() ? 10 : 20);
    
    particle.style.animationDelay = `${driftDelay}s, ${glowDelay}s`;
    
    const scale = isMobile() ? (0.3 + Math.random() * 0.3) : (0.5 + Math.random() * 0.5);
    particle.style.transform = `scale(${scale})`;
    
    particle.style.opacity = (0.05 + Math.random() * 0.07).toString();
    
    if (!isMobile()) {
        particle.style.willChange = 'transform, opacity';
    }
    
    container.appendChild(particle);
}

function executeEarth() {
    let btn;
    if (window.currentTheme === 'earth') {
        btn = document.getElementById('btn-execute-earth');
    }
    
    if (btn && btn.disabled) return;
    if (btn) btn.disabled = true;

    resetAll();

    const random = Math.random();
    const aSurvives = random < 1/3; 
    const cSurvives = !aSurvives;   

    setTimeout(() => {
        executePrisonerEarth('b');
        showNotification('⛰️ Узник B погребен заживо', 'danger');
    }, 300);

    setTimeout(() => {
        if (aSurvives) {
            executePrisonerEarth('c');
            highlightSurvivorEarth('a');
            showNotification('⛰️ C погребен • A СПАСЁН!', 'success');
        } 
        else {
            executePrisonerEarth('a');
            highlightSurvivorEarth('c');
            showNotification('⛰️ A погребен • C СПАСЁН!', 'success');
        }
    }, 2200);

    setTimeout(() => {
        if (btn) btn.disabled = false;
    }, 5000);
}

function executePrisonerEarth(prisonerId) {
    const prisoner = document.getElementById(`prisoner-${prisonerId}-earth`);
    const head = prisoner?.querySelector('.head-main');
    const crack = document.getElementById(`crack-${prisonerId}`);
    const dust = document.getElementById(`dust-${prisonerId}`);

    if (prisoner) {
        prisoner.classList.add('executing', 'dead');
    }
    if (head) {
        head.classList.add('falling');
    }
    if (crack) {
        crack.classList.add('active');
        dust?.classList.add('active');
    }
}

function highlightSurvivorEarth(prisonerId) {
    const prisoner = document.getElementById(`prisoner-${prisonerId}-earth`);
    if (prisoner) {
        prisoner.style.filter = 'drop-shadow(0 0 40px rgba(93, 64, 55, 0.9)) brightness(1.3)';
        prisoner.style.animation = 'survivor-glow-earth 2s ease-in-out infinite alternate';
    }
}

if (!document.querySelector('#earth-styles')) {
    const earthStyle = document.createElement('style');
    earthStyle.id = 'earth-styles';
    earthStyle.textContent = `
        @keyframes survivor-glow-earth {
            from {
                filter: drop-shadow(0 0 20px rgba(93, 64, 55, 0.7)) brightness(1.2);
            }
            to {
                filter: drop-shadow(0 0 40px rgba(93, 64, 55, 0.9)) brightness(1.4);
            }
        }
    `;
    document.head.appendChild(earthStyle);
}

function optimizeParticlesForMobile() {
    if (isMobile() && window.currentTheme === 'earth' && typeof generateParticles === 'function') {
        particleCount = 30;
        if (particleAnimationFrame) {
            cancelAnimationFrame(particleAnimationFrame);
        }
        setTimeout(generateParticles, 100);
    }
}

window.addEventListener('load', optimizeParticlesForMobile);
window.addEventListener('resize', optimizeParticlesForMobile);
