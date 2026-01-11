// Shared UI Logic: Back-to-Top, Theme Toggle, Mobile Menu

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
    // If inline scripts are removed, this will handle it.
    // Checks if the logic already ran to avoid double-toggling if inline script exists.
    // For now, I'll assume I replace the inline script with this.
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Only attach if not already handled (simple check: does the element exist?)
    if (themeToggle) {
        // Remove existing clones to be safe? No, just add listener. 
        // Note: multiple listeners might toggle twice if mixed with inline.
        // I will remove the inline script from blog pages.
        
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault(); // Stop any default behavior
            
            const isDark = body.classList.contains('dark-theme') || (!body.classList.contains('light-theme'));
            if (isDark) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                document.documentElement.className = 'light-theme';
                localStorage.setItem('theme', 'light');
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                document.documentElement.className = 'dark-theme';
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});
