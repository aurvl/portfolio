// Sélectionne les sections et les liens de navigation
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');

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

menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
});


function changeLanguage(select) {
    const selectedLanguage = select.value;
    
    // Vérifier la langue sélectionnée et rediriger vers la bonne page
    if (selectedLanguage === 'en') {
        window.location.href = 'explore-projects.html';  // Page en anglais
    } else if (selectedLanguage === 'fr') {
        window.location.href = 'explore-projects_fr.html';  // Page en français
    }
}


// Sauvegarder la langue choisie
function changeLanguage(select) {
    const selectedLanguage = select.value;
    localStorage.setItem('selectedLanguage', selectedLanguage);

    if (selectedLanguage === 'en') {
        window.location.href = 'explore-projects.html';
    } else if (selectedLanguage === 'fr') {
        window.location.href = 'explore-projects_fr.html';
    }
}

// Charger la langue sauvegardée
window.onload = function() {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
        document.getElementById('lang').value = savedLanguage;
    }
};

const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme in localStorage
// Note: Logic moved to inline script in head to prevent FOUC
const savedTheme = localStorage.getItem('theme') || 'dark';

// Toggle theme and save preference in localStorage
themeToggleBtn.addEventListener('click', () => {
    // Check if currently dark (fallback to dark if no class)
    const isDark = body.classList.contains('dark-theme') || (!body.classList.contains('light-theme'));

    if (isDark) {
        // Switch to Light
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        document.documentElement.className = 'light-theme';
        localStorage.setItem('theme', 'light');
    } else {
        // Switch to Dark
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        document.documentElement.className = 'dark-theme';
        localStorage.setItem('theme', 'dark');
    }
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

    try {
        const response = await fetch(jsonFile);
        projects = await response.json();

        // Compter projets et outils
        projectNumber.textContent = projects.length;
        const totalTools = projects.reduce((acc, p) => acc + p.tools.filter(t => t.trim() !== "").length, 0);
        toolsNumber.textContent = totalTools;

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

    function updateProjects() {
        const year = selectorYear.value;
        const tool = document.getElementById('tool-filter').value;

        let filtered = projects.filter(p => {
            const matchesYear = year === 'all' || new Date(p.date).getFullYear().toString() === year;
            const matchesTool = tool === 'all' || p.tools.includes(tool);
            return matchesYear && matchesTool;
        });

        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        renderProjects(filtered);
    }

    function renderProjects(projectList) {
        projectGrid.innerHTML = "";
        projectList.forEach(project => {
            const toolsHTML = project.tools.filter(t => t).map(t => `<p>${t}</p>`).join('');
            const box = document.createElement('div');
            box.className = 'box';
            box.setAttribute('date', project.date);

            box.innerHTML = `
                <div class="img-wk">
                    <img src="img/${project.pic}" alt="project${project.n}">
                </div>
                <div class="tdd">
                    <h2><a href="${project.link1}" class="hover-link" target="_blank">${project.title}</a></h2>
                    <p>📅 ${project.monh}, ${project.year}</p>
                    <div class="tools-used">${toolsHTML}</div>
                    <p>${project.description}</p>
                    <a href="${project.link2}" class="rm" target="_blank">${isFrench ? 'Lire plus ➜' : 'Read more ➜'}</a>
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
