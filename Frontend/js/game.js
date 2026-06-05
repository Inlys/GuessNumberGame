// Game state
let currentGameId = null;
let currentDifficulty = '简单';
let currentScore = 0;
let guessHistory = [];
let maxAttempts = 10;
let currentAttempts = 0;

// Initialize page
window.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;
    
    const guessInput = document.getElementById('guessInput');
    if (guessInput) {
        guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitGuess();
            }
        });
    }
});

// Start new game
async function startNewGame() {
    const token = getToken();
    if (!token) return;

    try {
        const response = await apiPost('/game/start', {}, token);
        
        currentGameId = response.gameId;
        currentScore = 0;
        currentAttempts = 0;
        guessHistory = [];
        maxAttempts = response.maxAttempts || 10;
        
        // Calculate difficulty based on some logic
        currentDifficulty = '简单';
        
        // Show game board
        document.getElementById('gameMenu').style.display = 'none';
        document.getElementById('gameBoard').style.display = 'block';
        document.getElementById('gameResult').style.display = 'none';
        document.getElementById('gameHistory').style.display = 'none';
        
        // Reset UI
        document.getElementById('guessInput').value = '';
        document.getElementById('guessInput').focus();
        updateGameInfo();
        clearGuessHistory();
        
        showMessage('游戏已开始！', 'info');
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Submit guess
async function submitGuess() {
    if (!currentGameId) return;
    
    const guessInput = document.getElementById('guessInput');
    const guess = parseInt(guessInput.value);
    
    // Validation
    if (!guessInput.value) {
        showMessage('请输入数字', 'warning');
        return;
    }
    
    if (isNaN(guess) || guess < 1 || guess > 100) {
        showMessage('请输入1到100之间的数字', 'error');
        guessInput.value = '';
        return;
    }
    
    if (guessHistory.some(g => g.number === guess)) {
        showMessage(`你已经猜过 ${guess}！`, 'warning');
        return;
    }
    
    const token = getToken();
    const guessBtn = document.getElementById('guessBtn');
    guessBtn.disabled = true;
    guessBtn.innerHTML = '<span class="loading"></span> 提交中...';
    
    try {
        const response = await apiPost('/game/guess', {
            gameId: currentGameId,
            guess: guess
        }, token);
        
        currentAttempts++;
        
        // Add to history
        const guessItem = {
            number: guess,
            feedback: response.result,
            isCorrect: response.isCorrect,
            status: response.result
        };
        guessHistory.push(guessItem);
        
        // Update score
        currentScore = response.score || calculateScore(currentAttempts);
        updateGameInfo();
        addGuessToHistory(guessItem);
        
        guessInput.value = '';
        
        // Show feedback
        const feedbackEl = document.getElementById('feedback');
        feedbackEl.style.display = 'block';
        
        if (response.isCorrect) {
            feedbackEl.className = 'feedback success';
            feedbackEl.textContent = `🎉 恭喜！你猜对了！数字是 ${guess}，用了 ${currentAttempts} 次`;
            endGame(true, currentScore);
        } else {
            feedbackEl.className = 'feedback info';
            if (response.result === 'TooHigh') {
                feedbackEl.textContent = '📈 太大了，请猜一个更小的数字';
            } else if (response.result === 'TooLow') {
                feedbackEl.textContent = '📉 太小了，请猜一个更大的数字';
            } else {
                feedbackEl.textContent = response.message || '继续猜测...';
            }
            
            // Check if game over
            if (currentAttempts >= maxAttempts) {
                endGame(false, currentScore);
            } else {
                guessInput.focus();
            }
        }
    } catch (error) {
        showMessage(error.message, 'error');
    } finally {
        guessBtn.disabled = false;
        guessBtn.innerHTML = '提交';
    }
}

// Calculate score based on attempts
function calculateScore(attempts) {
    if (attempts === 1) return 1000;
    if (attempts <= 3) return 500;
    if (attempts <= 5) return 300;
    if (attempts <= 7) return 200;
    if (attempts <= 10) return 100;
    return 0;
}

// Update game info display
function updateGameInfo() {
    document.getElementById('attemptCount').textContent = `${currentAttempts}/${maxAttempts}`;
    document.getElementById('difficulty').textContent = currentDifficulty;
    document.getElementById('score').textContent = currentScore;
}

// Add guess to history
function addGuessToHistory(item) {
    const historyList = document.getElementById('historyList');
    
    if (historyList.querySelector('.text-muted')) {
        historyList.innerHTML = '';
    }
    
    const guessEl = document.createElement('div');
    guessEl.className = 'history-item';
    
    if (item.isCorrect) {
        guessEl.classList.add('correct');
        guessEl.innerHTML = `
            <span class="guess-number">✓ ${item.number}</span>
            <span class="feedback">正确！</span>
        `;
    } else if (item.status === 'TooHigh') {
        guessEl.classList.add('too-high');
        guessEl.innerHTML = `
            <span class="guess-number">▲ ${item.number}</span>
            <span class="feedback">太大</span>
        `;
    } else if (item.status === 'TooLow') {
        guessEl.classList.add('too-low');
        guessEl.innerHTML = `
            <span class="guess-number">▼ ${item.number}</span>
            <span class="feedback">太小</span>
        `;
    }
    
    historyList.insertBefore(guessEl, historyList.firstChild);
}

// Clear guess history display
function clearGuessHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '<p class="text-muted">还没有猜测</p>';
}

// End game
function endGame(won, finalScore) {
    document.getElementById('gameBoard').style.display = 'none';
    document.getElementById('gameResult').style.display = 'block';
    document.getElementById('feedback').style.display = 'none';
    
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    
    if (won) {
        resultTitle.textContent = '🎉 游戏胜利';
        resultMessage.textContent = `恭喜！你成功猜出了数字！`;
    } else {
        resultTitle.textContent = '💔 游戏失败';
        resultMessage.textContent = `很遗憾，你已经用完了所有 ${maxAttempts} 次机会。`;
    }
    
    document.getElementById('totalAttempts').textContent = currentAttempts;
    document.getElementById('finalScore').textContent = finalScore;
}

// Back to menu
function backToMenu() {
    document.getElementById('gameMenu').style.display = 'block';
    document.getElementById('gameBoard').style.display = 'none';
    document.getElementById('gameResult').style.display = 'none';
    document.getElementById('gameHistory').style.display = 'none';
    
    currentGameId = null;
    guessHistory = [];
    currentScore = 0;
}

// Load game history
async function loadGameHistory() {
    const token = getToken();
    if (!token) return;

    try {
        document.getElementById('gameMenu').style.display = 'none';
        document.getElementById('gameHistory').style.display = 'block';
        
        const historyContent = document.getElementById('historyContent');
        historyContent.innerHTML = '<p class="text-muted">加载中...</p>';
        
        const response = await apiGet('/game/history', token);
        
        if (!response || response.length === 0) {
            historyContent.innerHTML = '<p class="text-muted">还没有游戏记录</p>';
            return;
        }
        
        let html = '<table class="history-table" style="width: 100%; border-collapse: collapse;">';
        html += '<thead><tr style="background: #f9f9f9; border-bottom: 2px solid #e0e0e0;">';
        html += '<th style="padding: 10px; text-align: left;">时间</th>';
        html += '<th style="padding: 10px; text-align: left;">猜测次数</th>';
        html += '<th style="padding: 10px; text-align: left;">得分</th>';
        html += '<th style="padding: 10px; text-align: left;">状态</th>';
        html += '</tr></thead><tbody>';
        
        response.forEach(record => {
            const status = record.isWon ? '✓ 胜利' : '✗ 失败';
            const statusClass = record.isWon ? 'color: #4caf50;' : 'color: #f44336;';
            html += `<tr style="border-bottom: 1px solid #e0e0e0;">`;
            html += `<td style="padding: 10px;">${formatDate(record.createdAt)}</td>`;
            html += `<td style="padding: 10px;">${record.guessCount}/${maxAttempts}</td>`;
            html += `<td style="padding: 10px; font-weight: bold; color: #667eea;">${record.score}</td>`;
            html += `<td style="padding: 10px; ${statusClass}">${status}</td>`;
            html += `</tr>`;
        });
        
        html += '</tbody></table>';
        historyContent.innerHTML = html;
    } catch (error) {
        showMessage(error.message, 'error');
        document.getElementById('historyContent').innerHTML = '<p class="text-muted">加载失败</p>';
    }
}
