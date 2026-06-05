using System;

namespace GuessNumberGame.Models
{
    public class GameRecord
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int TargetNumber { get; set; }
        public int GuessCount { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public bool IsSuccess { get; set; }
        // Navigation
        public User? User { get; set; }
    }
}