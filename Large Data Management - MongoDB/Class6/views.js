// 1. Giới thiệu Views trong MongoDB
// 1.1. Views là gì?
// - View trong MongoDB là một tập hợp ảo (chỉ đọc) được tạo dựa trên một truy vấn Aggregation
//   Pipeline.
// - Views không lưu trữ dữ liệu thật, mà tự động lược dữ liệu từ collection gốc.
// 1.2. Ðặc điểm
// - Views là read-only (chỉ đọc).
// - Hỗ trợ phép biến đổi dữ liệu sử dụng Aggregation Pipeline.
// - Giúp trực quan hóa dữ liệu phức tạp và tăng tính tự động.
// - Hạn chế sự trùng lặp dữ liệu bằng cách chỉ hiển thị dữ liệu cần thiết mà không cần lưu trữ lại dữ liệu.
// 1.3. Lưu ý
// - Views không tăng tính hiệu quả cho truy vấn nếu pipeline quá phức tạp.
// - Chỉ hỗ trợ đọc dữ liệu

// Cú pháp tạo views
db.createView(
    "view_name", // Tên View
    "source_collection", // Collection gốc
    [pipeline] // Aggregation pipeline
)

// Demo
db.customers.insertMany([
    { name: "Alice", loyaltyPoints: 1500 },
    { name: "Bob", loyaltyPoints: 800 },
    { name: "Charlie", loyaltyPoints: 1200 }
]);

// View hiển thị khách hàng có điểm trên 1000
// Tạo view
db.createView(
    "high_value_customers", // Tên View
    "customers", // Collection gốc
    [
    { $match: { loyaltyPoints: { $gt: 1000 } } }
    ]
);

// Hiển thị
db.high_value_customers.find()

// Tạo view phức tạp
db.sales.insertMany([
    { saleDate: new Date("2023-01-15"), amount: 200 },
    { saleDate: new Date("2023-02-20"), amount: 500 },
    { saleDate: new Date("2023-01-25"), amount: 300 }
]);

db.createView(
    "monthly_sales_summary",
    "sales",
    [
        { $group: {
            _id: { month: { $month: "$saleDate" }, year: { $year: "$saleDate" } },
            totalSales: { $sum: "$amount" },
            totalOrders: { $sum: 1 }
        } },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]
);

// Hiển thị các views trong db
db.getCollectionInfos({ type: "view" });

// Xóa view
db.view_name.drop();

// Không thể sửa view trực tiếp
// Xóa view cũ -> tạo view mới


// ----------------------------------------------------------------
// Practice
db.products.insertMany([
    { name: "Laptop", price: 1000 },
    { name: "Mouse", price: 20 },
    { name: "Monitor", price: 300 }
]);

// Tạo view
db.createView(
    "expensive_products", // Tên View
    "products", // Collection gốc
    [
        { $match: { price: { $gt: 500 } } },
        { $sort: { name: 1 } }
    ]
);

db.createView(
    "monthly_revenue_summary",
    "sales",
    [
        { $group: {
        _id: { month: { $month: "$saleDate" }, year: { $year: "$saleDate" } },
        totalRevenue: { $sum: "$amount" }
        } },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]
);
