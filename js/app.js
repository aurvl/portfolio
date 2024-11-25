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