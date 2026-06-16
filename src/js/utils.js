window.showToast = function(message) {
    var oldToast = document.querySelector('.custom-toast');
    if (oldToast && oldToast.parentNode) {
        oldToast.parentNode.removeChild(oldToast);
    }

    var toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerHTML = '<i class="bi bi-info-circle-fill text-brand-success me-1"></i> <span>' + message + '</span>';
    document.body.appendChild(toast);

    var reflow = toast.offsetHeight;
    toast.classList.add('show');

    setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() {
            if (toast && toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3500);
};

document.addEventListener('DOMContentLoaded', function() {
    var currentPath = window.location.pathname;
    var pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    
    if (!pageName || pageName === '/') {
        pageName = 'index.html';
    }

    var navLinks = document.querySelectorAll('.navbar-nav .nav-link, .mobile-bottom-nav-item');

    for (var i = 0; i < navLinks.length; i++) {
        var link = navLinks[i];
        var href = link.getAttribute('href');
        if (href) {
            var linkFile = href.substring(href.lastIndexOf('/') + 1);

            if (linkFile === pageName) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        }
    }
});
