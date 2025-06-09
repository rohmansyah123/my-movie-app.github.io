// ====================================================================================
// TEMPATKAN KODE UNIT IKLAN ADSTERRA ANDA DI SINI
// Ganti contoh placeholder di bawah dengan kode Adsterra Anda yang sebenarnya.
// Pastikan setiap unit iklan adalah fungsi yang bisa diekspor.
// ====================================================================================

/**
 * Fungsi untuk memuat unit iklan Banner (misalnya 728x90 atau 970x250).
 * Tempatkan kode banner Adsterra Anda di dalam fungsi ini.
 * @param {string} containerId ID dari elemen HTML tempat iklan akan dimasukkan.
 */
export function loadBannerAd(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found for banner ad.`);
        return;
    }

    // --- CONTOH KODE ADSTERRA BANNER (GANTI DENGAN KODE ASLI ANDA) ---
    // Anda bisa mendapatkan kode ini dari dashboard Adsterra saat membuat unit iklan.
    // Biasanya dimulai dengan <script async data-cfasync="false" src="...">
    // Atau mungkin berupa iframe, tergantung jenis unitnya.

    // Contoh untuk unit Banner (ganti dengan kode Adsterra Anda)
    container.innerHTML = `
        <div id="container-ID_UNIT_ADSTERRA_BANNER_ANDA"></div>
        <script async data-cfasync="false" src="//pl22168345.topcreativeformat.com/ID_UNIT_ADSTERRA_BANNER_ANDA/invoke.js"></script>
    `;
    // --- AKHIR CONTOH KODE ADSTERRA BANNER ---

    console.log(`Adsterra banner ad loaded into #${containerId}`);
}

/**
 * Fungsi untuk memuat unit iklan Popunder.
 * Popunder biasanya tidak memerlukan container ID karena membuka tab baru.
 * Tempatkan kode Popunder Adsterra Anda di dalam fungsi ini.
 */
export function loadPopunderAd() {
    // --- CONTOH KODE ADSTERRA POPUNDER (GANTI DENGAN KODE ASLI ANDA) ---
    // Biasanya kode Popunder lebih ringkas dan langsung dieksekusi.

    // Contoh untuk unit Popunder
    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = '//pl22168345.topcreativeformat.com/ID_UNIT_ADSTERRA_POPUNDER_ANDA/invoke.js';
    document.head.appendChild(script);
    // --- AKHIR CONTOH KODE ADSTERRA POPUNDER ---

    console.log('Adsterra Popunder ad loaded.');
}

/**
 * Fungsi untuk memuat unit iklan Social Bar (jika ingin menempatkannya secara dinamis).
 * Social Bar biasanya ditempatkan di dalam <body> atau <head> secara langsung.
 * Jika Anda ingin memuatnya secara dinamis, tempatkan kodenya di sini.
 */
export function loadSocialBarAd() {
    // --- CONTOH KODE ADSTERRA SOCIAL BAR (GANTI DENGAN KODE ASLI ANDA) ---
    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = '//pl22168345.topcreativeformat.com/ID_UNIT_ADSTERRA_SOCIAL_BAR_ANDA/invoke.js';
    document.body.appendChild(script);
    // --- AKHIR CONTOH KODE ADSTERRA SOCIAL BAR ---

    console.log('Adsterra Social Bar ad loaded.');
}

// Anda bisa menambahkan fungsi export lainnya untuk jenis unit iklan Adsterra yang berbeda
// seperti Native Banner, Direct Link, dll., sesuai kebutuhan Anda.
