// Delivery assignment
// Insert dummy data
db.users.insertMany([
    {
        _id: 1,
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        address: "123 Main St, New York, NY",
        phone: "123-456-7890",
        registration_date: ISODate("2024-11-10T08:00:00Z")
    },
    {
        _id: 2,
        name: "Bob Smith",
        email: "bob.smith@example.com",
        address: "456 Elm St, Los Angeles, CA",
        phone: "987-654-3210",
        registration_date: ISODate("2024-12-15T09:30:00Z")
    },
    {
        _id: 3,
        name: "Charlie Brown",
        email: "charlie.brown@example.com",
        address: "789 Oak St, Chicago, IL",
        phone: "555-123-4567",
        registration_date: ISODate("2024-11-01T12:00:00Z")
    },
    {
        _id: 4,
        name: "Diana Prince",
        email: "diana.prince@example.com",
        address: "101 Maple Ave, Seattle, WA",
        phone: "444-987-6543",
        registration_date: ISODate("2025-01-02T15:45:00Z")
    },
    {
        _id: 5,
        name: "Evan Taylor",
        email: "evan.taylor@example.com",
        address: "202 Pine St, Austin, TX",
        phone: "333-654-9870",
        registration_date: ISODate("2024-11-05T10:15:00Z")
    }
]);

db.menu.insertMany([
    {
        _id: 1,
        item_name: "Margherita Pizza",
        category: "Main Course",
        price: 10.99
    },
    {
        _id: 2,
        item_name: "Caesar Salad",
        category: "Appetizer",
        price: 6.99
    },
    {
        _id: 3,
        item_name: "Spaghetti Bolognese",
        category: "Main Course",
        price: 12.99
    },
    {
        _id: 4,
        item_name: "French Fries",
        category: "Side Dish",
        price: 3.99
    },
    {
        _id: 5,
        item_name: "Chocolate Cake",
        category: "Dessert",
        price: 5.99
    },
    {
        _id: 6,
        item_name: "Chicken Wings",
        category: "Appetizer",
        price: 7.99
    },
    {
        _id: 7,
        item_name: "Grilled Salmon",
        category: "Main Course",
        price: 15.99
    },
    {
        _id: 8,
        item_name: "Lemonade",
        category: "Beverage",
        price: 2.99
    },
    {
        _id: 9,
        item_name: "Iced Coffee",
        category: "Beverage",
        price: 3.49
    },
    {
        _id: 10,
        item_name: "Tiramisu",
        category: "Dessert",
        price: 6.49
    }
]);

db.orders.insertMany([
    {
        user_id: 4,
        order_date: ISODate("2024-11-21T10:27:59Z"),
        items: [{ menu_item_id: 4, quantity: 4 }],
        status: "cancelled"
    },
    {
        user_id: 1,
        order_date: ISODate("2024-10-27T02:56:30Z"),
        items: [{ menu_item_id: 7, quantity: 3 }],
        status: "cancelled"
    },
    {
        user_id: 3,
        order_date: ISODate("2024-12-31T07:19:18Z"),
        items: [
            { menu_item_id: 1, quantity: 3 },
            { menu_item_id: 4, quantity: 1 },
            { menu_item_id: 5, quantity: 5 }
        ],
        status: "completed"
    },
    {
        user_id: 3,
        order_date: ISODate("2024-09-21T08:07:03Z"),
        items: [
            { menu_item_id: 2, quantity: 2 },
            { menu_item_id: 10, quantity: 5 }
        ],
        status: "cancelled"
    },
    {
        user_id: 3,
        order_date: ISODate("2024-10-25T03:18:22Z"),
        items: [{ menu_item_id: 4, quantity: 2 }],
        status: "completed"
    },
    {
        user_id: 1,
        order_date: ISODate("2024-09-05T11:47:42Z"),
        items: [
            { menu_item_id: 10, quantity: 3 },
            { menu_item_id: 7, quantity: 4 },
            { menu_item_id: 10, quantity: 1 }
        ],
        status: "completed"
    },
    {
        user_id: 3,
        order_date: ISODate("2024-11-11T10:23:19Z"),
        items: [
            { menu_item_id: 2, quantity: 5 },
            { menu_item_id: 10, quantity: 3 }
        ],
        status: "completed"
    },
    {
        user_id: 1,
        order_date: ISODate("2025-01-14T15:43:37Z"),
        items: [
            { menu_item_id: 1, quantity: 4 },
            { menu_item_id: 4, quantity: 3 }
        ],
        status: "completed"
    },
    {
        user_id: 4,
        order_date: ISODate("2024-11-26T14:49:04Z"),
        items: [
            { menu_item_id: 6, quantity: 5 },
            { menu_item_id: 8, quantity: 3 },
            { menu_item_id: 4, quantity: 2 }
        ],
        status: "cancelled"
    },
    {
        user_id: 4,
        order_date: ISODate("2024-12-23T10:50:52Z"),
        items: [{ menu_item_id: 7, quantity: 4 }],
        status: "cancelled"
    },
    {
        user_id: 5,
        order_date: ISODate("2024-11-28T08:41:48Z"),
        items: [
            { menu_item_id: 10, quantity: 4 },
            { menu_item_id: 3, quantity: 5 }
        ],
        status: "cancelled"
    },
    {
        user_id: 4,
        order_date: ISODate("2025-01-27T22:45:13Z"),
        items: [
            { menu_item_id: 7, quantity: 2 },
            { menu_item_id: 8, quantity: 3 }
        ],
        status: "completed"
    },
    {
        user_id: 1,
        order_date: ISODate("2025-01-09T14:53:02Z"),
        items: [
            { menu_item_id: 3, quantity: 3 },
            { menu_item_id: 4, quantity: 1 }
        ],
        status: "cancelled"
    },
    {
        user_id: 5,
        order_date: ISODate("2024-12-13T22:47:18Z"),
        items: [
            { menu_item_id: 7, quantity: 4 },
            { menu_item_id: 6, quantity: 4 }
        ],
        status: "cancelled"
    },
    {
        user_id: 1,
        order_date: ISODate("2024-11-06T06:25:14Z"),
        items: [
            { menu_item_id: 6, quantity: 3 },
            { menu_item_id: 8, quantity: 1 }
        ],
        status: "completed"
    },
    {
        user_id: 5,
        order_date: ISODate("2025-01-22T22:48:30Z"),
        items: [{ menu_item_id: 8, quantity: 5 }],
        status: "cancelled"
    }
]);


// 1. Tổng doanh thu hàng tháng
db.orders.aggregate([
    { $unwind: "$items" }, // tách các element trong mảng items
    {
        $lookup: {
            from: "menu",
            localField: "items.menu_item_id",
            foreignField: "_id",
            as: "menu_item_info"
        }
    }, // nối thông tin từ collection menu
    { $unwind: "$menu_item_info" },
    {
        $group: {
            _id: { month: { $month: "$order_date" }, year: { $year: "$order_date" } },
            totalRevenue: { $sum: { $multiply: ["$items.quantity", "$menu_item_info.price"] } }
        }
    }, // nhóm các order theo tháng và tính tổng doanh thu
    {
        $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            totalRevenue: { $round: ["$totalRevenue", 2] } // làm tròn để tránh sai sót khi máy tính tính toán
        }
    }, // hiển thị năm, tháng và doanh thu
    { $sort: { year: 1, month: 1 } } // sắp xếp thứ tự tăng dần
])

// Output
[
    {
        year: 2024,
        month: 9,
        totalRevenue: 136.35
    },
    {
        year: 2024,
        month: 10,
        totalRevenue: 55.95
    },
    {
        year: 2024,
        month: 11,
        totalRevenue: 245.15
    },
    {
        year: 2024,
        month: 12,
        totalRevenue: 226.79
    },
    {
        year: 2025,
        month: 1,
        totalRevenue: 154.79
    }
]


// 2. Top món ăn được đặt nhiều nhất theo tháng
db.orders.aggregate([
    { $unwind: "$items" },
    {
        $lookup: {
            from: "menu",
            localField: "items.menu_item_id",
            foreignField: "_id",
            as: "menu_item_info"
        }
    },
    { $unwind: "$menu_item_info" },
    {
        $group: {
            _id: { month: { $month: "$order_date" }, year: { $year: "$order_date" }, item: "$menu_item_info.item_name" },
            totalOrdered: { $sum: "$items.quantity" }
        } // nhóm lần đầu theo tháng và tính số lượng đặt hàng của mỗi món ăn
    },
    { $sort: { "_id.year": 1, "_id.month": 1, totalOrdered: -1 } },
    // sắp xếp theo thứ tự số lượng đặt hàng giảm
    {
        $group: {
            _id: { year: "$_id.year", month: "$_id.month" },
            item_name: { $first: "$_id.item" },
            totalOrdered: { $first: "$totalOrdered" }
        } // nhóm lần 2 để lấy được món ăn đầu tiên là món được đặt nhiều nhất theo mỗi tháng
    },
    {
        $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            item_name: "$item_name",
            totalOrdered: "$totalOrdered"
        }
    },
    { $sort: { year: 1, month: 1 } }
])

// Output
[
    {
        year: 2024,
        month: 9,
        item_name: "Tiramisu",
        totalOrdered: 9
    },
    {
        year: 2024,
        month: 10,
        item_name: "Grilled Salmon",
        totalOrdered: 3
    },
    {
        year: 2024,
        month: 11,
        item_name: "Chicken Wings",
        totalOrdered: 8
    },
    {
        year: 2024,
        month: 12,
        item_name: "Grilled Salmon",
        totalOrdered: 8
    },
    {
        year: 2025,
        month: 1,
        item_name: "Lemonade",
        totalOrdered: 8
    }
]


// 3. Khách hàng có tổng chi tiêu cao nhất (all-time)
db.orders.aggregate([
    { $unwind: "$items" },
    {
        $lookup: {
            from: "menu",
            localField: "items.menu_item_id",
            foreignField: "_id",
            as: "menu_item_info"
        }
    },
    { $unwind: "$menu_item_info" },
    {
        $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "customer_info"
        }
    },
    { $unwind: "$customer_info" },
    {
        $group: {
            _id: "$customer_info.name",
            totalSpent: { $sum: { $multiply: ["$items.quantity", "$menu_item_info.price"] } }
        }
    },
    { // optional, just for better display
        $project: {
            _id: 0,
            customer: "$_id",
            totalSpent: { $round: ["$totalSpent", 2] }
        }
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 1 }
])

// Output
[
    {
        customer: 'Alice Johnson',
        totalSpent: 263.74
    }
]

// 4. Tính tổng doanh thu theo danh mục món ăn
db.orders.aggregate([
    { $unwind: "$items" },
    {
        $lookup: {
            from: "menu",
            localField: "items.menu_item_id",
            foreignField: "_id",
            as: "menu_item_info"
        }
    },
    { $unwind: "$menu_item_info" },
    {
        $group: {
            _id: "$menu_item_info.category",
            totalRevenue: { $sum: { $multiply: ["$items.quantity", "$menu_item_info.price"] } }
        }
    },
    {
        $project: {
            _id: 0,
            category: "$_id",
            totalRevenue: { $round: ["$totalRevenue", 2] }
        }
    },
    { $sort: { totalRevenue: -1 } }
])

// Output
[
    {
        category: "Main Course",
        totalRevenue: 452.68
    },
    {
        category: "Appetizer",
        totalRevenue: 144.81
    },
    {
        category: "Dessert",
        totalRevenue: 133.79
    },
    {
        category: "Side Dish",
        totalRevenue: 51.87
    },
    {
        category: "Beverage",
        totalRevenue: 35.88
    }
]


// 5. Đếm số đơn hàng bị hủy mỗi tháng
db.orders.aggregate([
    {
        $match: { status: "cancelled" } // chỉ lấy các đơn hàng cancelled
    },
    {
        $group: {
            _id: { year: { $year: "$order_date" }, month: { $month: "$order_date" } },
            cancelledOrder: { $sum: 1 } // đếm số đơn hàng được nhóm theo tháng
        }
    },
    {
        $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            cancelledOrder: "$cancelledOrder"
        }
    },
    { $sort: { year: 1, month: 1 } }
])

// Output
[
    {
        year: 2024,
        month: 9,
        cancelledOrder: 1
    },
    {
        year: 2024,
        month: 10,
        cancelledOrder: 1
    },
    {
        year: 2024,
        month: 11,
        cancelledOrder: 3
    },
    {
        year: 2024,
        month: 12,
        cancelledOrder: 2
    },
    {
        year: 2025,
        month: 1,
        cancelledOrder: 2
    }
]


// 6. Tần suất đặt hàng của từng khách hàng
db.orders.aggregate([
    {
        $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "customer_info"
        }
    },
    { $unwind: "$customer_info" },
    {
        $group: {
            _id: "$customer_info.name",
            totalOrders: { $sum: 1 }
        }
    },
    {
        $project: {
            _id: 0,
            customer: "$_id",
            totalOrders: "$totalOrders"
        }
    }
])

// Output
[
    {
        customer: 'Diana Prince',
        totalOrders: 4
    },
    {
        customer: 'Alice Johnson',
        totalOrders: 5
    },
    {
        customer: 'Charlie Brown',
        totalOrders: 4
    },
    {
        customer: 'Evan Taylor',
        totalOrders: 3
    }
]


// 7. Doanh thu theo ngày trong một tháng cụ thể (12/2024)
db.orders.aggregate([
    {
        $match: {
            $expr: { // để viết các biểu thức toán học và logic
                $and: [
                    { $eq: [{ $year: "$order_date" }, 2024] },
                    { $eq: [{ $month: "$order_date" }, 12] }
                ]
            }
        }
    },
    { $unwind: "$items" },
    {
        $lookup: {
            from: "menu",
            localField: "items.menu_item_id",
            foreignField: "_id",
            as: "menu_item_info"
        }
    },
    { $unwind: "$menu_item_info" },
    {
        $group: {
            _id: { year: { $year: "$order_date" }, month: { $month: "$order_date" }, day: { $dayOfMonth: "$order_date" } },
            totalRevenue: { $sum: { $multiply: ["$items.quantity", "$menu_item_info.price"] } }
        }
    },
    {
        $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
            totalRevenue: { $round: ["$totalRevenue", 2] }
        }
    },
    { $sort: { totalRevenue: -1 } }
])

// Output for 12/2024
[
    {
        year: 2024,
        month: 12,
        day: 13,
        totalRevenue: 95.92
    },
    {
        year: 2024,
        month: 12,
        day: 31,
        totalRevenue: 66.91
    },
    {
        year: 2024,
        month: 12,
        day: 23,
        totalRevenue: 63.96
    }
]


// 8. Phân tích khách hàng đăng ký mới
db.users.aggregate([
    {
        $group: {
            _id: { year: { $year: "$registration_date" }, month: { $month: "$registration_date" } },
            userRegistered: { $sum: 1 }
        }
    },
    {
        $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            userRegistered: "$userRegistered"
        }
    },
    { $sort: { year: 1, month: 1 } }
])

// Output
[
    {
        year: 2024,
        month: 11,
        userRegistered: 3
    },
    {
        year: 2024,
        month: 12,
        userRegistered: 1
    },
    {
        year: 2025,
        month: 1,
        userRegistered: 1
    }
]


// 9. Phân tích danh mục bán chạy nhất
db.orders.aggregate([
    { $unwind: "$items" },
    {
        $lookup: {
            from: "menu",
            localField: "items.menu_item_id",
            foreignField: "_id",
            as: "menu_item_info"
        }
    },
    { $unwind: "$menu_item_info" },
    {
        $group: {
            _id: "$menu_item_info.category",
            quantitySold: { $sum: "$items.quantity" } 
        }
    },
    {
        $project: {
            _id: 0,
            category: "$_id",
            quantitySold: "$quantitySold"
        }
    },
    { $sort: { quantitySold: -1 } },
    { $limit: 1 }
])

// Output
[
    {
        category: 'Main Course',
        quantitySold: 32
    }
]

// 10. Tỷ lệ đơn hàng hoàn thành
db.orders.aggregate([
    {
        $group: {
            _id: null, // không cần nhóm theo trường nào
            totalOrders: { $sum: 1 }, // tổng đơn hàng
            completedOrders: {
                $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
            } // tổng số đơn hàng "completed"
        }
    },
    {
        $project: {
            _id: 0,
            totalOrders: 1,
            completedOrders: 1,
            percentageCompleted: {
                $round: [{ $multiply: [{ $divide: ["$completedOrders", "$totalOrders"] }, 100] }, 2] // tính tỷ lệ
            }
        }
    }
]);

// Output
[
    {
        totalOrders: 16,
        completedOrders: 7,
        percentageCompleted: 43.75
    }
]