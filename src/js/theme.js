(function() {
    const savedTheme = localStorage.getItem('theme');
    let initialTheme = savedTheme;
    if (!initialTheme) {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        initialTheme = prefersDark ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', initialTheme);
})();

document.addEventListener('DOMContentLoaded', () => {
    let toggleBtn = document.getElementById('theme-toggle-floating');
    const wrapper = document.querySelector('.theme-toggle-header-wrapper');
    
    if (!toggleBtn) {
        toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle-floating';
        toggleBtn.className = 'theme-toggle-btn';
        toggleBtn.setAttribute('aria-label', 'Alternar modo escuro/claro');
        if (wrapper) {
            wrapper.appendChild(toggleBtn);
        } else {
            document.body.appendChild(toggleBtn);
        }
    }
    
    const updateIcon = (theme) => {
        toggleBtn.innerHTML = theme === 'dark' 
            ? '<i class="bi bi-sun-fill"></i>' 
            : '<i class="bi bi-moon-fill"></i>';
    };
    
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateIcon(currentTheme);
    
    toggleBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateIcon(theme);
    });
});
