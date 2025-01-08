// Case Study 1: Student Grade Management
// Create database, collection and insert data
use Student;
db.Stud_mark.insertMany([
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
]);

// Queries
// Finding datas
// 1. Find students with average is 84
db.Stud_mark.find({ average: 84 })

// 2. Find students with average greater than 85
db.Stud_mark.find({ average: { $gt: 85 } })

// 3. Find students with average in range 87 to 90
db.Stud_mark.find({
	$and: [ { average: { $gte: 87 } }, { average: { $lte: 90 } } ]
})
// or
db.Stud_mark.find({ average: { $gte: 87, $lte: 90 } })

// Updating datas
// 4. Add field "date_of_exam" for Amelia
db.Stud_mark.updateOne(
    { name: 'Amelia' },
    { $set: { date_of_exam: new Date() } } // Javascript Date() method
)

// 5. Increase Franklin's average by 2
db.Stud_mark.updateOne(
    { name: 'Franklin' },
    { $inc: { average: 2 } }
)

// 6. Rename field 'date_of_exam" to "examination_date"
db.Stud_mark.updateMany(
    {},
    { $rename: { date_of_exam: "examination_date" } }
)


// Case Study 2: Analyse sales by month
// Create database, collection and insert data
use Sales
db.sales.insertMany([
    {
        "_id": 1,
        "date": "2025-01-01",
        "product": "Product A",
        "category": "Electronics",
        "quantity": 2,
        "price": 500
    },
    {
        "_id": 2,
        "date": "2025-01-02",
        "product": "Product B",
        "category": "Furniture",
        "quantity": 1,
        "price": 1500
    },
    {
        "_id": 3,
        "date": "2025-01-03",
        "product": "Product C",
        "category": "Clothing",
        "quantity": 5,
        "price": 200
    },
    {
        "_id": 4,
        "date": "2025-02-01",
        "product": "Product D",
        "category": "Electronics",
        "quantity": 1,
        "price": 1000
    },
    {
        "_id": 5,
        "date": "2025-02-02",
        "product": "Product E",
        "category": "Furniture",
        "quantity": 2,
        "price": 800
    },
    {
        "_id": 6,
        "date": "2025-02-03",
        "product": "Product F",
        "category": "Clothing",
        "quantity": 10,
        "price": 150
    }
]);

// Analyse data with pipeline
// 1. Analyse sales by month
