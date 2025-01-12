// shop database
db.sales.insertMany([
    { date: "2025-01-05", category: "Electronics", quantity: 10 },
    { date: "2025-01-06", category: "Furniture", quantity: 5 },
    { date: "2025-01-10", category: "Clothing", quantity: 20 },
    { date: "2025-01-12", category: "Electronics", quantity: 7 },
    { date: "2025-01-15", category: "Furniture", quantity: 3 },
    { date: "2025-02-03", category: "Electronics", quantity: 12 },
    { date: "2025-02-10", category: "Clothing", quantity: 15 },
    { date: "2025-02-18", category: "Furniture", quantity: 6 },
    { date: "2025-03-02", category: "Electronics", quantity: 8 },
    { date: "2025-03-05", category: "Clothing", quantity: 30 },
    { date: "2025-03-08", category: "Furniture", quantity: 4 },
    { date: "2025-03-12", category: "Electronics", quantity: 5 }
]);

db.products.insertMany([
    { _id: 1, name: "Laptop", category: "Electronics", price: 1000 },
    { _id: 2, name: "Phone", category: "Electronics", price: 500 },
    { _id: 3, name: "Tablet", category: "Electronics", price: 300 },
    { _id: 4, name: "Chair", category: "Furniture", price: 200 },
    { _id: 5, name: "Desk", category: "Furniture", price: 400 }
]);

db.customers.insertMany([
    { _id: 1, name: "Alice", city: "New York" },
    { _id: 2, name: "Bob", city: "Los Angeles" },
    { _id: 3, name: "Charlie", city: "Chicago" }
]);

db.orders.insertMany([
    {
        _id: 1,
        customer_id: 1,
        items: [
            { product_id: 1, quantity: 1 },
            { product_id: 2, quantity: 2 }
        ],
        date: "2025-01-01"
    },
    {
        _id: 2,
        customer_id: 2,
        items: [
            { product_id: 3, quantity: 1 },
            { product_id: 4, quantity: 4 }
        ],
        date: "2025-01-02"
    },
    {
        _id: 3,
        customer_id: 1,
        items: [
            { product_id: 5, quantity: 3 },
            { product_id: 2, quantity: 2 }
        ],
        date: "2025-01-03"
    }
]);


// universities_db database
db.courses.insertMany([
    {
        university: "USAL",
        name: "Computer Science",
        level: "Excellent"
    },
    {
        university: "USAL",
        name: "Electronics",
        level: "Intermediate"
    },
    {
        university: "USAL",
        name: "Communication",
        level: "Excellent"
    }
]);

db.universities.insertMany([
    {
        country: "Spain",
        city: "Salamanca",
        name: "USAL",
        students: [
            { year: 2014, number: 24774 },
            { year: 2015, number: 23166 },
            { year: 2016, number: 21913 },
            { year: 2017, number: 21715 }
        ]
    },
    {
        country: "Spain",
        city: "Salamanca",
        name: "UPSA",
        students: [
            { year: 2014, number: 24554 },
            { year: 2015, number: 23995 },
            { year: 2016, number: 22980 },
            { year: 2017, number: 22970 }
        ]
    }
]);
