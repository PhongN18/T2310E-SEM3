using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinalExam.Data;
using FinalExam.Models;

namespace FinalExam.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;

        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Get the CustomerId from the session
            var customerId = HttpContext.Session.GetInt32("CustomerId");

            if (customerId.HasValue)
            {
                // Retrieve customer from the database using the customerId from session
                var customer = _context.Customers.FirstOrDefault(c => c.CustomerId == customerId.Value);

                // Pass the customer object to the view
                ViewData["Customer"] = customer;
            }

            return View();
        }
    }
}
