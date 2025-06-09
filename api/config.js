// WARNING: Dalam proyek real, JANGAN PERNAH menyertakan API Key sensitif langsung di frontend.
// Ini hanya untuk tujuan demonstrasi sederhana. Untuk aplikasi produksi, gunakan server-side proxy
// atau environment variables yang aman.

const API_KEY = 'YOUR_API_KEY'; // Ganti dengan API Key TMDb v3 Anda
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const YOUTUBE_EMBED_URL = 'https://www.youtube.com/embed/'; // URL dasar untuk embed YouTube

export { API_KEY, BASE_URL, IMAGE_BASE_URL, YOUTUBE_EMBED_URL };
