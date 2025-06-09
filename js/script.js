import { API_KEY, BASE_URL, IMAGE_BASE_URL, YOUTUBE_EMBED_URL } from '../api/config.js';

// Elements
const heroSection = document.getElementById('heroSection');
const movieListEl = document.getElementById('movieList');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');
const mobileMenuToggle = document.getElementById('mobileMenu');
const navLinks = document.querySelector('.nav-links');
const genreFilterDropdown = document.getElementById('genreFilter');
const sectionTitle = document.getElementById('sectionTitle');

// Loading & Error Elements
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const heroLoadingOverlay = document.getElementById('heroLoadingOverlay');

// Modal Elements
const movieDetailModal = document.getElementById('movieDetailModal');
const closeButton = movieDetailModal.querySelector('.close-button');
const modalBody = document.getElementById('modalBody');
const modalLoadingOverlay = document.getElementById('modalLoadingOverlay');
const modalErrorMessage = document.getElementById('modalErrorMessage');

let currentPage = 1;
let currentSearchQuery = '';
let currentFilterType = 'popular'; // 'popular', 'top_rated', 'upcoming', or 'genre'
let currentGenreId = null; // Used when filtering by genre

let debounceTimer; // For search debounce

// --- API Helpers ---
const fetchApi = async (url, elementToShowSpinner, elementToShowError) => {
    if (elementToShowSpinner) elementToShowSpinner.style.display = 'flex';
    if (elementToShowError) elementToShowError.style.display = 'none';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        if (elementToShowError) elementToShowError.style.display = 'block';
        return null;
    } finally {
        if (elementToShowSpinner) elementToShowSpinner.style.display = 'none';
    }
};

const getImageUrl = (path, size = 'w500') => {
    return path ? `${IMAGE_BASE_URL}${size}${path}` : 'https://via.placeholder.com/250x375?text=No+Image';
};

// --- Lazy Loading Implementation ---
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    const observerOptions = {
        rootMargin: '0px',
        threshold: 0.1
    };

    const imgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, observerOptions);

    images.forEach(img => {
        imgObserver.observe(img);
    });
};


// --- Hero Section ---
async function displayHeroMovie() {
    heroLoadingOverlay.style.display = 'flex';
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
            heroLoadingOverlay.style.display = 'none';
        };
        img.onerror = () => {
            console.error('Failed to load hero backdrop image.');
            heroSection.style.display = 'none';
            heroLoadingOverlay.style.display = 'none';
        };
    } else {
        heroSection.style.display = 'none';
        heroLoadingOverlay.style.display = 'none';
    }
}

// --- Display Movies in Grid ---
function displayMovies(movies) {
    movieListEl.innerHTML = ''; // Clear previous movies
    errorMessage.style.display = 'none'; // Hide main error message

    if (!movies || movies.length === 0) {
        movieListEl.innerHTML = '<p style="text-align: center; width: 100%; color: #aaa;">Tidak ada film yang ditemukan.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.dataset.movieId = movie.id;

        const posterUrl = getImageUrl(movie.poster_path);

        movieCard.innerHTML = `
            <img data-src="${posterUrl}" alt="${movie.title}" class="lazy-load">
            <h3>${movie.title}</h3>
            <p>Rating: ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
        `;
        movieListEl.appendChild(movieCard);
    });

    lazyLoadImages(); // Apply lazy loading to newly added images

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
async function fetchAndDisplayMovies(page = 1, query = '', filterType = 'popular', genreId = null) {
    movieListEl.innerHTML = ''; // Clear existing content
    loadingIndicator.style.display = 'flex'; // Show loading indicator
    errorMessage.style.display = 'none'; // Hide previous errors

    let url;
    let title = 'Film Populer';

    if (query) {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=${page}`;
        title = `Hasil Pencarian: "${query}"`;
    } else if (filterType === 'genre' && genreId) {
        url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreId}`;
        const genreName = genreFilterDropdown.querySelector(`[data-genre-id="${genreId}"]`).textContent;
        title = `Film Genre: ${genreName}`;
    } else { // Default to popular or other predefined filters
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
    } else {
        // Error message already handled by fetchApi
    }
}

// --- Pagination Controls ---
function updatePagination(totalPages) {
    currentPageSpan.textContent = `Halaman ${currentPage}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage >= totalPages || currentPage >= 500; // TMDb limits pages to 500
}

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        fetchAndDisplayMovies(currentPage - 1, currentSearchQuery, currentFilterType, currentGenreId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

nextPageBtn.addEventListener('click', () => {
    // Only allow navigation up to page 500 to match TMDb API limits
    if (currentPage < 500) {
        fetchAndDisplayMovies(currentPage + 1, currentSearchQuery, currentFilterType, currentGenreId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// --- Search Functionality (with Debounce) ---
searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer); // Clear previous timer
    debounceTimer = setTimeout(() => {
        const query = searchInput.value.trim();
        if (query.length > 2 || query === '') { // Search if query is 3+ chars or empty to reset
            currentSearchQuery = query;
            currentFilterType = query ? 'search' : 'popular'; // Set filter type based on search
            currentGenreId = null; // Clear genre filter
            // Remove 'active' class from nav links if searching
            document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
            fetchAndDisplayMovies(1, query); // Always go to page 1 for new searches
        }
    }, 500); // 500ms debounce
});

searchButton.addEventListener('click', () => {
    clearTimeout(debounceTimer); // Trigger immediately on button click
    const query = searchInput.value.trim();
    currentSearchQuery = query;
    currentFilterType = query ? 'search' : 'popular';
    currentGenreId = null;
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    fetchAndDisplayMovies(1, query);
});

// --- Mobile Menu Toggle ---
mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// --- Genre Filtering ---
async function populateGenres() {
    const data = await fetchApi(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
    if (data && data.genres) {
        genreFilterDropdown.innerHTML = ''; // Clear existing
        data.genres.forEach(genre => {
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = genre.name;
            a.dataset.genreId = genre.id;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                currentSearchQuery = ''; // Clear search
                searchInput.value = ''; // Clear search input
                currentFilterType = 'genre';
                currentGenreId = genre.id;
                // Deactivate all general nav links
                document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
                // Activate the dropdown link (if applicable) or just fetch
                const dropbtn = document.querySelector('.dropbtn');
                if (dropbtn) dropbtn.classList.add('active');

                fetchAndDisplayMovies(1, '', 'genre', genre.id);
                navLinks.classList.remove('active'); // Close mobile menu if open
            });
            genreFilterDropdown.appendChild(a);
        });
    } else {
        // Handle error for genre list
        const a = document.createElement('a');
        a.textContent = 'Gagal memuat genre';
        a.style.color = '#e50914';
        genreFilterDropdown.appendChild(a);
    }
}

// Event listeners for main navigation filters
document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.dataset.filterGenre) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active from all and add to clicked
            document.querySelectorAll('.nav-links a').forEach(navLink => navLink.classList.remove('active'));
            e.target.classList.add('active');

            currentSearchQuery = ''; // Clear search
            searchInput.value = ''; // Clear search input
            currentGenreId = null; // Clear genre filter
            currentFilterType = e.target.dataset.filterGenre;
            fetchAndDisplayMovies(1, '', currentFilterType);
            navLinks.classList.remove('active'); // Close mobile menu if open
        });
    }
});


// --- Movie Detail Modal ---
async function showMovieDetail(movieId) {
    modalBody.innerHTML = ''; // Clear previous details
    modalLoadingOverlay.style.display = 'flex'; // Show modal spinner
    modalErrorMessage.style.display = 'none'; // Hide previous error

    // Fetch movie details
    const movieData = await fetchApi(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`, null, modalErrorMessage);
    
    // Fetch videos (trailers)
    const videoData = await fetchApi(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`, null, modalErrorMessage);

    modalLoadingOverlay.style.display = 'none'; // Hide modal spinner

    if (movieData) {
        const posterUrl = getImageUrl(movieData.poster_path, 'w500');
        const genres = movieData.genres.map(genre => `<span>${genre.name}</span>`).join('');
        
        let trailerEmbed = '';
        if (videoData && videoData.results.length > 0) {
            // Find a YouTube trailer
            const trailer = videoData.results.find(vid => vid.site === 'YouTube' && (vid.type === 'Trailer' || vid.type === 'Teaser'));
            if (trailer) {
                trailerEmbed = `
                    <div class="trailer-section">
                        <h3>Trailer</h3>
                        <div class="video-container">
                            <iframe src="${YOUTUBE_EMBED_URL}${trailer.key}" frameborder="0" allowfullscreen></iframe>
                        </div>
                    </div>
                `;
            } else {
                 trailerEmbed = `<div class="trailer-section"><p style="color:#aaa;">Tidak ada trailer yang tersedia.</p></div>`;
            }
        } else {
             trailerEmbed = `<div class="trailer-section"><p style="color:#aaa;">Tidak ada video yang tersedia.</p></div>`;
        }

        modalBody.innerHTML = `
            <img src="${posterUrl}" alt="${movieData.title}" class="modal-poster">
            <div class="modal-details">
                <h2>${movieData.title}</h2>
                <p><strong>Sinopsis:</strong> ${movieData.overview || 'Tidak ada sinopsis tersedia.'}</p>
                <p><strong>Rating:</strong> ${movieData.vote_average ? movieData.vote_average.toFixed(1) : 'N/A'} (${movieData.vote_count} suara)</p>
                <p><strong>Rilis:</strong> ${movieData.release_date || 'N/A'}</p>
                <p><strong>Durasi:</strong> ${movieData.runtime ? `${movieData.runtime} menit` : 'N/A'}</p>
                <p><strong>Genre:</strong> <span class="genre-list">${genres || 'N/A'}</span></p>
                ${movieData.homepage ? `<p><a href="${movieData.homepage}" target="_blank" style="color:#007bff; text-decoration:none;">Kunjungi Situs Resmi</a></p>` : ''}
            </div>
            ${trailerEmbed}
        `;
        movieDetailModal.style.display = 'block';
    } else {
        // Error message already handled by fetchApi
    }
}

// Close modal when close button is clicked
closeButton.addEventListener('click', () => {
    movieDetailModal.style.display = 'none';
    modalBody.innerHTML = ''; // Clear content when closing
});

// Close modal when clicking outside of modal content
window.addEventListener('click', (event) => {
    if (event.target === movieDetailModal) {
        movieDetailModal.style.display = 'none';
        modalBody.innerHTML = ''; // Clear content when closing
    }
});

// Close modal when 'Escape' key is pressed
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && movieDetailModal.style.display === 'block') {
        movieDetailModal.style.display = 'none';
        modalBody.innerHTML = ''; // Clear content when closing
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

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    displayHeroMovie();
    populateGenres(); // Populate genres first
    fetchAndDisplayMovies(1, '', 'popular'); // Load popular movies initially
    // Set 'Beranda' as active by default
    document.querySelector('.nav-links a[data-filter-genre="popular"]').classList.add('active');
});
