const POST_PAGE_LANGUAGE_STORAGE_KEY = (typeof LANGUAGE_STORAGE_KEY !== 'undefined')
    ? LANGUAGE_STORAGE_KEY
    : 'selectedLanguage';
const POST_PAGE_ID_QUERY_PARAM = 'id';

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get(POST_PAGE_ID_QUERY_PARAM);

    const container = document.querySelector('.post-container');
    if (!container) return;

    const isMarkedAvailable = typeof marked !== 'undefined' && marked && typeof marked.parse === 'function';

    function escapeHtml(unsafe) {
        return String(unsafe)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    const uiLang = (typeof getSavedLanguage === 'function' ? getSavedLanguage() : null)
        || (localStorage.getItem(POST_PAGE_LANGUAGE_STORAGE_KEY) === 'fr' ? 'fr' : 'en');

    function applyLanguageToHeader(lang) {
        const normalized = (lang === 'fr') ? 'fr' : 'en';

        const logo = document.querySelector('a.logo');
        if (logo) {
            if (typeof getHomeHrefForLanguage === 'function') {
                logo.setAttribute('href', getHomeHrefForLanguage(normalized));
            } else {
                logo.setAttribute('href', normalized === 'fr' ? '../home_fr.html' : '../index.html');
            }
        }

        const navLinks = document.querySelectorAll('.header .navbar a');
        if (navLinks.length >= 4) {
            const homeHref = normalized === 'fr' ? '../home_fr.html' : '../index.html';
            const projectsHref = normalized === 'fr' ? '../explore-projects_fr.html' : '../explore-projects.html';
            const blogHref = normalized === 'fr' ? 'blog_fr.html' : 'blog.html';
            const contactsHref = (normalized === 'fr' ? '../home_fr.html' : '../index.html') + '#contacts';

            navLinks[0].setAttribute('href', homeHref);
            navLinks[1].setAttribute('href', projectsHref);
            navLinks[2].setAttribute('href', blogHref);
            navLinks[3].setAttribute('href', contactsHref);
        }
    }

    function redirectToBlog(lang) {
        const normalized = (lang === 'fr') ? 'fr' : 'en';
        const target = (typeof getBlogListHrefForLanguage === 'function')
            ? getBlogListHrefForLanguage(normalized)
            : (normalized === 'fr' ? 'blog_fr.html' : 'blog.html');
        window.location.replace(target);
    }

    // Keep header navigation coherent with stored language.
    applyLanguageToHeader(uiLang);

    function plainTextToParagraphs(text) {
        const safeText = escapeHtml(text || '');
        return safeText
            .split(/\n{2,}/)
            .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
            .join('');
    }

    function renderError(message, backHref) {
        const href = backHref || 'blog.html';
        container.innerHTML = `
            <div class="post-main" style="max-width: 800px; margin: 120px auto 60px; padding: 0 20px;">
                <div class="post-header">
                    <h1 class="post-title">${escapeHtml(message)}</h1>
                </div>
                <div class="post-footer"><a href="${href}" class="btn">\u2190 Back to Blog</a></div>
            </div>
        `;
    }

    if (!postId) {
        redirectToBlog(uiLang);
        return;
    }

    const post = await getPostById(postId);

    if (!post) {
        redirectToBlog(uiLang);
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
                
                <!-- Mobile TOC Container -->
                <div class="mobile-toc-container" id="mobile-toc">
                    <div class="post-toc-title">${uiLang === 'fr' ? 'Sommaire' : 'On this page'}</div>
                    <nav class="post-toc" id="mobile-toc-list"></nav>
                </div>
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
        // New: Markdown rendering (defensive fallback)
        if (isMarkedAvailable) {
            try {
                let renderedHTML = marked.parse(post.content);
                // Fix asset paths
                renderedHTML = renderedHTML.replace(/src="assets\//g, 'src="../assets/');
                html += renderedHTML;
            } catch (e) {
                console.error('Markdown rendering failed, falling back to plain text:', e);
                html += plainTextToParagraphs(post.content);
            }
        } else {
            html += plainTextToParagraphs(post.content);
        }
    }

    // Sidebar with Table of Contents
    const links = post.links || {};
    
    // Bottom Actions for Mobile
    const bottomActionsHTML = `
        <div class="sidebar-actions mobile-actions">
            ${links.code ? `<a href="${links.code}" class="action-btn" title="View Code" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-code"></i></a>` : ''}
            ${links.download ? `<a href="${links.download}" class="action-btn" title="Download File" target="_blank" rel="noopener noreferrer"><i class="fa-regular fa-file-pdf"></i></a>` : ''}
            <a href="#" class="action-btn share-btn-class" title="Copy Link"><i class="fa-solid fa-link"></i></a>
        </div>
    `;

    html += `</div>`; // Close body
    
    // Previous/Back Link
    const backLink = uiLang === 'fr' ? 'blog_fr.html' : 'blog.html';
    const backText = uiLang === 'fr' ? '← Retour au Blog' : '← Back to Blog';
    
    html += `
        ${bottomActionsHTML}
        <div class="post-footer"><a href="${backLink}" class="btn">${backText}</a></div>
    </div>`; // Close post-main

    // Sidebar with Table of Contents
    html += `
        <aside class="post-sidebar">
            <div class="post-toc-title">${uiLang === 'fr' ? 'Sommaire' : 'On this page'}</div>
            <nav class="post-toc" id="toc-list"></nav>
            
            <div class="sidebar-actions">
                ${links.code ? `<a href="${links.code}" class="action-btn" title="View Code" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-code"></i></a>` : ''}
                ${links.download ? `<a href="${links.download}" class="action-btn" title="Download File" target="_blank" rel="noopener noreferrer"><i class="fa-regular fa-file-pdf"></i></a>` : ''}
                <a href="#" class="action-btn share-btn-class" title="Copy Link"><i class="fa-solid fa-link"></i></a>
            </div>
        </aside>
    `;

    container.innerHTML = html;

    // --- Generate TOC and IDs ---
    const contentDiv = document.getElementById('post-body-content');
    const tocList = document.getElementById('toc-list');
    const mobileTocList = document.getElementById('mobile-toc-list'); // New Mobile TOC List
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
        mobileTocList.innerHTML = tocHTML; // Populate Mobile TOC
    } else {
        document.querySelector('.post-sidebar').style.display = 'none';
        document.getElementById('mobile-toc').style.display = 'none'; // Hide Mobile TOC
        // Center content if no sidebar
        document.querySelector('.post-container').style.justifyContent = 'center'; 
        document.querySelector('.post-main').style.maxWidth = '800px'; 
    }

    // Share Button Logic (Class-based for multiple buttons)
    const shareBtns = document.querySelectorAll('.share-btn-class');
    shareBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(window.location.href).then(() => {
                const icon = btn.querySelector('i');
                icon.className = 'fa-solid fa-check';
                setTimeout(() => {
                    icon.className = 'fa-solid fa-link';
                }, 2000);
            }).catch(err => console.error('Failed to copy', err));
        });
    });
});

// Menu Toggle Logic
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');

if (menuToggle && navbar) {
    const setExpanded = () => {
        const expanded = navbar.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        menuToggle.setAttribute('aria-label', expanded ? 'Close menu' : 'Open menu');
    };

    const toggleMenu = () => {
        navbar.classList.toggle('active');
        setExpanded();
    };

    menuToggle.addEventListener('click', toggleMenu);
    menuToggle.addEventListener('keydown', (e) => {
        const isActivate = e.key === 'Enter' || e.key === ' ';
        if (!isActivate) return;
        e.preventDefault();
        toggleMenu();
    });

    setExpanded();
}
