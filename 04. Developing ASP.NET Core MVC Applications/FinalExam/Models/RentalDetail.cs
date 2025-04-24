namespace FinalExam.Models
{
    public class RentalDetail
    {
        public int RentalDetailId { get; set; }
        public int RentalId { get; set; }
        public int ComicBookId { get; set; }
        public int Quantity { get; set; }
        public int PricePerDay { get; set; }

        // Navigation property to Rental
        public Rental Rental { get; set; }

        // Navigation property to ComicBook
        public ComicBook ComicBook { get; set; }
    }
}