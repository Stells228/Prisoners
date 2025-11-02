let airParticleAnimationFrame;
let airParticleCount = 120; 

function generateAirParticles() {
    const container = document.getElementById('air-particle-container');
    if (!container) return;

    if (airParticleAnimationFrame) {
        cancelAnimationFrame(airParticleAnimationFrame);
    }
    
    container.innerHTML = '';

    for (let i = 0; i < airParticleCount; i++) {
        createAirParticle(container, i);
    }
    
    setTimeout(() => {
        if (window.currentTheme === 'air') {
            generateAirParticles();
        }
    }, 300000); 
}

function createAirParticle(container, index) {
    const particle = document.createElement('div');
    const particleType = Math.floor(Math.random() * 6) + 1; 
    particle.className = `air-particle type-${particleType}`;
    
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    const driftDelay = Math.random() * 90; 
    const glowDelay = Math.random() * 30; 
    
    particle.style.animationDelay = `${driftDelay}s, ${glowDelay}s`;
    
    const scale = 0.6 + Math.random() * 0.6;
    particle.style.transform = `scale(${scale})`;
    
    particle.style.opacity = (0.08 + Math.random() * 0.12).toString();
    
    particle.style.willChange = 'transform, opacity';
    
    container.appendChild(particle);
}

function executeAir() {
    let btn;
    if (window.currentTheme === 'air') {
        btn = document.getElementById('btn-execute-air');
    }
    
    if (btn && btn.disabled) return;
    if (btn) btn.disabled = true;

    resetAll();

    const random = Math.random();
    const aSurvives = random < 1/3;
    const cSurvives = !aSurvives;   

    setTimeout(() => {
        executePrisonerAir('b');
        showNotification('💨 Узник B унесен ветром', 'danger');
    }, 300);

    // Казнь второго узника (A или C)
    setTimeout(() => {
        if (aSurvives) {
            // C казнен, A выживает
            executePrisonerAir('c');
            highlightSurvivorAir('a');
            showNotification('💨 C унесен ветром • A СПАСЁН!', 'success');
        } 
        else {
            // A казнен, C выживает  
            executePrisonerAir('a');
            highlightSurvivorAir('c');
            showNotification('💨 A унесен ветром • C СПАСЁН!', 'success');
        }
    }, 2200);

    setTimeout(() => {
        if (btn) btn.disabled = false;
    }, 5000);
}

function executePrisonerAir(prisonerId) {
    const prisoner = document.getElementById(`prisoner-${prisonerId}-air`);
    const head = prisoner?.querySelector('.head-main');
    const wind = document.getElementById(`wind-${prisonerId}`);
    const dissipate = document.getElementById(`dissipate-${prisonerId}`);

    if (prisoner) {
        prisoner.classList.add('executing', 'dead');
    }
    if (head) {
        head.classList.add('falling');
    }
    if (wind) {
        wind.classList.add('active');
        dissipate?.classList.add('active');
    }
}

function highlightSurvivorAir(prisonerId) {
    const prisoner = document.getElementById(`prisoner-${prisonerId}-air`);
    if (prisoner) {
        prisoner.style.filter = 'drop-shadow(0 0 40px rgba(135, 206, 235, 0.9)) brightness(1.3)';
        prisoner.style.animation = 'survivor-glow-air 2s ease-in-out infinite alternate';
    }
}

if (!document.querySelector('#air-styles')) {
    const airStyle = document.createElement('style');
    airStyle.id = 'air-styles';
    airStyle.textContent = `
        @keyframes survivor-glow-air {
            from {
                filter: drop-shadow(0 0 20px rgba(135, 206, 235, 0.7)) brightness(1.2);
            }
            to {
                filter: drop-shadow(0 0 40px rgba(135, 206, 235, 0.9)) brightness(1.4);
            }
        }
    `;
    document.head.appendChild(airStyle);
}

function optimizeAirParticlesForMobile() {
    if (window.innerWidth <= 768 && window.currentTheme === 'air' && typeof generateAirParticles === 'function') {
        airParticleCount = 70;
    }
}

window.addEventListener('load', optimizeAirParticlesForMobile);
window.addEventListener('resize', optimizeAirParticlesForMobile);