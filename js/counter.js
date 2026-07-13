/**
 * =========================================================================
 * PINKP CERAMICS - SHOWROOM COUNTERS ANIMATION ENGINE
 * FILE: js/counters.js
 * =========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    initializeShowroomCounterObserver();
});

function initializeShowroomCounterObserver() {
    const counterNodes = document.querySelectorAll('.live-counter-node');
    if (counterNodes.length === 0) return;

    const counterAnimationOptions = {
        root: null,          // Tracks scrolling boundaries inside window viewport framework
        threshold: 0.25,     // Fires the numbers sequence once 25% of the section enters view
        rootMargin: "0px"
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stand down tracker immediately so calculations only execute once per landing cycle
                observer.unobserve(entry.target);

                // Fire live counting progression loop
                executeRollingAnimation(entry.target);
            }
        });
    }, counterAnimationOptions);

    // Bind layout observer over every counting node structural element
    counterNodes.forEach(node => counterObserver.observe(node));
}

/**
 * Linearly increments number text layout frames safely over a fixed 2000ms arc window.
 */
function executeRollingAnimation(element) {
    const databaseTargetLimit = parseInt(element.getAttribute('data-target'), 10);
    const animationDurationMs = 2000; // Duration of counter roll (2 seconds)
    const framesPerSecond = 60;       // Smooth rendering rate
    const totalExecutionSteps = Math.round(animationDurationMs / (1000 / framesPerSecond));

    let currentStepIndex = 0;

    const renderingTickerTimer = setInterval(() => {
        currentStepIndex++;

        // Easing calculations: easeOutCubic curve for realistic slowing down near targets
        const progressRatio = currentStepIndex / totalExecutionSteps;
        const easedProgress = 1 - Math.pow(1 - progressRatio, 3);

        const rollingStepValue = Math.floor(easedProgress * databaseTargetLimit);

        // Print step tracking values safely to DOM viewport nodes
        element.textContent = rollingStepValue;

        // End execution loop once frame bounds match limit steps
        if (currentStepIndex >= totalExecutionSteps) {
            clearInterval(renderingTickerTimer);
            element.textContent = databaseTargetLimit; // Hard lock target precisely at termination edge
        }
    }, 1000 / framesPerSecond);
}