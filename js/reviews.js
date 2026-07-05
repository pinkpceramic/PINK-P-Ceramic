/**
 * =========================================================================
 * TILES & BATHWARE SHOWROOM - REVIEWS UI INTERFACE INTAKE
 * FILE: js/reviews.js
 * =========================================================================
 */

// Import the specific database fetching channel from your core module script file
import {fetchReviewsFromRPC, uploadReviewViaRPC} from './supabase.js';

document.addEventListener("DOMContentLoaded", () => {
    renderReviewsSection();

    // 2. Finds the HTML form element by its ID inside index.html
    const entryForm = document.getElementById('reviewSubmissionForm');

    // 3. Wires up the execution connection hook
    if (entryForm) {
        entryForm.addEventListener('submit', handleReviewFormTransmission);
    }

    initializeGoldenStarsEngine()
});

/**
 * Resolves the database promise and maps out the HTML layout cards dynamically
 */
async function renderReviewsSection() {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;

    container.innerHTML = `
        <div style="padding: 20px; color: var(--color-text-muted); font-size: 0.9rem;">
            Connecting to secure database streams...
        </div>
    `;

    // Invoke the function imported from supabase.js and wait for data array return
    const approvedReviews = await fetchReviewsFromRPC();

    if (!approvedReviews || approvedReviews.length === 0) {
        container.innerHTML = `
            <div style="padding: 30px; text-align: center; color: var(--color-text-muted); font-size: 0.85rem;">
                No authorized customer endorsements found in the current system.
            </div>
        `;
        return;
    }

    // Paint the data cards into the UI container slot
    container.innerHTML = approvedReviews.map(review => {
        const score = parseInt(review.rating, 10) || 5;
        const goldStars = '★'.repeat(score) + '☆'.repeat(5 - score);

        return `
            <article class="review-card">
                <div style="color: var(--color-secondary); margin-bottom: 12px; font-size: 1rem; letter-spacing: 2px;">${goldStars}</div>
                <p style="color: var(--color-text-dark); font-size: 0.95rem; font-style: italic; line-height: 1.6;">"${review.comment}"</p>
                <div style="margin-top: 15px; display: flex; align-items: center; justify-content: space-between; border-top: 1px dashed var(--color-border-light); padding-top: 12px;">
                    <div>
                        <strong style="color: var(--color-primary); font-size: 0.9rem; font-weight: 600;">${review.name}</strong>
                        <span style="color: var(--color-text-muted); font-size: 0.75rem; display: block; margin-top: 2px;">${review.city}</span>
                    </div>
                    <span style="background: #F0FDF4; color: #166534; padding: 3px 10px; border-radius: var(--radius-full); font-size: 0.65rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Verified Procurement</span>
                </div>
            </article>
        `;
    }).join('');
}


async function handleReviewFormTransmission(event) {
    event.preventDefault();

    const activeSelectedScore = document.getElementById('revRatingInput').value;

    // Gather text values directly from your HTML input fields
    const formData = {
        name: document.getElementById('revName').value,
        city: document.getElementById('revCity').value,
        rating: parseInt(activeSelectedScore, 10) || 5, // Maximized design standard index default
        comment: document.getElementById('revComment').value
    };

    // Trigger the write RPC function imported from supabase.js
    const transactionStatus = await uploadReviewViaRPC(formData);

    if (transactionStatus.success) {
        alert(transactionStatus.message);
        event.target.reset(); // Safely clear out the HTML input text blocks

        // Instantly re-query database streams to populate the newly added card without hard refreshing the browser page
        await renderReviewsSection();
    } else {
        alert(`Transaction Failed: ${transactionStatus.message}`);
    }
}

function initializeGoldenStarsEngine() {
    const starBox = document.getElementById('formStarRatingGroup');
    const trackingInput = document.getElementById('revRatingInput');
    if (!starBox || !trackingInput) return;

    const allStars = starBox.querySelectorAll('.gold-star-node');

    // Run baseline check to initialize all 5 stars as pre-selected gold icons
    allStars.forEach(s => s.classList.add('selected'));

    allStars.forEach(star => {
        star.addEventListener('click', () => {
            const chosenValue = parseInt(star.getAttribute('data-value'), 10);

            // Commit the selected score array value back to the hidden input
            trackingInput.value = chosenValue;

            // Clear previous class states and redraw selected ranges accurately
            allStars.forEach(s => {
                const nodeVal = parseInt(s.getAttribute('data-value'), 10);
                // Due to reverse layout orientation, we check if the value is greater than or equal
                if (nodeVal === chosenValue) {
                    s.classList.add('selected');
                } else {
                    s.classList.remove('selected');
                }
            });

            // Standardizing layout: enforce selection colors on target element context
            star.classList.add('selected');
        });
    });
}
