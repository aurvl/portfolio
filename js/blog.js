document.addEventListener('DOMContentLoaded', async () => {
    // Current Page Lang logic: Use HTML attribute as source of truth
    const isFrench = document.documentElement.lang === 'fr' || window.location.href.includes('_fr');
    const lang = isFrench ? 'fr' : 'en';
    
    // Store all fetched posts to allow filtering without re-fetching
    let allPosts = await getPosts(lang);
    
    // Initial Render
    renderPosts(allPosts, lang, isFrench);
    initFilters(allPosts);

    // Filter Logic
    const searchInput = document.getElementById('search-input');
    const yearSelect = document.getElementById('filter-year');
    const tagSelect = document.getElementById('filter-tag');

    function filterPosts() {
        const query = searchInput.value.toLowerCase();
        const year = yearSelect.value;
        const tag = tagSelect.value;

        const filtered = allPosts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(query) || 
                                (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
                                (typeof post.content === 'string' && post.content.toLowerCase().includes(query));
            
            const postYear = new Date(post.date).getFullYear().toString();
            const matchesYear = year === '' || postYear === year;

            const matchesTag = tag === '' || (post.tags && post.tags.includes(tag));

            return matchesSearch && matchesYear && matchesTag;
        });

        renderPosts(filtered, lang, isFrench);
    }

    searchInput.addEventListener('input', filterPosts);
    yearSelect.addEventListener('change', filterPosts);
    tagSelect.addEventListener('change', filterPosts);

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.querySelector('.navbar');

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });
    }
});

function initFilters(posts) {
    const yearSelect = document.getElementById('filter-year');
    const tagSelect = document.getElementById('filter-tag');

    // Extract Years
    const years = [...new Set(posts.map(p => new Date(p.date).getFullYear()))].sort((a,b) => b-a);
    years.forEach(y => {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        yearSelect.appendChild(opt);
    });

    // Extract Tags
    const tags = [...new Set(posts.flatMap(p => p.tags || []))].sort();
    tags.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        tagSelect.appendChild(opt);
    });
}

function renderPosts(posts, lang, isFrench) {
    const grid = document.querySelector('.blog-grid'); 
    if (!grid) return;

    grid.innerHTML = '';

    if (posts.length === 0) {
        grid.innerHTML = `<p style="text-align: center; width: 100%; grid-column: 1 / -1; margin-top: 50px; color: var(--text2-col);">
            ${isFrench ? 'Aucun article trouvé pour ces critères.' : 'No posts found matching your criteria.'}
        </p>`;
        return;
    }

    posts.forEach(post => {
        // Create card reusing "box" style from projects or "blog-card" from home
        // Let's use the .blog-card style grid adapted for the page
        const card = document.createElement('article');
        card.className = 'blog-card';
        
        // Fix path: we are in pages/blog.html, so assets are ../assets
        const imgPath = '../' + post.cover;
        const linkPath = `post.html?id=${post.id}`;

        card.innerHTML = `
            <div class="blog-img">
                <a href="${linkPath}">
                    <img src="${imgPath}" alt="${post.title}" onerror="this.style.display='none'">
                </a>
            </div>
            <div class="blog-content">
                <h3><a href="${linkPath}">${post.title}</a></h3>
                <p>${post.excerpt || ''}</p>
                <div style="margin-top: 10px; font-size: 0.9em; color: var(--text2-col); display: flex; justify-content: space-between; align-items: center;">
                    <span>${formatDate(post.date, lang)}</span>
                    <span style="font-size: 0.85rem;">${post.tags ? post.tags.slice(0, 2).map(t => `#${t}`).join(' ') : ''}</span>
                </div>
                <!-- Abstract/Excerpt already shown above -->
                <a href="${linkPath}" class="read-more">
                    ${isFrench ? 'Lire plus' : 'Read more'} <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}
