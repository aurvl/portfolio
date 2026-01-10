// Shared logic for fetching and filtering posts

// Base path adjustment (handles deeper levels if needed, though simpler is better)
// Check if we are inside the 'pages' directory
const isPagesDir = window.location.pathname.includes('/pages/');
const POSTS_URL = isPagesDir ? '../data/posts.json' : 'data/posts.json';

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
