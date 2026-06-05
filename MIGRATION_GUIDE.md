# EF Core Migration 与数据库初始化指南

## 项目配置

- **数据库**: SQLite
- **数据库文件**: `E:\VSCodeData\GuessNumberGame\Backend\guessgame.db`
- **DbContext**: `GuessNumberGame.Data.GameDbContext`
- **Migrations 路径**: `GuessNumberGame/Migrations/`

## 自动初始化（推荐）

项目已配置为**首次启动时自动初始化数据库**。在 `Program.cs` 中：

```csharp
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<GameDbContext>();
    try
    {
        db.Database.Migrate();  // 应用迁移
    }
    catch
    {
        db.Database.EnsureCreated();  // 回退：直接创建表
    }
}
```

**启动方式**：

```powershell
cd E:\VSCodeData\GuessNumberGame\Backend
dotnet run
```

运行时会自动：
1. 检查数据库是否存在
2. 应用 Migration（如果存在）
3. 若失败，则直接创建所有表结构

**数据库表将被创建**：
- `Users` - 用户表 (Id, Username, PasswordHash)
- `GameRecords` - 游戏记录表 (Id, UserId, TargetNumber, GuessCount, StartTime, EndTime, IsSuccess)

---

## 手动 Migration 命令（可选）

### 前提条件

安装 EF Core CLI 工具：

```powershell
dotnet tool install --global dotnet-ef
```

或更新已安装版本：

```powershell
dotnet tool update --global dotnet-ef
```

### 生成新迁移

进入后端项目目录：

```powershell
cd E:\VSCodeData\GuessNumberGame\Backend
```

创建新迁移（若修改了数据模型）：

```powershell
dotnet ef migrations add <MigrationName>
```

例如，添加新字段迁移：

```powershell
dotnet ef migrations add AddUserEmail
```

### 应用迁移到数据库

```powershell
dotnet ef database update
```

### 查看迁移历史

```powershell
dotnet ef migrations list
```

### 回滚迁移

回滚到上一个迁移：

```powershell
dotnet ef database update <PreviousMigrationName>
```

例如，回滚初始迁移：

```powershell
dotnet ef database update 0
```

---

## 现有迁移

已提供的初始迁移：

- **`Migrations/20240602000000_InitialCreate.cs`** - 创建 Users 和 GameRecords 表
- **`Migrations/GameDbContextModelSnapshot.cs`** - 模型快照

## 验证数据库

启动应用后，检查数据库文件是否生成：

```powershell
Test-Path -Path "E:\VSCodeData\GuessNumberGame\Backend\guessgame.db"
```

使用 SQLite 工具查看表结构（可选）：

```powershell
# 若已安装 sqlite3
sqlite3 "E:\VSCodeData\GuessNumberGame\Backend\guessgame.db" ".tables"
```

---

## 常见问题

### Q: 启动时报错 "unable to open database file"？

A: 确保 Backend 目录存在且有读写权限，或检查 appsettings.json 中的连接字符串。

### Q: 如何重置数据库？

A: 删除 `guessgame.db` 文件，重启应用即可重新创建。

### Q: 如何查看应用的迁移状态？

A: 运行 `dotnet ef database update --verbose` 查看详细输出。

---

## 完整启动流程

1. 进入后端项目目录：
   ```powershell
   cd E:\VSCodeData\GuessNumberGame\Backend
   ```

2. 还原依赖包：
   ```powershell
   dotnet restore
   ```

3. 构建项目：
   ```powershell
   dotnet build
   ```

4. 运行应用（**自动初始化数据库**）：
   ```powershell
   dotnet run
   ```

5. 看到类似输出时，表示启动成功：
   ```
   info: Microsoft.Hosting.Lifetime[14]
         Now listening on: http://localhost:5000
   ```

6. 在浏览器打开前端：
   ```
   file:///E:\VSCodeData\GuessNumberGame\Frontend\index.html
   ```

---

## 相关文件

- `GuessNumberGame.csproj` - 项目文件（包含 EF Core NuGet 包）
- `appsettings.json` - 数据库连接字符串配置
- `Program.cs` - 自动初始化配置
- `Data/GameDbContext.cs` - DbContext 定义
- `Models/User.cs`, `Models/GameRecord.cs` - 数据实体
