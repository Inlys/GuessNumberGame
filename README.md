# Guess Number Game（猜数字游戏系统）

## 项目简介

Guess Number Game 是一个基于 **ASP.NET Core Web API + 前后端分离架构** 的轻量级Web小游戏系统。

项目模拟真实企业开发流程，包含：

- 用户注册 / 登录
- JWT身份认证
- 猜数字核心游戏逻辑
- 游戏记录持久化
- 排行榜系统
- 前后端分离交互

本项目主要用于：
- 后端接口开发练习
- 接口测试实践
- 小型全栈练习项目

---

## 技术栈

### 后端
- C# .NET 8 Web API
- ASP.NET Core
- Entity Framework Core
- SQLite
- JWT Authentication

### 前端
- HTML5
- CSS3
- JavaScript (Fetch API)
#前后端交互方式：浏览器自带Fetch，前端通过网络请求(Fetch)去拿后端数据

---

## 系统架构

前端（HTML + JS）
        ↓
REST API（ASP.NET Core Web API）
        ↓
业务层（Services）
        ↓
ORM层（Entity Framework Core）
        ↓
SQLite数据库

---

## 运行
运行后端:
```powershell
cd Backend
dotnet restore
dotnet build
# 可借助实体框架工具（可选）创建数据库并执行数据库迁移操作
# 使用dotnet ef迁移命令添加名为Initial的迁移文件
# 使用dotnet ef命令更新数据库
dotnet run
```

浏览器打开 `Frontend/index.html`展示UI (或通过简易静态服务器部署运行).

---

## 测试用例
链接：https://my.feishu.cn/mindnotes/NANEbmJ0imEGDlnAdqXcWw7an1b?from=from_copylink