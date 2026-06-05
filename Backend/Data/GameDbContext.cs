using GuessNumberGame.Models;
using Microsoft.EntityFrameworkCore;

namespace GuessNumberGame.Data
{
    public class GameDbContext : DbContext
    {
        public GameDbContext(DbContextOptions<GameDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<GameRecord> GameRecords { get; set; }
    }
}