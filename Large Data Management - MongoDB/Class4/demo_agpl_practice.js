// use data in demo data file
// tách dữ liệu: nếu mảng items có nhiều elements thì tách ra thành nhiều documents có items chứa 1 element
db.orders.aggregate([
    { $unwind: "$items" }
])

// thêm trường product_info vào document, $lookup lấy dữ liệu từ collection from, dữ liệu tương ứng khi localField và foreignField giống nhau
db.orders.aggregate([
    { $unwind: "$items" },
    {
        $lookup: {
            from: "products",
            localField: "items.product_id",
            foreignField: "_id",
            as: "product_info"
        }
    }
])

// Tính tổng doanh thu theo mặt hàng
db.orders.aggregate([
    { $unwind: "$items" },
    {
        $lookup: {
            from: "products",
            localField: "items.product_id",
            foreignField: "_id",
            as: "product_info"
        }
    },
    { $unwind: "$product_info"},
    {
        $group: {
            _id: "$product_info.name",
            totalRevenue: { $sum: { $multiply: ["$items.quantity", "$product_info.price"] } }
        }
    }
])

// Tổng doanh thu theo danh mục sản phẩm
db.orders.aggregate([
    { $unwind: "$items" },
    {
        $lookup: {
            from: "products",
            localField: "items.product_id",
            foreignField: "_id",
            as: "product_info"
        }
    },
    { $unwind: "$product_info" },
    {
        $group: {
            _id: "$product_info.category", // Nhóm theo danh mục sản phẩm
            totalRevenue: { $sum: { $multiply: ["$items.quantity", "$product_info.price"] } }
        }
    },
    { $sort: { totalRevenue: -1 } }
]);

// Khách hàng chi tiêu nhiều nhất
db.orders.aggregate([
    { $unwind: "$items" },
    {
        $lookup: {
            from: "products",
            localField: "items.product_id",
            foreignField: "_id",
            as: "product_info"
        }
    },
    { $unwind: "$product_info" },
    {
        $group: {
            _id: "$customer_id",
            totalSpent: { $sum: { $multiply: ["$items.quantity", "$product_info.price"] } }
        }
    },
    {
        $lookup: {
            from: "customers",
            localField: "_id",
            foreignField: "_id",
            as: "customer_info"
        }
    },
    { $unwind: "$customer_info" },
    { $sort: { totalSpent: -1 } },
    { $limit: 1 } // Chỉ lấy khách hàng chi tiêu nhiều nhất
]);

// Doanh thu theo thành phố
db.orders.aggregate([
    { $unwind: "$items" },
    {
        $lookup: {
            from: "products",
            localField: "items.product_id",
            foreignField: "_id",
            as: "product_info"
        }
    },
    { $unwind: "$product_info" },
    {
        $lookup: {
            from: "customers",
            localField: "customer_id",
            foreignField: "_id",
            as: "customer_info"
        }
    },
    { $unwind: "$customer_info" },
    {
        $group: {
            _id: "$customer_info.city",
            totalRevenue: { $sum: { $multiply: ["$items.quantity", "$product_info.price"] } }
        }
    },
    { $sort: { totalRevenue: -1 } }
]);

// Sản phẩm bán chạy nhất
db.orders.aggregate([
    { $unwind: "$items" },
    {
        $group: {
            _id: "$items.product_id",
            totalQuantity: { $sum: "$items.quantity" }
        }
    },
    {
        $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product_info"
        }
    },
    { $unwind: "$product_info" },
    { $sort: { totalQuantity: -1 } },
    { $limit: 1 }
]);
