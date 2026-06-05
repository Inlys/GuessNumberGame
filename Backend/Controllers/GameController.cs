using GuessNumberGame.DTOs;
using GuessNumberGame.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace GuessNumberGame.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GameController : ControllerBase
    {
        private readonly IGameService _game;
        private readonly ILeaderboardService _leaderboard;
        private readonly Data.GameDbContext _db;

        public GameController(IGameService game, ILeaderboardService leaderboard, Data.GameDbContext db)
        {
            _game = game;
            _leaderboard = leaderboard;
            _db = db;
        }

        private int GetUserId() => int.Parse(User.FindFirst("id").Value);

        [HttpPost("start")]
        public async Task<IActionResult> Start()
        {
            var userId = GetUserId();
            var gameId = await _game.StartGameAsync(userId);
            return Ok(new { GameId = gameId });
        }

        [HttpPost("guess")]
        public async Task<IActionResult> Guess([FromBody] GuessRequest req)
        {
            var userId = GetUserId();
            var res = await _game.MakeGuessAsync(userId, req.GameId, req.Guess);
            if (res.Result == "NotFound") return NotFound();
            return Ok(res);
        }

        [HttpGet("history")]
        public async Task<IActionResult> History()
        {
            var userId = GetUserId();
            var list = await _db.GameRecords.Where(g => g.UserId == userId).OrderByDescending(g => g.StartTime)
                .Select(g => new DTOs.GameRecordDto {
                    Id = g.Id,
                    UserId = g.UserId,
                    TargetNumber = g.TargetNumber,
                    GuessCount = g.GuessCount,
                    StartTime = g.StartTime,
                    EndTime = g.EndTime,
                    IsSuccess = g.IsSuccess
                }).ToListAsync();
            return Ok(list);
        }

        [AllowAnonymous]
        [HttpGet("leaderboard")]
        public async Task<IActionResult> Leaderboard([FromQuery] int limit = 20)
        {
            var list = await _leaderboard.GetLeaderboardAsync(limit);
            return Ok(list);
        }
    }
}