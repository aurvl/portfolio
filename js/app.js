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
        window.location.href = 'index.html';  // Page en anglais
    } else if (selectedLanguage === 'fr') {
        window.location.href = 'home_fr.html';  // Page en français
    }
}


// Sauvegarder la langue choisie
function changeLanguage(select) {
    const selectedLanguage = select.value;
    localStorage.setItem('selectedLanguage', selectedLanguage);

    if (selectedLanguage === 'en') {
        window.location.href = 'index.html';
    } else if (selectedLanguage === 'fr') {
        window.location.href = 'home_fr.html';
    }
}

// Charger la langue sauvegardée
window.onload = function() {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
        document.getElementById('lang').value = savedLanguage;
    }
};

const form = document.getElementById('myForm');

    form.addEventListener('submit', function(e) {
        // Laisser le formulaire se soumettre normalement (en ouvrant un nouvel onglet)
        
        setTimeout(function() {
            // Réinitialiser le formulaire après un court délai
            form.reset();
        }, 1000); // Attendre une seconde avant de réinitialiser pour laisser le formulaire se soumettre
    });
