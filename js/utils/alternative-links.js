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
