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
        tasks: [
            { name: "Homework", status: "pending" },
            { name: "Exam", status: "completed" }
        ],
        updates: [
            { type: "feature", description: "Added dark mode" },
            { type: "bug", description: "Fixed UI overlap issue" },
            { type: "deploy", description: "Deployed version 1.2.0" }
        ],
        orders: [
            { item: "Book", status: "pending" },
            { item: "Notebook", status: "completed" }
        ],
        friends: [{ name: "Jane", age: 19 }, { name: "Mike", age: 22 }],
        skills: [{ skill: "JavaScript", level: "Beginner" }],
        purchases: [{ item: "Notebook", price: 15 }],
        numbers: [10, 20, 30],
        statuses: ["inactive", "archived"],
        licenses: [{ type: "silver", expiry: 2023 }],
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
        tags: ["optional", "important", "team"],
        tasks: [
            { name: "Project", status: "pending" },
            { name: "Assignment", status: "pending" }
        ],
        updates: [
            { type: "bugfix", description: "Resolved login error" },
            { type: "feature", description: "Added user analytics" },
            { type: "deploy", description: "Deployed version 2.0.1" }
        ],
        orders: [
            { item: "Laptop", status: "pending" },
            { item: "Tablet", status: "completed" }
        ],
        friends: [{ name: "Anna", age: 18 }, { name: "Tom", age: 25 }],
        skills: [{ skill: "Python", level: "Intermediate" }],
        purchases: [{ item: "Pen", price: 5 }],
        numbers: [20, 30, 40],
        statuses: ["active", "archived"],
        licenses: [{ type: "gold", expiry: 2024 }],
        class: "10B",
        comments: ["Improvement needed in history", "spam detected in notes", "Good effort in science"]
    },
    {
        name: "Charlie",
        grades: [
            { subject: "Math", score: 90 },
            { subject: "English", score: 40 },
            { subject: "Physics", score: 75 }
        ],
        subjects: ["Math", "English", "Physics"],
        attendance: [true, true, true],
        tags: ["urgent", "done"],
        tasks: [
            { name: "Presentation", status: "pending" },
            { name: "Quiz", status: "completed" }
        ],
        updates: [
            { type: "feature", description: "Integrated new API for payments" },
            { type: "bug", description: "Resolved performance lag" },
            { type: "deploy", description: "Deployed version 1.4.3" }
        ],
        orders: [
            { item: "Stationery", status: "pending" },
            { item: "Charger", status: "completed" }
        ],
        friends: [{ name: "John", age: 20 }, { name: "Eve", age: 23 }],
        skills: [{ skill: "React", level: "Advanced" }],
        purchases: [{ item: "Book", price: 20 }],
        numbers: [5, 10, 15],
        statuses: ["pending", "active"],
        licenses: [{ type: "bronze", expiry: 2025 }],
        class: "10A",
        comments: ["Outstanding in math", "English requires improvement", "Possible spam alert"]
    },
    {
        name: "David",
        grades: [
            { subject: "Biology", score: 65 },
            { subject: "Chemistry", score: 50 },
            { subject: "Physics", score: 40 }
        ],
        subjects: ["Biology", "Chemistry", "Physics"],
        attendance: [false, true, true],
        tags: ["done", "important", "team"],
        tasks: [
            { name: "Lab Report", status: "completed" },
            { name: "Research", status: "pending" }
        ],
        updates: [
            { type: "bugfix", description: "Corrected calculation error in dashboard" },
            { type: "deploy", description: "Deployed hotfix for version 1.3.1" },
            { type: "feature", description: "Implemented role-based access control" }
        ],
        orders: [
            { item: "Lab Equipment", status: "pending" },
            { item: "Microscope", status: "completed" }
        ],
        friends: [{ name: "Alice", age: 21 }, { name: "Charlie", age: 19 }],
        skills: [{ skill: "Django", level: "Intermediate" }],
        purchases: [{ item: "Laptop", price: 500 }],
        numbers: [40, 50, 60],
        statuses: ["inactive", "pending"],
        licenses: [{ type: "gold", expiry: 2026 }],
        class: "10B",
        comments: ["Consistent progress", "spam removed from tasks", "Strong in biology"]
    },
    {
        name: "Eve",
        grades: [
            { subject: "Math", score: 70 },
            { subject: "Art", score: 40 },
            { subject: "Music", score: 55 }
        ],
        subjects: ["Math", "Art", "Music"],
        attendance: [true, true, false],
        tags: ["review", "urgent", "team"],
        tasks: [
            { name: "Essay", status: "completed" },
            { name: "Music Composition", status: "pending" }
        ],
        updates: [
            { type: "deploy", description: "Deployed version 3.0.0" },
            { type: "bug", description: "Fixed audio playback issue" },
            { type: "feature", description: "Enhanced UI for composition tools" }
        ],
        orders: [
            { item: "Tablet", status: "completed" },
            { item: "Music Notes", status: "pending" }
        ],
        friends: [{ name: "Bob", age: 18 }, { name: "David", age: 24 }],
        skills: [{ skill: "JavaScript", level: "Beginner" }],
        purchases: [{ item: "Tablet", price: 300 }],
        numbers: [10, 20, 25],
        statuses: ["archived", "pending"],
        licenses: [{ type: "silver", expiry: 2027 }],
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
db.students.updateMany(
    {},
    { $push: { purchases: { item: "Book", price: 20 } } }
)

// Delete [10, 20, 30] from numbers array
db.students.updateMany(
    {},
    { $pullAll: { numbers: [10, 20, 30] } }
)

// Update all elements in grades array to have attribute 'reviewed': true
db.students.updateMany(
    {},
    { $set: { "grades.$[].reviewed": true } }
)

// Delete elements with score < 40 and push subject: Math, score: 80
db.students.updateMany(
    {},
    {
        $pull: { grades: { score: { $lt: 40 } } }
    }
)

db.students.updateMany(
    {},
    {
        $push: { grades: { subject: 'Math', score: 80 } }
    }
)

// db.students.updateMany(
//     {},
//     {
//         $pull: { grades: { score: { $lt: 40 } } },
//         $push: { grades: { subject: 'Math', score: 80 } }
//     }
// )
// Causing conflict because  MongoDB cannot handle both operations on the grades array simultaneously

// Challenging
// Add 'active' element to 'statuses' array if not exists and remove 'inactive' if exists
db.students.updateMany(
    {},
    {
        $addToSet: { statuses: 'active' }
    }
)

db.students.updateMany(
    {},
    {
        $pull: { statuses: 'inactive' }
    }
)

// Change status: pending to completed in orders
db.students.updateMany(
    { "orders.status" : 'pending' },
    { $set: { "orders.$[].status": 'completed' } }
)

// Delete expired licenses and add type: gold, expiry: 2025
db.students.updateMany(
    {},
    { $pull: { licenses: { expiry: { $lt: 2025 } } } }
)

db.students.updateMany(
    {},
    { $push: { licenses: { type: 'gold', expiry: 2025 } } }
)

// Add passed: true for for score >= 50 in grades
db.students.updateMany(
    {},
    {
        $set: { "grades.$[elem].passed": true }
    },
    {
        arrayFilters: [
            { "elem.score": { $gte: 50 } }
        ]
    }
)

// { <update-operator>: { "<array>.$[<identifier>]": value } },
// { arrayFilters: [ { <identifier>: <condition> } ] }
// => Update all elements satisfy the condition in arrayFilters

// 20
// Add 'team' to tags
db.students.updateMany(
    {},
    { $addToSet: { tags: 'team' } }
)

// Delete elements containing 'bug'
db.students.updateMany(
    {},
    { $pull: { updates: { type: 'bug' } } }
)

// Add type: 'feature, description: 'New Design" to updates
db.students.updateMany(
    {},
    { $push: { updates: { type: 'feature', description: 'New Design' } } }
)