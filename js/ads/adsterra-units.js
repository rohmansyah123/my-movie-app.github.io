// ====================================================================================
// TEMPATKAN KODE UNIT IKLAN ADSTERRA ANDA DI SINI
// Ganti contoh placeholder di bawah dengan kode Adsterra Anda yang sebenarnya.
// Pastikan setiap unit iklan adalah fungsi yang bisa diekspor.
// ====================================================================================

/**
 * Fungsi untuk memuat unit iklan Banner (misalnya 728x90, 970x250, atau Responsive).
 * Tempatkan kode banner Adsterra Anda di dalam fungsi ini.
 * @param {string} containerId ID dari elemen HTML tempat iklan akan dimasukkan.
 */
export function loadBannerAd(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`[Adsterra] Container with ID ${containerId} not found for banner ad.`);
        return;
    }

    // --- TEMPATKAN KODE ADSTERRA BANNER ANDA DI SINI ---
    // Contoh placeholder:
    container.innerHTML = `
        <div id="container-${containerId}-ad"></div>
        <script async data-cfasync="false" src="//pl22168345.topcreativeformat.com/YOUR_ACTUAL_ADSTERRA_BANNER_CODE_ID/invoke.js"></script>
    `;
    // Ganti "//pl22168345.topcreativeformat.com/YOUR_ACTUAL_ADSTERRA_BANNER_CODE_ID/invoke.js"
    // dengan URL script yang Adsterra berikan untuk unit banner Anda.
    // Pastikan ID div container (misal: "container-ad-header-banner-ad") unik jika diperlukan.
    // --- AKHIR KODE ADSTERRA BANNER ---

    console.log(`[Adsterra] Banner ad requested for #${containerId}`);
}

/**
 * Fungsi untuk memuat unit iklan Popunder.
 * Popunder biasanya tidak memerlukan container ID karena membuka tab baru.
 * Tempatkan kode Popunder Adsterra Anda di dalam fungsi ini.
 */
export function loadPopunderAd() {
    // --- TEMPATKAN KODE ADSTERRA POPUNDER ANDA DI SINI ---
    // Contoh placeholder:
    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = '//pl22168345.topcreativeformat.com/YOUR_ACTUAL_ADSTERRA_POPUNDER_CODE_ID/invoke.js';
    document.head.appendChild(script);
    // --- AKHIR KODE ADSTERRA POPUNDER ---

    console.log('[Adsterra] Popunder ad requested.');
}

/**
 * Fungsi untuk memuat unit iklan Social Bar.
 * Tempatkan kode Social Bar Adsterra Anda di dalam fungsi ini.
 */
export function loadSocialBarAd() {
    // --- TEMPATKAN KODE ADSTERRA SOCIAL BAR ANDA DI SINI ---
    // Contoh placeholder:
    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = '//pl22168345.topcreativeformat.com/YOUR_ACTUAL_ADSTERRA_SOCIAL_BAR_CODE_ID/invoke.js';
    document.body.appendChild(script);
    // --- AKHIR KODE ADSTERRA SOCIAL BAR ---

    console.log('[Adsterra] Social Bar ad requested.');
}

// Anda bisa menambahkan fungsi export lainnya untuk jenis unit iklan Adsterra yang berbeda
// seperti Native Banner, Direct Link, dll., sesuai kebutuhan Anda.
