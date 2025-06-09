import { API_KEY, BASE_URL, IMAGE_BASE_URL, YOUTUBE_EMBED_URL } from '../api/config.js';
// Import fungsi-fungsi iklan dari file terpisah
import { loadBannerAd, loadPopunderAd, loadSocialBarAd } from './ads/adsterra-units.js';

// ... (Elements yang sudah ada) ...

// Initial load - tambahkan panggilan untuk iklan saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    displayHeroMovie();
    populateGenres();
    fetchAndDisplayMovies(1, '', 'popular');
    document.querySelector('.nav-links a[data-filter-genre="popular"]').classList.add('active');

    // --- Panggilan Fungsi Iklan Adsterra ---
    // Panggil banner di header
    loadBannerAd('ad-header-banner');

    // Panggil banner di tengah halaman
    loadBannerAd('ad-middle-banner'); // Gunakan ID kontainer yang berbeda

    // Panggil banner di atas footer
    loadBannerAd('ad-footer-banner'); // Gunakan ID kontainer yang berbeda

    // Panggil Popunder (biasanya dipanggil sekali saat halaman dimuat)
    loadPopunderAd();

    // Panggil Social Bar (jika ingin menggunakan)
    // loadSocialBarAd(); // Aktifkan jika Anda ingin menggunakan Social Bar
    // --- Akhir Panggilan Fungsi Iklan ---
});

// ... (sisa kode JavaScript Anda, tidak ada perubahan di sini kecuali di `DOMContentLoaded`) ...

// Catatan: Jika Adsterra menyediakan "Direct Link", Anda bisa menempatkannya
// pada elemen-elemen tertentu, misalnya pada tombol "Lihat Detail" atau "Putar Film",
// namun pastikan untuk tidak melanggar kebijakan Adsterra atau mengganggu UX.
// Untuk Direct Link, Anda biasanya hanya menempelkan URL-nya di link yang sudah ada.
