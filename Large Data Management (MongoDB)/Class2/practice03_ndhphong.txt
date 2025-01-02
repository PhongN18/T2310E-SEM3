// Part 1
// Create a database named 'movie_library' and a collection named 'classics'
use movie_library
db.createCollection('classics')

// Add documents to the collection
db.classics.insertMany([
    {
        title: "Gone with the Wind",
        year: 1939,
        genre: "Drama, Romance",
        director: "Victor Fleming"
    },
    {
        title: "The Dark Knight",
        year: 2008,
        genre: "Action, Crime",
        director: "Christopher Nolan"
    },
    {
        title: "Schindler's List",
        year: 1993,
        genre: "Biography, Drama",
        director: "Steven Spielberg"
    }
])

// Find all movies produced after 1990
db.classics.find({ year: { $gt: 1990 } })

// Find all movies named "The Dark Knight"
db.classics.find({ title: "The Dark Knight" })

// Show all movies with just title and genre
db.classics.find({}, { title: 1, genre: 1})

// Update the genre of "Gone with the Wind" to "Classic, Drama, Romance"
db.classics.updateOne(
	{ title: "Gone with the Wind" },
    { $set: { genre: "Classic, Drama, Romance" } }
)

// Mark all movies produced before 2000 as 'classic'
db.classics.updateMany(
    { year: { $lt: 2000 } },
    { $set: { tag: 'classic' } }
)

// Delete the movie named "Schindler's List"
db.classics.deleteOne({ title: "Schindler's List" })

// Delete all movies produced before 1950
db.classics.deleteMany({ year: { $lt: 1950 } })

// Part 2
// 1. Bookstore - Bestseller
// Create 'bookstore' database and 'bestsellers' collection
use bookstore
db.createCollection('bestsellers')

// Add 5 bestsellers books, with fields: title, author, year, genre, sales
db.bestsellers.insertMany([
    {
        title: "The Midnight Library",
        author: "Matt Haig",
        year: 2020,
        genre: "Fiction",
        sales: 1500000
    },
    {
        title: "Atomic Habits",
        author: "James Clear",
        year: 2018,
        genre: "Self-help",
        sales: 2500000
    },
    {
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        year: 1997,
        genre: "Fantasy",
        sales: 5000000
    },
    {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        year: 1960,
        genre: "Classic",
        sales: 2000000
    },
    {
        title: "Becoming",
        author: "Michelle Obama",
        year: 2018,
        genre: "Biography",
        sales: 1800000
    }
]);

// Find all bestsellers books with sales greater than 1 million
db.bestsellers.find({ sales: { $gt: 1000000 } })

// Update the tag 'hot' for books that have sales greater than 2m
db.bestsellers.updateMany(
    { sales: { $gt: 2000000 } },
    { $set: { tag: "hot" } }
)

// Delete all books that were published before 2000
db.bestsellers.deleteMany({ year: { $lt: 2000} })

// 2. Restaurant
// Create 'restaurant_db' database and 'restaurants' collection
use restaurant_db
db.createCollection('restaurants')

// Add 5 restaurants with field: name, cuisine, location, rating
db.restaurants.insertMany([
    {
        name: "Sushi Delight",
        cuisine: "Japanese",
        location: "Tokyo",
        rating: 4.8
    },
    {
        name: "Pasta Paradise",
        cuisine: "Italian",
        location: "Rome",
        rating: 4.5
    },
    {
        name: "Taco Fiesta",
        cuisine: "Mexican",
        location: "Mexico City",
        rating: 3.8
    },
    {
        name: "Burger Haven",
        cuisine: "American",
        location: "New York",
        rating: 4.2
    },
    {
        name: "Spicy Curry House",
        cuisine: "Indian",
        location: "Mumbai",
        rating: 2.9
    }
]);

// Find all restaurants with rating greater than or equal to 4.5
db.restaurants.find({ rating: { $gte: 4.5 } })

// Update field openHours
db.restaurants.updateMany({}, { $set: { openHours: "8AM - 10PM" }})

// Delete all restaurants with rating under 3.0
db.restaurants.deleteMany({ rating: { $lt: 3.0 } })

// 3. Track personal expense
// Create 'expense_tracker' database and 'expenses' collection
use expense_tracker
db.createCollection('expenses')

// Add 10 expenses with fields: description, category, amount, date
db.expenses.insertMany([
    {
        description: "Grocery shopping",
        category: "Food",
        amount: 50,
        date: new Date("2025-01-01")
    },
    {
        description: "Monthly bus pass",
        category: "Transport",
        amount: 20,
        date: new Date("2025-01-02")
    },
    {
        description: "Gym membership",
        category: "Health",
        amount: 40,
        date: new Date("2025-01-03")
    },
    {
        description: "Netflix subscription",
        category: "Entertainment",
        amount: 15,
        date: new Date("2025-01-01")
    },
    {
        description: "Coffee with friends",
        category: "Food",
        amount: 8,
        date: new Date("2025-01-04")
    },
    {
        description: "Taxi ride",
        category: "Transport",
        amount: 25,
        date: new Date("2025-01-05")
    },
    {
        description: "Doctor visit",
        category: "Health",
        amount: 60,
        date: new Date("2025-01-03")
    },
    {
        description: "Movie ticket",
        category: "Entertainment",
        amount: 12,
        date: new Date("2025-01-02")
    },
    {
        description: "Fast food lunch",
        category: "Food",
        amount: 6,
        date: new Date("2025-01-06")
    },
    {
        description: "Parking fee",
        category: "Transport",
        amount: 5,
        date: new Date("2025-01-06")
    }
]);

// Calculate the total amount of each category
db.expenses.aggregate([
    { $group: {
            _id: "$category",
            total: { $sum: "$amount" }
    }}
])

// Add monthlyBudget field
db.expenses.updateMany({}, { $set: { montlyBudget: 500 } })

// Delete all expenses with amount less than 10
db.expenses.deleteMany({ amount: { $lt: 10 } })
