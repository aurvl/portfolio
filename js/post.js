document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
        window.location.href = 'blog.html';
        return;
    }

    const post = await getPostById(postId);
    const container = document.querySelector('.post-container');

    if (!post) {
        container.innerHTML = '<h1>Post not found</h1><a href="blog.html">Back to Blog</a>';
        return;
    }

    // Set Meta Title
    document.title = `${post.title} | Aurel VEHI`;

    // Render HTML Structure: Main Content + Sidebar
    let html = `
        <div class="post-main">
            <div class="post-header">
                <h1 class="post-title">${post.title}</h1>
                
                ${post.excerpt ? `<div class="post-abstract">${post.excerpt}</div>` : ''}

                <div class="post-meta">
                    <span>${formatDate(post.date, post.lang)}</span>
                    <span class="tags">${post.tags.map(t => `#${t}`).join(' ')}</span>
                </div>
                <img src="../${post.cover}" class="post-cover" alt="${post.title}">
            </div>
            <div class="post-body" id="post-body-content">
    `;

    if (Array.isArray(post.content)) {
        // Legacy: Block-based rendering
        post.content.forEach(block => {
            switch (block.type) {
                case 'h2':
                    html += `<h2>${block.value}</h2>`;
                    break;
                case 'p':
                    html += `<p>${block.value}</p>`;
                    break;
                case 'img':
                    html += `<img src="../${block.src}" alt="${block.alt || ''}">`;
                    break;
                case 'code':
                    html += `<pre><code class="language-${block.lang}">${block.value}</code></pre>`;
                    break;
                case 'list':
                     const items = block.items.map(i => `<li>${i}</li>`).join('');
                     html += `<ul>${items}</ul>`;
                     break;
                default:
                    console.warn('Unknown block type:', block.type);
            }
        });
    } else if (typeof post.content === 'string') {
        // New: Markdown rendering
        let renderedHTML = marked.parse(post.content);
        // Fix asset paths
        renderedHTML = renderedHTML.replace(/src="assets\//g, 'src="../assets/');
        html += renderedHTML;
    }

    html += `</div>`; // Close body
    
    // Previous/Back Link
    const backLink = post.lang === 'fr' ? 'blog_fr.html' : 'blog.html';
    const backText = post.lang === 'fr' ? '← Retour au Blog' : '← Back to Blog';
    html += `<div class="post-footer"><a href="${backLink}" class="btn">${backText}</a></div>
        </div>`; // Close post-main

    // Sidebar with Table of Contents
    html += `
        <aside class="post-sidebar">
            <div class="post-toc-title">${post.lang === 'fr' ? 'Sommaire' : 'On this page'}</div>
            <nav class="post-toc" id="toc-list"></nav>
            
            <div class="sidebar-actions">
                <a href="${post.link_code || '#'}" class="action-btn" title="View Code" target="${(post.link_code && post.link_code !== '#') ? '_blank' : '_self'}"><i class="fa-solid fa-code"></i></a>
                <a href="${post.link_download || '#'}" class="action-btn" title="Download PDF" target="${(post.link_download && post.link_download !== '#') ? '_blank' : '_self'}"><i class="fa-regular fa-file-pdf"></i></a>
                <a href="${post.link_share || '#'}" class="action-btn" title="Share Link" target="${(post.link_share && post.link_share !== '#') ? '_blank' : '_self'}"><i class="fa-solid fa-link"></i></a>
            </div>
        </aside>
    `;

    container.innerHTML = html;

    // --- Generate TOC and IDs ---
    const contentDiv = document.getElementById('post-body-content');
    const tocList = document.getElementById('toc-list');
    const headings = contentDiv.querySelectorAll('h2, h3');

    if (headings.length > 0) {
        let tocHTML = '<ul>';
        headings.forEach((heading, index) => {
             // Create ID if missing
            const id = heading.id || `heading-${index}`;
            heading.id = id;

            const isH3 = heading.tagName.toLowerCase() === 'h3';
            tocHTML += `<li style="${isH3 ? 'margin-left:15px;' : ''}"><a href="#${id}">${heading.textContent}</a></li>`;
        });
        tocHTML += '</ul>';
        tocList.innerHTML = tocHTML;
    } else {
        document.querySelector('.post-sidebar').style.display = 'none';
        // Center content if no sidebar
        document.querySelector('.post-container').style.justifyContent = 'center'; 
        document.querySelector('.post-main').style.maxWidth = '800px'; 
    }
});
