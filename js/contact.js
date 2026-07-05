/**
 * =========================================================================
 * TILES & BATHWARE SHOWROOM - PROJECT BRIEF SUBMISSION DESK CONTROLLER
 * FILE: js/projects.js
 * =========================================================================
 */
import {uploadProjectViaRPC} from './supabase.js';

document.addEventListener("DOMContentLoaded", () => {
    const projectInquiryForm = document.getElementById('contactInquiryForm');

    if (projectInquiryForm) {
        projectInquiryForm.addEventListener('submit', handleProjectFormSubmission);
    }
});

/**
 * Intercepts form submissions, extracts data packets, and signals the Supabase network loop
 */
async function handleProjectFormSubmission(event) {
    event.preventDefault();


    // Collect data elements out of the DOM fields
    const packet = {
        name: document.getElementById('infName').value,
        email: document.getElementById('infEmail').value,
        description: document.getElementById('infMessage').value
    };

    // Trigger background database transaction
    const outcome = await uploadProjectViaRPC(packet);

    if (outcome.success) {
        alert(outcome.message);
        event.target.reset(); // Clear form fields smoothly
    } else {
        alert(`Inquiry Interrupted: ${outcome.message}`);
    }
}