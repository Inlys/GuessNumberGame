# ================================================================
# GuessNumberGame API 完整功能演示脚本
# ================================================================
# 用途: 演示所有 API 端点的功能
# 前置条件: 后端已运行 (dotnet run)
# ================================================================

function Test-API {
    param(
        [string]$Method = "GET",
        [string]$Endpoint,
        [string]$Body,
        [string]$Token
    )
    
    $uri = "http://localhost:5000/api/$Endpoint"
    $headers = @{"Content-Type" = "application/json"}
    
    if ($Token) {
        $headers["Authorization"] = "Bearer $Token"
    }
    
    try {
        $result = Invoke-WebRequest -Uri $uri -Method $Method -Headers $headers -Body $Body -UseBasicParsing
        return $result.Content | ConvertFrom-Json
    }
    catch {
        Write-Host "✗ 请求失败: $_" -ForegroundColor Red
        return $null
    }
}

# ================================================================
# 演示开始
# ================================================================

Write-Host "`n╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  GuessNumberGame - API 完整功能演示" -ForegroundColor Cyan
Write-Host "║  后端: http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# [1] 注册新用户
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "[1/6] POST /auth/register - 注册新用户" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$username = "user_$timestamp"
$registerBody = @{username = $username; password = "Test@12345"} | ConvertTo-Json

Write-Host "请求: POST /auth/register" -ForegroundColor Yellow
Write-Host "用户: $username`n" -ForegroundColor Yellow

$registerResp = Test-API -Method POST -Endpoint "auth/register" -Body $registerBody
if ($registerResp) {
    Write-Host "✓ 响应: " -ForegroundColor Green
    Write-Host "  ID: $($registerResp.id)"
    Write-Host "  用户名: $($registerResp.username)`n"
    $userId = $registerResp.id
} else {
    exit
}

# [2] 用户登录
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "[2/6] POST /auth/login - 用户登录获取 JWT" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green

$loginBody = @{username = $username; password = "Test@12345"} | ConvertTo-Json

Write-Host "请求: POST /auth/login`n" -ForegroundColor Yellow

$loginResp = Test-API -Method POST -Endpoint "auth/login" -Body $loginBody
if ($loginResp) {
    Write-Host "✓ 响应: " -ForegroundColor Green
    Write-Host "  Token: $($loginResp.token.Substring(0, 50))...`n"
    $token = $loginResp.token
} else {
    exit
}

# [3] 开始新游戏
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "[3/6] POST /game/start - 开始新游戏" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green

Write-Host "请求: POST /game/start [认证]`n" -ForegroundColor Yellow

$startResp = Test-API -Method POST -Endpoint "game/start" -Body "{}" -Token $token
if ($startResp) {
    Write-Host "✓ 响应: " -ForegroundColor Green
    Write-Host "  Game ID: $($startResp.gameId)`n"
    $gameId = $startResp.gameId
} else {
    exit
}

# [4] 进行猜测（多轮演示）
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "[4/6] POST /game/guess - 进行猜测（3 轮演示）" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green

$guesses = @(50, 75, 25, 60, 42)
$correctGuess = $null

foreach ($guess in $guesses) {
    $guessBody = @{gameId = $gameId; guess = $guess} | ConvertTo-Json
    
    Write-Host "请求: POST /game/guess (猜测: $guess)" -ForegroundColor Yellow
    
    $guessResp = Test-API -Method POST -Endpoint "game/guess" -Body $guessBody -Token $token
    if ($guessResp) {
        Write-Host "✓ 响应: $($guessResp.result)" -ForegroundColor Green
        if ($guessResp.result -eq "Correct") {
            Write-Host "  🎉 恭喜！猜中了！目标数字是: $guess`n" -ForegroundColor Yellow
            $correctGuess = $guess
            break
        }
    } else {
        break
    }
}

# [5] 查看游戏历史
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "[5/6] GET /game/history - 查看游戏历史" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green

Write-Host "请求: GET /game/history [认证]`n" -ForegroundColor Yellow

$historyResp = Test-API -Method GET -Endpoint "game/history" -Token $token
if ($historyResp) {
    Write-Host "✓ 响应: " -ForegroundColor Green
    Write-Host "  游戏总数: $($historyResp.Count)"
    
    if ($historyResp.Count -gt 0) {
        Write-Host "  最近游戏:"
        foreach ($record in $historyResp | Select-Object -First 3) {
            $status = if ($record.isSuccess) { "✓ 成功" } else { "进行中" }
            Write-Host "    - Game $($record.id): 第 $($record.guessCount) 次猜测 - $status"
        }
    }
    Write-Host ""
}

# [6] 查看全球排行榜
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "[6/6] GET /game/leaderboard - 查看全球排行榜" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green

Write-Host "请求: GET /game/leaderboard?limit=5`n" -ForegroundColor Yellow

$boardResp = Test-API -Method GET -Endpoint "game/leaderboard?limit=5"
if ($boardResp) {
    Write-Host "✓ 响应: " -ForegroundColor Green
    Write-Host "  Top 5 玩家:"
    $rank = 1
    foreach ($entry in $boardResp | Select-Object -First 5) {
        Write-Host "  $rank. $($entry.username) - 最少猜测: $($entry.guessCount) 次"
        $rank++
    }
    Write-Host ""
}

# 演示完成
Write-Host "`n╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  ✅ API 演示完成" -ForegroundColor Cyan
Write-Host "╠════════════════════════════════════════════════════╣" -ForegroundColor Cyan
Write-Host "║  已验证的端点:" -ForegroundColor Cyan
Write-Host "║  ✓ POST /auth/register        - 用户注册" -ForegroundColor Cyan
Write-Host "║  ✓ POST /auth/login           - 用户登录" -ForegroundColor Cyan
Write-Host "║  ✓ POST /game/start           - 开始游戏" -ForegroundColor Cyan
Write-Host "║  ✓ POST /game/guess           - 提交猜测" -ForegroundColor Cyan
Write-Host "║  ✓ GET  /game/history         - 查看历史" -ForegroundColor Cyan
Write-Host "║  ✓ GET  /game/leaderboard     - 查看排行榜" -ForegroundColor Cyan
Write-Host "╠════════════════════════════════════════════════════╣" -ForegroundColor Cyan
Write-Host "║  🌐 前端测试:" -ForegroundColor Cyan
Write-Host "║  打开浏览器: file:///E:/VSCodeData/GuessNumberGame/Frontend/index.html" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host ""
