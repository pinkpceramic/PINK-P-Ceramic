/**
 * =========================================================================
 * PINKP CERAMICS - DYNAMIC HIERARCHICAL CATALOG CONTROLLER
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

const TARGET_WHATSAPP_NUMBER = "7777945744";

function routeLeadToWhatsAppChat(productTitle, size, finish, category) {
    const displaySize = size || 'Standard Sizing';
    const displayFinish = finish || 'Showroom Finish';
    const displayCategory = category || 'Premium Series';

    let customTextBlueprint = `Hello PINK P Ceramic, I would like to purchase tiles please share your catalogue for this ${displaySize} , ${displayCategory} and ${displayFinish}`;

    window.location.href = `whatsapp://send?phone=${TARGET_WHATSAPP_NUMBER}&text=` +
        encodeURIComponent(customTextBlueprint);
}

async function executeCatalogDataSync() {
    const floorContainer = document.getElementById('floorTilesContainer');
    const wallContainer = document.getElementById('wallTilesContainer');
    const sanitaryContainer = document.getElementById('sanitaryContainer');
    const specialtyContainer = document.getElementById('specialtyTilesContainer');

    const blockFloor = document.getElementById('block-floor-tiles');
    const blockWall = document.getElementById('block-wall-tiles');
    const blockSanitary = document.getElementById('block-sanitary');
    const blockSpecialty = document.getElementById('block-specialty-tiles');

    const fallbackLoadingMarkup = `<div style="text-align:center; padding: 40px 0; color: var(--color-text-muted); width: 100%;">Connecting to secure database streams...</div>`;

    if (floorContainer) floorContainer.innerHTML = fallbackLoadingMarkup;
    if (wallContainer) wallContainer.innerHTML = fallbackLoadingMarkup;
    if (sanitaryContainer) sanitaryContainer.innerHTML = fallbackLoadingMarkup;
    if (specialtyContainer) specialtyContainer.innerHTML = fallbackLoadingMarkup;

    // Fetch unified dataset array from Supabase RPC
    const productJsonArray = await callCatalogRPC(activeStateQueryTokens);


    if (!productJsonArray || productJsonArray.length === 0) {
        const noRecordsMarkup = `<div style="text-align:center; padding: 40px 0; color: var(--color-text-muted); width: 100%;"><p style="font-size: 1.1rem; font-family:var(--font-display); color: var(--color-primary);">No Matching Collections Found</p></div>`;
        if (floorContainer) floorContainer.innerHTML = noRecordsMarkup;
        if (wallContainer) wallContainer.innerHTML = noRecordsMarkup;
        if (sanitaryContainer) sanitaryContainer.innerHTML = noRecordsMarkup;
        if (specialtyContainer) specialtyContainer.innerHTML = noRecordsMarkup;
        return;
    }

    // =========================================================================
    // ACCURATE DATABASE CATEGORY FILTER MAPS (MATCHING YOUR TABLE SNAPS)
    // =========================================================================

    // 1. FLOOR TILES: Matches floor-tiles, full-body, double-charge, parking-tiles, nano-tile, porcelain
    const floorProducts = productJsonArray.filter(item => {
        const catName = (item.category_name || '').toLowerCase();
        return catName.includes('floor') || catName.includes('body') ||
            catName.includes('charge') || catName.includes('parking') ||
            catName.includes('nano') || catName.includes('porcelain') ||
            catName.includes('step riser');
    });

    // 2. WALL TILES: Matches wall-tiles and elevatoin-tile (Elevation Tile)
    const wallProducts = productJsonArray.filter(item => {
        const catName = (item.category_name || '').toLowerCase();
        return catName.includes('wall') || catName.includes('elevation') ||
            catName.includes('kitchen') || catName.includes('bathroom');
    });

    // 3. SANITARY WARE: Matches sanitary, luxury-bathware, and quarz-sink (Quartz sink)
    const sanitaryProducts = productJsonArray.filter(item => {
        const catName = (item.category_name || '').toLowerCase();
        return catName.includes('sanitary') || catName.includes('bathware') || catName.includes('sink');
    });

    // 4. SPECIALTY TILES: Matches swimmingpool-series, mosaic-tile, and special-color-series-moroccan
    const specialtyProducts = productJsonArray.filter(item => {
        const catName = (item.category_name || '').toLowerCase();
        return catName.includes('swimming') || catName.includes('mosaic') ||
            catName.includes('moroccan') || catName.includes('outdoor') || catName.includes('special color');
    });

    // =========================================================================
    // VISIBILITY CONTROL LAYER FOR TOP SELECT FILTERS
    // =========================================================================
    if (activeStateQueryTokens.category === 'all') {
        // Show sections dynamically if they actually contain items matching active filters
        if (blockFloor) blockFloor.style.display = floorProducts.length ? 'block' : 'none';
        if (blockWall) blockWall.style.display = wallProducts.length ? 'block' : 'none';
        if (blockSanitary) blockSanitary.style.display = sanitaryProducts.length ? 'block' : 'none';
        if (blockSpecialty) blockSpecialty.style.display = specialtyProducts.length ? 'block' : 'none';
    } else {
        const pickedFilter = activeStateQueryTokens.category;

        // Match specific dropdown choice tokens directly to their parent structural lane blocks
        const isFloorGroup = ['floor-tiles', 'porcelain', 'parking-tiles', 'double-charge', 'nano-tile', 'full-body', 'step-reser'].includes(pickedFilter);
        const isWallGroup = ['wall-tiles', 'elevation-tile'].includes(pickedFilter);
        const isSanitaryGroup = ['sanitary', 'quartz-sink', 'luxury-bathware'].includes(pickedFilter);
        const isSpecialtyGroup = ['swimmingpool-series', 'mosaic-tile', 'special-color-series-moroccan'].includes(pickedFilter);

        if (blockFloor) blockFloor.style.display = isFloorGroup ? 'block' : 'none';
        if (blockWall) blockWall.style.display = isWallGroup ? 'block' : 'none';
        if (blockSanitary) blockSanitary.style.display = isSanitaryGroup ? 'block' : 'none';
        if (blockSpecialty) blockSpecialty.style.display = isSpecialtyGroup ? 'block' : 'none';
    }

    // Universal String HTML Card Generator
    const renderCardStripMarkup = (itemsSubset) => {
        if (itemsSubset.length === 0) {
            return `<div style="text-align:center; padding: 30px 0; color: var(--color-text-muted); width: 100%;">No available showroom items match this active filter.</div>`;
        }
        return itemsSubset.map(item => {
            const primaryImage = (item.images && item.images[0]) ? item.images[0] : 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80';
            const cleanName = item.name.replace(/'/g, "\\'");
            const cleanSize = item.size ? item.size.replace(/'/g, "\\'") : '';
            const cleanFinish = item.finish ? item.finish.replace(/'/g, "\\'") : '';
            const cleanCategory = item.category_name ? item.category_name.replace(/'/g, "\\'") : '';

            return `
                <article class="product-card">
                    <div class="product-image-frame" onclick="window.routeLeadToWhatsAppChat('${cleanName}','${cleanSize}' , '${cleanFinish}' , '${cleanCategory}')">
                        <span class="product-badge">Pink-P Ceramic</span>
                        <img src="${primaryImage}" alt="${item.name} Presentation">
                    </div>
                    <div class="product-meta">
                        <span class="product-brand">${item.category_name}</span>
                        <h3 class="product-title" onclick="window.routeLeadToWhatsAppChat('${cleanName}','${cleanSize}' , '${cleanFinish}' , '${cleanCategory}')">${item.name}</h3>
                        ${item.size !== "NULL"? `<div class="product-spec-row"><span>Dimensions:</span> <strong>${item.size}</strong></div>` : ''}
                        ${item.finish !== "NULL" ? `<div class="product-spec-row"><span>Surface Style:</span> <strong style="text-transform:capitalize;">${item.finish}</strong></div>` : ''}
                        <div class="product-actions">
                            <button class="btn-lux btn-secondary-lux btn-action" onclick="window.routeLeadToWhatsAppChat('${cleanName}','${cleanSize}' , '${cleanFinish}' , '${cleanCategory}')">View more catalogue</button>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    };

    // Inject arrays cleanly into the DOM swimlanes
    if (floorContainer) floorContainer.innerHTML = renderCardStripMarkup(floorProducts);
    if (wallContainer) wallContainer.innerHTML = renderCardStripMarkup(wallProducts);
    if (sanitaryContainer) sanitaryContainer.innerHTML = renderCardStripMarkup(sanitaryProducts);
    if (specialtyContainer) specialtyContainer.innerHTML = renderCardStripMarkup(specialtyProducts);
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