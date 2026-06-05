// Leaderboard state
let currentFilter = 'top';
let leaderboardData = [];

// Initialize page
window.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;
    loadLeaderboard('top');
    loadUserStats();
});

// Filter leaderboard
async function filterLeaderboard(type) {
    currentFilter = type;
    
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadLeaderboard(type);
}

// Load leaderboard
async function loadLeaderboard(type = 'top') {
    const token = getToken();
    if (!token) return;

    try {
        const leaderboardContent = document.getElementById('leaderboardContent');
        leaderboardContent.innerHTML = `
            <div class="loading-spinner">
                <span class="loading"></span>
                <p>加载排行榜中...</p>
            </div>
        `;
        
        let endpoint = '/leaderboard';
        if (type === 'recent') {
            endpoint += '?period=week';
        } else if (type === 'personal') {
            endpoint += '/personal';
        }
        
        const response = await apiGet(endpoint, token);
        leaderboardData = response || [];
        
        if (!leaderboardData || leaderboardData.length === 0) {
            leaderboardContent.innerHTML = '<div class="leaderboard-empty"><p>还没有排行数据</p></div>';
            return;
        }
        
        renderLeaderboard(leaderboardData, type);
    } catch (error) {
        showMessage(error.message, 'error');
        document.getElementById('leaderboardContent').innerHTML = '<div class="leaderboard-empty"><p>加载失败</p></div>';
    }
}

// Render leaderboard table
function renderLeaderboard(data, type) {
    const leaderboardContent = document.getElementById('leaderboardContent');
    
    let html = '<table class="leaderboard-table">';
    html += '<thead><tr>';
    html += '<th>排名</th>';
    html += '<th>用户名</th>';
    html += '<th>游戏数</th>';
    html += '<th>最高得分</th>';
    html += '<th>平均得分</th>';
    html += '</tr></thead><tbody>';
    
    data.forEach((item, index) => {
        const rank = index + 1;
        let rankClass = '';
        
        if (rank === 1) rankClass = ' top-1';
        else if (rank === 2) rankClass = ' top-2';
        else if (rank === 3) rankClass = ' top-3';
        
        const avgScore = item.totalGames > 0 ? 
            Math.round(item.totalScore / item.totalGames) : 0;
        
        html += `<tr>`;
        html += `<td><span class="rank${rankClass}">`;
        
        if (rank === 1) html += '🥇';
        else if (rank === 2) html += '🥈';
        else if (rank === 3) html += '🥉';
        else html += `#${rank}`;
        
        html += `</span></td>`;
        html += `<td><span class="username">${escapeHtml(item.username)}</span></td>`;
        html += `<td>${item.totalGames}</td>`;
        html += `<td><span class="score">${item.maxScore}</span></td>`;
        html += `<td>${avgScore}</td>`;
        html += `</tr>`;
    });
    
    html += '</tbody></table>';
    leaderboardContent.innerHTML = html;
}

// Load user statistics
async function loadUserStats() {
    const token = getToken();
    if (!token) return;

    try {
        const response = await apiGet('/leaderboard/personal', token);
        
        if (response) {
            document.getElementById('totalGames').textContent = response.totalGames || 0;
            document.getElementById('maxScore').textContent = response.maxScore || 0;
            
            const avgScore = response.totalGames > 0 ?
                Math.round(response.totalScore / response.totalGames) : 0;
            document.getElementById('avgScore').textContent = avgScore;
            
            document.getElementById('userRank').textContent = response.rank || '-';
        }
    } catch (error) {
        // Silently fail for stats
        console.log('Failed to load user stats:', error.message);
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '\"': '&quot;',
        \"'\": '&#039;'
    };
    return text.replace(/[&<>\"']/g, m => map[m]);
}
