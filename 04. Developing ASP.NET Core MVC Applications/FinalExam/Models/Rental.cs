namespace FinalExam.Models
{
    public class Rental
    {
        public int RentalId { get; set; }
        public int CustomerId { get; set; }
        public DateTime RentalDate { get; set; }
        public DateTime ReturnDate { get; set; }
        public string? Status { get; set; }

        // Navigation property to link Rental to Customer
        public Customer Customer { get; set; }

        // Navigation property to link to RentalDetails
        public ICollection<RentalDetail> RentalDetails { get; set; }
    }
}