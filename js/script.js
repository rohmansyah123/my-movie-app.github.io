import { API_KEY, BASE_URL, IMAGE_BASE_URL, YOUTUBE_EMBED_URL } from '../api/config.js';
import { loadBannerAd, loadPopunderAd, loadSocialBarAd } from './ads/adsterra-units.js';
import { generateGoogleSearchLink } from './utils/alternative-links.js';

// --- Elements ---
const heroSection = document.getElementById('heroSection');
const movieListEl = document.getElementById('movieList');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');
const mobileMenuToggle = document.getElementById('mobileMenu');
const navLinksContainer = document.querySelector('.nav-links'); // Menggunakan container ul
const navLinks = document.querySelectorAll('.nav-link'); // Semua link navigasi
const genreFilterDropdown = document.getElementById('genreFilter');
const sectionTitle = document.getElementById('sectionTitle');

// --- Loading & Error Elements ---
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const heroLoadingOverlay = document.getElementById('heroLoadingOverlay');

// --- Modal Elements ---
const movieDetailModal = document.getElementById('movieDetailModal');
const closeButton = movieDetailModal.querySelector('.close-button');
const modalBody = document.getElementById('modalBody');
const modalLoadingOverlay = document.getElementById('modalLoadingOverlay');
const modalErrorMessage = document.getElementById('modalErrorMessage');

// --- State Variables ---
let currentPage = 1;
let currentSearchQuery = '';
let currentFilterType = 'popular'; // 'popular', 'top_rated', 'upcoming', 'genre', 'search'
let currentGenreId = null; // Used when filtering by genre
let debounceTimer; // For search debounce

// --- API Helpers ---
/**
 * Melakukan panggilan Fetch API dengan penanganan loading dan error.
 * @param {string} url URL endpoint API.
 * @param {HTMLElement} [spinnerEl] Elemen spinner yang akan ditampilkan/disembunyikan.
 * @param {HTMLElement} [errorEl] Elemen pesan error yang akan ditampilkan/disembunyikan.
 * @returns {Promise<object|null>} Data JSON dari API atau null jika terjadi error.
 */
const fetchApi = async (url, spinnerEl, errorEl) => {
    if (spinnerEl) spinnerEl.style.display = 'flex';
    if (errorEl) errorEl.style.display = 'none';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Log the full response for better debugging
            const errorText = await response.text();
            console.error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        if (errorEl) errorEl.style.display = 'block';
        return null;
    } finally {
        if (spinnerEl) spinnerEl.style.display = 'none';
    }
};

/**
 * Mengembalikan URL gambar TMDb dengan ukuran yang ditentukan.
 * @param {string|null} path Path gambar dari API.
 * @param {string} size Ukuran gambar (e.g., 'w500', 'w1280').
 * @returns {string} URL gambar lengkap atau placeholder.
 */
const getImageUrl = (path, size = 'w500') => {
    return path ? `${IMAGE_BASE_URL}${size}${path}` : 'https://via.placeholder.com/250x375?text=No+Image';
};

// --- Lazy Loading Implementation ---
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            rootMargin: '0px',
            threshold: 0.1 // Muat saat 10% gambar terlihat
        };

        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.onload = () => img.classList.add('loaded'); // Opsional: tambahkan kelas untuk efek fade-in
                    observer.unobserve(img);
                }
            });
        }, observerOptions);

        images.forEach(img => {
            imgObserver.observe(img);
        });
    } else {
        // Fallback for older browsers (load all images immediately)
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
};

// --- Hero Section ---
async function displayHeroMovie() {
    heroLoadingOverlay.style.display = 'flex';
    // Mengambil film yang sedang tayang (now_playing) untuk hero section
    const data = await fetchApi(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`, heroLoadingOverlay);

    if (data && data.results.length > 0) {
        const movie = data.results[0];
        const backdropPath = getImageUrl(movie.backdrop_path, 'w1280');

        // Preload backdrop image to avoid flicker
        const img = new Image();
        img.src = backdropPath;
        img.onload = () => {
            heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backdropPath})`;
            heroSection.innerHTML = `
                <div class="hero-content">
                    <h2>${movie.title}</h2>
                    <p>${movie.overview || 'No description available.'}</p>
                    <button data-movie-id="${movie.id}" class="view-detail-btn">Lihat Detail</button>
                </div>
            `;
            heroSection.style.display = 'flex';
        };
        img.onerror = () => {
            console.error('Failed to load hero backdrop image. Hiding hero section.');
            heroSection.style.display = 'none';
        };
    } else {
        heroSection.style.display = 'none';
    }
}

// --- Display Movies in Grid ---
/**
 * Menampilkan daftar film ke dalam grid.
 * @param {Array<object>} movies Array objek film dari API.
 */
function displayMovies(movies) {
    movieListEl.innerHTML = ''; // Hapus film sebelumnya
    errorMessage.style.display = 'none'; // Sembunyikan pesan error utama

    if (!movies || movies.length === 0) {
        movieListEl.innerHTML = '<p style="text-align: center; width: 100%; color: #aaa;">Tidak ada film yang ditemukan.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.dataset.movieId = movie.id; // Simpan ID film

        const posterUrl = getImageUrl(movie.poster_path);

        movieCard.innerHTML = `
            <img data-src="${posterUrl}" alt="${movie.title}" class="lazy-load">
            <h3>${movie.title}</h3>
            <p>Rating: ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
        `;
        movieListEl.appendChild(movieCard);
    });

    lazyLoadImages(); // Terapkan lazy loading pada gambar yang baru ditambahkan

    // Lampirkan event listener ke kartu film yang baru ditambahkan
    document.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const movieId = e.currentTarget.dataset.movieId;
            if (movieId) {
                showMovieDetail(movieId);
            }
        });
    });
}

// --- Fetch & Display Logic ---
/**
 * Mengambil dan menampilkan film berdasarkan halaman, query pencarian, dan jenis filter.
 * @param {number} page Nomor halaman yang akan diambil.
 * @param {string} query Query pencarian film.
 * @param {string} filterType Tipe filter ('popular', 'top_rated', 'upcoming', 'genre', 'search').
 * @param {number|null} genreId ID genre jika filterType adalah 'genre'.
 */
async function fetchAndDisplayMovies(page = 1, query = '', filterType = 'popular', genreId = null) {
    movieListEl.innerHTML = ''; // Kosongkan konten yang ada
    loadingIndicator.style.display = 'flex'; // Tampilkan indikator loading
    errorMessage.style.display = 'none'; // Sembunyikan error sebelumnya

    let url;
    let title = 'Film Populer';

    if (query) {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`;
        title = `Hasil Pencarian: "${query}"`;
    } else if (filterType === 'genre' && genreId) {
        url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreId}`;
        const genreLink = genreFilterDropdown.querySelector(`a[data-genre-id="${genreId}"]`);
        title = `Film Genre: ${genreLink ? genreLink.textContent : 'Tidak Diketahui'}`;
    } else { // Default ke popular atau filter yang telah ditentukan
        url = `${BASE_URL}/movie/${filterType}?api_key=${API_KEY}&language=en-US&page=${page}`;
        switch (filterType) {
            case 'popular': title = 'Film Populer'; break;
            case 'top_rated': title = 'Film Rating Tertinggi'; break;
            case 'upcoming': title = 'Film Mendatang'; break;
        }
    }

    sectionTitle.textContent = title;

    const data = await fetchApi(url, loadingIndicator, errorMessage);

    if (data) {
        displayMovies(data.results);
        currentPage = data.page;
        updatePagination(data.total_pages);
    }
    // Pesan error sudah ditangani oleh fetchApi
}

// --- Pagination Controls ---
function updatePagination(totalPages) {
    currentPageSpan.textContent = `Halaman ${currentPage}`;
    prevPageBtn.disabled = currentPage === 1;
    // TMDb API biasanya membatasi hingga 500 halaman hasil, meskipun total_pages lebih besar
    nextPageBtn.disabled = currentPage >= totalPages || currentPage >= 500;
}

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        fetchAndDisplayMovies(currentPage - 1, currentSearchQuery, currentFilterType, currentGenreId);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Gulir ke atas
    }
});

nextPageBtn.addEventListener('click', () => {
    // Hanya izinkan navigasi hingga halaman 500 sesuai batasan API TMDb
    if (currentPage < 500) {
        fetchAndDisplayMovies(currentPage + 1, currentSearchQuery, currentFilterType, currentGenreId);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Gulir ke atas
    }
});

// --- Search Functionality (with Debounce) ---
searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer); // Hapus timer sebelumnya
    debounceTimer = setTimeout(() => {
        const query = searchInput.value.trim();
        // Memicu pencarian jika query 3+ karakter atau kosong (untuk mereset)
        if (query.length > 2 || query === '') {
            currentSearchQuery = query;
            currentFilterType = query ? 'search' : 'popular'; // Atur tipe filter berdasarkan pencarian
            currentGenreId = null; // Hapus filter genre

            // Hapus kelas 'active' dari semua link navigasi
            navLinks.forEach(link => link.classList.remove('active'));
            fetchAndDisplayMovies(1, query); // Selalu ke halaman 1 untuk pencarian baru
        }
    }, 500); // Debounce 500ms
});

searchButton.addEventListener('click', () => {
    clearTimeout(debounceTimer); // Langsung picu saat tombol diklik
    const query = searchInput.value.trim();
    currentSearchQuery = query;
    currentFilterType = query ? 'search' : 'popular';
    currentGenreId = null;
    navLinks.forEach(link => link.classList.remove('active'));
    fetchAndDisplayMovies(1, query);
});

// --- Mobile Menu Toggle ---
mobileMenuToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
});

// --- Genre Filtering ---
async function populateGenres() {
    const data = await fetchApi(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
    if (data && data.genres) {
        genreFilterDropdown.innerHTML = ''; // Bersihkan yang sudah ada
        data.genres.forEach(genre => {
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = genre.name;
            a.dataset.genreId = genre.id;
            a.classList.add('nav-link'); // Tambahkan kelas nav-link untuk styling aktif

            a.addEventListener('click', (e) => {
                e.preventDefault();
                currentSearchQuery = '';
                searchInput.value = '';
                currentFilterType = 'genre';
                currentGenreId = genre.id;

                navLinks.forEach(link => link.classList.remove('active'));
                document.querySelector('.dropbtn').classList.add('active'); // Aktifkan tombol dropdown

                fetchAndDisplayMovies(1, '', 'genre', genre.id);
                navLinksContainer.classList.remove('active'); // Tutup menu mobile jika terbuka
            });
            genreFilterDropdown.appendChild(a);
        });
    } else {
        const a = document.createElement('a');
        a.textContent = 'Gagal memuat genre';
        a.style.color = '#e50914';
        genreFilterDropdown.appendChild(a);
    }
}

// Event listeners untuk filter navigasi utama
navLinks.forEach(link => {
    if (link.dataset.filterType) { // Hanya untuk link dengan data-filter-type
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            e.target.classList.add('active');

            currentSearchQuery = '';
            searchInput.value = '';
            currentGenreId = null;
            currentFilterType = e.target.dataset.filterType;
            fetchAndDisplayMovies(1, '', currentFilterType);
            navLinksContainer.classList.remove('active');
        });
    }
});


// --- Movie Detail Modal ---
async function showMovieDetail(movieId) {
    modalBody.innerHTML = '';
    modalLoadingOverlay.style.display = 'flex';
    modalErrorMessage.style.display = 'none';

    const [movieData, videoData] = await Promise.all([
        fetchApi(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`, null, modalErrorMessage),
        fetchApi(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`, null, modalErrorMessage)
    ]);

    modalLoadingOverlay.style.display = 'none';

    if (movieData) {
        const posterUrl = getImageUrl(movieData.poster_path, 'w500');
        const genres = movieData.genres.map(genre => `<span>${genre.name}</span>`).join('');

        let trailerEmbed = '';
        if (videoData && videoData.results.length > 0) {
            const trailer = videoData.results.find(
                vid => vid.site === 'YouTube' && (vid.type === 'Trailer' || vid.type === 'Teaser')
            );
            if (trailer) {
                trailerEmbed = `
                    <div class="trailer-section">
                        <h3>Trailer</h3>
                        <div class="video-container">
                            <iframe src="${YOUTUBE_EMBED_URL}${trailer.key}"
                                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen>
                            </iframe>
                        </div>
                    </div>
                `;
            } else {
                 trailerEmbed = `<div class="trailer-section"><p style="color:#aaa;">Tidak ada trailer yang tersedia.</p></div>`;
            }
        } else {
             trailerEmbed = `<div class="trailer-section"><p style="color:#aaa;">Tidak ada video yang tersedia.</p></div>`;
        }

        // --- Link Alternatif ---
        let alternativeLinkHtml = generateGoogleSearchLink(movieData.title);


        modalBody.innerHTML = `
            <img src="${posterUrl}" alt="${movieData.title}" class="modal-poster">
            <div class="modal-details">
                <h2>${movieData.title}</h2>
                <p><strong>Sinopsis:</strong> ${movieData.overview || 'Tidak ada sinopsis tersedia.'}</p>
                <p><strong>Rating:</strong> ${movieData.vote_average ? movieData.vote_average.toFixed(1) : 'N/A'} (${movieData.vote_count} suara)</p>
                <p><strong>Rilis:</strong> ${movieData.release_date || 'N/A'}</p>
                <p><strong>Durasi:</strong> ${movieData.runtime ? `${movieData.runtime} menit` : 'N/A'}</p>
                <p><strong>Genre:</strong> <span class="genre-list">${genres || 'N/A'}</span></p>

                ${alternativeLinkHtml} ${movieData.homepage ? `<p><a href="${movieData.homepage}" target="_blank" class="official-website-link">Kunjungi Situs Resmi</a></p>` : ''}
            </div>
            ${trailerEmbed}
        `;
        movieDetailModal.style.display = 'block';
    }
}

// Close modal when close button is clicked
closeButton.addEventListener('click', () => {
    movieDetailModal.style.display = 'none';
    modalBody.innerHTML = '';
});

// Close modal when clicking outside of modal content
window.addEventListener('click', (event) => {
    if (event.target === movieDetailModal) {
        movieDetailModal.style.display = 'none';
        modalBody.innerHTML = '';
    }
});

// Close modal when 'Escape' key is pressed
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && movieDetailModal.style.display === 'block') {
        movieDetailModal.style.display = 'none';
        modalBody.innerHTML = '';
    }
});

// Attach click listener to hero button
heroSection.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-detail-btn')) {
        const movieId = e.target.dataset.movieId;
        if (movieId) {
            showMovieDetail(movieId);
        }
    }
});

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    displayHeroMovie();
    populateGenres();
    fetchAndDisplayMovies(1, '', 'popular');

    document.querySelector('.nav-link[data-filter-type="popular"]').classList.add('active');

    // --- Panggil Fungsi Iklan Adsterra saat halaman dimuat ---
    loadBannerAd('ad-header-banner');
    loadBannerAd('ad-middle-banner');
    loadBannerAd('ad-footer-banner');

    loadPopunderAd();
    // loadSocialBarAd(); // Aktifkan jika ingin menggunakan Social Bar
});
