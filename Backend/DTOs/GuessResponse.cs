namespace GuessNumberGame.DTOs
{
    public class GuessResponse
    {
        public string Result { get; set; } // "TooHigh", "TooLow", "Correct"
        public int RemainingGuesses { get; set; }
    }
}