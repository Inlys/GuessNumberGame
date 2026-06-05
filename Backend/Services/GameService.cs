using GuessNumberGame.Data;
using GuessNumberGame.DTOs;
using GuessNumberGame.Models;
using Microsoft.EntityFrameworkCore;

namespace GuessNumberGame.Services
{
    public class GameService : IGameService
    {
        private readonly GameDbContext _db;
        private readonly Random _rng = new();

        public GameService(GameDbContext db)
        {
            _db = db;
        }

        public async Task<int> StartGameAsync(int userId)
        {
            var record = new GameRecord
            {
                UserId = userId,
                TargetNumber = _rng.Next(1, 101),
                GuessCount = 0,
                StartTime = DateTime.UtcNow,
                IsSuccess = false
            };
            _db.GameRecords.Add(record);
            await _db.SaveChangesAsync();
            return record.Id;
        }

        public async Task<GuessResponse> MakeGuessAsync(int userId, int gameId, int guess)
        {
            var record = await _db.GameRecords.FirstOrDefaultAsync(g => g.Id == gameId && g.UserId == userId);
            if (record == null) return new GuessResponse { Result = "NotFound", RemainingGuesses = 0 };
            record.GuessCount++;
            string result;
            if (guess == record.TargetNumber)
            {
                record.IsSuccess = true;
                record.EndTime = DateTime.UtcNow;
                result = "Correct";
            }
            else if (guess > record.TargetNumber)
            {
                result = "TooHigh";
            }
            else
            {
                result = "TooLow";
            }
            await _db.SaveChangesAsync();
            return new GuessResponse { Result = result, RemainingGuesses = 0 };
        }
    }
}