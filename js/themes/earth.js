let particleAnimationFrame;
let particleCount = 150; 

function generateParticles() {
    const container = document.getElementById('particle-container');
    if (!container) return;

    if (particleAnimationFrame) {
        cancelAnimationFrame(particleAnimationFrame);
    }
    
    container.innerHTML = '';

    for (let i = 0; i < particleCount; i++) {
        createParticle(container, i);
    }
    
    setTimeout(() => {
        if (window.currentTheme === 'earth') {
            generateParticles();
        }
    }, 300000); 
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    const particleType = Math.floor(Math.random() * 6) + 1;
    particle.className = `particle type-${particleType}`;
    
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    const driftDelay = Math.random() * 60; 
    const glowDelay = Math.random() * 20; 
    
    particle.style.animationDelay = `${driftDelay}s, ${glowDelay}s`;
    
    const scale = 0.5 + Math.random() * 0.5;
    particle.style.transform = `scale(${scale})`;
    
    particle.style.opacity = (0.05 + Math.random() * 0.1).toString();
    
    particle.style.willChange = 'transform, opacity';
    
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

    // Казнь B (первая) - всегда казнен, так как назван стражником
    setTimeout(() => {
        executePrisonerEarth('b');
        showNotification('⛰️ Узник B погребен заживо', 'danger');
    }, 300);

    // Казнь второго узника (A или C)
    setTimeout(() => {
        if (aSurvives) {
            // C казнен, A выживает
            executePrisonerEarth('c');
            highlightSurvivorEarth('a');
            showNotification('⛰️ C погребен • A СПАСЁН!', 'success');
        } 
        else {
            // A казнен, C выживает  
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
    if (window.innerWidth <= 768 && window.currentTheme === 'earth' && typeof generateParticles === 'function') {
        particleCount = 80; 
    }
}

window.addEventListener('load', optimizeParticlesForMobile);
window.addEventListener('resize', optimizeParticlesForMobile);