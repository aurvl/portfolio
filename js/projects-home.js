document.addEventListener('DOMContentLoaded', async () => {
    const isFrench = document.documentElement.lang === 'fr' || window.location.href.includes('_fr');
    const dataUrl = isFrench ? 'data/projects_fr.json' : 'data/projects.json';

    const mainContainer = document.getElementById('home-projects-main');
    const sideContainer = document.getElementById('home-projects-side');

    if (!mainContainer) return;

    const clear = (el) => {
        while (el.firstChild) el.removeChild(el.firstChild);
    };

    const fallback = (message) => {
        clear(mainContainer);
        const content = document.createElement('div');
        content.className = 'main-content-wk';
        const p = document.createElement('p');
        p.style.textAlign = 'left';
        p.style.color = 'var(--text2-col)';
        p.textContent = message;
        content.appendChild(p);
        mainContainer.appendChild(content);
        if (sideContainer) sideContainer.innerHTML = '';
    };

    const renderMain = (project) => {
        clear(mainContainer);

        const imgWrap = document.createElement('div');
        imgWrap.className = 'main-img-wk';

        const img = document.createElement('img');
        img.src = project?.pic || '';
        img.alt = isFrench ? 'projet' : 'project';
        img.onerror = () => {
            img.style.display = 'none';
        };
        imgWrap.appendChild(img);

        const content = document.createElement('div');
        content.className = 'main-content-wk';

        const h2 = document.createElement('h2');
        const a = document.createElement('a');
        const href = (project?.link1 && project.link1.trim()) ? project.link1 : (project?.link2 || '#');
        a.href = href;
        a.className = 'hover-link';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = project?.title || (isFrench ? 'Projet' : 'Project');
        h2.appendChild(a);

        const dateP = document.createElement('p');
        const month = project?.monh || '';
        const year = project?.year || '';
        const dateLabel = [month, year].filter(Boolean).join(', ');
        dateP.textContent = `📅 ${dateLabel}`;

        const toolsWrap = document.createElement('div');
        toolsWrap.className = 'tools-used';
        const tools = Array.isArray(project?.tools)
            ? project.tools.filter(t => typeof t === 'string' && t.trim().length > 0)
            : [];
        tools.forEach(tool => {
            const tp = document.createElement('p');
            tp.textContent = tool;
            toolsWrap.appendChild(tp);
        });

        const descP = document.createElement('p');
        descP.textContent = project?.description || '';

        content.appendChild(h2);
        content.appendChild(dateP);
        content.appendChild(toolsWrap);
        content.appendChild(descP);

        mainContainer.appendChild(imgWrap);
        mainContainer.appendChild(content);
    };

    try {
        const response = await fetch(dataUrl, { cache: 'no-store' });
        if (!response.ok) {
            fallback(isFrench ? "Impossible de charger les projets pour le moment." : "Unable to load projects right now.");
            return;
        }

        const projects = await response.json();
        if (!Array.isArray(projects) || projects.length === 0) {
            fallback(isFrench ? "Aucun projet trouvé." : "No projects found.");
            return;
        }

        const sorted = [...projects].sort((a, b) => {
            const da = Date.parse(a?.date || '') || 0;
            const db = Date.parse(b?.date || '') || 0;
            return db - da;
        });

        // N=1: only show the latest project (as the main card)
        renderMain(sorted[0]);

        if (sideContainer) sideContainer.innerHTML = '';

    } catch (e) {
        fallback(isFrench ? "Impossible de charger les projets pour le moment." : "Unable to load projects right now.");
    }
});
