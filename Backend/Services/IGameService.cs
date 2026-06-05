using GuessNumberGame.DTOs;

namespace GuessNumberGame.Services
{
    public interface IGameService
    {
        Task<int> StartGameAsync(int userId);
        Task<GuessResponse> MakeGuessAsync(int userId, int gameId, int guess);
    }
}