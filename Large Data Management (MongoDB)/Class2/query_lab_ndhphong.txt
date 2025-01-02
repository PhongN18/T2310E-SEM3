// Create 'company' database and 'employees' collection
use company
db.createCollection('employees')

// Insert documents
db.employees.insertMany([
    { name: "John Doe", age: 30, position: "Developer", skills: ["JavaScript", "Node.js"], salary: 70000 },
    { name: "Jane Smith", age: 25, position: "Manager", skills: ["Leadership", "Communication"], salary: 90000 },
    { name: "Emily Johnson", age: 22, position: "Intern", skills: ["Python", "Data Analysis"], salary: 15000 },
    { name: "Michael Brown", age: 28, position: "Developer", skills: ["JavaScript", "React"], salary: 60000 },
    { name: "Sarah Davis", age: 35, position: "Designer", skills: ["UI/UX", "Photoshop"], salary: 75000 },
    { name: "David Wilson", age: 40, position: "Developer", skills: ["JavaScript", "Node.js", "TypeScript"], salary: 85000 },
    { name: "Chris Lee", age: 32, position: "Tester", skills: ["Automation Testing", "Selenium"], salary: 55000 },
    { name: "Anna Walker", age: 27, position: "Developer", skills: ["React", "Redux"], salary: 62000 },
    { name: "James King", age: 45, position: "Manager", skills: ["Leadership", "Project Management"], salary: 100000 },
    { name: "Laura Adams", age: 29, position: "Developer", skills: ["Vue.js", "JavaScript"], salary: 72000 },
    { name: "Robert Taylor", age: 50, position: "Manager", skills: ["Communication", "Problem Solving"], salary: 110000 },
    { name: "Nancy Thomas", age: 26, position: "Intern", skills: ["JavaScript"], salary: 18000 },
    { name: "Steve Moore", age: 31, position: "Developer", skills: ["Python", "Django"], salary: 77000 },
    { name: "Sophia Garcia", age: 24, position: "Trainee", skills: ["HTML", "CSS"], salary: 20000 },
    { name: "Kevin Lewis", age: 33, position: "Developer", skills: ["Node.js", "Express.js"], salary: 68000 },
    { name: "Karen Harris", age: 29, position: "Intern", skills: ["Machine Learning"], salary: 15000 },
    { name: "Jason Young", age: 34, position: "Developer", skills: ["Java", "Spring Boot"], salary: 90000 },
    { name: "Olivia Martinez", age: 38, position: "Designer", skills: ["Figma", "Adobe XD"], salary: 85000 },
    { name: "William Perez", age: 36, position: "Tester", skills: ["Manual Testing", "API Testing"], salary: 50000 },
    { name: "Chloe White", age: 28, position: "Developer", skills: ["Angular", "TypeScript"], salary: 65000 }
]);

// Use $eq to find "Developer"
db.employees.find({ position: { $eq: "Developer" } })

// Use $gt to find employees older than 25
db.employees.find({ age: { $gt: 25 } })

// Use $gte to find employees with salary greater than or equal to 60000
db.employees.find({ salary: { $gte: 60000 } })

// Use $in to find 'Manager' and 'Developer'
db.employees.find({ position: { $in: ['Manager', 'Developer'] } })

// Use $nin to find emloyees who is not 'Intern' or 'Trainee'
db.employees.find({ position: { $nin: ['Intern', 'Trainee'] } })

// Use $and to find employees with salary greater than 50000 and position is 'Developer'
db.employees.find({
    $and: [
        { salary: { $gt: 50000 } },
        { position: "Developer" }
    ]})

// Use $or to find all employees younger than 30 or position 'Manager'
db.employees.find({
    $or: [
        { age: { $lt: 30 } },
        { position: "Manager" }
    ]})

// Use $not to find all employees without skill "React"
db.employees.find({
    skills: { $not: { $elemMatch: { $eq: "React" } } }
});

// Use $exists to find all employees with skills
db.employees.find({ skills: { $exists: true } })

// Use $type to find all employees with salary field has type number
db.employees.find({ salary: { $type: "number" } })

// Use $all to find all employees with both Javascript and Node.js skills
db.employees.find({ skills: { $all: ['JavaScript', 'Node.js'] } })

// Use $elemMatch to find all employees with at least 1 skill satisfying the conditions
db.employees.find({ skills: { $elemMatch: { $in: ['Python', 'Django'] } } })

// Use $size to find all employees with 3 skills
db.employees.find({ skills: { $size: 3 } })

// Add skill 'TypeScript' to all 'Developer'
db.employees.updateMany(
    { position: 'Developer' },
    { $push: { skills: "TypeScript" } }
)

// Update John Doe's salary to 75000
db.employees.updateOne({ name: 'John Doe'}, { $set: { salary: 75000 } })

// Delete all 'Intern'
db.employees.deleteMany({ position: 'Intern' })
