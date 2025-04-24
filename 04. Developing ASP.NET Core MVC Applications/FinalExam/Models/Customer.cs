namespace FinalExam.Models
{
    public class Customer
    {
        public int CustomerId { get; set; }
        public string? Fullname { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Password { get; set; }
        public DateTime RegistrationDate { get; set; }
    }
}
