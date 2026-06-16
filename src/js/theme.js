(function() {
    var savedTheme = localStorage.getItem('theme');
    var initialTheme = savedTheme;
    if (!initialTheme) {
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        initialTheme = prefersDark ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', initialTheme);
})();

document.addEventListener('DOMContentLoaded', function() {
    var toggleBtn = document.getElementById('theme-toggle-floating');
    var wrapper = document.querySelector('.theme-toggle-header-wrapper');
    
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
    
    function updateIcon(theme) {
        if (theme === 'dark') {
            toggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
        } else {
            toggleBtn.innerHTML = '<i class="bi bi-moon-fill"></i>';
        }
    }
    
    var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateIcon(currentTheme);
    
    toggleBtn.addEventListener('click', function() {
        var current = document.documentElement.getAttribute('data-theme');
        var theme = 'light';
        if (current === 'dark') {
            theme = 'light';
        } else {
            theme = 'dark';
        }
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateIcon(theme);
    });
});
