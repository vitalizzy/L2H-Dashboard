/**
 * Theme management system for the dashboard
 */

const THEME_KEY = 'l2h-dashboard-theme';

/**
 * Initialize theme system
 */
export function initializeTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    setTheme(savedTheme);
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

/**
 * Set the theme
 * @param {string} theme - 'light' or 'dark'
 */
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    
    // Update theme toggle button icon
    updateThemeToggleIcon(theme);
    
    // Update chart colors if charts exist
    updateChartColors(theme);
}

/**
 * Update theme toggle button icon
 * @param {string} theme - Current theme
 */
function updateThemeToggleIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const sunIcon = themeToggle.querySelector('.fa-sun');
    const moonIcon = themeToggle.querySelector('.fa-moon');
    
    if (theme === 'dark') {
        sunIcon?.classList.add('hidden');
        moonIcon?.classList.remove('hidden');
    } else {
        sunIcon?.classList.remove('hidden');
        moonIcon?.classList.add('hidden');
    }
}

/**
 * Update chart colors based on theme
 * @param {string} theme - Current theme
 */
function updateChartColors(theme) {
    // This will be called when charts are updated
    // The actual color updates are handled in charts.js
}

/**
 * Get current theme
 * @returns {string} Current theme
 */
export function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
}

/**
 * Check if system prefers dark mode
 * @returns {boolean} True if system prefers dark mode
 */
export function prefersDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Auto-detect system theme preference
 */
export function autoDetectTheme() {
    if (!localStorage.getItem(THEME_KEY)) {
        const systemTheme = prefersDarkMode() ? 'dark' : 'light';
        setTheme(systemTheme);
    }
}

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
} 