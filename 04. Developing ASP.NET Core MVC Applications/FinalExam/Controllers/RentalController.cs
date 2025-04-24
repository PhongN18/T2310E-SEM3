using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinalExam.Data;
using FinalExam.Models;

namespace FinalExam.Controllers
{
    public class RentalController : Controller
    {
        private readonly ApplicationDbContext _context;

        public RentalController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var customerId = HttpContext.Session.GetInt32("CustomerId");

            if (!customerId.HasValue)
            {
                return RedirectToAction("Login", "Customer");  // Redirect to login if not logged in
            }

            // Get all rentals for the logged-in user
            var rentals = await _context.Rentals
                .Where(r => r.CustomerId == customerId.Value)
                .Include(r => r.RentalDetails)
                .ThenInclude(rd => rd.ComicBook)
                .ToListAsync();

            return View(rentals);  // Pass rentals to the view
        }

        // GET: Rental/Rent/5
        public IActionResult Rent(int comicBookId)
        {
            var comicBook = _context.ComicBooks.FirstOrDefault(c => c.ComicBookId == comicBookId);
            if (comicBook == null)
            {
                return NotFound();
            }

            // Assuming the customer ID is stored in session
            ViewData["CustomerId"] = HttpContext.Session.GetInt32("CustomerId");

            return View(comicBook);  // Pass comicBook to the Rent view
        }

        // POST: Rental/Rent
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Rent(int comicBookId, int customerId, int quantity, DateTime returnDate)
        {
            var comicBook = await _context.ComicBooks.FindAsync(comicBookId);
            if (comicBook == null)
            {
                return NotFound();
            }

            // Create a new rental record
            var rental = new Rental
            {
                CustomerId = customerId,  // Use the customerId passed from the form
                RentalDate = DateTime.Now,
                ReturnDate = returnDate,
                Status = "Active"
            };

            _context.Add(rental);
            await _context.SaveChangesAsync();

            // Add rental details
            var rentalDetail = new RentalDetail
            {
                RentalId = rental.RentalId,
                ComicBookId = comicBookId,
                Quantity = quantity,
                PricePerDay = comicBook.PricePerDay
            };

            _context.Add(rentalDetail);
            await _context.SaveChangesAsync();

            // Redirect to the Home or another relevant page after the rental
            return RedirectToAction("Index", "Home");
        }

        // GET: Rental/Report
        public IActionResult Report(DateTime? startDate, DateTime? endDate)
        {
            if (startDate == null || endDate == null)
            {
                return View();  // Return view without data if no date range is provided
            }

            // Get all rentals within the specified date range and include related Customer and RentalDetails
            var rentalReport = _context.Rentals
                .Where(r => r.RentalDate >= startDate.Value && r.ReturnDate <= endDate.Value)
                .Include(r => r.RentalDetails)
                .ThenInclude(rd => rd.ComicBook)  // Include the related ComicBook for each RentalDetail
                .Include(r => r.Customer)  // Include the related Customer for each Rental
                .ToList();

            // Create a list of report data to pass to the view
            var reportData = rentalReport.Select(r => new
            {
                BookName = r.RentalDetails.Select(rd => rd.ComicBook.Title).FirstOrDefault(),
                RentalDate = r.RentalDate.ToShortDateString(),
                ReturnDate = r.ReturnDate.ToShortDateString(),
                CustomerName = r.Customer.Fullname,  // Accessing Customer's Fullname
                Quantity = r.RentalDetails.Sum(rd => rd.Quantity)
            }).ToList();

            return View(reportData);  // Pass the data to the view
        }
    }
}
