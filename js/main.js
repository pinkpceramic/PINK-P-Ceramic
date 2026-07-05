/**
 * =========================================================================
 * TILES & BATHWARE SHOWROOM - CENTRAL APPLICATION STRAPPER MODULE
 * FILE: js/main.js
 * =========================================================================
 */

// import {deployWhatsAppModal} from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
    initFloatingControls();
    setupGlobalEventDelegation();
});

function initFloatingControls() {
    const floatContainer = document.createElement('div');
    floatContainer.className = 'floating-actions-container';

    floatContainer.innerHTML = `
        <button class="btn-top-float" id="scrollTopBtn" aria-label="Scroll back to top">
            <svg viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg>
        </button>
        <button class="btn-whatsapp-float" id="globalWhatsappFloat" aria-label="Open support chat">
            <svg viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 11.966.01c3.179.001 6.169 1.24 8.417 3.491 2.247 2.251 3.481 5.244 3.479 8.423-.004 6.619-5.341 11.958-11.913 11.958-2.001-.001-3.972-.505-5.717-1.46L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.777 1.453 5.325 0 9.66-4.323 9.663-9.636.002-2.573-1.002-4.993-2.827-6.822C16.377 2.316 13.97 1.313 11.4 1.313c-5.328 0-9.663 4.324-9.666 9.64-.001 1.706.444 3.374 1.288 4.866l-.999 3.648 3.734-.979zm11.373-6.626c-.3-.15-1.772-.875-2.046-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.487-.891-.795-1.492-1.777-1.667-2.076-.175-.3-.019-.463.13-.612.134-.133.3-.349.45-.523.15-.174.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.589-.493-.51-.675-.52-.172-.007-.368-.009-.565-.009-.196 0-.517.074-.788.368-.271.294-1.034 1.011-1.034 2.465 0 1.454 1.057 2.859 1.204 3.056.148.197 2.081 3.179 5.042 4.457.705.304 1.254.486 1.682.622.708.226 1.353.194 1.863.118.569-.085 1.772-.725 2.021-1.425.25-.7.25-1.299.175-1.425-.075-.125-.275-.2-.575-.35z"/>
            </svg>
        </button>
    `;

    document.body.appendChild(floatContainer);
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    document.getElementById('globalWhatsappFloat').addEventListener('click', () => {
        deployWhatsAppModal(
            "Speak directly with our showroom design curators regarding premium collections, stock queries, and catalog assistance.",
            "Hello, I am looking to discover premium collections for my interior design project. Please guide me through your catalogs."
        );
    });
}

function setupGlobalEventDelegation() {
    document.body.addEventListener('click', (e) => {
        const targetElement = e.target.closest('[data-lux-whatsapp]');
        if (!targetElement) return;

        e.preventDefault();

        const mode = targetElement.getAttribute('data-lux-whatsapp');
        const contextName = targetElement.getAttribute('data-context-name') || 'Selected Premium Architecture Collection';

        let promptText = "Connect instantly to download digital product lookbooks and review regional options.";
        let finalMessage = `Hello Luxury Ceramics Showroom, I am requesting technical data and pricing layout charts regarding: ${contextName}.`;

        if (mode === 'catalog') {
            promptText = "Would you like to download the luxury design catalog for this collection?";
            finalMessage = `Hi, I would like to download the high-resolution specification catalog for the "${contextName}" range.`;
        } else if (mode === 'quote') {
            promptText = "Request a bespoke architectural price estimation from our project management desk.";
            finalMessage = `Hello, please provide an estimate and availability details for the "${contextName}" collection for an upcoming project.`;
        }

        deployWhatsAppModal(promptText, finalMessage);
    });
}