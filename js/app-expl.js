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
const savedTheme = localStorage.getItem('theme') || 'dark';
body.classList.add(savedTheme + '-theme');
themeToggleBtn.textContent = savedTheme === 'dark' ? '🌞' : '🌙';

// Toggle theme and save preference in localStorage
themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
        body.classList.replace('dark-theme', 'light-theme');
        themeToggleBtn.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.replace('light-theme', 'dark-theme');
        themeToggleBtn.textContent = '🌞';
        localStorage.setItem('theme', 'dark');
    }
});

// Calcul des stats
document.addEventListener("DOMContentLoaded", function() {
    var projectBoxes = document.querySelectorAll(".box").length;
    document.getElementById("projectNumber").textContent = projectBoxes;
});

document.addEventListener("DOMContentLoaded", function() {
    // Sélectionne toutes les divs avec la classe "tools-used"
    const toolDivs = document.querySelectorAll(".tools-used");
    
    // Initialiser un compteur pour toutes les balises <p>
    let totalPCount = 0;

    // Parcourt chaque div.tools-used pour compter les balises <p>
    toolDivs.forEach(div => {
        totalPCount += div.querySelectorAll("p").length;
    });

    // Met à jour le contenu de la div avec l'id "tools-count"
    const toolsCountDiv = document.getElementById("toolsNumber");
    toolsCountDiv.textContent += ` ${totalPCount}`;
});

// Date selector
// document.addEventListener("DOMContentLoaded", function () {
//     const selector = document.getElementById("time"); // Menu déroulant
//     const projects = document.querySelectorAll(".box"); // Tous les projets

//     // Fonction pour afficher les projets de l'année sélectionnée
//     const filterProjects = () => {
//         const selectedYear = selector.value; // Année choisie

//         // Parcourt tous les projets
//         projects.forEach(project => {
//             const projectYear = project.getAttribute("year"); // Année du projet
//             if (selectedYear === "all" || selectedYear === projectYear) {
//                 project.style.display = "block"; // Affiche le projet
//             } else {
//                 project.style.display = "none"; // Cache le projet
//             }
//         });
//     };

//     // Événement pour changer les projets affichés selon l'année
//     selector.addEventListener("change", filterProjects);

//     // Afficher tous les projets au chargement
//     filterProjects();
// });

document.addEventListener("DOMContentLoaded", function () {
    const selector = document.getElementById("time"); // Menu déroulant
    const projectGrid = document.querySelector(".wk-grid"); // Conteneur des projets
    const projects = Array.from(document.querySelectorAll(".box")); // Tous les projets sous forme de tableau

    // Fonction pour trier les projets par date (décroissant)
    const sortProjectsByDate = () => {
        projects.sort((a, b) => {
            const dateA = new Date(a.getAttribute("date"));
            const dateB = new Date(b.getAttribute("date"));
            return dateB - dateA; // Tri décroissant
        });

        // Réorganiser les projets dans le DOM
        projects.forEach(project => {
            projectGrid.appendChild(project);
        });
    };

    // Fonction pour filtrer les projets selon l'année sélectionnée
    const filterProjects = () => {
        const selectedYear = selector.value; // Année choisie

        projects.forEach(project => {
            const projectDate = new Date(project.getAttribute("date"));
            const projectYear = projectDate.getFullYear(); // Extraire l'année

            if (selectedYear === "all" || parseInt(selectedYear) === projectYear) {
                project.style.display = "block"; // Afficher
            } else {
                project.style.display = "none"; // Masquer
            }
        });

        // Réorganiser les projets affichés
        sortProjectsByDate();
    };

    // Tri initial et affichage
    sortProjectsByDate();

    // Mise à jour lors du changement d'année
    selector.addEventListener("change", filterProjects);
});

// To top button
window.addEventListener('scroll', function() {
    const toTopButton = document.querySelector('.to-top');
    const welcomeSection = document.querySelector('#welcome');
    const rect = welcomeSection.getBoundingClientRect();

    // Si la section "welcome" est complètement visible à l'écran, on cache le bouton
    if (rect.bottom <= 0) {
        toTopButton.style.display = 'block';  // Afficher le bouton
    } else {
        toTopButton.style.display = 'none';   // Masquer le bouton
    }
});