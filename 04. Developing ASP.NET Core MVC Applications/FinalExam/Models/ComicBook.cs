namespace FinalExam.Models
{
    public class ComicBook
    {
        public int ComicBookId { get; set; }
        public string? Title { get; set; }
        public string? Author { get; set; }
        public int PricePerDay { get; set; }
    }
}