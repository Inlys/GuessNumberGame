// Auth page initialization - check if already logged in
function checkAuthPage() {
    if (getToken() && getUsername()) {
        window.location.href = 'index.html';
    }
}

// Initialize auth page
if (window.location.pathname.includes('register.html') || window.location.pathname.includes('login.html')) {
    window.addEventListener('DOMContentLoaded', checkAuthPage);
}
