// ========================
// PROCESS ANIMATION CONTROLLER
// ========================

let animationRunning = false;
let animationPaused = false;
let currentStep = 0;
let animationTimeouts = [];

const steps = [
    { name: 'Preparing raw materials', items: ['item-castor', 'item-methanol', 'item-naoh'], arrows: [], duration: 1500, description: 'Measuring and preparing castor oil, methanol and catalyst in correct ratios.' },
    { name: 'Ultrasonication mixing', items: ['item-ultrasonic'], arrows: ['arrow-1', 'arrow-2', 'arrow-3'], duration: 2000, description: 'Intense mixing using ultrasonic cavitation to improve contact between reagents.' },
    { name: 'Heating the mixture', items: ['item-heating'], arrows: ['arrow-4'], duration: 2500, description: 'Controlled heating to activate and speed up the transesterification reaction.' },
    { name: 'First separation', items: ['item-separation1'], arrows: ['arrow-5'], duration: 2000, description: 'Allow the reaction to settle so glycerol separates from crude biodiesel.' },
    { name: 'Collecting glycerol', items: ['item-glycerol'], arrows: [], duration: 1500, description: 'Drain and collect glycerol byproduct for reuse or sale.' },
    { name: 'Water washing', items: ['item-washing'], arrows: ['arrow-6'], duration: 2000, description: 'Wash biodiesel with water to remove residual catalyst, methanol and soaps.' },
    { name: 'Final separation', items: ['item-separation2'], arrows: ['arrow-7'], duration: 2000, description: 'Separate water and remaining impurities; prepare for drying.' },
    { name: 'Pure biodiesel (B100)', items: ['item-biodiesel'], arrows: ['arrow-8'], duration: 2000, description: 'Final product ready — pure biodiesel suitable for use or blending.' }
];

document.addEventListener('DOMContentLoaded', function() {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');

    if (playBtn) {
        playBtn.addEventListener('click', startAnimation);
    }

    if (pauseBtn) {
        pauseBtn.addEventListener('click', pauseAnimation);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', resetAnimation);
    }
});

function startAnimation() {
    if (animationRunning && !animationPaused) return;

    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');

    playBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';

    if (!animationRunning) {
        animationRunning = true;
        currentStep = 0;
        runNextStep();
    } else if (animationPaused) {
        animationPaused = false;
        runNextStep();
    }
}

function pauseAnimation() {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');

    animationPaused = true;
    playBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';

    // Clear all pending timeouts
    animationTimeouts.forEach(timeout => clearTimeout(timeout));
    animationTimeouts = [];
}

function resetAnimation() {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');

    // Clear all timeouts
    animationTimeouts.forEach(timeout => clearTimeout(timeout));
    animationTimeouts = [];

    animationRunning = false;
    animationPaused = false;
    currentStep = 0;

    playBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';

    updateProgress('Ready to start');

    // Reset all items and arrows
    document.querySelectorAll('.process-item').forEach(item => {
        item.classList.remove('active');
    });

    document.querySelectorAll('.arrow-svg').forEach(arrow => {
        arrow.classList.remove('active');
        const path = arrow.querySelector('.arrow-path');
        const flow = arrow.querySelector('.liquid-flow');
        if (path) path.classList.remove('animate');
        if (flow) {
            flow.classList.remove('active');
            const motion = flow.querySelector('animateMotion');
            if (motion) motion.beginElement();
        }
    });
}

function runNextStep() {
    if (animationPaused || currentStep >= steps.length) {
        if (currentStep >= steps.length) {
            updateProgress('Animation complete!');
            const playBtn = document.getElementById('playBtn');
            const pauseBtn = document.getElementById('pauseBtn');
            playBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
            animationRunning = false;

            // Auto-reset after a short pause so user can see the final state
            const autoResetTimeout = setTimeout(() => {
                resetAnimation();
            }, 2500);
            animationTimeouts.push(autoResetTimeout);
        }
        return;
    }

    const step = steps[currentStep];
    // Show numbered step and short description
    const stepNumber = currentStep + 1;
    const message = `Step ${stepNumber}: ${step.name} — ${step.description}`;
    updateProgress(message);

    // Activate items
    step.items.forEach((itemId, index) => {
        const timeout = setTimeout(() => {
            const item = document.getElementById(itemId);
            if (item) {
                item.classList.add('active');
                // extra visual classes for realism
                if (itemId === 'item-ultrasonic') {
                    item.classList.add('mixing');
                }
                if (itemId === 'item-heating') {
                    item.classList.add('heating-active');
                }
                if (itemId === 'item-separation1' || itemId === 'item-separation2') {
                    item.classList.add('draining');
                }
                if (itemId === 'item-washing') {
                    item.classList.add('washing-active');
                }
                if (itemId === 'item-biodiesel') {
                    // trigger fill after a short delay for dramatic effect
                    setTimeout(() => item.classList.add('fill'), 600);
                }
            }
        }, index * 300);
        animationTimeouts.push(timeout);
    });

    // Activate arrows with animation
    const arrowDelay = step.items.length * 300 + 500;
    step.arrows.forEach((arrowId, index) => {
        const timeout = setTimeout(() => {
            const arrow = document.getElementById(arrowId);
            if (arrow) {
                arrow.classList.add('active');
                const path = arrow.querySelector('.arrow-path');
                const flow = arrow.querySelector('.liquid-flow');
                
                if (path) {
                    path.classList.add('animate');
                }
                
                if (flow) {
                    setTimeout(() => {
                        flow.classList.add('active');
                        const motion = flow.querySelector('animateMotion');
                        if (motion) {
                            motion.beginElement();
                        }
                    }, 800);
                }
            }
        }, arrowDelay + (index * 400));
        animationTimeouts.push(timeout);
    });

    // Move to next step
    const nextStepTimeout = setTimeout(() => {
        currentStep++;
        runNextStep();
    }, step.duration);
    animationTimeouts.push(nextStepTimeout);
}

function updateProgress(message) {
    const indicator = document.getElementById('currentStep');
    if (indicator) {
        indicator.textContent = message;
    }
}
