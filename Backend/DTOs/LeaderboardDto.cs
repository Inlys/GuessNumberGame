namespace GuessNumberGame.DTOs
{
    public class LeaderboardDto
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public int GuessCount { get; set; }
    }
}