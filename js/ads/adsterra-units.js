// ====================================================================================
// TEMPATKAN KODE UNIT IKLAN ADSTERRA ANDA DI SINI
// Ganti contoh placeholder di bawah dengan kode Adsterra Anda yang sebenarnya.
// ====================================================================================

/**
 * Fungsi untuk memuat unit iklan Banner (misalnya 728x90, 970x250, atau Responsive).
 * @param {string} containerId ID dari elemen HTML tempat iklan akan dimasukkan.
 */
export function loadBannerAd(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`[Adsterra] Container with ID ${containerId} not found for banner ad.`);
        return;
    }

    // --- TEMPATKAN KODE ADSTERRA BANNER ANDA DI SINI ---
    // Gunakan kode Native Banner Adsterra yang Anda berikan:
    container.innerHTML = `
        <div id="container-2c979ea6eea470e28aecac661089d1a9"></div>
        <script async data-cfasync="false" src="//pl26583030.profitableratecpm.com/2c979ea6eea470e28aecac661089d1a9/invoke.js"></script>
    `;
    // --- AKHIR KODE ADSTERRA BANNER ---

    console.log(`[Adsterra] Banner ad requested for #${containerId}`);
}

/**
 * Fungsi untuk memuat unit iklan Popunder.
 * Popunder biasanya tidak memerlukan container ID karena membuka tab baru.
 */
export function loadPopunderAd() {
    // --- TEMPATKAN KODE ADSTERRA POPUNDER ANDA DI SINI ---
    // Contoh placeholder. Ganti dengan kode Popunder asli Anda.
    // const script = document.createElement('script');
    // script.async = true;
    // script.dataset.cfasync = 'false';
    // script.src = '//pl22168345.topcreativeformat.com/GANTI_DENGAN_ID_UNIT_ADSTERRA_POPUNDER_ANDA/invoke.js';
    // document.head.appendChild(script);
    // --- AKHIR KODE ADSTERRA POPUNDER ---

    console.log('[Adsterra] Popunder ad requested.');
}

/**
 * Fungsi untuk memuat unit iklan Social Bar.
 */
export function loadSocialBarAd() {
    // --- TEMPATKAN KODE ADSTERRA SOCIAL BAR ANDA DI SINI ---
    // Contoh placeholder. Ganti dengan kode Social Bar asli Anda.
    // const script = document.createElement('script');
    // script.async = true;
    // script.dataset.cfasync = 'false';
    // script.src = '//pl22168345.topcreativeformat.com/GANTI_DENGAN_ID_UNIT_ADSTERRA_SOCIAL_BAR_ANDA/invoke.js';
    // document.body.appendChild(script);
    // --- AKHIR KODE ADSTERRA SOCIAL BAR ---

    console.log('[Adsterra] Social Bar ad requested.');
}
