// Use $ to get the first hobby of Alice
db.demo.find({ name: "Alice", hobbies: { $exists: true } }, { "hobbies.$": 1 })

// Use $slice to get the first 2 hobbies of Bob
db.demo.find({ name: "Bob" }, { hobbies: { $slice: 2 } })

// Use $elemMatch to find posts with tag "NoSQL"
db.demo.find({ tags: { $elemMatch: { $eq: "NoSQL"} } })

// Use $slice to limit tags result to 2 elements
db.demo.find({}, { tags: { $slice: 2 } })

// Use $ to get the first score of Mike
db.demo.find({ name: "Mike", scores: { $exists: true } }, { "scores.$": 1 })

// Use $slice to get the first 2 scores of Lucy
db.demo.find({ name: "Lucy" }, { scores: { $slice: 2 } })
