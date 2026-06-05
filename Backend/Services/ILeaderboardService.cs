using GuessNumberGame.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GuessNumberGame.Services
{
    public interface ILeaderboardService
    {
        Task<IEnumerable<LeaderboardDto>> GetLeaderboardAsync(int limit = 20);
    }
}