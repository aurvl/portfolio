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

// Fonction de changement de langue avec sauvegarde dans localStorage
function changeLanguage(select) {
    const selectedLanguage = select.value;
    localStorage.setItem('selectedLanguage', selectedLanguage);

    // Redirection en fonction de la langue choisie
    if (selectedLanguage === 'en') {
        window.location.href = 'index.html';
    } else if (selectedLanguage === 'fr') {
        window.location.href = 'home_fr.html';
    }
}

// Charger la langue sauvegardée au chargement de la page
window.onload = function() {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const languageSelect = document.getElementById('lang');

    if (savedLanguage) {
        languageSelect.value = savedLanguage;
        // Redirige vers la version de langue sauvegardée si elle ne correspond pas à la page actuelle
        if (savedLanguage === 'fr' && !window.location.href.includes('home_fr.html')) {
            window.location.href = 'home_fr.html';
        } else if (savedLanguage === 'en' && !window.location.href.includes('index.html')) {
            window.location.href = 'index.html';
        }
    }
};

// Formulaire de contact avec reset après envoi
const form = document.getElementById('myForm');

form.addEventListener('submit', function(e) {
    // Laisser le formulaire se soumettre normalement (en ouvrant un nouvel onglet)
    
    setTimeout(function() {
        // Réinitialiser le formulaire après un court délai
        form.reset();
    }, 1000); // Attendre une seconde avant de réinitialiser pour laisser le formulaire se soumettre
});

const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme in localStorage
// Note: Logic moved to inline script in head to prevent FOUC
const savedTheme = localStorage.getItem('theme') || 'dark';

// Toggle theme and save preference in localStorage
const themeToggleBtns = document.querySelectorAll('.theme-toggle');
themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
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
});

// To top button
window.addEventListener('scroll', function() {
    const toTopButton = document.querySelector('.to-top');
    const welcomeSection = document.querySelector('#home');
    const rect = welcomeSection.getBoundingClientRect();

    // Si la section "welcome" est complètement visible à l'écran, on cache le bouton
    if (rect.bottom <= 0) {
        toTopButton.style.display = 'block';  // Afficher le bouton
    } else {
        toTopButton.style.display = 'none';   // Masquer le bouton
    }
});

function filterSkills(category) {
    const gridData = document.querySelector('.grid-data');
    const gridWeb = document.querySelector('.grid-web');
    const buttons = document.querySelectorAll('.filter-btn');
  
    // Affichage conditionnel
    if (category === 'data') {
      gridData.style.display = 'flex';
      gridWeb.style.display = 'none';
    } else {
      gridData.style.display = 'none';
      gridWeb.style.display = 'flex';
    }
  
    // Gestion des boutons actifs
    buttons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.filter-btn[data-category="${category}"]`).classList.add('active');
};

function filterContent(cat) {
    const expCont = document.querySelector('.exp');
    const certCont = document.querySelector('.cert');
    const buttonss = document.querySelectorAll('.filt-btn');
  
    // Affichage conditionnel
    if (cat === 'exp') {
      expCont.style.display = 'flex';
      certCont.style.display = 'none';
    } else {
      expCont.style.display = 'none';
      certCont.style.display = 'flex';
    }
  
    // Gestion des boutons actifs
    buttonss.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.filt-btn[cont-cat="${cat}"]`).classList.add('active');
};

async function updateRecentProjects() {
    try {
        // Récupère la langue sélectionnée
        const langSelect = document.querySelector('#lang');
        const selectedLang = langSelect ? langSelect.value : 'en';

        // Détermine le fichier à charger
        const fileToFetch = selectedLang === 'fr' ? 'explore-projects_fr.html' : 'explore-projects.html';

        const response = await fetch(fileToFetch);
        const text = await response.text();

        // Crée un DOM temporaire pour parser le HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // Récupère toutes les div.box
        const boxes = Array.from(doc.querySelectorAll('.box'));

        // Trie par date décroissante
        boxes.sort((a, b) => {
            const dateA = new Date(a.getAttribute('date'));
            const dateB = new Date(b.getAttribute('date'));
            return dateB - dateA;
        });

        // Garde les 3 plus récents
        const top3 = boxes.slice(0, 3);

        // Prépare le HTML final
        const wkItemsDiv = document.querySelector('.wk-items');
        wkItemsDiv.innerHTML = ''; // Vide le contenu actuel

        top3.forEach(box => {
            const clonedBox = box.cloneNode(true);

            // Supprime le lien "Read more ➜" s'il existe
            const readMoreLink = clonedBox.querySelector('.rm');
            if (readMoreLink) {
                readMoreLink.remove();
            }

            wkItemsDiv.appendChild(clonedBox);
        });

    } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
    }
}

// Appelle la fonction après le chargement de la page
window.addEventListener('DOMContentLoaded', updateRecentProjects);

// Recharge les projets quand on change la langue
document.querySelector('#lang').addEventListener('change', updateRecentProjects);
