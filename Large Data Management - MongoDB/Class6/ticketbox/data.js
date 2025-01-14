// Events
db.events.insertMany([
    {
        event_name: "Live Music Concert 2025",
        event_type: "Music Show",
        location: "Ho Chi Minh City",
        venue: "Saigon Opera House",
        date: "2025-01-20",
        time: "19:00",
        ticket_tiers: [
            { tier: "General Admission", price: 50000, available_tickets: 300 },
            { tier: "VIP", price: 120000, available_tickets: 100 }
        ]
    },
    {
        event_name: "Tech Innovations 2025",
        event_type: "Seminar",
        location: "Hanoi",
        venue: "National Convention Center",
        date: "2025-02-10",
        time: "09:00",
        ticket_tiers: [
            { tier: "Regular", price: 100000, available_tickets: 200 },
            { tier: "Premium", price: 300000, available_tickets: 50 },
            { tier: "Student", price: 50000, available_tickets: 50 }
        ]
    },
    {
        event_name: "Cultural Fair 2025",
        event_type: "Exhibition",
        location: "Da Nang",
        venue: "City Square",
        date: "2025-03-01",
        time: "15:00",
        ticket_tiers: [
            { tier: "Standard Pass", price: 50000, available_tickets: 500 },
            { tier: "VIP Access", price: 150000, available_tickets: 100 }
        ]
    },
    {
        event_name: "Startup Conference 2025",
        event_type: "Conference",
        location: "Hanoi",
        venue: "Hilton Hanoi Opera",
        date: "2025-03-20",
        time: "08:00",
        ticket_tiers: [
            { tier: "Basic", price: 200000, available_tickets: 150 },
            { tier: "Gold", price: 400000, available_tickets: 50 },
            { tier: "Platinum", price: 600000, available_tickets: 20 }
        ]
    },
    {
        event_name: "International Film Festival",
        event_type: "Film",
        location: "Ho Chi Minh City",
        venue: "Galaxy Cinema",
        date: "2025-04-05",
        time: "18:30",
        ticket_tiers: [
            { tier: "Regular Seat", price: 70000, available_tickets: 200 },
            { tier: "Deluxe Seat", price: 150000, available_tickets: 50 },
            { tier: "Balcony", price: 200000, available_tickets: 30 }
        ]
    },
    {
        event_name: "Art Exhibition 2025",
        event_type: "Exhibition",
        location: "Hue",
        venue: "Royal Museum",
        date: "2025-04-15",
        time: "10:00",
        ticket_tiers: [
            { tier: "General Admission", price: 50000, available_tickets: 300 },
            { tier: "VIP", price: 120000, available_tickets: 100 },
            { tier: "Family Pack", price: 200000, available_tickets: 50 },
            { tier: "Student", price: 30000, available_tickets: 50 }
        ]
    },
    {
        event_name: "Beach Party 2025",
        event_type: "Music Show",
        location: "Nha Trang",
        venue: "Beachside Stage",
        date: "2025-05-10",
        time: "20:00",
        ticket_tiers: [
            { tier: "General Admission", price: 80000, available_tickets: 400 },
            { tier: "VIP Lounge", price: 180000, available_tickets: 50 },
            { tier: "All Access", price: 250000, available_tickets: 30 },
            { tier: "Group Pack", price: 500000, available_tickets: 20 }
        ]
    },
    {
        event_name: "World Food Expo 2025",
        event_type: "Expo",
        location: "Ho Chi Minh City",
        venue: "SECC Center",
        date: "2025-05-20",
        time: "11:00",
        ticket_tiers: [
            { tier: "General Entry", price: 60000, available_tickets: 500 },
            { tier: "Priority Entry", price: 150000, available_tickets: 200 },
            { tier: "VIP Dining", price: 300000, available_tickets: 100 },
            { tier: "Chef's Table", price: 500000, available_tickets: 20 },
            { tier: "Corporate Package", price: 1000000, available_tickets: 10 }
        ]
    },
    {
        event_name: "Yoga and Wellness Retreat",
        event_type: "Workshop",
        location: "Da Lat",
        venue: "Mountain Resort",
        date: "2025-06-01",
        time: "07:00",
        ticket_tiers: [
            { tier: "Basic Retreat", price: 120000, available_tickets: 200 },
            { tier: "Advanced Retreat", price: 250000, available_tickets: 100 },
            { tier: "Full Experience", price: 500000, available_tickets: 50 }
        ]
    },
    {
        event_name: "National Science Fair",
        event_type: "Fair",
        location: "Can Tho",
        venue: "University Campus",
        date: "2025-06-15",
        time: "09:00",
        ticket_tiers: [
            { tier: "Standard Entry", price: 40000, available_tickets: 500 },
            { tier: "VIP Access", price: 100000, available_tickets: 50 }
        ]
    }
]);

// Tickets
db.tickets.insertMany([
    // Tickets for Event 1
    { event_id: ObjectId('67866b200e659e062d938939'), customer_name: "Nguyen Van A", email: "nguyenvana@example.com", ticket_tier: "General Admission", purchase_date: "2025-01-15" },
    { event_id: ObjectId('67866b200e659e062d938939'), customer_name: "Tran Thi B", email: "tranthib@example.com", ticket_tier: "VIP", purchase_date: "2025-01-16" },
    { event_id: ObjectId('67866b200e659e062d938939'), customer_name: "Nguyen Van A", email: "nguyenvana@example.com", ticket_tier: "VIP", purchase_date: "2025-01-16" },

    // Tickets for Event 2
    { event_id: ObjectId('67866b200e659e062d93893a'), customer_name: "Le Thi C", email: "lethic@example.com", ticket_tier: "Regular", purchase_date: "2025-02-01" },
    { event_id: ObjectId('67866b200e659e062d93893a'), customer_name: "Pham Van D", email: "phamvand@example.com", ticket_tier: "Premium", purchase_date: "2025-02-02" },
    { event_id: ObjectId('67866b200e659e062d93893a'), customer_name: "Nguyen Van A", email: "nguyenvana@example.com", ticket_tier: "Student", purchase_date: "2025-02-03" },
    { event_id: ObjectId('67866b200e659e062d93893a'), customer_name: "Le Thi C", email: "lethic@example.com", ticket_tier: "Student", purchase_date: "2025-02-03" },

    // Tickets for Event 3
    { event_id: ObjectId('67866b200e659e062d93893b'), customer_name: "Bui Thanh F", email: "buithanhf@example.com", ticket_tier: "Standard Pass", purchase_date: "2025-02-25" },
    { event_id: ObjectId('67866b200e659e062d93893b'), customer_name: "Pham Van D", email: "phamvand@example.com", ticket_tier: "VIP Access", purchase_date: "2025-02-26" },
    { event_id: ObjectId('67866b200e659e062d93893b'), customer_name: "Nguyen Van A", email: "nguyenvana@example.com", ticket_tier: "Standard Pass", purchase_date: "2025-02-25" },

    // Tickets for Event 4
    { event_id: ObjectId('67866b200e659e062d93893c'), customer_name: "Hoang Minh E", email: "hoangminhe@example.com", ticket_tier: "Basic", purchase_date: "2025-03-10" },
    { event_id: ObjectId('67866b200e659e062d93893c'), customer_name: "Pham Van D", email: "phamvand@example.com", ticket_tier: "Gold", purchase_date: "2025-03-11" },
    { event_id: ObjectId('67866b200e659e062d93893c'), customer_name: "Nguyen Van A", email: "nguyenvana@example.com", ticket_tier: "Platinum", purchase_date: "2025-03-12" },
    { event_id: ObjectId('67866b200e659e062d93893c'), customer_name: "Pham Van D", email: "phamvand@example.com", ticket_tier: "Basic", purchase_date: "2025-03-10" },

    // Tickets for Event 5
    { event_id: ObjectId('67866b200e659e062d93893d'), customer_name: "Tran Thi B", email: "tranthib@example.com", ticket_tier: "Regular Seat", purchase_date: "2025-03-30" },
    { event_id: ObjectId('67866b200e659e062d93893d'), customer_name: "Nguyen Van A", email: "nguyenvana@example.com", ticket_tier: "Deluxe Seat", purchase_date: "2025-03-31" },
    { event_id: ObjectId('67866b200e659e062d93893d'), customer_name: "Pham Van D", email: "phamvand@example.com", ticket_tier: "Balcony", purchase_date: "2025-04-01" },
    { event_id: ObjectId('67866b200e659e062d93893d'), customer_name: "Tran Thi B", email: "tranthib@example.com", ticket_tier: "Balcony", purchase_date: "2025-04-01" },

    // Tickets for Event 6
    { event_id: ObjectId('67866b200e659e062d93893e'), customer_name: "Hoang Minh E", email: "hoangminhe@example.com", ticket_tier: "General Admission", purchase_date: "2025-04-10" },
    { event_id: ObjectId('67866b200e659e062d93893e'), customer_name: "Pham Van D", email: "phamvand@example.com", ticket_tier: "VIP", purchase_date: "2025-04-11" },
    { event_id: ObjectId('67866b200e659e062d93893e'), customer_name: "Le Thi C", email: "lethic@example.com", ticket_tier: "Family Pack", purchase_date: "2025-04-12" },
    { event_id: ObjectId('67866b200e659e062d93893e'), customer_name: "Nguyen Van A", email: "nguyenvana@example.com", ticket_tier: "Student", purchase_date: "2025-04-13" },

    // Tickets for Other Events
    { event_id: ObjectId('67866b200e659e062d93893f'), customer_name: "Bui Thanh F", email: "buithanhf@example.com", ticket_tier: "General Admission", purchase_date: "2025-05-01" },
    { event_id: ObjectId('67866b200e659e062d938940'), customer_name: "Le Thi C", email: "lethic@example.com", ticket_tier: "VIP Dining", purchase_date: "2025-05-12" },
    { event_id: ObjectId('67866b200e659e062d938941'), customer_name: "Tran Thi B", email: "tranthib@example.com", ticket_tier: "Advanced Retreat", purchase_date: "2025-05-26" },
    { event_id: ObjectId('67866b200e659e062d938942'), customer_name: "Pham Van D", email: "phamvand@example.com", ticket_tier: "Standard Entry", purchase_date: "2025-06-05" }
]);

// Customers
db.customers.insertMany([
    {
        name: "Nguyen Van A",
        email: "nguyenvana@example.com",
        phone_number: "0987654321",
        purchased_tickets: [
            ObjectId('67866cf60e659e062d938943'),
            ObjectId('67866cf60e659e062d938944'),
            ObjectId('67866cf60e659e062d938945')
        ]
    },
    {
        name: "Tran Thi B",
        email: "tranthib@example.com",
        phone_number: "0987654322",
        purchased_tickets: [
            ObjectId('67866cf60e659e062d938946'),
            ObjectId('67866cf60e659e062d938947'),
            ObjectId('67866cf60e659e062d938948')
        ]
    },
    {
        name: "Le Thi C",
        email: "lethic@example.com",
        phone_number: "0987654323",
        purchased_tickets: [
            ObjectId('67866cf60e659e062d938949'),
            ObjectId('67866cf60e659e062d93894a'),
            ObjectId('67866cf60e659e062d93894b')
        ]
    },
    {
        name: "Pham Van D",
        email: "phamvand@example.com",
        phone_number: "0987654324",
        purchased_tickets: [
            ObjectId('67866cf60e659e062d93894c'),
            ObjectId('67866cf60e659e062d93894d'),
            ObjectId('67866cf60e659e062d93894e'),
            ObjectId('67866cf60e659e062d93894f')
        ]
    },
    {
        name: "Hoang Minh E",
        email: "hoangminhe@example.com",
        phone_number: "0987654325",
        purchased_tickets: [
            ObjectId('67866cf60e659e062d938950'),
            ObjectId('67866cf60e659e062d938951')
        ]
    },
    {
        name: "Bui Thanh F",
        email: "buithanhf@example.com",
        phone_number: "0987654326",
        purchased_tickets: [
            ObjectId('67866cf60e659e062d938952'),
            ObjectId('67866cf60e659e062d938953')
        ]
    },
    {
        name: "Nguyen Thi G",
        email: "nguyenthing@example.com",
        phone_number: "0987654327",
        purchased_tickets: [
            ObjectId('67866cf60e659e062d938954')
        ]
    },
    {
        name: "Tran Van H",
        email: "tranvanh@example.com",
        phone_number: "0987654328",
        purchased_tickets: [
            ObjectId('67866cf60e659e062d938955'),
            ObjectId('67866cf60e659e062d938956')
        ]
    },
    {
        name: "Le Minh K",
        email: "leminhk@example.com",
        phone_number: "0987654329",
        purchased_tickets: [
            ObjectId('67866cf60e659e062d938957'),
            ObjectId('67866cf60e659e062d938958'),
            ObjectId('67866cf60e659e062d938959')
        ]
    },
    {
        name: "Pham Thi L",
        email: "phamthil@example.com",
        phone_number: "0987654330",
        purchased_tickets: [
            ObjectId('67866cf60e659e062d93895a'),
            ObjectId('67866cf60e659e062d93895b'),
            ObjectId('67866cf60e659e062d93895c')
        ]
    }
]);
