/**
 * =========================================================================
 * PINKP CERAMICS - DYNAMIC CATALOG ENGINE CONTROLLER WITH CAROUSEL SUPPORT
 * FILE: js/products.js
 * =========================================================================
 */
import { callCatalogRPC } from './supabase.js';

document.addEventListener("DOMContentLoaded", () => {
    executeCatalogDataSync();
    attachInteractiveFilters();
});

const activeStateQueryTokens = {
    category: 'all',
    finish: 'all',
    size: 'all',
    search: ''
};

const TARGET_WHATSAPP_NUMBER = "7777945744"; // Replace with your office phone number

function routeLeadToWhatsAppChat(productTitle,size, finish, category) {
    let customTextBlueprint = "";


    customTextBlueprint = `Hello PINK P Ceramic, I would like to perches tiles please share your catalogue to this ${size} , ${category} and ${finish}`;

    // const secureUrlEncodedString = encodeURIComponent(customTextBlueprint);
    // const nativeWhatsAppGatewayUrl = `https://wa.me/${TARGET_WHATSAPP_NUMBER}?text=${secureUrlEncodedString}`;
    // window.open(nativeWhatsAppGatewayUrl, '_blank');


    window.location.href = `whatsapp://send?phone=${TARGET_WHATSAPP_NUMBER}&text=` +
        encodeURIComponent(customTextBlueprint)
}

async function executeCatalogDataSync() {
    const gridContainer = document.getElementById('productGridContainer');
    if (!gridContainer) return;

    gridContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 60px 0; color: var(--color-text-muted); width: 100%;">
            Connecting to secure database streams...
        </div>
    `;

    const productJsonArray = await callCatalogRPC(activeStateQueryTokens);
    console.log(productJsonArray)


    if (!productJsonArray || productJsonArray.length === 0) {
        gridContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding: 60px 0; color: var(--color-text-muted); width: 100%;">
                <p style="font-size: 1.1rem; font-family:var(--font-display); color: var(--color-primary);">No Matching Collections Found</p>
            </div>
        `;
        return;
    }

    gridContainer.innerHTML = productJsonArray.map(item => {
        const primaryImage = (item.images && item.images[0]) ? item.images[0] : 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80';

        const cleanName = item.name.replace(/'/g, "\\'");

        // <article class="product-card">
        //     <div class="product-image-frame" onclick="window.routeLeadToWhatsAppChat('details', '${cleanName}' , '${item.size}' , '${item.finish}' , '${item.category_name}'})">
        //         <span class="product-badge">Pink P Ceramic</span>
        //         <img src="${primaryImage}" alt="${item.name} Presentation" loading="lazy">
        //     </div>
        //     <div class="product-meta">
        //         <span class="product-brand">${item.material} - ${item.category_name}</span>
        //         <h3 class="product-title" onclick="window.routeLeadToWhatsAppChat('details', '${cleanName}','${item.size}' , '${item.finish}' , '${item.category_name}'})">${item.name}</h3>
        //         <div class="product-spec-row"><span>Dimensions:</span> <strong>${item.size}</strong></div>
        //         <div class="product-spec-row"><span>Surface Style:</span> <strong style="text-transform:capitalize;">${item.finish}</strong></div>
        //         <div class="product-actions">
        //             <button class="btn-lux btn-secondary-lux btn-action" onclick="window.routeLeadToWhatsAppChat('details', '${cleanName}','${item.size}' , '${item.finish}' , '${item.category_name}')">View more catalogue</button>
        //         </div>
        //     </div>
        // </article>


        return `
            <article class="product-card">
                <div class="product-image-frame" onclick="window.routeLeadToWhatsAppChat('${cleanName}','${item.size}' , '${item.finish}' , '${item.category_name}')">
                    <span class="product-badge">Pink-P Ceramic</span>
                    <img src="${primaryImage}" alt="${item.name} Presentation">
                </div>
                <div class="product-meta">
                    <span class="product-brand">${item.category_name}</span>
                    <h3 class="product-title" onclick="window.routeLeadToWhatsAppChat('${cleanName}','${item.size}' , '${item.finish}' , '${item.category_name}')">${item.name}</h3>
                    ${item.size ?  `<div class="product-spec-row"><span>Dimensions:</span> <strong>${item.size}</strong></div>` : ''}
                    ${item.finish ? `<div class="product-spec-row"><span>Surface Style:</span> <strong style="text-transform:capitalize;">${item.finish}</strong></div>` : ''}
                    <div class="product-actions">
                        <button class="btn-lux btn-secondary-lux btn-action" onclick="window.routeLeadToWhatsAppChat('${cleanName}','${item.size}' , '${item.finish}' , '${item.category_name}')">View more catalogue</button>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

function attachInteractiveFilters() {
    const searchBar = document.getElementById('productSearch');
    const selectCat = document.getElementById('filterCategory');
    const selectFinish = document.getElementById('filterFinish');
    const selectSize = document.getElementById('filterSize');

    let processingTimeoutInputTracker;
    const pipelineRefresh = () => { executeCatalogDataSync(); };

    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            activeStateQueryTokens.search = e.target.value;
            clearTimeout(processingTimeoutInputTracker);
            processingTimeoutInputTracker = setTimeout(pipelineRefresh, 350);
        });
    }

    if (selectCat) selectCat.addEventListener('change', (e) => { activeStateQueryTokens.category = e.target.value; pipelineRefresh(); });
    if (selectFinish) selectFinish.addEventListener('change', (e) => { activeStateQueryTokens.finish = e.target.value; pipelineRefresh(); });
    if (selectSize) selectSize.addEventListener('change', (e) => { activeStateQueryTokens.size = e.target.value; pipelineRefresh(); });
}

window.routeLeadToWhatsAppChat = routeLeadToWhatsAppChat;