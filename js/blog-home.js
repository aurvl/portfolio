document.addEventListener('DOMContentLoaded', async () => {
    // Determine language from HTML lang attribute or URL
    const isFrench = document.documentElement.lang === 'fr' || window.location.href.includes('_fr');
    const lang = isFrench ? 'fr' : 'en';

    // Fetch posts
    const posts = await getPosts(lang);
    
    // Get the container
    const blogContainer = document.querySelector('.posts');
    if (!blogContainer) return;

    // Clear existing static content if any
    blogContainer.innerHTML = '';

    // Take top 3 for homepage
    const recentPosts = posts.slice(0, 3);

    if (recentPosts.length === 0) {
        blogContainer.innerHTML = '<p style="text-align:center; width:100%; color: var(--text2-col);">No posts found.</p>';
        return;
    }

    recentPosts.forEach(post => {
        const article = document.createElement('article');
        article.className = 'blog-card';
        
        // Define paths relative to root since we are on index.html
        // Note: post.cover in JSON is "assets/img/..." which works fine from root
        
        article.innerHTML = `
            <div class="blog-img">
                <a href="pages/post.html?id=${post.id}">
                    <img src="${post.cover}" alt="${post.title}" onerror="this.style.display='none'">
                </a>
            </div>
            <div class="blog-content">
                <h3>
                    <a href="pages/post.html?id=${post.id}">${post.title}</a>
                </h3>
                <p>${post.excerpt}</p>
                <a href="pages/post.html?id=${post.id}" class="read-more">
                    ${isFrench ? 'Lire plus' : 'Read more'} <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        `;
        
        blogContainer.appendChild(article);
    });

    // --- Add CTA Card (4th slot) ---
    const ctaCard = document.createElement('article');
    ctaCard.className = 'blog-card cta-card';
    const blogUrl = isFrench ? 'pages/blog_fr.html' : 'pages/blog.html';
    const ctaText = isFrench ? 'Voir plus d’articles' : 'See more articles';
    
    ctaCard.innerHTML = `
        <a href="${blogUrl}" class="cta-link-wrapper">
            <div class="cta-content">
                <h3>${ctaText}</h3>
            </div>
        </a>
    `;
    blogContainer.appendChild(ctaCard);

});
