using GuessNumberGame.Data;
using GuessNumberGame.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GuessNumberGame.Services
{
    public class LeaderboardService : ILeaderboardService
    {
        private readonly GameDbContext _db;

        public LeaderboardService(GameDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<LeaderboardDto>> GetLeaderboardAsync(int limit = 20)
        {
            var query = from g in _db.GameRecords
                        where g.IsSuccess
                        join u in _db.Users on g.UserId equals u.Id
                        orderby g.GuessCount
                        select new LeaderboardDto { UserId = u.Id, Username = u.Username, GuessCount = g.GuessCount };
            return await query.Take(limit).ToListAsync();
        }
    }
}