// Demo data
use testDB
db.students.insertMany([
    {
        name: "Alice",
        grades: [
            { subject: "Math", score: 55 },
            { subject: "English", score: 80 }
        ],
        subjects: ["Math", "English"],
        attendance: [true, true, false],
        tags: ["urgent", "important", "review"],
        tasks: [{ name: "Homework", status: "pending" }, { name: "Exam", status: "completed" }],
        friends: [{ name: "Jane", age: 19 }, { name: "Mike", age: 22 }],
        skills: [{ skill: "JavaScript", level: "Beginner" }],
        purchases: [{ item: "Notebook", price: 15 }],
        numbers: [10, 20, 30],
        statuses: ["inactive", "archived"],
        licenses: [{ type: "silver", expiry: "2023" }],
        class: "10A",
        comments: ["Great performance", "Needs to focus on math", "Review spam messages"]
    },
    {
        name: "Bob",
        grades: [
            { subject: "History", score: 45 },
            { subject: "Science", score: 70 }
        ],
        subjects: ["History", "Science"],
        attendance: [true, false, true],
        tags: ["optional", "important"],
        tasks: [{ name: "Project", status: "pending" }],
        friends: [{ name: "Anna", age: 18 }, { name: "Tom", age: 25 }],
        skills: [{ skill: "Python", level: "Intermediate" }],
        purchases: [{ item: "Pen", price: 5 }],
        numbers: [20, 30, 40],
        statuses: ["active", "archived"],
        licenses: [{ type: "gold", expiry: "2024" }],
        class: "10B",
        comments: ["Improvement needed in history", "spam detected in notes", "Good effort in science"]
    },
    {
        name: "Charlie",
        grades: [
            { subject: "Math", score: 90 },
            { subject: "English", score: 40 }
        ],
        subjects: ["Math", "English", "Physics"],
        attendance: [true, true, true],
        tags: ["urgent", "done"],
        tasks: [{ name: "Presentation", status: "pending" }],
        friends: [{ name: "John", age: 20 }, { name: "Eve", age: 23 }],
        skills: [{ skill: "React", level: "Advanced" }],
        purchases: [{ item: "Book", price: 20 }],
        numbers: [5, 10, 15],
        statuses: ["pending", "active"],
        licenses: [{ type: "bronze", expiry: "2025" }],
        class: "10A",
        comments: ["Outstanding in math", "English requires improvement", "Possible spam alert"]
    },
    {
        name: "David",
        grades: [
            { subject: "Biology", score: 65 },
            { subject: "Chemistry", score: 50 }
        ],
        subjects: ["Biology", "Chemistry"],
        attendance: [false, true, true],
        tags: ["done", "important"],
        tasks: [{ name: "Lab Report", status: "completed" }],
        friends: [{ name: "Alice", age: 21 }, { name: "Charlie", age: 19 }],
        skills: [{ skill: "Django", level: "Intermediate" }],
        purchases: [{ item: "Laptop", price: 500 }],
        numbers: [40, 50, 60],
        statuses: ["inactive", "pending"],
        licenses: [{ type: "gold", expiry: "2026" }],
        class: "10B",
        comments: ["Consistent progress", "spam removed from tasks", "Strong in biology"]
    },
    {
        name: "Eve",
        grades: [
            { subject: "Math", score: 70 },
            { subject: "Art", score: 40 }
        ],
        subjects: ["Math", "Art"],
        attendance: [true, true, false],
        tags: ["review", "urgent"],
        tasks: [{ name: "Essay", status: "completed" }],
        friends: [{ name: "Bob", age: 18 }, { name: "David", age: 24 }],
        skills: [{ skill: "JavaScript", level: "Beginner" }],
        purchases: [{ item: "Tablet", price: 300 }],
        numbers: [10, 20, 25],
        statuses: ["archived", "pending"],
        licenses: [{ type: "silver", expiry: "2027" }],
        class: "10A",
        comments: ["Creative in art", "Needs more focus on math", "Spam content identified"]
    }
]);



// Basic
// $: update first grade in grades array that has score < 60 to 60
db.students.updateOne(
	{ grades: { $elemMatch: { score: { $lt: 60 } } } },
    { $set: { "grades.$.score": 60 } }
)

// $addToSet: add Physics to subjects if not existing
db.students.updateMany({}, { $addToSet: { subjects: 'Physics' } })

// $pop: remove last element from attendance array of first student (Alice)
db.students.updateOne(
	{ name: "Alice" },
    { $pop: { attendance: -1 } }
)

// $pull: remove subjects that have grade < 50 from grades
db.students.updateMany(
    {},
    { $pull: { grades: { score: { $lt: 50 } } } }
)

// $push: add element to grades array
db.students.updateMany(
    {},
    { $push: { grades: {subject: "History", score: 75} } }
)

// $pullAll: delete ["urgent", "important"] from tags
db.students.updateMany(
	{},
    { $pullAll: { tags: ["urgent", "important"] } }
)

// $[]: Change all pending to complete
db.students.updateMany(
    { "tasks.status": 'pending' },
    { $set: { "tasks.$[].status": 'completed' } }
)

// Advanced
// Update 'John'to 'Johnny' in friends array if age > 20
db.students.updateMany(
    { $and: [
                { "friends.name": "John" },
                { "friends.age": { $gt: 20 } }
            ]
    },
    { $set: { "friends.$.name": "Johnny" }}
)

// Add skill element if not exists
db.students.updateMany(
	{ "skills.skill": { $ne: "JavaScript" } },
	{ $addToSet: { skills: { skill: "JavaScript", level: "Intermediate" } } }
)

// Delete first element of grades array if student in class 10A
db.students.updateMany(
    { class: "10A" },
    { $pop: { grades: -1 } }
)

// Delete all comments containing 'spam' in comments
db.students.updateMany(
    {},
    { $pull: { comments: { $regex: "(?i)spam(?-i)" } } }
    // (?i)(?-i) - to mark start and end of case-insensitive substring
)

// Add element to purchases array
