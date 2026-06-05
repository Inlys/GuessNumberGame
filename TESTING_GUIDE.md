# GuessNumberGame 测试文档

> **项目**: GuessNumberGame  
> **版本**: 1.0  
> **API 基础 URL**: `http://localhost:5000/api`  
> **前端地址**: `file:///E:/VSCodeData/GuessNumberGame/Frontend/index.html`  
> **数据库**: SQLite (`E:\VSCodeData\GuessNumberGame\Backend\guessgame.db`)

---

## 目录

1. [功能测试用例](#功能测试用例)
2. [接口测试用例](#接口测试用例)
3. [Reqable 导入格式](#reqable-导入格式)
4. [Bug 清单模板](#bug-清单模板)
5. [Jira 任务模板](#jira-任务模板)
6. [Postman 测试集合](#postman-测试集合)

---

## 功能测试用例

### 1. 用户注册 (Register)

| 用例 ID | TC-REG-001 |
|--------|-----------|
| **用例名称** | 正常注册新用户 |
| **前置条件** | 1. 应用已启动<br>2. 用户未在系统中注册 |
| **测试步骤** | 1. 打开 `register.html`<br>2. 输入用户名 (e.g., `testuser01`)<br>3. 输入密码 (e.g., `Test@123`)<br>4. 点击"注册"按钮 |
| **预期结果** | 1. 显示成功提示 "账号创建成功，请登录"<br>2. 页面跳转至登录页面<br>3. 用户数据存储到数据库 |
| **实际结果** | ☐ 通过 / ☐ 失败 |
| **备注** | 验证密码哈希存储安全性 |

| 用例 ID | TC-REG-002 |
|--------|-----------|
| **用例名称** | 注册用户名已存在 |
| **前置条件** | 1. 用户 `testuser01` 已注册<br>2. 处于注册页面 |
| **测试步骤** | 1. 输入已存在的用户名 `testuser01`<br>2. 输入密码 `Test@123`<br>3. 点击"注册"按钮 |
| **预期结果** | 1. 显示错误提示 "用户名已存在"<br>2. 页面停留在注册页面<br>3. 无新用户记录创建 |
| **实际结果** | ☐ 通过 / ☐ 失败 |

| 用例 ID | TC-REG-003 |
|--------|-----------|
| **用例名称** | 注册表单验证 - 空用户名 |
| **前置条件** | 处于注册页面 |
| **测试步骤** | 1. 用户名字段为空<br>2. 输入密码 `Test@123`<br>3. 点击"注册"按钮 |
| **预期结果** | 1. 浏览器原生验证提示 "请填写此字段"<br>2. 表单未提交 |
| **实际结果** | ☐ 通过 / ☐ 失败 |

| 用例 ID | TC-REG-004 |
|--------|-----------|
| **用例名称** | 注册表单验证 - 空密码 |
| **前置条件** | 处于注册页面 |
| **测试步骤** | 1. 输入用户名 `testuser02`<br>2. 密码字段为空<br>3. 点击"注册"按钮 |
| **预期结果** | 1. 浏览器原生验证提示<br>2. 表单未提交 |
| **实际结果** | ☐ 通过 / ☐ 失败 |

---

### 2. 用户登录 (Login)

| 用例 ID | TC-LOGIN-001 |
|--------|-------------|
| **用例名称** | 正常登录 |
| **前置条件** | 1. 用户 `testuser01` / 密码 `Test@123` 已注册<br>2. 处于登录页面 |
| **测试步骤** | 1. 输入用户名 `testuser01`<br>2. 输入密码 `Test@123`<br>3. 点击"登录"按钮 |
| **预期结果** | 1. 显示成功提示 "登录成功"<br>2. 页面跳转至游戏页面<br>3. JWT Token 存储到 localStorage (key: `gn_token`)<br>4. Token 在 HTTP 请求中发送 |
| **实际结果** | ☐ 通过 / ☐ 失败 |
| **备注** | 用浏览器开发者工具检查 localStorage 和网络请求 |

| 用例 ID | TC-LOGIN-002 |
|--------|-------------|
| **用例名称** | 登录密码错误 |
| **前置条件** | 1. 用户 `testuser01` 已存在<br>2. 处于登录页面 |
| **测试步骤** | 1. 输入用户名 `testuser01`<br>2. 输入错误密码 `WrongPassword`<br>3. 点击"登录"按钮 |
| **预期结果** | 1. 显示错误提示 "用户名或密码错误"<br>2. 页面停留在登录页面<br>3. 无 Token 生成 |
| **实际结果** | ☐ 通过 / ☐ 失败 |

| 用例 ID | TC-LOGIN-003 |
|--------|-------------|
| **用例名称** | 登录用户不存在 |
| **前置条件** | 处于登录页面 |
| **测试步骤** | 1. 输入不存在的用户名 `nonexistent`<br>2. 输入任意密码<br>3. 点击"登录"按钮 |
| **预期结果** | 1. 显示错误提示 "用户名或密码错误"<br>2. 页面停留在登录页面 |
| **实际结果** | ☐ 通过 / ☐ 失败 |

| 用例 ID | TC-LOGIN-004 |
|--------|-------------|
| **用例名称** | 登录后访问游戏页面 |
| **前置条件** | 1. 已登录，Token 有效<br>2. localStorage 中存有 `gn_token` |
| **测试步骤** | 1. 刷新页面<br>2. 游戏页面应自动加载 |
| **预期结果** | 1. 游戏页面正常显示<br>2. "开始新游戏"按钮可用 |
| **实际结果** | ☐ 通过 / ☐ 失败 |

---

### 3. 开始游戏 (Start Game)

| 用例 ID | TC-GAME-001 |
|--------|-----------|
| **用例名称** | 正常开始新游戏 |
| **前置条件** | 1. 用户已登录<br>2. 处于游戏页面 |
| **测试步骤** | 1. 点击"开始新游戏"按钮 |
| **预期结果** | 1. 显示 "游戏编号: {gameId}"<br>2. 显示输入框和"提交猜测"按钮<br>3. 后端返回有效的 gameId (整数) |
| **实际结果** | ☐ 通过 / ☐ 失败 |
| **备注** | 验证 gameId 在 GameRecords 表中插入 |

| 用例 ID | TC-GAME-002 |
|--------|-----------|
| **用例名称** | 多个游戏并行 |
| **前置条件** | 用户已登录且启动了一个游戏 |
| **测试步骤** | 1. 记下当前 gameId<br>2. 点击"开始新游戏"按钮<br>3. 观察新的 gameId |
| **预期结果** | 1. 新 gameId ≠ 旧 gameId<br>2. 两个游戏的目标数字独立 |
| **实际结果** | ☐ 通过 / ☐ 失败 |

---

### 4. 猜数字 (Make Guess)

| 用例 ID | TC-GUESS-001 |
|--------|------------|
| **用例名称** | 猜测太大 |
| **前置条件** | 1. 游戏已启动，目标数字为 42<br>2. 输入框可用 |
| **测试步骤** | 1. 输入数字 `80`<br>2. 点击"提交猜测"按钮 |
| **预期结果** | 1. 显示 "太大了"<br>2. 猜测次数 +1<br>3. 游戏继续 |
| **实际结果** | ☐ 通过 / ☐ 失败 |

| 用例 ID | TC-GUESS-002 |
|--------|------------|
| **用例名称** | 猜测太小 |
| **前置条件** | 1. 游戏已启动，目标数字为 42<br>2. 输入框可用 |
| **测试步骤** | 1. 输入数字 `10`<br>2. 点击"提交猜测"按钮 |
| **预期结果** | 1. 显示 "太小了"<br>2. 猜测次数 +1<br>3. 游戏继续 |
| **实际结果** | ☐ 通过 / ☐ 失败 |

| 用例 ID | TC-GUESS-003 |
|--------|------------|
| **用例名称** | 猜测正确 |
| **前置条件** | 1. 游戏已启动，目标数字为 42<br>2. 经过多轮猜测 |
| **测试步骤** | 1. 输入数字 `42`<br>2. 点击"提交猜测"按钮 |
| **预期结果** | 1. 显示 "恭喜你，猜对了！用时 N 次"<br>2. 游戏记录插入数据库 (IsSuccess = true)<br>3. "开始新游戏"按钮重新启用 |
| **实际结果** | ☐ 通过 / ☐ 失败 |
| **备注** | 验证 GuessCount 和 IsSuccess 字段 |

| 用例 ID | TC-GUESS-004 |
|--------|------------|
| **用例名称** | 猜测数字范围验证 |
| **前置条件** | 游戏已启动 |
| **测试步骤** | 1. 输入 `0`<br>2. 点击"提交猜测"<br>3. 清空，输入 `101`<br>4. 点击"提交猜测" |
| **预期结果** | 1. 显示验证提示 "请输入 1-100 的整数"<br>2. 请求未发送到后端 |
| **实际结果** | ☐ 通过 / ☐ 失败 |

| 用例 ID | TC-GUESS-005 |
|--------|------------|
| **用例名称** | 猜测非整数 |
| **前置条件** | 游戏已启动 |
| **测试步骤** | 1. 输入 `42.5`<br>2. 点击"提交猜测" |
| **预期结果** | 1. 输入框拒绝小数输入（HTML5 number 类型验证）<br>或 2. 后端返回验证错误 |
| **实际结果** | ☐ 通过 / ☐ 失败 |

---

### 5. 游戏历史 (Game History)

| 用例 ID | TC-HIST-001 |
|--------|-----------|
| **用例名称** | 查看游戏历史 |
| **前置条件** | 1. 用户已登录<br>2. 已完成至少 2 个游戏 |
| **测试步骤** | 1. 点击"我的历史"按钮 |
| **预期结果** | 1. 显示历史记录列表<br>2. 每条记录显示：目标数字、猜测次数、是否成功、开始时间<br>3. 按时间倒序排列 |
| **实际结果** | ☐ 通过 / ☐ 失败 |
| **备注** | 验证查询结果与数据库一致 |

| 用例 ID | TC-HIST-002 |
|--------|-----------|
| **用例名称** | 空历史 |
| **前置条件** | 1. 新用户已登录<br>2. 未进行任何游戏 |
| **测试步骤** | 1. 点击"我的历史"按钮 |
| **预期结果** | 1. 显示 "暂无游戏记录"<br>或 2. 显示空列表 |
| **实际结果** | ☐ 通过 / ☐ 失败 |

---

### 6. 排行榜 (Leaderboard)

| 用例 ID | TC-BOARD-001 |
|--------|------------|
| **用例名称** | 查看排行榜 |
| **前置条件** | 1. 至少 3 个用户已完成游戏<br>2. 处于游戏页面或排行榜页面 |
| **测试步骤** | 1. 点击"排行榜"链接<br>2. 观察排行榜列表 |
| **预期结果** | 1. 显示用户排名列表<br>2. 按成功游戏的最少猜测次数排序（升序）<br>3. 显示用户名和猜测次数 |
| **实际结果** | ☐ 通过 / ☐ 失败 |
| **备注** | 只显示成功的游戏记录 |

| 用例 ID | TC-BOARD-002 |
|--------|------------|
| **用例名称** | 排行榜限制（Top 20） |
| **前置条件** | 超过 20 个用户已完成游戏 |
| **测试步骤** | 1. 打开排行榜页面<br>2. 计算显示的用户数量 |
| **预期结果** | 1. 最多显示 20 条记录<br>2. 显示标注 "Top 20" 或类似提示 |
| **实际结果** | ☐ 通过 / ☐ 失败 |

| 用例 ID | TC-BOARD-003 |
|--------|------------|
| **用例名称** | 排行榜实时更新 |
| **前置条件** | 1. 排行榜页面已打开<br>2. 其他用户正在完成游戏 |
| **测试步骤** | 1. 在排行榜停留<br>2. 刷新页面<br>3. 观察排行是否更新 |
| **预期结果** | 1. 刷新后显示最新排行<br>2. 新完成的游戏出现在列表中 |
| **实际结果** | ☐ 通过 / ☐ 失败 |

---

### 7. 跨浏览器兼容性

| 用例 ID | TC-COMPAT-001 |
|--------|--------------|
| **用例名称** | Chrome 浏览器兼容性 |
| **前置条件** | Chrome 最新版本已安装 |
| **测试步骤** | 1. 在 Chrome 中打开应用<br>2. 完成注册→登录→游戏→查看排行榜流程 |
| **预期结果** | 1. 所有功能正常<br>2. 无控制台错误<br>3. 样式正确渲染 |
| **实际结果** | ☐ 通过 / ☐ 失败 |

| 用例 ID | TC-COMPAT-002 |
|--------|--------------|
| **用例名称** | Firefox 浏览器兼容性 |
| **前置条件** | Firefox 最新版本已安装 |
| **测试步骤** | 同 TC-COMPAT-001 |
| **预期结果** | 同 TC-COMPAT-001 |
| **实际结果** | ☐ 通过 / ☐ 失败 |

---

### 8. 响应式设计

| 用例 ID | TC-RESP-001 |
|--------|-----------|
| **用例名称** | PC 分辨率 (1920x1080) |
| **前置条件** | 浏览器窗口为 1920x1080 |
| **测试步骤** | 1. 打开各页面<br>2. 检查布局、字体、间距 |
| **预期结果** | 1. 所有元素正确显示<br>2. 无水平滚动条<br>3. 卡片布局合理 |
| **实际结果** | ☐ 通过 / ☐ 失败 |

| 用例 ID | TC-RESP-002 |
|--------|-----------|
| **用例名称** | 平板分辨率 (768x1024) |
| **前置条件** | 浏览器窗口为 768x1024 |
| **测试步骤** | 1. 打开各页面<br>2. 检查布局是否重排 |
| **预期结果** | 1. 布局自适应调整<br>2. 所有元素可见且可点击 |
| **实际结果** | ☐ 通过 / ☐ 失败 |

---

## 接口测试用例

### API 端点总览

| 方法 | 端点 | 描述 | 认证 |
|-----|------|------|------|
| POST | `/api/auth/register` | 用户注册 | ✗ |
| POST | `/api/auth/login` | 用户登录 | ✗ |
| POST | `/api/game/start` | 开始游戏 | ✓ |
| POST | `/api/game/guess` | 提交猜测 | ✓ |
| GET | `/api/game/history` | 获取游戏历史 | ✓ |
| GET | `/api/game/leaderboard` | 获取排行榜 | ✗ |

---

### TC-API-001: POST /api/auth/register - 成功注册

**请求**
```http
POST /api/auth/register HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "username": "testuser01",
  "password": "Test@123"
}
```

**预期响应 (200 OK)**
```json
{
  "id": 1,
  "username": "testuser01"
}
```

**验证点**
- ✓ 状态码 200
- ✓ 返回用户 ID 和用户名
- ✓ 用户存储到数据库
- ✓ 密码已哈希

---

### TC-API-002: POST /api/auth/register - 用户名冲突

**请求**
```http
POST /api/auth/register HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "username": "testuser01",
  "password": "AnotherPassword"
}
```

**预期响应 (400 Bad Request)**
```json
{
  "message": "User exists"
}
```

**验证点**
- ✓ 状态码 400
- ✓ 错误消息清晰
- ✓ 无新用户创建

---

### TC-API-003: POST /api/auth/login - 成功登录

**请求**
```http
POST /api/auth/login HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "username": "testuser01",
  "password": "Test@123"
}
```

**预期响应 (200 OK)**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJzdWIiOiJ0ZXN0dXNlcjAxIiwibmJmIjoxNzE3MzAwMDAwLCJleHAiOjE3MTczODY0MDAsImlhdCI6MTcxNzMwMDAwMH0.xxx"
}
```

**验证点**
- ✓ 状态码 200
- ✓ Token 为有效 JWT 格式
- ✓ Token 包含用户 ID 和用户名（解码验证）
- ✓ Token 过期时间为 7 天

---

### TC-API-004: POST /api/auth/login - 密码错误

**请求**
```http
POST /api/auth/login HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "username": "testuser01",
  "password": "WrongPassword"
}
```

**预期响应 (401 Unauthorized)**
```json
{}
```
或
```
(empty body)
```

**验证点**
- ✓ 状态码 401
- ✓ 无 Token 返回

---

### TC-API-005: POST /api/game/start - 开始游戏

**请求**
```http
POST /api/game/start HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{}
```

**预期响应 (200 OK)**
```json
{
  "gameId": 1
}
```

**验证点**
- ✓ 状态码 200
- ✓ gameId 为正整数
- ✓ 数据库新增 GameRecord 记录
- ✓ TargetNumber 为 1-100 随机数
- ✓ IsSuccess = false，GuessCount = 0

---

### TC-API-006: POST /api/game/start - 无授权

**请求**
```http
POST /api/game/start HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{}
```

**预期响应 (401 Unauthorized)**
```json
{
  "message": "Unauthorized"
}
```

**验证点**
- ✓ 状态码 401
- ✓ 无游戏记录创建

---

### TC-API-007: POST /api/game/guess - 猜测太大

**前置条件**: 已开始游戏，gameId = 1，目标数字 = 42

**请求**
```http
POST /api/game/guess HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "gameId": 1,
  "guess": 80
}
```

**预期响应 (200 OK)**
```json
{
  "result": "TooHigh",
  "remainingGuesses": 0
}
```

**验证点**
- ✓ 状态码 200
- ✓ result 值为 "TooHigh"
- ✓ 数据库 GuessCount +1
- ✓ IsSuccess 保持 false

---

### TC-API-008: POST /api/game/guess - 猜测正确

**请求**
```http
POST /api/game/guess HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "gameId": 1,
  "guess": 42
}
```

**预期响应 (200 OK)**
```json
{
  "result": "Correct",
  "remainingGuesses": 0
}
```

**验证点**
- ✓ 状态码 200
- ✓ result 值为 "Correct"
- ✓ 数据库 IsSuccess = true
- ✓ 数据库 EndTime 设置为当前时间
- ✓ GuessCount 最终次数正确

---

### TC-API-009: GET /api/game/history - 获取游戏历史

**请求**
```http
GET /api/game/history HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**预期响应 (200 OK)**
```json
[
  {
    "id": 1,
    "userId": 1,
    "targetNumber": 42,
    "guessCount": 5,
    "startTime": "2024-06-02T10:00:00",
    "endTime": "2024-06-02T10:02:30",
    "isSuccess": true
  },
  {
    "id": 2,
    "userId": 1,
    "targetNumber": 75,
    "guessCount": 0,
    "startTime": "2024-06-02T10:05:00",
    "endTime": null,
    "isSuccess": false
  }
]
```

**验证点**
- ✓ 状态码 200
- ✓ 返回数组，按 startTime 倒序
- ✓ 只返回当前用户的记录
- ✓ 完成的游戏有 endTime

---

### TC-API-010: GET /api/game/leaderboard - 获取排行榜

**请求**
```http
GET /api/game/leaderboard HTTP/1.1
Host: localhost:5000
```

**预期响应 (200 OK)**
```json
[
  {
    "userId": 1,
    "username": "testuser01",
    "guessCount": 5
  },
  {
    "userId": 3,
    "username": "testuser03",
    "guessCount": 6
  },
  {
    "userId": 2,
    "username": "testuser02",
    "guessCount": 8
  }
]
```

**验证点**
- ✓ 状态码 200
- ✓ 返回数组，按 guessCount 升序
- ✓ 最多 20 条记录
- ✓ 不认证也可访问

---

## Reqable 导入格式

### Reqable Collection JSON (v1.0)

```json
{
  "version": "1.0",
  "name": "GuessNumberGame API Tests",
  "baseUrl": "http://localhost:5000",
  "requests": [
    {
      "id": "req-reg-001",
      "name": "POST - Register User",
      "method": "POST",
      "url": "/api/auth/register",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": {
        "type": "json",
        "content": {
          "username": "testuser01",
          "password": "Test@123"
        }
      },
      "tests": [
        {
          "name": "Status is 200",
          "assertion": "response.status === 200"
        },
        {
          "name": "Has userId",
          "assertion": "response.body.id > 0"
        }
      ]
    },
    {
      "id": "req-login-001",
      "name": "POST - Login User",
      "method": "POST",
      "url": "/api/auth/login",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": {
        "type": "json",
        "content": {
          "username": "testuser01",
          "password": "Test@123"
        }
      },
      "tests": [
        {
          "name": "Status is 200",
          "assertion": "response.status === 200"
        },
        {
          "name": "Has JWT token",
          "assertion": "response.body.token && response.body.token.split('.').length === 3"
        }
      ]
    },
    {
      "id": "req-game-start",
      "name": "POST - Start Game",
      "method": "POST",
      "url": "/api/game/start",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer {{token}}"
      },
      "body": {
        "type": "json",
        "content": {}
      },
      "tests": [
        {
          "name": "Status is 200",
          "assertion": "response.status === 200"
        },
        {
          "name": "Has gameId",
          "assertion": "response.body.gameId > 0"
        }
      ]
    },
    {
      "id": "req-game-guess",
      "name": "POST - Make Guess",
      "method": "POST",
      "url": "/api/game/guess",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer {{token}}"
      },
      "body": {
        "type": "json",
        "content": {
          "gameId": "{{gameId}}",
          "guess": 50
        }
      },
      "tests": [
        {
          "name": "Status is 200",
          "assertion": "response.status === 200"
        },
        {
          "name": "Result is valid",
          "assertion": "['TooHigh', 'TooLow', 'Correct'].includes(response.body.result)"
        }
      ]
    },
    {
      "id": "req-game-history",
      "name": "GET - Game History",
      "method": "GET",
      "url": "/api/game/history",
      "headers": {
        "Authorization": "Bearer {{token}}"
      },
      "tests": [
        {
          "name": "Status is 200",
          "assertion": "response.status === 200"
        },
        {
          "name": "Is array",
          "assertion": "Array.isArray(response.body)"
        }
      ]
    },
    {
      "id": "req-leaderboard",
      "name": "GET - Leaderboard",
      "method": "GET",
      "url": "/api/game/leaderboard?limit=20",
      "headers": {},
      "tests": [
        {
          "name": "Status is 200",
          "assertion": "response.status === 200"
        },
        {
          "name": "Is array",
          "assertion": "Array.isArray(response.body)"
        },
        {
          "name": "Max 20 records",
          "assertion": "response.body.length <= 20"
        }
      ]
    }
  ],
  "variables": {
    "baseUrl": "http://localhost:5000",
    "token": "",
    "gameId": "",
    "userId": ""
  }
}
```

---

## Bug 清单模板

### Bug 报告格式

```markdown
## Bug 清单 - GuessNumberGame v1.0

### Bug #001: [严重] 登录后 Token 未正确存储

**报告者**: QA Team  
**报告日期**: 2024-06-02  
**优先级**: 🔴 P0 - 严重  
**状态**: 🔴 Open

**环境信息**
- 浏览器: Chrome 125.0
- 操作系统: Windows 11
- 后端版本: v1.0.0
- 前端版本: v1.0.0

**复现步骤**
1. 打开 register.html
2. 创建新账号 testuser_bug01 / password123
3. 打开 login.html
4. 使用相同凭证登录
5. 打开浏览器开发者工具 → Application → localStorage
6. 检查 gn_token 键值

**预期结果**
- localStorage 中应存在 `gn_token` 键
- 值应为有效的 JWT Token

**实际结果**
- localStorage 中不存在 `gn_token` 键
- 导致后续 API 请求失败（401 Unauthorized）

**附加信息**
- 后端登录接口正常返回 token
- 问题在前端 auth.js 的 Token 存储逻辑

**建议修复**
检查 js/auth.js 的 loginForm 提交处理，确保调用了 `localStorage.setItem('gn_token', res.token)`

**相关文件**
- Frontend/js/auth.js (L25-30)
- Frontend/login.html

---

### Bug #002: [中等] 排行榜未按猜测次数排序

**报告者**: QA Team  
**报告日期**: 2024-06-02  
**优先级**: 🟡 P1 - 中等  
**状态**: 🔴 Open

**复现步骤**
1. 创建 3 个用户并各完成 1 个游戏
   - 用户 A: 3 次猜测成功
   - 用户 B: 1 次猜测成功
   - 用户 C: 5 次猜测成功
2. 打开排行榜

**预期结果**
排行榜顺序（按猜测次数升序）:
1. 用户 B - 1 次
2. 用户 A - 3 次
3. 用户 C - 5 次

**实际结果**
排行榜顺序为:
1. 用户 A - 3 次
2. 用户 B - 1 次
3. 用户 C - 5 次
（顺序无规则）

**根本原因**
Backend/Services/LeaderboardService.cs 的查询逻辑错误

---

### Bug #003: [低] 游戏历史页面响应缓慢

**报告者**: QA Team  
**报告日期**: 2024-06-02  
**优先级**: 🟢 P2 - 低  
**状态**: 🟡 In Progress

**现象**
- 用户点击"我的历史"后，页面加载超过 2 秒

**环境**
- 用户拥有 100+ 游戏记录

**建议**
- 添加分页功能
- 优化数据库查询（添加索引）
- 实现虚拟滚动

---
```

---

## Jira 任务模板

### Jira Issue JSON Export

```json
{
  "expand": "changelog,versionedRepresentations.previousVersion,operations,editmeta,changelog,transitions,rawEstimateStatistic",
  "id": "10000",
  "self": "http://jira.example.com/rest/api/2/issue/10000",
  "key": "GNG-001",
  "fields": {
    "summary": "[BUG] 登录后 Token 未正确存储到 localStorage",
    "description": "用户登录成功后，JWT Token 未保存到浏览器 localStorage，导致后续 API 请求失败（401 Unauthorized）。",
    "issuetype": {
      "self": "http://jira.example.com/rest/api/2/issuetype/10001",
      "id": "10001",
      "description": "A software bug",
      "iconUrl": "http://jira.example.com/images/icons/issuetypes/bug.png",
      "name": "Bug",
      "subtask": false
    },
    "priority": {
      "self": "http://jira.example.com/rest/api/2/priority/1",
      "iconUrl": "http://jira.example.com/images/icons/priorities/highest.png",
      "name": "Highest",
      "id": "1"
    },
    "labels": [
      "frontend",
      "authentication",
      "critical"
    ],
    "assignee": {
      "self": "http://jira.example.com/rest/api/2/user?username=dev_team",
      "name": "dev_team",
      "emailAddress": "dev@example.com",
      "displayName": "Development Team"
    },
    "reporter": {
      "self": "http://jira.example.com/rest/api/2/user?username=qa_team",
      "name": "qa_team",
      "emailAddress": "qa@example.com",
      "displayName": "QA Team"
    },
    "status": {
      "self": "http://jira.example.com/rest/api/2/status/10001",
      "description": "Work in Progress",
      "iconUrl": "http://jira.example.com/images/icons/statuses/progress.png",
      "name": "In Progress",
      "id": "10001",
      "statusCategory": {
        "self": "http://jira.example.com/rest/api/2/statuscategory/4",
        "id": 4,
        "key": "indeterminate",
        "colorName": "yellow",
        "name": "In Progress"
      }
    },
    "components": [
      {
        "self": "http://jira.example.com/rest/api/2/component/10000",
        "id": "10000",
        "name": "Frontend"
      }
    ],
    "fixVersions": [
      {
        "self": "http://jira.example.com/rest/api/2/version/10000",
        "id": "10000",
        "name": "v1.0.1",
        "released": false
      }
    ],
    "customfield_10001": "HIGH",
    "environment": "Chrome 125.0, Windows 11",
    "duedate": "2024-06-05",
    "created": "2024-06-02T08:00:00.000+0000",
    "updated": "2024-06-02T09:30:00.000+0000",
    "resolutiondate": null,
    "comment": {
      "comments": [
        {
          "self": "http://jira.example.com/rest/api/2/issue/10000/comment/10000",
          "id": "10000",
          "author": {
            "name": "qa_team",
            "emailAddress": "qa@example.com",
            "displayName": "QA Team"
          },
          "body": "复现步骤已验证，问题确认。建议检查 js/auth.js 中的 loginForm 提交处理。",
          "created": "2024-06-02T08:15:00.000+0000",
          "updated": "2024-06-02T08:15:00.000+0000"
        }
      ]
    }
  }
}
```

### Markdown 格式 Jira 问题

```markdown
# GNG-001: [BUG] 登录后 Token 未正确存储

**类型**: 🐛 Bug  
**优先级**: 🔴 Highest  
**状态**: 🔄 In Progress  
**责任人**: Development Team  
**报告人**: QA Team  
**截止日期**: 2024-06-05  
**标签**: `frontend`, `authentication`, `critical`

## 问题描述

用户登录成功后，JWT Token 未保存到浏览器 localStorage，导致后续 API 请求失败（401 Unauthorized）。

## 复现步骤

1. 打开 register.html，创建新账号（username: testuser01, password: Test@123）
2. 打开 login.html，使用相同凭证登录
3. 查看浏览器开发者工具 → Application → localStorage
4. 验证 `gn_token` 键不存在

## 预期行为

- localStorage 中应存在 `gn_token` 键
- 值应为有效的 JWT Token (3 部分用 `.` 分隔)

## 实际行为

- localStorage 中无 `gn_token` 键
- 后续请求返回 401 Unauthorized

## 环境信息

- 浏览器: Chrome 125.0
- 操作系统: Windows 11
- 后端版本: v1.0.0
- 前端版本: v1.0.0

## 根本原因分析

前端 `js/auth.js` 中的 loginForm 提交处理未正确保存返回的 token 到 localStorage。

## 建议修复

检查 `Frontend/js/auth.js` 第 25-30 行，确保登录成功后调用：
```javascript
localStorage.setItem('gn_token', res.token);
```

## 相关链接

- 代码文件: [Frontend/js/auth.js](../Frontend/js/auth.js)
- 测试用例: [TC-LOGIN-001](./test-cases.md#tc-login-001)
- 后端 API: POST /api/auth/login

## 历史记录

| 日期 | 人员 | 操作 | 备注 |
|-----|------|------|------|
| 2024-06-02 08:00 | QA Team | 创建 | 初次报告 |
| 2024-06-02 09:00 | Dev Team | 认领 | 分配给前端开发 |
| 2024-06-02 10:30 | Dev Team | 开发中 | 正在修复 |
```

---

## Postman 测试集合

### Postman Collection JSON (v2.1)

```json
{
  "info": {
    "_postman_id": "guessnum-collection-001",
    "name": "GuessNumberGame API Tests",
    "description": "Complete API test collection for GuessNumberGame project",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register - Success",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function() {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Response has userId', function() {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.id).to.be.a('number');",
                  "    pm.expect(jsonData.username).to.equal('testuser01');",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"username\": \"testuser01\", \"password\": \"Test@123\"}"
            },
            "url": {
              "raw": "{{base_url}}/api/auth/register",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "api",
                "auth",
                "register"
              ]
            }
          }
        },
        {
          "name": "Login - Success",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function() {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Response has JWT token', function() {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.token).to.be.a('string');",
                  "    var parts = jsonData.token.split('.');",
                  "    pm.expect(parts.length).to.equal(3);",
                  "});",
                  "",
                  "pm.test('Save token to environment', function() {",
                  "    var jsonData = pm.response.json();",
                  "    pm.environment.set('auth_token', jsonData.token);",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"username\": \"testuser01\", \"password\": \"Test@123\"}"
            },
            "url": {
              "raw": "{{base_url}}/api/auth/login",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "api",
                "auth",
                "login"
              ]
            }
          }
        },
        {
          "name": "Login - Wrong Password",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 401', function() {",
                  "    pm.response.to.have.status(401);",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"username\": \"testuser01\", \"password\": \"WrongPassword\"}"
            },
            "url": {
              "raw": "{{base_url}}/api/auth/login",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "api",
                "auth",
                "login"
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Game",
      "item": [
        {
          "name": "Start Game",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function() {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Response has gameId', function() {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.gameId).to.be.a('number');",
                  "    pm.environment.set('game_id', jsonData.gameId);",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{auth_token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{}"
            },
            "url": {
              "raw": "{{base_url}}/api/game/start",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "api",
                "game",
                "start"
              ]
            }
          }
        },
        {
          "name": "Make Guess - TooHigh",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function() {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Result is TooHigh, TooLow or Correct', function() {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(['TooHigh', 'TooLow', 'Correct']).to.include(jsonData.result);",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{auth_token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"gameId\": {{game_id}}, \"guess\": 80}"
            },
            "url": {
              "raw": "{{base_url}}/api/game/guess",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "api",
                "game",
                "guess"
              ]
            }
          }
        },
        {
          "name": "Get Game History",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function() {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Response is array', function() {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.be.an('array');",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{auth_token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/game/history",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "api",
                "game",
                "history"
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Leaderboard",
      "item": [
        {
          "name": "Get Leaderboard",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function() {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Response is array with max 20 items', function() {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.be.an('array');",
                  "    pm.expect(jsonData.length).to.be.below(21);",
                  "});",
                  "",
                  "pm.test('Records are sorted by guessCount ascending', function() {",
                  "    var jsonData = pm.response.json();",
                  "    for (let i = 1; i < jsonData.length; i++) {",
                  "        pm.expect(jsonData[i-1].guessCount).to.be.at.most(jsonData[i].guessCount);",
                  "    }",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/game/leaderboard?limit=20",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "api",
                "game",
                "leaderboard"
              ],
              "query": [
                {
                  "key": "limit",
                  "value": "20"
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000",
      "type": "string"
    },
    {
      "key": "auth_token",
      "value": "",
      "type": "string"
    },
    {
      "key": "game_id",
      "value": "",
      "type": "string"
    }
  ]
}
```

### Postman 使用步骤

1. **导入集合**
   - 打开 Postman
   - 点击 "Import" → "Paste Raw Text"
   - 粘贴上述 JSON
   - 点击 "Import"

2. **配置环境变量**
   - 创建新环境 "GuessNumberGame"
   - 设置变量：
     - `base_url`: `http://localhost:5000`

3. **运行测试**
   - 选择 "Authentication" 文件夹 → "Register - Success"
   - 点击 "Send"，确保注册成功
   - 运行 "Login - Success"，自动保存 Token
   - 运行 "Start Game"
   - 运行 "Make Guess"
   - 运行 "Get Leaderboard"

4. **批量运行（Collection Runner）**
   - 右键集合 → "Run collection"
   - 设置迭代次数和延迟
   - 点击 "Run GuessNumberGame API Tests"

---

## 总结

| 测试类型 | 用例数量 | 覆盖范围 |
|--------|--------|--------|
| 功能测试 | 20+ | 注册、登录、游戏、历史、排行榜 |
| 接口测试 | 10+ | 所有 REST API 端点 |
| 兼容性测试 | 2 | Chrome、Firefox |
| 响应式测试 | 2 | PC、平板 |

**测试工具链**
- 功能测试: 手工 + 自动化 (Selenium/Cypress)
- 接口测试: Postman、Reqable、REST Client
- 性能测试: JMeter、LoadRunner
- Bug 追踪: Jira、Azure DevOps

**建议测试流程**
1. 本地环境单元测试
2. 集成测试 (Postman 集合)
3. 功能测试 (手工 + 自动化)
4. 性能测试 (高并发)
5. 兼容性测试 (多浏览器)
6. UAT (用户验收测试)
