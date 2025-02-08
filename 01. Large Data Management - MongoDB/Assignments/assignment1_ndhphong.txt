// Exercise with instructions
// Create database and collection
use Student
db.Stud_mark.insertMany(
	[
        {
            "name": "Adam",
            "gender": "M",
            "subjects": ["Java", "C", "Python"],
            "marks": [89, 78, 90],
            "average": 85.6
        },
        {
            "name": "Franklin",
            "gender": "M",
            "subjects": ["C", "VB", "Python"],
            "marks": [78, 85, 89],
            "average": 84
        },
        {
            "name": "Michael",
            "gender": "M",
            "subjects": ["Java", "PHP"],
            "marks": [88, 89],
            "average": 88.5
        },
        {
            "name": "Amelia",
            "gender": "F",
            "subjects": ["Ruby", "C++"],
            "marks": [86, 87],
            "average": 86.5
        }
    ]
)

// 3.1
// 1. Find only the documents where the average value is equal to 84
db.Stud_mark.find(
    { average: { $eq: 84 } }
)

// 2. Find only the documents where the average value is greater than 85
db.Stud_mark.find(
    { average: { $gt: 85 } }
)

// 3. View only the documents where the average is greater than or equal to 87 and less than or equal to 90
db.Stud_mark.find(
    { $and: [
        { average: { $gte: 87 } },
        { average: { $lte: 90 } }	
    ]}
)

// 3.2
// 4. Display only the documents where the subjects array contains either Java or C++.
db.Stud_mark.find(
    { subjects: { $elemMatch: { $in: ['Java', 'C++'] } } }
)

// 5. View all the documents where the subjects array has the value Java
db.Stud_mark.find(
    { subjects: { $elemMatch: { $eq: 'Java' } } }
)

// 6. Display only the documents where the first element in the marks array is less than 80
db.Stud_mark.find(
    { "marks.0": { $lt: 80 } }
)

// 7. Display the details of the student named Adam where the marks array has only the first element and the second element.
db.Stud_mark.find(
    { name: 'Adam' },
    { marks: { $slice: 2 } }
)

// 3.3
// 8. Add a new date field Date_of_exam which shows the current date only for the student named Amelia
db.Stud_mark.updateOne(
    { name: 'Amelia' },
    { $currentDate: { "date_of_exam": { $type: "date" } } }
)

// 9. Increase the average value by 2 for the student named Franklin
db.Stud_mark.updateOne(
    { name: 'Franklin' },
    { $inc: { average: 2 } }
)

// 10. Rename the field Date_of_exam to Examination_date
db.Stud_mark.updateMany(
    { date_of_exam: { $exists: true } },
    { $rename: { date_of_exam: "examination_date" } }
)


// Additional exercises
// Ex1: Employee Records
// Create database and collection
use Company
db.Employee.insertMany(
    [
        {
            "name": "Alice",
            "department": "HR",
            "skills": ["Communication", "Recruitment"],
            "salary": 50000,
            "experience": 5
        },
        {
            "name": "Bob",
            "department": "IT",
            "skills": ["Java", "Python"],
            "salary": 70000,
            "experience": 8
        },
        {
            "name": "Charlie",
            "department": "Finance",
            "skills": ["Accounting", "Excel"],
            "salary": 60000,
            "experience": 6
        }
    ]
)

// 1. Find employees with a salary greater than 60000
db.Employee.find({ salary: { $gt: 60000 } })

// 2. Display employees with Python as one of their skills
db.Employee.find({ skills: { $elemMatch: { $eq: 'Python' } } })

// 3. Update the experience of Alice to 6 years
db.Employee.updateOne(
    { name: 'Alice' },
    { $set: { experience: 6 } }
)

// 4. Rename the salary field to annual_salary
db.Employee.updateMany(
    {}, { $rename: { salary: "annual_salary" } }
)


// Ex2: Library Management
// Create database and collection
use Library
db.Books.insertMany(
    [
        {
            "title": "To Kill a Mockingbird",
            "author": "Harper Lee",
            "genres": ["Fiction", "Classic"],
            "copies": 5,
            "borrowed": 3
        },
        {
            "title": "1984",
            "author": "George Orwell",
            "genres": ["Fiction", "Dystopian"],
            "copies": 8,
            "borrowed": 6
        },
        {
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "genres": ["Fiction", "Classic"],
            "copies": 3,
            "borrowed": 1
        }
    ]
)

// 1. Find books with borrowed count less than 5
db.Books.find({ borrowed: { $lt: 5 } })

// 2. Display books of the genre Classic
db.Books.find({ genres: { $elemMatch: { $eq: 'Classic' } } })

// 3. Add a new field available_copies for all books (calculated as copies - borrowed)
db.Books.aggregate(
    { $set: { available_copies: { $subtract: ["$copies", "$borrowed"] } } }
)

// 4. Update the author field of 1984 to Eric Arthur Blair
db.Books.updateOne(
    { title: '1984' },
    { $set: { author: 'Eric Arthur Blair' } }
)


// Ex3: Online Store
// Create database and collection
use ECommerce
db.Products.insertMany(
    [
        {
            "product": "Laptop",
            "brand": "Dell",
            "price": 1200,
            "stock": 15,
            "ratings": [5, 4, 4, 5, 5]
        },
        {
            "product": "Smartphone",
            "brand": "Samsung",
            "price": 800,
            "stock": 30,
            "ratings": [4, 4, 5, 3, 4]
        },
        {
            "product": "Headphones",
            "brand": "Sony",
            "price": 150,
            "stock": 50,
            "ratings": [5, 5, 4, 5, 4]
        }
    ]
)

// 1. Find products priced above 500
db.Products.find({ price: { $gt: 500 } })

// 2. Display products with an average rating greater than 4.5
db.Products.aggregate(
    { $set: { avg_ratings: { $avg: "$ratings" } } },
    { $match: { avg_ratings: { $gt: 4.5 } } }
)

// 3. Reduce the stock of Laptop by 2 units
db.Products.updateOne(
    { product: 'Laptop' },
    { $inc: { stock: -2 } }
)

// 4. Add a new field on_sale and set it to true for products with price less than 200
db.Products.updateMany(
    {},
    [{
        $set: {
            on_sale: {
                $cond: { if: { $lt: ["$price", 200] }, then: true, else: false }
            }
        }
    }]
)
// [] for aggregation pipeline in update queries

