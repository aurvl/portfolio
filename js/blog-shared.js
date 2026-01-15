// Shared logic for fetching and filtering posts

// Base path adjustment (handles deeper levels if needed, though simpler is better)
// Check if we are inside the 'pages' directory
const isPagesDir = window.location.pathname.includes('/pages/');
const POSTS_URL = isPagesDir ? '../data/posts.json' : 'data/posts.json';

// Language persistence (shared across site)
const LANGUAGE_STORAGE_KEY = 'selectedLanguage';

function normalizeLanguage(value) {
    if (!value) return null;
    const v = String(value).trim().toLowerCase();
    if (v === 'en' || v === 'fr') return v;
    // Support legacy/inline select values that are URLs
    if (v.includes('blog_fr')) return 'fr';
    if (v.includes('blog.html')) return 'en';
    return null;
}

function getCurrentPageLanguage() {
    const isFrench = document.documentElement.lang === 'fr' || window.location.href.includes('_fr');
    return isFrench ? 'fr' : 'en';
}

function getSavedLanguage() {
    return normalizeLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY));
}

function setSavedLanguage(lang) {
    const normalized = normalizeLanguage(lang);
    if (!normalized) return;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
}

function getHomeHrefForLanguage(lang) {
    const normalized = normalizeLanguage(lang) || 'en';
    if (isPagesDir) return normalized === 'fr' ? '../home_fr.html' : '../index.html';
    return normalized === 'fr' ? 'home_fr.html' : 'index.html';
}

function getExploreHrefForLanguage(lang) {
    const normalized = normalizeLanguage(lang) || 'en';
    if (isPagesDir) return normalized === 'fr' ? '../explore-projects_fr.html' : '../explore-projects.html';
    return normalized === 'fr' ? 'explore-projects_fr.html' : 'explore-projects.html';
}

function getBlogListHrefForLanguage(lang) {
    const normalized = normalizeLanguage(lang) || 'en';
    if (isPagesDir) return normalized === 'fr' ? 'blog_fr.html' : 'blog.html';
    return normalized === 'fr' ? 'pages/blog_fr.html' : 'pages/blog.html';
}

function syncLanguageSelectors(lang) {
    const normalized = normalizeLanguage(lang);
    if (!normalized) return;

    const desktop = document.getElementById('lang');
    const mobile = document.getElementById('lang-mobile');
    if (desktop) desktop.value = normalized;
    if (mobile) mobile.value = normalized;
}

// Blog pages call this from inline onchange.
function changeLanguage(selectOrValue) {
    const raw = typeof selectOrValue === 'string' ? selectOrValue : selectOrValue?.value;
    const lang = normalizeLanguage(raw);
    if (!lang) return;

    setSavedLanguage(lang);
    syncLanguageSelectors(lang);

    // Navigate to equivalent blog list page.
    window.location.href = getBlogListHrefForLanguage(lang);
}

function ensureBlogLanguageCoherence() {
    const saved = getSavedLanguage();
    const current = getCurrentPageLanguage();

    // No saved preference yet: adopt current page language.
    if (!saved) {
        setSavedLanguage(current);
        syncLanguageSelectors(current);
        return;
    }

    // Keep selectors consistent.
    syncLanguageSelectors(saved);

    // On blog list pages, redirect to preferred language if needed.
    const path = window.location.pathname;
    const isBlogList = /\/blog(_fr)?\.html$/.test(path);
    if (isBlogList && saved !== current) {
        window.location.replace(getBlogListHrefForLanguage(saved));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Only runs meaningful logic if the page has a language selector or is a blog list.
    ensureBlogLanguageCoherence();

    // Ensure the logo always points to the correct homepage language.
    const saved = getSavedLanguage() || getCurrentPageLanguage();
    const logos = document.querySelectorAll('a.logo');
    logos.forEach(logo => logo.setAttribute('href', getHomeHrefForLanguage(saved)));
});

// Fetch all posts
async function fetchPosts() {
    try {
        const response = await fetch(POSTS_URL);
        if (!response.ok) throw new Error('Failed to load posts');
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

// Get posts filtered by language and sorted by date
async function getPosts(lang = 'en') {
    const posts = await fetchPosts();
    return posts
        .filter(post => post.lang === lang)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Get a single post by ID
async function getPostById(id) {
    const posts = await fetchPosts();
    return posts.find(post => post.id === id);
}

// Format Date helper
function formatDate(dateString, locale = undefined) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(locale, options);
}
