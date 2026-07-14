/**
 * =========================================================================
 * TILES & BATHWARE SHOWROOM - LUXURY LOADING PRELOAD CONTROLLER
 * FILE: js/loader.js
 * =========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    injectAndExecutePremiumLoader();
});

function injectAndExecutePremiumLoader() {
    const loaderScreen = document.createElement('div');
    loaderScreen.id = 'lux-global-preloader';

    const preloaderStyles = document.createElement('style');
    preloaderStyles.textContent = `
        #lux-global-preloader {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: #0F172A;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .loader-brand-wrapper { 
            position: relative;
            text-align: center; 
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            padding: 0 20px;
            box-sizing: border-box;
        }
        
        /* --- RESPONSIVE TEXT TYPOGRAPHY SYSTEMS --- */
        .loader-title {
            font-family: 'Playfair Display', serif;
            font-size: 2.5rem; color: #FFFFFF;
            letter-spacing: 6px; margin-bottom: 12px; opacity: 0;
            transition: opacity 0.5s ease;
            line-height: 1.3;
        }
        .loader-subtitle {
            font-family: 'Poppins', sans-serif; font-size: 0.8rem;
            color: #D4AF37; text-transform: uppercase;
            letter-spacing: 4px; opacity: 0;
            transform: translateY(10px);
            transition: all 0.6s ease 0.5s;
            line-height: 1.5;
        }
        .letter-span {
            display: inline-block; opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .letter-span.reveal { opacity: 1; transform: translateY(0); }
        
        /* --- SWAPPED: DYNAMIC HIGH-PERFORMANCE VIDEO CONTAINER ENGINE --- */
        .loader-video-display {
            position: absolute;
            width: 450px;       /* Premium widescreen desktop viewing boundary */
            max-width: 90%;
            aspect-ratio: 16 / 9; /* Maintains crisp structural media boundaries */
            object-fit: cover;
            border-radius: 8px; /* Smooth corners for editorial modern aesthetics */
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }
        .loader-video-display.active {
            opacity: 1;
            transform: scale(1);
        }

        #lux-global-preloader.fade-out { opacity: 0; pointer-events: none; }

        /* =========================================================================
           RESPONSIVE VIEWPORT BOUNDARY ENGINES (SCALING TEXT AND VIDEO PANELS)
           ========================================================================= */
        
        /* Medium Devices & Small Laptops / Tablets */
        @media (max-width: 768px) {
            .loader-title { font-size: 1.9rem; letter-spacing: 4px; }
            .loader-subtitle { font-size: 0.7rem; letter-spacing: 3px; }
            .loader-video-display { width: 340px; }
        }

        /* Large Mobile Smartphones Profile */
        @media (max-width: 425px) {
            .loader-title { font-size: 1.4rem; letter-spacing: 3px; }
            .loader-subtitle { font-size: 0.65rem; letter-spacing: 2px; }
            .loader-video-display { width: 280px; }
        }

        /* Micro Portrait Screen Layouts */
        @media (max-width: 320px) {
            .loader-title { font-size: 1.2rem; letter-spacing: 2px; }
            .loader-subtitle { font-size: 0.55rem; letter-spacing: 1.5px; }
            .loader-video-display { width: 240px; }
        }
    `;
    document.head.appendChild(preloaderStyles);

    // Dynamic brand character arrays
    const brandString = "P I N K P C E R A M I C";
    const brandArr = brandString.split(" ");

    // Process character nodes, applying hot pink styling to specific 'P' glyph indices
    let htmlSpans = brandArr.map((char, index) => {
        if (char === 'P' && index !== 0) {
            return `<span class="letter-span" style="color: #FF69B4 !important;">${char}</span>`;
        }
        return `<span class="letter-span">${char}</span>`;
    }).join('&nbsp;');

    loaderScreen.innerHTML = `
        <div class="loader-brand-wrapper">
            <audio autoplay>
                <source src="../assets/WhatsApp Audio 2026-07-05 at 6.25.51 PM.mpeg">
            </audio>
            <!-- Text Content Module Container Grid -->
            <div id="textGroupingElement" style="transition: opacity 0.5s ease; opacity: 1;">
                <div class="loader-title" id="loaderTitleContainer">${htmlSpans}</div>
<!--                <div class="loader-subtitle" id="loaderSubtitle">Transforming Ordinary Spaces into Masterpieces</div>-->
            </div>
            
            <!-- Performance Optimized HTML5 Video Component -->
        </div>
    `;

    document.body.appendChild(loaderScreen);

    const letters = loaderScreen.querySelectorAll('.letter-span');
    document.getElementById('loaderTitleContainer').style.opacity = '1';

    // 1. SEQUENCE PHASE ONE: Characters drop into view sequentially
    letters.forEach((span, idx) => {
        setTimeout(() => {
            span.classList.add('reveal');
        }, idx * 175);
    });

    // setTimeout(() => {
    //     document.getElementById('loaderSubtitle').style.opacity = '1';
    //     document.getElementById('loaderSubtitle').style.transform = 'translateY(0)';
    // }, letters.length * 75 + 200);

    // 2. SEQUENCE PHASE TWO: Entire text component block fades out and vanishes completely
    const textCompletionTimestamp = (letters.length * 75) + 1200;

    setTimeout(() => {
        const textWrapper = document.getElementById('textGroupingElement');
        if (textWrapper) textWrapper.style.opacity = '0';
    }, textCompletionTimestamp);

    // 3. SEQUENCE PHASE THREE: Video rolls out, lights up, and forces playback streams
    setTimeout(() => {
        const videoElement = document.getElementById('bigVideoElement');
        if (videoElement) {
            videoElement.classList.add('active');

            // --- CRITICAL BROWSER FIX ---
            // 1. Double-enforce mute state right before firing execution loops
            videoElement.muted = true;
            videoElement.defaultMuted = true;

            // 2. Set structural play attributes to bypass background tab limits
            videoElement.setAttribute('autoplay', '');

            // 3. Fire play request handle hook with error fallback interceptors
            const playAttempt = videoElement.play();

            if (playAttempt !== undefined) {
                playAttempt.then(() => {
                    console.log("Premium brand video streaming successfully executed.");
                }).catch(err => {
                    console.warn("Browser security engine blocked execution hook. Retrying via structural reload...", err);

                    // Fallback Action: Re-prime media source streams and try again instantly
                    videoElement.load();
                    videoElement.play().catch(e => console.error("Final playback loop exception:", e));
                });
            }
        }
    }, textCompletionTimestamp + 550);

    // 4. PRELOADER DISMISSAL EXIT ROUTE (Calibrated around the 10-second playback arc)
    window.addEventListener('load', () => {
        setTimeout(() => {
            loaderScreen.classList.add('fade-out');
            setTimeout(() => loaderScreen.remove(), 800);
        }, textCompletionTimestamp + 105); // 10.5 seconds of display breathing room
    });
}