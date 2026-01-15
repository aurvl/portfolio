// Shared UI Logic: Back-to-Top, Theme Toggle, Mobile Menu

// Shared keys (keep identical across scripts)
const THEME_STORAGE_KEY = 'theme';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Back to Top Button Logic ---
    const toTopButton = document.querySelector('.to-top');
    if (toTopButton) {
        window.addEventListener('scroll', () => {
            // Check if specific sections exist (for Home/Explore pages)
            const homeSection = document.getElementById('home') || document.getElementById('welcome');
            
            if (homeSection) {
                // Original Logic: Rect based
                const rect = homeSection.getBoundingClientRect();
                if (rect.bottom <= 0) {
                    toTopButton.style.display = 'block';
                } else {
                    toTopButton.style.display = 'none';
                }
            } else {
                // Fallback Logic for Blog Pages (Generic Scroll Threshold)
                if (window.scrollY > 300) {
                    toTopButton.style.display = 'block';
                } else {
                    toTopButton.style.display = 'none';
                }
            }
        });
    }

    // --- 2. Theme Toggle Logic (Consolidated) ---
    // Note: Theme initialization (avoiding FOUC) is handled by inline HTML on this site.
    const themeToggleBtns = document.querySelectorAll('.theme-toggle');
    const body = document.body;
    
    // Only attach if not already handled (simple check: does the element exist?)
    if (themeToggleBtns.length > 0) {
        // Remove existing clones to be safe? No, just add listener. 
        // Note: multiple listeners might toggle twice if mixed with inline.
        // I will remove the inline script from blog pages.
        
        themeToggleBtns.forEach(btn => {
            const handleToggleTheme = (e) => {
                e.preventDefault(); // Stop any default behavior
                
                const isDark = body.classList.contains('dark-theme') || (!body.classList.contains('light-theme'));
                if (isDark) {
                    body.classList.remove('dark-theme');
                    body.classList.add('light-theme');
                    document.documentElement.className = 'light-theme';
                    localStorage.setItem(THEME_STORAGE_KEY, 'light');
                } else {
                    body.classList.remove('light-theme');
                    body.classList.add('dark-theme');
                    document.documentElement.className = 'dark-theme';
                    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
                }
            };

            btn.addEventListener('click', handleToggleTheme);
            btn.addEventListener('keydown', (e) => {
                const isActivate = e.key === 'Enter' || e.key === ' ';
                if (!isActivate) return;
                e.preventDefault();
                handleToggleTheme(e);
            });
        });
    }
});
