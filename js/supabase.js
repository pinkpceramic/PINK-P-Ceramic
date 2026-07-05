/**
 * =========================================================================
 * TILES & BATHWARE SHOWROOM - CORE SUPABASE CONNECTOR INTERFACE
 * FILE: js/supabase.js
 * =========================================================================
 */

const SUPABASE_URL = window.ENV_SUPABASE_URL || "https://tcohvtqypkfnufivjppx.supabase.co";
const SUPABASE_ANON_KEY = window.ENV_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjb2h2dHF5cGtmbnVmaXZqcHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMjUyMTQsImV4cCI6MjA5ODgwMTIxNH0.lQfeVphiw3DPnhf3C7jhO2tzoNfQD4LcS9l_bZ9zOms";


export const supabaseClient = {
    async from(table) {
        return {
            select: async (columns = '*', filters = {}) => {
                let url = `${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(columns)}`;

                Object.keys(filters).forEach(key => {
                    url += `&${key}=eq.${encodeURIComponent(filters[key])}`;
                });

                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'apikey': SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!response.ok) throw new Error(`Supabase query failed: ${response.statusText}`);
                    const data = await response.json();
                    return {data, error: null};
                } catch (err) {
                    console.error(`Database Exception [Table: ${table}]:`, err);
                    return {data: null, error: err.message};
                }
            },

            insert: async (payload) => {
                const url = `${SUPABASE_URL}/rest/v1/${table}`;
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'apikey': SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify(payload)
                    });
                    if (!response.ok) throw new Error(`Supabase insertion failed: ${response.statusText}`);
                    const data = await response.json();
                    return {data, error: null};
                } catch (err) {
                    console.error(`Database Exception [Insertion Table: ${table}]:`, err);
                    return {data: null, error: err.message};
                }
            }
        };
    }
};

// Append this method inside the existing object interface in your js/supabase.js file
async function callCatalogRPC(filters = {}) {

    const endpoint = `${SUPABASE_URL}/rest/v1/rpc/get_catalog_json`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'params=single-object'
            },
            body: JSON.stringify({
                filter_category: filters.category || 'all',
                filter_finish: filters.finish || 'all',
                filter_size: filters.size || 'all',
                search_query: filters.search || ''
            })
        });

        if (!response.ok) throw new Error(`RPC Engine responded with fault code: ${response.statusText}`);
        return await response.json();
    } catch (err) {
        console.error("Critical Database RPC Stream Interrupt Exception:", err);
        return [];
    }
}

export {callCatalogRPC};


/**
 * Connects securely to the get_all_reviews database function.
 * @returns {Promise<Array>} Clean JSON array of reviews.
 */
export async function fetchReviewsFromRPC() {
    const rpcEndpoint = `${SUPABASE_URL}/rest/v1/rpc/get_all_reviews`;

    try {
        const response = await fetch(rpcEndpoint, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            // Secure parameter signature binding for zero-argument functions
            body: JSON.stringify({})
        });

        if (!response.ok) {
            throw new Error(`Supabase returned fault response: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Database Core RPC Execution Interrupted:", error);
        return [];
    }
}

/**
 * Safely writes a user review into the database using a Remote Procedure Call.
 * @param {Object} reviewFields - Contains { name, city, rating, comment }
 * @returns {Promise<Object>} The status response object generated by the database engine.
 */
export async function uploadReviewViaRPC(reviewFields) {
    const targetRpcUrl = `${SUPABASE_URL}/rest/v1/rpc/upload_new_review`;

    try {
        const response = await fetch(targetRpcUrl, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            // Map parameters directly to match your PostgreSQL function variable signatures exactly
            body: JSON.stringify({
                p_name: reviewFields.name,
                p_city: reviewFields.city,
                p_rating: parseInt(reviewFields.rating, 10) || 5,
                p_comment: reviewFields.comment
            })
        });

        if (!response.ok) {
            throw new Error(`RPC Write Transaction rejected: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Database Transaction Layer Execution Fault:", error);
        return {success: false, message: "Network connection fault could not transmit review payload mapping arrays."};
    }
}


/**
 * Transmits structured project inquiry payloads cleanly through the database RPC pipeline.
 * @param {Object} projectData - Contains { name, email, description }
 * @returns {Promise<Object>} Status response containing execution confirmations.
 */
export async function uploadProjectViaRPC(projectData) {
    // Ensure this matches the RPC endpoint schema route perfectly

    console.log(projectData)

    const projectRpcUrl = `${SUPABASE_URL}/rest/v1/rpc/upload_new_project`;

    try {
        const response = await fetch(projectRpcUrl, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                p_client_name: projectData.name,
                p_client_email: projectData.email,
                p_description: projectData.description
            })
        });

        if (!response.ok) {
            throw new Error(`Project API transaction gateway rejected: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Project Submission Transmission Interrupted Exception:", error);
        return {success: false, message: "Network connection loss. Could not transmit project parameters."};
    }
}