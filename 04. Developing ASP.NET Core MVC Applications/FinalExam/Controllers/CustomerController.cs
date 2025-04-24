using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinalExam.Data;
using FinalExam.Models;

namespace FinalExam.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Customer/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Customer/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Fullname,PhoneNumber,Password")] Customer customer)
        {
            if (ModelState.IsValid)
            {
                customer.RegistrationDate = DateTime.Now;
                _context.Add(customer);
                await _context.SaveChangesAsync();
                return RedirectToAction("Login");
            }
            return View(customer);
        }

        // GET: Customer/Login
        public IActionResult Login()
        {
            return View();
        }

        // POST: Customer/Login
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login([Bind("PhoneNumber,Password")] Customer loginCustomer)
        {
            if (ModelState.IsValid)
            {
                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.PhoneNumber == loginCustomer.PhoneNumber && c.Password == loginCustomer.Password);

                if (customer != null)
                {
                    // Successfully logged in
                    HttpContext.Session.SetInt32("CustomerId", customer.CustomerId);
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    // Invalid credentials
                    ModelState.AddModelError("", "Invalid login attempt.");
                }
            }
            return View(loginCustomer);
        }

        // GET: Customer/Logout
        public IActionResult Logout()
        {
            HttpContext.Session.Remove("CustomerId");
            return RedirectToAction("Login");
        }
    }
}
