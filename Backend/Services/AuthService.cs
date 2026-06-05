using GuessNumberGame.Data;
using GuessNumberGame.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace GuessNumberGame.Services
{
    public class AuthService : IAuthService
    {
        private readonly GameDbContext _db;
        private readonly IConfiguration _config;

        public AuthService(GameDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        public async Task<User?> RegisterAsync(string username, string password)
        {
            var existing = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (existing != null) return null;
            var user = new User { Username = username, PasswordHash = HashPassword(password) };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return user;
        }

        public async Task<string?> AuthenticateAsync(string username, string password)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null) return null;
            if (!VerifyPassword(password, user.PasswordHash)) return null;
            return GenerateToken(user);
        }

        private string GenerateToken(User user)
        {
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "ReplaceThisWithASecureKey1234567890");
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()), new Claim(ClaimTypes.Name, user.Username) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private static string HashPassword(string password)
        {
            using var rng = new Rfc2898DeriveBytes(password, 16, 10000, HashAlgorithmName.SHA256);
            var salt = rng.Salt;
            var hash = rng.GetBytes(32);
            return Convert.ToBase64String(salt) + ":" + Convert.ToBase64String(hash);
        }

        private static bool VerifyPassword(string password, string stored)
        {
            var parts = stored.Split(':');
            if (parts.Length != 2) return false;
            var salt = Convert.FromBase64String(parts[0]);
            var hash = Convert.FromBase64String(parts[1]);
            using var rng = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
            var test = rng.GetBytes(32);
            return hash.SequenceEqual(test);
        }
    }
}