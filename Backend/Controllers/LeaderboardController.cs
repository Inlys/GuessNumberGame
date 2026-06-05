using GuessNumberGame.Services;
using Microsoft.AspNetCore.Mvc;

namespace GuessNumberGame.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeaderboardController : ControllerBase
    {
        private readonly ILeaderboardService _leaderboard;
        public LeaderboardController(ILeaderboardService leaderboard)
        {
            _leaderboard = leaderboard;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int limit = 20)
        {
            var list = await _leaderboard.GetLeaderboardAsync(limit);
            return Ok(list);
        }
    }
}