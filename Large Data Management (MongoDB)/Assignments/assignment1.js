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