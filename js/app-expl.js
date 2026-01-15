// Sélectionne les sections et les liens de navigation
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');

// Shared keys (keep identical across scripts)
// Avoid global redeclaration collisions if other scripts define similar constants.
const APP_EXPL_THEME_STORAGE_KEY = (typeof THEME_STORAGE_KEY !== 'undefined')
    ? THEME_STORAGE_KEY
    : 'theme';
const APP_EXPL_LANGUAGE_STORAGE_KEY = (typeof LANGUAGE_STORAGE_KEY !== 'undefined')
    ? LANGUAGE_STORAGE_KEY
    : 'selectedLanguage';

// Fonction pour activer le lien correspondant à la section visible
window.onscroll = () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        // Vérifie si la section est actuellement visible dans la fenêtre
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id'); // Obtient l'ID de la section visible
        }
    });

    // Supprime la classe "active" de tous les liens de navigation
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active'); // Active le lien correspondant à la section visible
        }
    });
};

// Menu pour petits écrans
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.querySelector('.navbar');

function setMenuAriaExpanded() {
    if (!menuToggle || !navbar) return;
    const expanded = navbar.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    menuToggle.setAttribute('aria-label', expanded ? 'Close menu' : 'Open menu');
}

function toggleMenu() {
    if (!navbar) return;
    navbar.classList.toggle('active');
    setMenuAriaExpanded();
}

if (menuToggle && navbar) {
    menuToggle.addEventListener('click', toggleMenu);
    menuToggle.addEventListener('keydown', (e) => {
        const isActivate = e.key === 'Enter' || e.key === ' ';
        if (!isActivate) return;
        e.preventDefault();
        toggleMenu();
    });

    setMenuAriaExpanded();
}

// Sauvegarder la langue choisie
function changeLanguage(select) {
    const selectedLanguage = select.value;
    localStorage.setItem(APP_EXPL_LANGUAGE_STORAGE_KEY, selectedLanguage);

    updateLogoLinksForLanguage(selectedLanguage);

    if (selectedLanguage === 'en') {
        window.location.href = 'explore-projects.html';
    } else if (selectedLanguage === 'fr') {
        window.location.href = 'explore-projects_fr.html';
    }
}

function updateLogoLinksForLanguage(lang) {
    const normalized = (lang === 'fr') ? 'fr' : 'en';
    const homeHref = normalized === 'fr' ? 'home_fr.html' : 'index.html';
    document.querySelectorAll('a.logo').forEach(logo => logo.setAttribute('href', homeHref));
}

// Charger la langue sauvegardée
window.onload = function() {
    const savedLanguage = localStorage.getItem(APP_EXPL_LANGUAGE_STORAGE_KEY);
    const langDesktop = document.getElementById('lang');
    const langMobile = document.getElementById('lang-mobile');

    if (savedLanguage) {
        updateLogoLinksForLanguage(savedLanguage);
        if (langDesktop) langDesktop.value = savedLanguage;
        if (langMobile) langMobile.value = savedLanguage;

        const isFrenchPage = window.location.pathname.includes('_fr');
        if (savedLanguage === 'fr' && !isFrenchPage) {
            window.location.href = 'explore-projects_fr.html';
        } else if (savedLanguage === 'en' && isFrenchPage) {
            window.location.href = 'explore-projects.html';
        }
    } else {
        updateLogoLinksForLanguage(window.location.pathname.includes('_fr') ? 'fr' : 'en');
    }
};

const body = document.body;

// Toggle theme and save preference in localStorage
const themeToggleBtns = document.querySelectorAll('.theme-toggle');
themeToggleBtns.forEach(btn => {
    const handleToggleTheme = () => {
        // Check if currently dark (fallback to dark if no class)
        const isDark = body.classList.contains('dark-theme') || (!body.classList.contains('light-theme'));

        if (isDark) {
            // Switch to Light
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            document.documentElement.className = 'light-theme';
            localStorage.setItem(APP_EXPL_THEME_STORAGE_KEY, 'light');
        } else {
            // Switch to Dark
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            document.documentElement.className = 'dark-theme';
            localStorage.setItem(APP_EXPL_THEME_STORAGE_KEY, 'dark');
        }
    };

    btn.addEventListener('click', handleToggleTheme);
    btn.addEventListener('keydown', (e) => {
        const isActivate = e.key === 'Enter' || e.key === ' ';
        if (!isActivate) return;
        e.preventDefault();
        handleToggleTheme();
    });
});

document.addEventListener("DOMContentLoaded", async function () {
    const isFrench = window.location.pathname.includes('_fr');
    const jsonFile = isFrench ? 'data/projects_fr.json' : 'data/projects.json';
    const selectorYear = document.getElementById("time");
    const statsSection = document.querySelector('.stats');
    const projectGrid = document.querySelector('.wk-grid');
    const projectNumber = document.getElementById("projectNumber");
    const toolsNumber = document.getElementById("toolsNumber");
    const toolSet = new Set();
    let projects = [];

    function getProjectYear(project) {
        const date = new Date(project.date);
        if (!Number.isNaN(date.getTime())) return date.getFullYear();

        const yearFallback = parseInt(project.year, 10);
        return Number.isFinite(yearFallback) ? yearFallback : null;
    }

    function getProjectTimestamp(project) {
        const date = new Date(project.date);
        if (!Number.isNaN(date.getTime())) return date.getTime();

        const year = getProjectYear(project);
        return year ? new Date(year, 0, 1).getTime() : 0;
    }

    function projectHasTool(project, tool) {
        const tools = Array.isArray(project.tools) ? project.tools : [];
        return tools.some(t => (t || '').trim() === tool);
    }

    try {
        const response = await fetch(jsonFile);
        projects = await response.json();

        // Populate year filter dynamically (min -> max) so new years appear automatically
        populateYearFilter(projects, selectorYear);

        // Récupérer tous les outils uniques
        projects.forEach(p => p.tools.forEach(t => {
            if (t.trim() !== "") toolSet.add(t.trim());
        }));

        // Créer le filtre tools
        createToolFilter(toolSet);

        // Initialiser affichage
        updateProjects();

        // Listeners filtres
        selectorYear.addEventListener("change", updateProjects);
        document.getElementById('tool-filter').addEventListener("change", updateProjects);

    } catch (error) {
        console.error("Erreur JSON :", error);

        // Fallback HTML si JSON échoue
        const fallbackBoxes = document.querySelectorAll(".box");
        projectNumber.textContent = fallbackBoxes.length;
        let fallbackTools = 0;
        fallbackBoxes.forEach(box => {
            fallbackTools += box.querySelectorAll(".tools-used p").length;
        });
        toolsNumber.textContent = fallbackTools;
    }

    function createToolFilter(toolSet) {
        if (!document.querySelector('#tool-filter')) {
            const filterSelect = document.createElement('select');
            filterSelect.id = 'tool-filter';
            filterSelect.innerHTML = `<option value="all">${isFrench ? 'Tous les outils' : 'All Tools'}</option>`;
            Array.from(toolSet).sort().forEach(tool => {
                const option = document.createElement('option');
                option.value = tool;
                option.textContent = tool;
                filterSelect.appendChild(option);
            });
            statsSection.appendChild(filterSelect);
        }
    }

    function populateYearFilter(projects, selector) {
        if (!selector) return;

        const years = projects
            .map(p => {
                return getProjectYear(p);
            })
            .filter(y => y !== null);

        if (years.length === 0) return;

        const minYear = Math.min(...years);
        const maxYear = Math.max(...years);

        // Preserve the existing first option (usually "All" / "Tout") if present
        let allOption = selector.querySelector('option[value="all"]');
        if (!allOption) {
            allOption = document.createElement('option');
            allOption.value = 'all';
            allOption.textContent = isFrench ? 'Tout' : 'All';
            selector.appendChild(allOption);
        }

        const previousValue = selector.value;

        // Remove all options except the "all" option
        Array.from(selector.querySelectorAll('option'))
            .filter(opt => opt.value !== 'all')
            .forEach(opt => opt.remove());

        for (let y = minYear; y <= maxYear; y++) {
            const option = document.createElement('option');
            option.value = String(y);
            option.textContent = String(y);
            selector.appendChild(option);
        }

        // Restore selection if still valid
        if (previousValue && selector.querySelector(`option[value="${CSS.escape(previousValue)}"]`)) {
            selector.value = previousValue;
        } else {
            selector.value = 'all';
        }
    }

    function updateCounters(projectList) {
        if (!projectNumber || !toolsNumber) return;

        projectNumber.textContent = projectList.length;

        const uniqueTools = new Set();
        projectList.forEach(p => {
            (p.tools || []).forEach(t => {
                const tool = (t || '').trim();
                if (tool) uniqueTools.add(tool);
            });
        });

        toolsNumber.textContent = uniqueTools.size;
    }

    function updateProjects() {
        const year = selectorYear ? selectorYear.value : 'all';
        const toolSelect = document.getElementById('tool-filter');
        const tool = toolSelect ? toolSelect.value : 'all';

        let filtered = projects.filter(p => {
            const projectYear = getProjectYear(p);
            const matchesYear = year === 'all' || (projectYear !== null && String(projectYear) === year);
            const matchesTool = tool === 'all' || projectHasTool(p, tool);
            return matchesYear && matchesTool;
        });

        filtered.sort((a, b) => getProjectTimestamp(b) - getProjectTimestamp(a));
        updateCounters(filtered);
        renderProjects(filtered);
    }

    function renderProjects(projectList) {
        projectGrid.innerHTML = "";
        projectList.forEach(project => {
            const toolsHTML = project.tools.filter(t => t).map(t => `<p>${t}</p>`).join('');

            const link1 = (project.link1 || '').trim();
            const link2 = (project.link2 || '').trim();

            // Title: prefer link1, fallback to link2, else render as plain text
            const titleHref = link1 || link2;
            const titleHTML = titleHref
                ? `<a href="${titleHref}" class="hover-link" target="_blank" rel="noopener noreferrer">${project.title}</a>`
                : `${project.title}`;

            // Read-more button: only render if we have a destination
            const readMoreHTML = link2
                ? `<a href="${link2}" class="rm" target="_blank" rel="noopener noreferrer">${isFrench ? 'Lire plus ➜' : 'Read more ➜'}</a>`
                : '';

            const box = document.createElement('div');
            box.className = 'box';
            box.setAttribute('date', project.date);

            box.innerHTML = `
                <div class="img-wk">
                    <img src="${project.pic}" alt="project${project.n}">
                </div>
                <div class="tdd">
                    <h2>${titleHTML}</h2>
                    <p>📅 ${project.monh}, ${project.year}</p>
                    <div class="tools-used">${toolsHTML}</div>
                    <p>${project.description}</p>
                    ${readMoreHTML}
                </div>
            `;
            projectGrid.appendChild(box);
        });
    }
});

// To top button
window.addEventListener('scroll', function() {
    const toTopButton = document.querySelector('.to-top');
    const welcomeSection = document.querySelector('#welcome');
    const rect = welcomeSection.getBoundingClientRect();
    toTopButton.style.display = rect.bottom <= 0 ? 'block' : 'none';
});
