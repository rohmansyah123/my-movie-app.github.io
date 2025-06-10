/**
 * Mengembalikan HTML untuk link alternatif pencarian film di Google.
 * @param {string} movieTitle Judul film.
 * @returns {string} String HTML untuk link alternatif.
 */
export function generateGoogleSearchLink(movieTitle) {
    if (!movieTitle) {
        return '';
    }
    const encodedTitle = encodeURIComponent(movieTitle);
    const googleSearchUrl = `https://www.google.com/search?q=${encodedTitle}+full+movie+online`;

    return `<p><a href="${googleSearchUrl}" target="_blank" class="alternative-link">Cari Film Ini Online</a></p>`;
}

/**
 * Mengembalikan HTML untuk link ke halaman pemutar placeholder Anda.
 * Catatan: Halaman ini adalah placeholder dan memerlukan input pencarian manual dari pengguna.
 * @returns {string} String HTML untuk link ke pemutar placeholder.
 */
export function generatePlayerPageLink() {
    // Anda bisa menambahkan parameter ke URL jika pemutar Anda mendukungnya,
    // misalnya: `https://rohmansyah123.github.io/movie-player.github.io/?q=${encodedTitle}`
    // jika pemutar Anda punya pencarian otomatis dari URL parameter.
    const playerPageUrl = 'https://rohmansyah123.github.io/movie-player.github.io/';
    return `<p><a href="${playerPageUrl}" target="_blank" class="player-page-link">Buka di Pemutar</a></p>`;
}
