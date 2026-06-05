using GuessNumberGame.DTOs;
using GuessNumberGame.Models;

namespace GuessNumberGame.Services
{
    public interface IAuthService
    {
        Task<User?> RegisterAsync(string username, string password);
        Task<string?> AuthenticateAsync(string username, string password);
    }
}