// Storage keys
const TOKEN_KEY = 'gn_token';
const USERNAME_KEY = 'gn_username';

// Token management
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function getUsername() {
    return localStorage.getItem(USERNAME_KEY);
}

function saveAuth(token, username) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERNAME_KEY, username);
}

function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
}

// Check authentication
function requireAuth() {
    const token = getToken();
    if (!token) {
        showMessage('请先登录', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return false;
    }
    return true;
}

// UI utilities
function showMessage(message, type = 'info', duration = 3000) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;
    messageEl.style.animation = 'slideIn 0.3s ease';
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease';
        messageEl.style.opacity = '0';
        setTimeout(() => {
            messageEl.remove();
        }, 300);
    }, duration);
}

// Format numbers
function formatNumber(num) {
    return typeof num === 'number' ? num.toLocaleString('zh-CN') : num;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Check connection
async function checkConnection() {
    try {
        await fetch(API_BASE + '/health', { method: 'GET' });
        return true;
    } catch (error) {
        return false;
    }
}

// Logout function
function logout() {
    clearAuth();
    showMessage('已登出', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Set navbar username
window.addEventListener('DOMContentLoaded', () => {
    const usernameEl = document.getElementById('username');
    if (usernameEl) {
        const username = getUsername();
        if (username) {
            usernameEl.textContent = username;
        }
    }
});
