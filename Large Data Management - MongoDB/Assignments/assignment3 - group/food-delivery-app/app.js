const { MongoClient } = require("mongodb");
const readline = require("readline");

// Kết nối MongoDB
const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)
const dbName = "food_delivery"
const db = client.db(dbName)
const menuCollection = db.collection("menu")
const storageCollection = db.collection("storage")
const ordersCollection = db.collection("orders")
const promotionsCollection = db.collection("promotions")
const categories = ['Fast Food', 'Beverage', 'Vietnamese', 'Chinese', 'Italian']

let nextMenuId, nextIngredientId, nextOrderId
let noOfMenuItems = 100
let noOfIngredients = 100
let noOfOrders = 10000
let firstOrderDate, lastOrderDate, firstOrderFormattedDate, lastOrderFormattedDate

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

// Function tạo thời gian ngẫu nhiên
function randomDate(start, end) {
    const startTimestamp = start.getTime()
    const endTimestamp = end.getTime()
    const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp)
    return new Date(randomTimestamp)
}

const startDate = new Date(Date.UTC(2024, 7, 1)) // 1/8/2024
const endDate = new Date(Date.UTC(2025, 0, 21)) // 21/1/2025

// Viết hoa chữ cái đầu của string
function capitalize(text) {
    return text
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Sinh dữ liệu mẫu
async function initializeData() {
    console.log("Inserting data...");

    // Xóa dữ liệu cũ nếu có
    await menuCollection.deleteMany({});
    await storageCollection.deleteMany({});
    await ordersCollection.deleteMany({});
    await promotionsCollection.deleteMany({});
    await menuCollection.dropIndexes()
    await ordersCollection.dropIndexes()

    // Xóa các view cũ nếu có
    const collections = await db.listCollections({ type: "view" }).toArray();
    for (const collection of collections) {
        await db.collection(collection.name).drop();
    }

    // Sinh dữ liệu mẫu
    // Kho hàng
    const storageData = [];
    for (let i = 1; i <= noOfIngredients; i++) {
        storageData.push({
            _id: `I0${String(i).padStart(3, "0")}`,
            ingredientName: `Ingredient_${i}`,
            inStock: Math.round(Math.random() * 200),
        });
    }
    await storageCollection.insertMany(storageData);
    nextIngredientId = noOfIngredients + 1
    console.log("Storage data inserted.");

    // Menu
    const menuData = [];
    const categories = [
        "Fast Food",
        "Beverage",
        "Vietnamese",
        "Chinese",
        "Italian",
    ];
    for (let i = 1; i <= noOfMenuItems; i++) {
        const noOfIngredients = Math.round(Math.random() * 9) + 1;
        const ingredients = Array.from({ length: noOfIngredients }, () => {
            const randomIndex = Math.floor(Math.random() * storageData.length);
            return storageData[randomIndex]._id;
        });
        menuData.push({
            _id: `MI0${String(i).padStart(3, "0")}`,
            itemName: `Menu_item_${i}`,
            category: categories[Math.floor(Math.random() * categories.length)],
            price: (Math.floor(Math.random() * 500) + 50) * 1000,
            ingredients: ingredients,
        });
    }
    await menuCollection.insertMany(menuData);
    nextMenuId = noOfMenuItems + 1
    console.log("Menu data inserted.");

    // Đơn đặt hàng
    const ordersData = [];
    for (let i = 1; i <= noOfOrders; i++) {
        const noOfItems = Math.round(Math.random() * 4) + 1;
        const items = Array.from({ length: noOfItems }, () => {
            const randomIndex = Math.floor(Math.random() * menuData.length);
            return {
                itemId: menuData[randomIndex]._id,
                quantity: Math.round(Math.random() * 4) + 1, // Random quantity between 1 and 5
            };
        });

        const total = items.reduce((total, item) => {
            const menuItem = menuData.find((menu) => menu._id === item.itemId);
            return total + menuItem.price * item.quantity;
        }, 0);

        ordersData.push({
            _id: "ORD" + String(i).padStart(9, "0"),
            items: items,
            total: total,
            customer: `Customer_${i}`,
            phone: `098${String(i).padStart(7, "0")}`,
            address: `Address_${i}`,
            createdAt: randomDate(startDate, endDate),
            customerSatisfaction: parseFloat((Math.random() * 2.5 + 2.5).toFixed(1))
        });
    }
    await ordersCollection.insertMany(ordersData);
    nextOrderId = noOfOrders + 1
    console.log("Orders data inserted.");

    // Lấy đơn đầu tiên và cuối cùng theo thời gian để hiển thị toàn thời gian
    firstOrderDate = await ordersCollection.find().sort({ createdAt: 1 }).limit(1).toArray()
    lastOrderDate = await ordersCollection.find().sort({ createdAt: -1 }).limit(1).toArray()
    if (firstOrderDate.length > 0 && lastOrderDate.length > 0) {
        firstOrderFormattedDate = new Date(firstOrderDate[0].createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        lastOrderFormattedDate = new Date(lastOrderDate[0].createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    // Khuyến mãi
    const promoData = []
    for (let i = 0; i < noOfMenuItems; i++) {
        const discount = Math.floor(Math.random() * 6) * 10
        if (discount === 0) continue;
        promoData.push({
            itemId: menuData[i]._id,
            itemName: menuData[i].itemName,
            discount
        })
    }
    await promotionsCollection.insertMany(promoData)
    console.log("Promotions data inserted.");

    // Index cho collection orders
    await ordersCollection.createIndex({ createdAt: 1 });
    await ordersCollection.createIndex({ "items.itemId": 1 });
    await ordersCollection.createIndex({ createdAt: 1, "items.itemId": 1 });

    // Index cho collection menu
    await menuCollection.createIndex({ category: 1 });
    console.log("Indexes created");
    
    //------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Tạo các View sau khi dữ liệu mẫu đã được thêm vào
    console.log("Creating views...");
    //1. Tổng doanh thu (theo tháng)
    await db.createCollection("RevenueByMonth", {
        viewOn: ordersCollection.s.namespace.collection,
        pipeline: [
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    totalRevenue: { $sum: "$total" },
                }
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    totalRevenue: "$totalRevenue"
                }
            },
            { $sort: { year: 1, month: 1 } },
        ],
    });
    //2. Tổng doanh thu (toàn thời gian)
    await db.createCollection("TotalRevenue", {
        viewOn: ordersCollection.s.namespace.collection,
        pipeline: [
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$total" },
                },
            },
        ],
    });
    //3. Top món ăn được đặt nhiều nhất (theo tháng)
    await db.createCollection("TopItemsByMonth", {
        viewOn: ordersCollection.s.namespace.collection,
        pipeline: [
            { $unwind: "$items" },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        itemId: "$items.itemId",
                    },
                    totalQuantity: { $sum: "$items.quantity" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1, totalQuantity: -1 } },
            {
                $group: {
                    _id: { year: "$_id.year", month: "$_id.month" },
                    topItem: { $first: "$_id.itemId" },
                    quantity: { $first: "$totalQuantity" },
                },
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    topItem: "$topItem",
                    quantity: "$quantity",
                }
            },
            { $sort: { year: 1, month: 1 } }
        ],
    });
    //4. Top 5 món ăn được đặt nhiều nhất (toàn thời gian)
    await db.createCollection("TopItemsAllTime", {
        viewOn: ordersCollection.s.namespace.collection,
        pipeline: [
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.itemId",
                    totalQuantity: { $sum: "$items.quantity" },
                },
            },
            {
                $lookup: {
                    from: menuCollection.s.namespace.collection,
                    localField: "_id",
                    foreignField: "_id",
                    as: "menuDetails",
                }
            },
            { $unwind: "$menuDetails" },
            {
                $project: {
                    _id: 1,
                    itemName: "$menuDetails.itemName",
                    totalQuantity: 1
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 },
        ],
    });
    //5. Phân tích danh mục bán chạy nhất (theo tháng)
    await db.createCollection("TopCategoriesByMonth", {
        viewOn: ordersCollection.s.namespace.collection,
        pipeline: [
            { $unwind: "$items" },
            {
                $lookup: {
                    from: menuCollection.s.namespace.collection,
                    localField: "items.itemId",
                    foreignField: "_id",
                    as: "menuDetails",
                },
            },
            { $unwind: "$menuDetails" },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        category: "$menuDetails.category",
                    },
                    totalQuantity: { $sum: "$items.quantity" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1, totalQuantity: -1 } },
            {
                $group: {
                    _id: { year: "$_id.year", month: "$_id.month" },
                    topCategory: { $first: "$_id.category" },
                    quantity: { $first: "$totalQuantity" },
                },
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    topCategory: "$topCategory",
                    quantity: "$quantity"
                }
            },
            { $sort: { year: 1, month: 1 } }
        ],
    });
    //6. Phân tích top 3 danh mục bán chạy nhất (toàn thời gian)
    await db.createCollection("TopCategoriesAllTime", {
        viewOn: ordersCollection.s.namespace.collection,
        pipeline: [
            { $unwind: "$items" },
            {
                $lookup: {
                    from: menuCollection.s.namespace.collection,
                    localField: "items.itemId",
                    foreignField: "_id",
                    as: "menuDetails",
                },
            },
            { $unwind: "$menuDetails" },
            {
                $group: {
                    _id: "$menuDetails.category",
                    totalQuantity: { $sum: "$items.quantity" },
                },
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 3 },
        ],
    });
    //7. Doanh thu theo danh mục món ăn
    await db.createCollection("RevenueByCategory", {
        viewOn: ordersCollection.s.namespace.collection,
        pipeline: [
            { $unwind: "$items" },
            {
                $lookup: {
                    from: menuCollection.s.namespace.collection,
                    localField: "items.itemId",
                    foreignField: "_id",
                    as: "menuDetails",
                },
            },
            { $unwind: "$menuDetails" },
            {
                $group: {
                    _id: "$menuDetails.category",
                    totalRevenue: {
                        $sum: { $multiply: ["$menuDetails.price", "$items.quantity"] },
                    },
                },
            },
            { $sort: { totalRevenue: -1 } },
        ],
    });
    //8. Tần suất đặt hàng theo từng tháng
    await db.createCollection("OrderFrequencyByMonth", {
        viewOn: ordersCollection.s.namespace.collection,
        pipeline: [
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    orderCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    orderCount: "$orderCount",
                }
            },
            { $sort: { year: 1, month: 1 } },
        ],
    });
    //9. Doanh thu theo ngày trong một tháng cụ thể
    // await db.createCollection("RevenueByDayInASpecificMonth", {
    //     viewOn: ordersCollection.s.namespace.collection,
    //     pipeline: [
    //         {
    //             $match: {
    //                 createdAt: {
    //                     //Hãy điền thay vào bằng 1 thời gian cụ thể có tồn tại
    //                     $gte: new Date("2024-12-01"),
    //                     $lte: new Date("2024-12-31"),
    //                 },
    //             },
    //         },
    //         {
    //             $group: {
    //                 _id: { $dayOfMonth: "$createdAt" },
    //                 dailyRevenue: { $sum: "$total" },
    //             },
    //         },
    //         { $sort: { _id: 1 } },
    //     ],
    // });

    // 10. Top nguyên liệu được dùng nhiều nhất theo tháng
    await db.createCollection("TopIngredientsByMonth", {
        viewOn: ordersCollection.s.namespace.collection,
        pipeline: [
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "menu",
                    localField: "items.itemId",
                    foreignField: "_id",
                    as: "itemDetails"
                }
            },
            { $unwind: "$itemDetails" },
            { $unwind: "$itemDetails.ingredients" },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, ingredient: "$itemDetails.ingredients" },
                    ingredientUsed: { $sum: "$items.quantity" }
                }
            },
            { $sort: { ingredientUsed: -1 } },
            {
                $group: {
                    _id: { year: "$_id.year", month: "$_id.month" },
                    ingredientId: { $first: "$_id.ingredient" },
                    ingredientUsed: { $first: "$ingredientUsed" }
                }
            },
            {
                $lookup: {
                    from: "storage",
                    localField: "ingredientId",
                    foreignField: "_id",
                    as: "ingredientDetails"
                }
            },
            { $unwind: "$ingredientDetails" },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    ingredientId: "$ingredientId",
                    ingredientName: "$ingredientDetails.ingredientName",
                    ingredientUsed: "$ingredientUsed",
                    inStock: "$ingredientDetails.inStock"
                }
            },
            { $sort: { year: 1, month: 1 } }
        ]
    })

    // 11. Top nguyên liệu được dùng nhiều nhất toàn thời gian
    await db.createCollection("TopIngredientsAllTime", {
        viewOn: ordersCollection.s.namespace.collection,
        pipeline: [
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "menu",
                    localField: "items.itemId",
                    foreignField: "_id",
                    as: "itemDetails"
                }
            },
            { $unwind: "$itemDetails" },
            { $unwind: "$itemDetails.ingredients" },
            {
                $group: {
                    _id: { ingredientId: "$itemDetails.ingredients" },
                    ingredientUsed: { $sum: "$items.quantity" }
                }
            },
            { $sort: { ingredientUsed: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "storage",
                    localField: "_id.ingredientId",
                    foreignField: "_id",
                    as: "ingredientDetails"
                }
            },
            { $unwind: "$ingredientDetails" },
            {
                $project: {
                    _id: 0,
                    ingredientId: "$_id.ingredientId",
                    ingredientName: "$ingredientDetails.ingredientName",
                    ingredientUsed: "$ingredientUsed",
                    inStock: "$ingredientDetails.inStock"
                }
            }
        ]
    })

    // 12. Trung bình đánh giá của khách hàng theo tháng
    await db.createCollection("AvgCustomerSatisfactionRatingsByMonth", {
        viewOn: ordersCollection.s.namespace.collection,
        pipeline: [
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    avgRatings: { $avg: "$customerSatisfaction" }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    avgRatings: "$avgRatings"
                }
            },
        { $sort: { year: 1, month: 1 } }
        ]
    })

    // 13. Trung bình đánh giá của khách hàng toàn thời gian
    await db.createCollection("AvgCustomerSatisfactionRatingsAllTime", {
        viewOn: ordersCollection.s.namespace.collection,
        pipeline: [
            {
                $group: {
                    _id: null,
                    avgRatings: { $avg: "$customerSatisfaction" }
                }
            },
            {
                $project: {
                    _id: 0,
                    avgRatings: "$avgRatings"
                }
            }
        ]
    })

    console.log("All views created successfully!");
}

// Hiển thị menu chính
function showMenuDialog() {
    console.log(`
        ================================
        LỰA CHỌN CHỨC NĂNG
        ================================
        1. Quản lý menu
        2. Quản lý kho hàng
        3. Quản lý đơn đặt hàng
        4. Quản lý khuyến mãi
        5. Thống kê số liệu
        6. Thoát
    `);

    rl.question("Chọn một chức năng: ", async (choice) => {
        switch (choice.trim()) {
            case "1":
                handleMenuManagement();
                break;
            case "2":
                handleStorageManagement();
                break;
            case "3":
                handleOrderManagement();
                break;
            case "4":
                handlePromotionManagement();
                break;
            case "5":
                handleStatistics();
                break;
            case "6":
                console.log("Thoát ứng dụng. Tạm biệt!");
                rl.close();
                client.close();
                return;
            default:
                console.log("Lựa chọn không hợp lệ. Vui lòng thử lại.");
                showMenuDialog();
        }
    });
}

// Các chức năng quản lý menu
function handleMenuManagement() {
    function showStoreMenu() {
        console.log(`
            ================================
            QUẢN LÝ MENU
            ================================
            1. Thêm món ăn mới (Create)
            2. Xem danh sách món ăn (Read)
            3. Cập nhật món ăn (Update)
            4. Xóa món ăn (Delete)
            5. Tìm kiếm (Search)
            6. Quay lại
        `);

        rl.question("Chọn một chức năng: ", async (choice) => {
            switch (choice.trim()) {
                case "1":
                    await createMenuItem(menuCollection);
                    break;
                case "2":
                    await readMenuItems(menuCollection);
                    break;
                case "3":
                    await updateMenuItem(menuCollection);
                    break;
                case "4":
                    await deleteMenuItem(menuCollection);
                    break;
                case "5":
                    await searchMenu(menuCollection);
                    break;
                case "6":
                    showMenuDialog()
                    break;
                default:
                    console.log("Lựa chọn không hợp lệ. Vui lòng thử lại.");
                    showStoreMenu();
            }
        });
    }

    // Validate giá tiền nhập vào
    function validatePrice(price, callback) {
        if (!/^[0-9]+$/.test(price)) {
            console.log("Giá món ăn phải là một số nguyên dương hợp lệ.");
            return callback();
        }

        const parsedPrice = parseInt(price, 10);
        if (parsedPrice <= 0) {
            console.log("Giá món ăn phải lớn hơn 0.");
            return callback();
        }
        return parsedPrice;
    }

    // Thêm món ăn mới
    async function createMenuItem(collection) {
        // Function check nếu món ăn đã có trong database
        async function checkItemExists(itemName) {
            try {
                const existingItem = await collection.findOne({ itemName });
                return !!existingItem;
            } catch (error) {
                console.error("Lỗi khi kiểm tra món ăn tồn tại:", error);
                return false;
            }
        }

        // Validate tên món ăn
        rl.question("Nhập tên món ăn: ", async (itemName) => {
            if (!itemName.trim()) {
                console.log("Tên món ăn không được để trống. Quay lại menu.")
                return showStoreMenu()
            }
    
            itemName = capitalize(itemName)
            const exists = await checkItemExists(itemName);
            if (exists) {
                console.log("Món ăn đã tồn tại trong cơ sở dữ liệu.")
                return showStoreMenu()
            }
            askIngredients(itemName);
        })

        // Validate danh sách nguyên liệu
        function askIngredients(itemName) {
            const ingredients = [];
            async function addIngredient() {
                rl.question(`Nhập ID nguyên liệu (để trống để kết thúc): I`, async (ingredientId) => {
                    if (!ingredientId.trim()) {
                        if (ingredients.length === 0) {
                            console.log("Danh sách nguyên liệu không được để trống.");
                            return addIngredient();
                        }
                        return askCategory(itemName, ingredients);
                    }
                    const ingredient = await storageCollection.findOne({ _id: `I${ingredientId.trim()}` });
                    if (!ingredient) {
                        console.log("Không tìm thấy nguyên liệu với ID này.");
                        return addIngredient();
                    }
                    ingredients.push(`I${ingredientId.trim()}`);
                    addIngredient();
                });
            }
            addIngredient();
        }
    
        // Validate danh mục món ăn
        function askCategory(itemName, ingredients) {
            console.log("Chọn danh mục món ăn:");
            categories.forEach((category, index) => {
                console.log(`${index + 1}. ${category}`);
            });
            rl.question("Chọn một danh mục: ", (choice) => {
                const categoryIndex = parseInt(choice.trim(), 10) - 1;
                if (categoryIndex < 0 || categoryIndex >= categories.length) {
                    console.log("Lựa chọn không hợp lệ. Vui lòng thử lại.");
                    return askCategory(itemName, ingredients);
                }
                const category = categories[categoryIndex];
                askPrice(itemName, category, ingredients);
            });
        }
    
        // Validate giá
        function askPrice(itemName, category, ingredients) {
            rl.question("Nhập giá món ăn: ", async (price) => {
                const parsedPrice = validatePrice(price, () => askPrice(itemName, category, ingredients));
                if (!parsedPrice) return;
    
                try {
                    const newItem = {
                        _id: `MI${String(nextMenuId++).padStart(4, "0")}`,
                        itemName,
                        category,
                        price: parsedPrice,
                        ingredients
                    };
                    await collection.insertOne(newItem);
                    newItem.price = parsedPrice.toLocaleString()
                    console.log("Thêm món ăn thành công:", newItem);
                } catch (error) {
                    console.error("Lỗi khi thêm món ăn:", error);
                }
                showStoreMenu();
            });
        }
    }

    // Xem danh sách món ăn
    async function readMenuItems(collection) {
        try {
            const items = await collection.find().toArray();
            console.log("Danh sách món ăn:");
            items.forEach((item, index) => {
                console.log(`${index + 1}. ID: ${item._id}, ${item.itemName} - ${item.category} - ${item.price.toLocaleString()} VND`);
                console.log("   Nguyên liệu:");
                item.ingredients.forEach((ingredientId, idx) => {
                    console.log(`     ${idx + 1}. ID: ${ingredientId}`);
                });
            });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách món ăn:", error);
        }
        showStoreMenu();
    }

    // Cập nhật món ăn
    async function updateMenuItem(collection) {
        rl.question(`Nhập ID món ăn cần cập nhật: MI`, async (id) => {
            try {
                const item = await collection.findOne({ _id: `MI${id.trim()}` });
                if (!item) {
                    console.log("Không tìm thấy món ăn với ID này.");
                    return showStoreMenu();
                }
                rl.question("Nhập tên mới (để trống nếu không thay đổi): ", (itemName) => {
                    console.log("Chọn danh mục mới (để trống nếu không thay đổi):");
                    categories.forEach((category, index) => {
                        console.log(`${index + 1}. ${category}`);
                    });
                    rl.question("Chọn một danh mục: ", (choice) => {
                        const categoryIndex = parseInt(choice.trim(), 10) - 1;
                        const updatedData = {};
                        if (itemName.trim()) updatedData.itemName = capitalize(itemName.trim());
                        if (categoryIndex >= 0 && categoryIndex < categories.length) {
                            updatedData.category = categories[categoryIndex];
                        }
    
                        // Validate price
                        function updatePrice() {
                            rl.question("Nhập giá mới (để trống nếu không thay đổi): ", async (price) => {
                                if (price.trim()) {
                                    const parsedPrice = validatePrice(price.trim(), updatePrice);
                                    if (!parsedPrice) return;
                                    updatedData.price = parsedPrice;
                                }
    
                                // Validate ingredients
                                function updateIngredients() {
                                    const ingredients = [];
                                    async function addIngredient() {
                                        rl.question(`Nhập ID nguyên liệu (để trống để kết thúc): I`, async (ingredientId) => {
                                            if (!ingredientId.trim()) {
                                                if (ingredients.length > 0) {
                                                    updatedData.ingredients = ingredients;
                                                }
                                                try {
                                                    await collection.updateOne({ _id: `MI${id.trim()}` }, { $set: updatedData });
                                                    console.log("Cập nhật món ăn thành công.");
                                                } catch (error) {
                                                    console.error("Lỗi khi cập nhật món ăn:", error);
                                                }
                                                return showStoreMenu();
                                            }
                                            const ingredient = await storageCollection.findOne({ _id: `I${ingredientId.trim()}` });
                                            if (!ingredient) {
                                                console.log("Không tìm thấy nguyên liệu với ID này.");
                                                return addIngredient();
                                            }
                                            ingredients.push(`I${ingredientId.trim()}`);
                                            addIngredient();
                                        });
                                    }
                                    addIngredient();
                                }
    
                                updateIngredients();
                            });
                        }
    
                        updatePrice();
                    });
                });
            } catch (error) {
                console.error("Lỗi khi tìm món ăn:", error);
                showStoreMenu();
            }
        });
    }

    // Xóa món ăn
    async function deleteMenuItem(collection) {
        rl.question(`Nhập ID món ăn cần xóa: MI`, async (id) => {
            try {
                const result = await collection.deleteOne({ _id: `MI${id.trim()}` });
                if (result.deletedCount > 0) {
                    console.log("Xóa món ăn thành công.");
                } else {
                    console.log("Không tìm thấy món ăn với ID này.");
                }
            } catch (error) {
                console.error("Lỗi khi xóa món ăn:", error);
            }
            showStoreMenu();
        });
    }

    // Tìm kiếm trong menu
    async function searchMenu(collection) {
        console.log(`
            ================================
            LỰA CHỌN TÌM KIẾM
            ================================
            1. Tìm kiếm theo ID
            2. Tìm kiếm theo tên món ăn
            3. Tìm kiếm theo danh mục
            4. Tìm kiếm theo khoảng giá
            5. Tìm kiếm theo nguyên liệu
            6. Quay lại
        `);
    
        rl.question("Chọn một chức năng: ", async (choice) => {
            switch (choice.trim()) {
                case "1":
                    searchById(collection);
                    break;
                case "2":
                    searchByName(collection);
                    break;
                case "3":
                    searchByCategory(collection);
                    break;
                case "4":
                    searchByPrice(collection);
                    break;
                case "5":
                    searchByIngredient(collection);
                    break;
                case "6":
                    showStoreMenu();
                    break;
                default:
                    console.log("Lựa chọn không hợp lệ. Vui lòng thử lại.");
                    searchMenu(collection);
            }
        });

        // Tìm món ăn bằng ID
        async function searchById(collection) {
            rl.question(`Nhập ID món ăn: MI`, async (id) => {
                try {
                    const item = await collection.findOne({ _id: `MI${id.trim()}` });
                    if (!item) {
                        console.log("Không tìm thấy món ăn với ID này.");
                    } else {
                        console.log(`ID: ${item._id}, ${item.itemName} - ${item.category} - ${item.price.toLocaleString()} VND`);
                    }
                } catch (error) {
                    console.error("Lỗi khi tìm kiếm món ăn:", error);
                }
                searchMenu(collection);
            });
        }

        // Tìm món ăn theo tên
        async function searchByName(collection) {
            rl.question("Nhập tên món ăn cần tìm: ", async (name) => {
                try {
                    const items = await collection.find({ itemName: { $regex: new RegExp(name, 'i') } }).toArray();
                    if (items.length === 0) {
                        console.log("Không tìm thấy món ăn với tên này.");
                    } else {
                        console.log("Kết quả tìm kiếm:");
                        items.forEach((item, index) => {
                            console.log(`${index + 1}. ID: ${item._id}, ${item.itemName} - ${item.category} - ${item.price.toLocaleString()} VND`)
                        });
                    }
                } catch (error) {
                    console.error("Lỗi khi tìm kiếm món ăn:", error);
                }
                searchMenu(collection);
            });
        }
        
        // Tìm món ăn theo danh mục
        async function searchByCategory(collection) {
            console.log(`
                ================================
                LỰA CHỌN DANH MỤC
                ================================
                1. Fast Food
                2. Beverage
                3. Vietnamese
                4. Chinese
                5. Italian
                6. Quay lại
            `);
        
            rl.question("Chọn một danh mục: ", async (choice) => {
                const index = parseInt(choice.trim()) - 1;
                if (index >= 0 && index < categories.length) {
                    try {
                        const items = await collection.find({ category: categories[index] }).toArray();
                        if (items.length === 0) {
                            console.log("Không tìm thấy món ăn trong danh mục này.");
                        } else {
                            console.log("Kết quả tìm kiếm:");
                            items.forEach((item, index) => {
                                console.log(`${index + 1}. ID: ${item._id}, ${item.itemName} - ${item.category} - ${item.price.toLocaleString()} VND`);
                            });
                        }
                    } catch (error) {
                        console.error("Lỗi khi tìm kiếm món ăn:", error);
                    }
                    searchMenu(collection);
                } else if (choice.trim() === "6") {
                    searchMenu(collection);
                } else {
                    console.log("Lựa chọn không hợp lệ. Vui lòng thử lại.");
                    searchByCategory(collection);
                }
            });
        }
        
        // Tìm món ăn theo khoảng giá
        async function searchByPrice(collection) {
            rl.question("Nhập giá thấp nhất (nghìn đồng): ", (minPrice) => {
                const parsedMinPrice = validatePrice(minPrice, () => searchByPrice(collection));
                if (!parsedMinPrice) return;
        
                rl.question("Nhập giá cao nhất (nghìn đồng): ", async (maxPrice) => {
                    const parsedMaxPrice = validatePrice(maxPrice, () => searchByPrice(collection));
                    if (!parsedMaxPrice) return;
        
                    try {
                        const items = await collection.find({
                            price: { $gte: parsedMinPrice * 1000, $lte: parsedMaxPrice * 1000 }
                        }).sort({ price: 1 }).toArray();
                        if (items.length === 0) {
                            console.log("Không tìm thấy món ăn trong khoảng giá này.");
                        } else {
                            console.log("Kết quả tìm kiếm (giá từ thấp đến cao):");
                            items.forEach((item, index) => {
                                console.log(`${index + 1}. ID: ${item._id}, ${item.itemName} - ${item.category} - ${item.price.toLocaleString()} VND`);
                            });
                        }
                    } catch (error) {
                        console.error("Lỗi khi tìm kiếm món ăn:", error);
                    }
                    searchMenu(collection);
                });
            })
        }

        // Tìm món ăn theo nguyên liệu
        async function searchByIngredient(collection) {
            rl.question("Nhập tên nguyên liệu cần tìm: ", async (ingredientName) => {
                try {
                    const ingredients = await storageCollection.find({ ingredientName: { $regex: new RegExp(ingredientName, 'i') } }).toArray();
                    if (ingredients.length === 0) {
                        console.log("Không tìm thấy nguyên liệu với tên này.");
                    } else {
                        const ingredientIds = ingredients.map(ingredient => ingredient._id);
                        const items = await collection.find({ ingredients: { $in: ingredientIds } }).toArray();
                        if (items.length === 0) {
                            console.log("Không tìm thấy món ăn sử dụng nguyên liệu này.");
                        } else {
                            console.log("Kết quả tìm kiếm:");
                            items.forEach((item, index) => {
                                console.log(`${index + 1}. ID: ${item._id}, ${item.itemName} - ${item.category} - ${item.price.toLocaleString()} VND`);
                                console.log("   Nguyên liệu:");
                                item.ingredients.forEach((ingredientId, idx) => {
                                    console.log(`     ${idx + 1}. ID: ${ingredientId}`);
                                });
                            });
                        }
                    }
                } catch (error) {
                    console.error("Lỗi khi tìm kiếm món ăn:", error);
                }
                searchMenu(collection);
            });
        }
    }

    showStoreMenu();
}

// Các chức năng quản lý kho hàng
function handleStorageManagement() {
    function showStorageMenu() {
        console.log(`
            ================================
            QUẢN LÝ KHO HÀNG
            ================================
            1. Thêm nguyên liệu mới (Create)
            2. Xem danh sách nguyên liệu (Read)
            3. Cập nhật nguyên liệu (Update)
            4. Xóa nguyên liệu (Delete)
            5. Tìm kiếm nguyên liệu (Search)
            6. Quay lại
        `);

        rl.question("Chọn một chức năng: ", async (choice) => {
            switch (choice.trim()) {
                case "1":
                    await createIngredient();
                    break;
                case "2":
                    await readIngredients();
                    break;
                case "3":
                    await updateIngredient();
                    break;
                case "4":
                    await deleteIngredient();
                    break;
                case "5":
                    await searchIngredients();
                    break;
                case "6":
                    showMenuDialog();
                    break;
                default:
                    console.log("Lựa chọn không hợp lệ. Vui lòng thử lại.");
                    showStorageMenu();
            }
        });
    }

    // Thêm nguyên liệu
    async function createIngredient() {
        rl.question("Nhập tên nguyên liệu: ", async (name) => {
            if (!name.trim()) {
                console.log("Tên nguyên liệu không được để trống.");
                return createIngredient();
            }
            rl.question("Nhập số lượng tồn kho: ", async (inStock) => {
                inStock = parseInt(inStock.trim(), 10);
                if (isNaN(inStock) || inStock < 0) {
                    console.log("Số lượng tồn kho không hợp lệ.");
                    return createIngredient();
                }
                const newIngredient = {
                    _id: `I${String(nextIngredientId++).padStart(4, "0")}`,
                    ingredientName: capitalize(name.trim()),
                    inStock: inStock
                };
                await storageCollection.insertOne(newIngredient);
                console.log("Nguyên liệu đã được thêm thành công:", newIngredient);
                showStorageMenu();
            });
        });
    }

    // Xem danh sách nguyên liệu
    async function readIngredients() {
        try {
            const ingredients = await storageCollection.find().toArray();
            console.log("Danh sách nguyên liệu:");
            ingredients.forEach((ingredient, index) => {
                console.log(`${index + 1}. ID: ${ingredient._id}, Tên: ${ingredient.ingredientName}, Số lượng tồn kho: ${ingredient.inStock}`);
            });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nguyên liệu:", error);
        }
        showStorageMenu();
    }

    // Cập nhật nguyên liệu (xuất/nhập hàng)
    async function updateIngredient() {
        rl.question(`Nhập ID nguyên liệu cần cập nhật: I`, async (ingredientId) => {
            try {
                const ingredient = await storageCollection.findOne({ _id: `I${ingredientId.trim()}` });
                if (!ingredient) {
                    console.log("Không tìm thấy nguyên liệu với ID này.");
                    return showStorageMenu();
                }
                console.log(ingredient);
                
                rl.question("Nhập tên nguyên liệu mới (để trống nếu không thay đổi): ", (name) => {
                    rl.question("Nhập số lượng tăng/giảm (có thể là số âm hoặc dương): ", async (quantityChange) => {
                        const updatedData = {};
                        if (name.trim()) updatedData.ingredientName = capitalize(name.trim());
                        if (quantityChange.trim()) {
                            quantityChange = parseInt(quantityChange.trim(), 10);
                            if (isNaN(quantityChange)) {
                                console.log("Số lượng không hợp lệ.");
                                return showStorageMenu();
                            }
                            updatedData.inStock = ingredient.inStock + quantityChange;
                            if (updatedData.inStock < 0) {
                                console.log("Số lượng tồn kho không thể âm.");
                                return showStorageMenu();
                            }
                        }
                        await storageCollection.updateOne({ _id: `I${ingredientId.trim()}` }, { $set: updatedData });
                        console.log("Nguyên liệu đã được cập nhật thành công.");
                        showStorageMenu();
                    });
                });
            } catch (error) {
                console.error("Lỗi khi cập nhật nguyên liệu:", error);
                showStorageMenu();
            }
        });
    }

    // Xóa nguyên liệu
    async function deleteIngredient() {
        rl.question(`Nhập ID nguyên liệu cần xóa: I`, async (ingredientId) => {
            try {
                const result = await storageCollection.deleteOne({ _id: `I${ingredientId.trim()}` });
                if (result.deletedCount > 0) {
                    console.log("Nguyên liệu đã được xóa thành công.");
                } else {
                    console.log("Không tìm thấy nguyên liệu với ID này.");
                }
            } catch (error) {
                console.error("Lỗi khi xóa nguyên liệu:", error);
            }
            showStorageMenu();
        });
    }

    // Tìm kiếm trong kho nguyên liệu
    async function searchIngredients() {
        console.log(`
            ================================
            TÌM KIẾM NGUYÊN LIỆU
            ================================
            1. Tìm kiếm theo tên nguyên liệu
            2. Quay lại
        `);

        rl.question("Chọn một chức năng: ", async (choice) => {
            switch (choice.trim()) {
                case "1":
                    searchByName();
                    break;
                case "2":
                    showStorageMenu();
                    break;
                default:
                    console.log("Lựa chọn không hợp lệ. Vui lòng thử lại.");
                    searchIngredients();
            }
        });

        // Tìm theo tên
        async function searchByName() {
            rl.question("Nhập tên nguyên liệu: ", async (name) => {
                try {
                    const ingredients = await storageCollection.find({ ingredientName: { $regex: new RegExp(name, 'i') } }).toArray();
                    if (ingredients.length === 0) {
                        console.log("Không tìm thấy nguyên liệu với tên này.");
                    } else {
                        console.log("Kết quả tìm kiếm:");
                        ingredients.forEach((ingredient, index) => {
                            console.log(`${index + 1}. ID: ${ingredient._id}, Tên: ${ingredient.ingredientName}, Số lượng tồn kho: ${ingredient.inStock}`);
                        });
                    }
                } catch (error) {
                    console.error("Lỗi khi tìm kiếm nguyên liệu:", error);
                }
                searchIngredients();
            });
        }
    }

    showStorageMenu();
}

// Các chức năng quản lý đơn đặt hàng
function handleOrderManagement() {
    function showOrderMenu() {
        console.log(`
            ================================
            QUẢN LÝ ĐƠN ĐẶT HÀNG
            ================================
            1. Thêm đơn đặt hàng mới (Create)
            2. Xem danh sách đơn đặt hàng (Read)
            3. Cập nhật đơn đặt hàng (Update)
            4. Xóa đơn đặt hàng (Delete)
            5. Tìm kiếm đơn đặt hàng (Search)
            6. Quay lại
        `);

        rl.question("Chọn một chức năng: ", async (choice) => {
            switch (choice.trim()) {
                case "1":
                    await createOrder();
                    break;
                case "2":
                    await readOrders();
                    break;
                case "3":
                    await updateOrder();
                    break;
                case "4":
                    await deleteOrder();
                    break;
                case "5":
                    await searchOrders();
                    break;
                case "6":
                    showMenuDialog();
                    break;
                default:
                    console.log("Lựa chọn không hợp lệ. Vui lòng thử lại.");
                    showOrderMenu();
            }
        });
    }

    // Thêm đơn đặt hàng
    async function createOrder() {
        rl.question("Nhập tên khách hàng: ", async (customer) => {
            if (!customer.trim()) {
                console.log("Tên khách hàng không được để trống.");
                return createOrder();
            }
            rl.question("Nhập số điện thoại: ", async (phone) => {
                if (!phone.trim() || !/^\d+$/.test(phone)) {
                    console.log("Số điện thoại không hợp lệ.");
                    return createOrder();
                }
                rl.question("Nhập địa chỉ giao hàng: ", async (address) => {
                    if (!address.trim()) {
                        console.log("Địa chỉ giao hàng không được để trống.");
                        return createOrder();
                    }
                    const items = [];
                    const tempIngredientUsage = {}; // Temporary storage for ingredient usage
    
                    async function addItem() {
                        rl.question(`Nhập ID món ăn: MI`, async (itemId) => {
                            if (!itemId.trim()) {
                                console.log("ID món ăn không được để trống.");
                                return addItem();
                            }
                            const menuItem = await menuCollection.findOne({ _id: `MI${itemId.trim()}` });
                            if (!menuItem) {
                                console.log("Không tìm thấy món ăn với ID này.");
                                return addItem();
                            }
                            rl.question("Nhập số lượng: ", async (quantity) => {
                                quantity = parseInt(quantity.trim(), 10);
                                if (isNaN(quantity) || quantity <= 0) {
                                    console.log("Số lượng không hợp lệ.");
                                    return addItem();
                                }
    
                                // Kiểm tra số lượng nguyên liệu trong kho và trong tempIngredientUsage
                                const insufficientIngredients = [];
                                let missingIngredient;
                                for (const ingredientId of menuItem.ingredients) {
                                    const ingredient = await storageCollection.findOne({ _id: ingredientId });
                                    const usedQuantity = tempIngredientUsage[ingredientId] || 0;
                                    if (!ingredient || ingredient.inStock < (usedQuantity + quantity)) {
                                        insufficientIngredients.push(ingredientId);
                                        missingIngredient = ingredient;
                                    }

                                    if (insufficientIngredients.length > 0) {
                                        console.log("Không đủ nguyên liệu để làm món ăn này. Vui lòng thay đổi số lượng hoặc chọn món khác.");
                                        console.log(`Nguyên liệu: ${missingIngredient.ingredientName}, Số lượng còn: ${missingIngredient.inStock - usedQuantity}, Đơn hàng cần: ${quantity}`);
                                        return addItem();
                                    }
                                }
    
    
                                // Cập nhật tempIngredientUsage
                                for (const ingredientId of menuItem.ingredients) {
                                    tempIngredientUsage[ingredientId] = (tempIngredientUsage[ingredientId] || 0) + quantity;
                                }
    
                                const hasPromotion = await promotionsCollection.findOne({ itemId: `MI${itemId}` });
                                if (hasPromotion) console.log(`Món ăn được khuyến mãi ${hasPromotion.discount}%`);
    
                                const existingItem = items.find(item => item.itemId === `MI${itemId.trim()}`);
                                if (existingItem) {
                                    existingItem.quantity += quantity;
                                } else {
                                    items.push({
                                        itemId: `MI${itemId.trim()}`,
                                        quantity: quantity
                                    });
                                }
                                rl.question("Thêm món ăn khác? (y/n): ", async (answer) => {
                                    if (answer.trim().toLowerCase() === 'y') {
                                        addItem();
                                    } else {
                                        const total = await items.reduce(async (sumPromise, item) => {
                                            const sum = await sumPromise;
                                            const menuItem = await menuCollection.findOne({ _id: `MI${item.itemId}` });
                                            const promotion = await promotionsCollection.findOne({ itemId: `MI${item.itemId}` });
                                            return sum + (menuItem.price * item.quantity * (promotion ? (100 - promotion.discount) / 100 : 1));
                                        }, Promise.resolve(0));
                                        const newOrder = {
                                            _id: "ORD" + String(nextOrderId++).padStart(9, "0"),
                                            customer: capitalize(customer.trim()),
                                            phone: phone.trim(),
                                            address: capitalize(address.trim()),
                                            items: items,
                                            total: total,
                                            createdAt: new Date(),
                                            customerSatisfaction: parseFloat((Math.random() * 4 + 1).toFixed(1))
                                        };
    
                                        // Trừ số lượng nguyên liệu trong kho
                                        for (const item of items) {
                                            const menuItem = await menuCollection.findOne({ _id: `MI${item.itemId}` });
                                            for (const ingredientId of menuItem.ingredients) {
                                                await storageCollection.updateOne(
                                                    { _id: ingredientId },
                                                    { $inc: { inStock: -item.quantity } }
                                                );
                                            }
                                        }
    
                                        await ordersCollection.insertOne(newOrder);
                                        console.log("Đơn đặt hàng đã được tạo thành công:", newOrder);
                                        showOrderMenu();
                                    }
                                });
                            });
                        });
                    }
                    addItem();
                });
            });
        });
    }

    // Xem danh sách đơn đặt hàng (có phân trang)
    async function readOrders(page = 1, limit = 100) {
        try {
            const skip = (page - 1) * limit;
            const orders = await ordersCollection.find().skip(skip).limit(limit).toArray();
            const totalOrders = await ordersCollection.countDocuments();
            const totalPages = Math.ceil(totalOrders / limit);
    
            console.log(`Danh sách đơn đặt hàng - Trang ${page}:`);
            orders.forEach((order, index) => {
                const formattedDate = new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
                console.log(`ID: ${order._id}, Khách hàng: ${order.customer}, Số điện thoại: ${order.phone}, Địa chỉ: ${order.address}, Tổng: ${order.total.toLocaleString()} VND, Ngày tạo: ${formattedDate}, Đánh giá: ${order.customerSatisfaction}`);
                order.items.forEach((item, idx) => {
                    console.log(`   ${idx + 1}. Món ăn ID: ${item.itemId}, Số lượng: ${item.quantity}`);
                });
            });

            showPaginationMenu()
    
            // Hiển thị menu phân trang
            function showPaginationMenu() {
                console.log(`
                    Đơn hàng ${skip + 1} - ${Math.min(skip + limit, totalOrders)} trên ${totalOrders} đơn hàng
                    1. Trang tiếp theo ${page < totalPages ? '' : '- Không khả dụng'}
                    2. Trang phía trước ${page > 1 ? '' : '- Không khả dụng'}
                    3. Nhập số trang muốn đến
                    4. Quay lại
                `);
                rl.question("Chọn một chức năng: ", (answer) => {
                    switch (answer.trim()) {
                        case '1':
                            if (page < totalPages) {
                                readOrders(page + 1, limit);
                            } else {
                                console.log("Bạn đang ở trang cuối cùng.");
                                showPaginationMenu();
                            }
                            break;
                        case '2':
                            if (page > 1) {
                                readOrders(page - 1, limit);
                            } else {
                                console.log("Bạn đang ở trang đầu tiên.");
                                showPaginationMenu();
                            }
                            break;
                        case '3':
                            rl.question(`Nhập số trang muốn đến (1 - ${totalPages}): `, (pageNumber) => {
                                pageNumber = parseInt(pageNumber.trim(), 10);
                                if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
                                    readOrders(pageNumber, limit);
                                } else {
                                    console.log("Số trang không hợp lệ.");
                                    showPaginationMenu();
                                }
                            });
                            break;
                        case '4':
                            showOrderMenu();
                            break;
                        default:
                            console.log("Lựa chọn không hợp lệ. Vui lòng thử lại.");
                            showPaginationMenu();
                            break;
                    }
                });
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn đặt hàng:", error);
            showOrderMenu();
        }
    }

    // Cập nhật đơn đặt hàng
    async function updateOrder() {
        rl.question(`Nhập ID đơn đặt hàng cần cập nhật: ORD`, async (orderId) => {
            try {
                const order = await ordersCollection.findOne({ _id: `ORD${orderId.trim()}`});
                if (!order) {
                    console.log("Không tìm thấy đơn đặt hàng với ID này.");
                    return showOrderMenu();
                }
                rl.question("Nhập tên khách hàng mới (để trống nếu không thay đổi): ", (customer) => {
                    rl.question("Nhập số điện thoại mới (để trống nếu không thay đổi): ", (phone) => {
                        rl.question("Nhập địa chỉ mới (để trống nếu không thay đổi): ", (address) => {
                            const updatedData = {};
                            if (customer.trim()) updatedData.customer = capitalize(customer.trim());
                            if (phone.trim() && /^\d+$/.test(phone)) updatedData.phone = phone.trim();
                            if (address.trim()) updatedData.address = capitalize(address.trim());
                            rl.question("Cập nhật món ăn? (y/n): ", async (answer) => {
                                if (answer.trim().toLowerCase() === 'y') {
                                    const items = [];
                                    async function addItem() {
                                        rl.question("Nhập ID món ăn: MI", async (itemId) => {
                                            if (!itemId.trim()) {
                                                console.log("ID món ăn không được để trống.");
                                                return addItem();
                                            }
                                            const menuItem = await menuCollection.findOne({ _id: `MI${itemId.trim()}` });
                                            if (!menuItem) {
                                                console.log("Không tìm thấy món ăn với ID này.");
                                                return addItem();
                                            }
                                            rl.question("Nhập số lượng: ", async (quantity) => {
                                                quantity = parseInt(quantity.trim(), 10);
                                                if (isNaN(quantity) || quantity <= 0) {
                                                    console.log("Số lượng không hợp lệ.");
                                                    return addItem();
                                                }
                                                items.push({
                                                    itemId: itemId.trim(),
                                                    quantity: quantity
                                                });
                                                rl.question("Thêm món ăn khác? (y/n): ", async (answer) => {
                                                    if (answer.trim().toLowerCase() === 'y') {
                                                        addItem();
                                                    } else {
                                                        updatedData.items = items;
                                                        updatedData.total = await items.reduce(async (sumPromise, item) => {
                                                            const sum = await sumPromise;
                                                            const menuItem = await menuCollection.findOne({ _id: `MI${item.itemId}` });
                                                            return sum + (menuItem.price * item.quantity);
                                                        }, Promise.resolve(0));
                                                        await ordersCollection.updateOne({ _id: `ORD${orderId.trim()}` }, { $set: updatedData });
                                                        console.log("Đơn đặt hàng đã được cập nhật thành công.");
                                                        showOrderMenu();
                                                    }
                                                });
                                            });
                                        });
                                    }
                                    addItem();
                                } else {
                                    await ordersCollection.updateOne({ _id: `ORD${orderId.trim()}` }, { $set: updatedData });
                                    console.log("Đơn đặt hàng đã được cập nhật thành công.");
                                    showOrderMenu();
                                }
                            });
                        });
                    });
                });
            } catch (error) {
                console.error("Lỗi khi cập nhật đơn đặt hàng:", error);
                showOrderMenu();
            }
        });
    }

    // Xóa đơn đặt hàng
    async function deleteOrder() {
        rl.question(`Nhập ID đơn đặt hàng cần xóa: ORD`, async (orderId) => {
            try {
                const result = await ordersCollection.deleteOne({ _id: `ORD${orderId.trim()}` });
                if (result.deletedCount > 0) {
                    console.log("Đơn đặt hàng đã được xóa thành công.");
                } else {
                    console.log("Không tìm thấy đơn đặt hàng với ID này.");
                }
            } catch (error) {
                console.error("Lỗi khi xóa đơn đặt hàng:", error);
            }
            showOrderMenu();
        });
    }

    // Tìm kiếm đơn đặt hàng
    async function searchOrders() {
        console.log(`
            ================================
            TÌM KIẾM ĐƠN ĐẶT HÀNG
            ================================
            1. Tìm kiếm theo ID đơn đặt hàng
            2. Tìm kiếm theo tên khách hàng
            3. Tìm kiếm theo số điện thoại
            4. Quay lại
        `);

        rl.question("Chọn một chức năng: ", async (choice) => {
            switch (choice.trim()) {
                case "1":
                    searchById();
                    break;
                case "2":
                    searchByCustomer();
                    break;
                case "3":
                    searchByPhone();
                    break;
                case "4":
                    showOrderMenu();
                    break;
                default:
                    console.log("Lựa chọn không hợp lệ. Vui lòng thử lại.");
                    searchOrders();
            }
        });

        // Tìm bằng ID
        async function searchById() {
            rl.question(`Nhập ID đơn đặt hàng: ORD`, async (id) => {
                try {
                    const order = await ordersCollection.findOne({ _id: `ORD${id.trim()}` });
                    if (!order) {
                        console.log("Không tìm thấy đơn đặt hàng với ID này.");
                    } else {
                        console.log(`ID: ${order._id}, Khách hàng: ${order.customer}, Số điện thoại: ${order.phone}, Địa chỉ: ${order.address}, Tổng: ${order.total.toLocaleString()} VND, Ngày tạo: ${order.createdAt}`);
                        order.items.forEach((item, idx) => {
                            console.log(`   ${idx + 1}. Món ăn ID: ${item.itemId}, Số lượng: ${item.quantity}`);
                        });
                    }
                } catch (error) {
                    console.error("Lỗi khi tìm kiếm đơn đặt hàng:", error);
                }
                searchOrders();
            });
        }

        // Tìm bằng tên khách hàng
        async function searchByCustomer() {
            rl.question("Nhập tên khách hàng: ", async (customer) => {
                try {
                    const orders = await ordersCollection.find({ customer: { $regex: new RegExp(customer, 'i') } }).toArray();
                    if (orders.length === 0) {
                        console.log("Không tìm thấy đơn đặt hàng với tên khách hàng này.");
                    } else {
                        console.log("Kết quả tìm kiếm:");
                        orders.forEach((order, index) => {
                            console.log(`${index + 1}. ID: ${order._id}, Khách hàng: ${order.customer}, Số điện thoại: ${order.phone}, Địa chỉ: ${order.address}, Tổng: ${order.total.toLocaleString()} VND, Ngày tạo: ${order.createdAt}`);
                            order.items.forEach((item, idx) => {
                                console.log(`   ${idx + 1}. Món ăn ID: ${item.itemId}, Số lượng: ${item.quantity}`);
                            });
                        });
                    }
                } catch (error) {
                    console.error("Lỗi khi tìm kiếm đơn đặt hàng:", error);
                }
                searchOrders();
            });
        }

        // Tìm bằng điện thoại đặt hàng
        async function searchByPhone() {
            rl.question("Nhập số điện thoại: ", async (phone) => {
                try {
                    const orders = await ordersCollection.find({ phone: phone.trim() }).toArray();
                    if (orders.length === 0) {
                        console.log("Không tìm thấy đơn đặt hàng với số điện thoại này.");
                    } else {
                        console.log("Kết quả tìm kiếm:");
                        orders.forEach((order, index) => {
                            console.log(`${index + 1}. ID: ${order._id}, Khách hàng: ${order.customer}, Số điện thoại: ${order.phone}, Địa chỉ: ${order.address}, Tổng: ${order.total.toLocaleString()} VND, Ngày tạo: ${order.createdAt}`);
                            order.items.forEach((item, idx) => {
                                console.log(`   ${idx + 1}. Món ăn ID: ${item.itemId}, Số lượng: ${item.quantity}`);
                            });
                        });
                    }
                } catch (error) {
                    console.error("Lỗi khi tìm kiếm đơn đặt hàng:", error);
                }
                searchOrders();
            });
        }
    }

    showOrderMenu();
}

// Các chức năng quản lý khuyến mãi
function handlePromotionManagement() {
    function showPromotionMenu() {
        console.log(`
            ================================
            QUẢN LÝ KHUYẾN MÃI
            ================================
            1. Thêm khuyến mãi
            2. Xem danh sách khuyến mãi
            3. Cập nhật khuyến mãi
            4. Gỡ khuyến mãi
            5. Quay lại menu chính
        `);
    
        rl.question("Chọn một chức năng: ", async (choice) => {
            switch (choice.trim()) {
                case "1":
                    await addPromotion();
                    break;
                case "2":
                    await listPromotions();
                    break;
                case "3":
                    await updatePromotion();
                    break;
                case "4":
                    await removePromotion();
                    break;
                case "5":
                    showMenuDialog();
                    return;
                default:
                    console.log("Lựa chọn không hợp lệ. Vui lòng thử lại.");
                    showPromotionMenu();
            }
        });
    }
    
    // Thêm khuyến mãi
    async function addPromotion() {
        rl.question(`Nhập ID món ăn cần áp dụng khuyến mãi: MI`, async (id) => {
            const menuItem = await menuCollection.findOne({ _id: `MI${id.trim()}` });
            if (!menuItem) {
                console.log("Không tìm thấy món ăn với ID này.");
                return showPromotionMenu();
            }

            const existingPromotion = await promotionsCollection.findOne({ itemId: `MI${id}` });
            if (existingPromotion) {
                console.log("Món ăn này đã có khuyến mãi.");
                return showPromotionMenu();
            }
    
            rl.question("Nhập phần trăm giảm giá (0-100): ", async (discount) => {
                if (!/^\d+$/.test(discount) || parseInt(discount) <= 0 || parseInt(discount) > 100) {
                    console.log("Phần trăm giảm giá không hợp lệ.");
                    return showPromotionMenu();
                }
    
                try {
                    const promotion = {
                        itemId: menuItem._id,
                        itemName: menuItem.itemName,
                        discount: parseInt(discount),
                    };
                    await promotionsCollection.insertOne(promotion);
                    console.log("Khuyến mãi đã được thêm:", promotion);
                } catch (error) {
                    console.error("Lỗi khi thêm khuyến mãi:", error);
                }
                showPromotionMenu();
            });
        });
    }
    
    // Hiển thị danh sách khuyến mãi
    async function listPromotions() {
        try {
            const promotions = await promotionsCollection.find().toArray();
            if (promotions.length === 0) {
                console.log("Không có khuyến mãi nào.");
            } else {
                console.log("Danh sách khuyến mãi:");
                promotions.forEach((promotion, index) => {
                    console.log(`${index + 1}. Món ăn: ${promotion.itemName}, Giảm giá: ${promotion.discount}%`);
                });
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khuyến mãi:", error);
        }
        showPromotionMenu();
    }
    
    // Gỡ khuyến mãi
    async function removePromotion() {
        rl.question(`Nhập ID món ăn cần gỡ khuyến mãi: MI`, async (id) => {
            try {
                const result = await promotionsCollection.deleteOne({ itemId: `MI${id.trim()}` });
                if (result.deletedCount > 0) {
                    console.log("Khuyến mãi đã được gỡ thành công.");
                } else {
                    console.log("Không tìm thấy khuyến mãi với ID món ăn này.");
                }
            } catch (error) {
                console.error("Lỗi khi gỡ khuyến mãi:", error);
            }
            showPromotionMenu();
        });
    }

    // Cập nhật khuyến mãi
    async function updatePromotion() {
        rl.question(`Nhập ID món ăn cần cập nhật khuyến mãi: MI`, async (id) => {
            const menuItem = await menuCollection.findOne({ _id: `MI${id.trim()}` });
            if (!menuItem) {
                console.log("Không tìm thấy món ăn với ID này.");
                return showPromotionMenu();
            }

            const existingPromotion = await promotionsCollection.findOne({ itemId: `MI${id}` });
            if (!existingPromotion) {
                console.log("Không tìm thấy khuyến mãi cho món ăn này.");
                return showPromotionMenu();
            }

            rl.question("Nhập phần trăm giảm giá mới (0-100): ", async (discount) => {
                if (!/^\d+$/.test(discount) || parseInt(discount) <= 0 || parseInt(discount) > 100) {
                    console.log("Phần trăm giảm giá không hợp lệ.");
                    return showPromotionMenu();
                }

                try {
                    await promotionsCollection.updateOne(
                        { itemId: `MI${id}` },
                        { $set: { discount: parseInt(discount) } }
                    );
                    console.log("Khuyến mãi đã được cập nhật.");
                } catch (error) {
                    console.error("Lỗi khi cập nhật khuyến mãi:", error);
                }
                showPromotionMenu();
            });
        });
    }

    showPromotionMenu();
}

// Quản lý dữ liệu thống kê
function handleStatistics() {
    function showStatisticsMenu() {
        console.log(`
            ================================
            THỐNG KÊ SỐ LIỆU
            ================================
            0. Quay lại
            1. Tổng doanh thu (theo tháng)
            2. Tổng doanh thu (toàn thời gian)
            3. Top món ăn được đặt nhiều nhất (theo tháng)
            4. Top 5 món ăn được đặt nhiều nhất (toàn thời gian)
            5. Phân tích danh mục bán chạy nhất (theo tháng)
            6. Top 3 danh mục bán chạy nhất (toàn thời gian)
            7. Doanh thu theo danh mục món ăn
            8. Tần suất đặt hàng theo từng tháng
            9. Doanh thu theo ngày trong một tháng cụ thể
            10. Top nguyên liệu được dùng nhiều nhất (theo tháng)
            11. Top nguyên liệu được dùng nhiều nhất (toàn thời gian)
            12. Trung bình đánh giá khách hàng (theo tháng)
            13. Trung bình đánh giá khách hàng (toàn thời gian)
        `);

        rl.question("Chọn một chức năng: ", async (choice) => {
            switch (choice.trim()) {
                case "1":
                    await showRevenueByMonth();
                    break;
                case "2":
                    await showTotalRevenue();
                    break;
                case "3":
                    await showTopItemsByMonth();
                    break;
                case "4":
                    await showTopItemsAllTime();
                    break;
                case "5":
                    await showTopCategoriesByMonth();
                    break;
                case "6":
                    await showTopCategoriesAllTime();
                    break;
                case "7":
                    await showRevenueByCategory();
                    break;
                case "8":
                    await showOrderFrequencyByMonth();
                    break;
                case "9":
                    await showRevenueByDayInASpecificMonth();
                    break;
                case "10":
                    await showTopIngredientsByMonth();
                    break;
                case "11":
                    await showTopIngredientsAllTime();
                    break;
                case "12":
                    await showAverageCustomerSatisfactionByMonth();
                    break;
                case "13":
                    await showAverageCustomerSatisfactionAllTime();
                    break;
                case "0":
                    showMenuDialog();
                    break;
                default:
                    console.log("Lựa chọn không hợp lệ. Vui lòng thử lại.");
                    showStatisticsMenu();
            }
        });
    }

    // Tổng doanh thu theo tháng
    async function showRevenueByMonth() {
        const results = await db.collection("RevenueByMonth").find().toArray();
        console.log("Tổng doanh thu (theo tháng):");
        results.forEach(result => {
            console.log(`Tháng: ${String(result.month).padStart(2, "0")}/${result.year}, Doanh thu: ${result.totalRevenue.toLocaleString()} VND`);
        });
        showStatisticsMenu();
    }

    // Tổng doanh thu toàn thời gian
    async function showTotalRevenue() {
        const result = await db.collection("TotalRevenue").findOne();
        console.log(`Từ ${firstOrderFormattedDate} đến ${lastOrderFormattedDate}`);
        console.log(`Tổng doanh thu: ${result.totalRevenue.toLocaleString()} VND`);
        showStatisticsMenu();
    }

    // Top món ăn được đặt nhiều nhất theo tháng
    async function showTopItemsByMonth() {
        const results = await db.collection("TopItemsByMonth").find().toArray();
        console.log("Top món ăn được đặt nhiều nhất (theo tháng):");
        results.forEach(result => {
            console.log(`Tháng: ${String(result.month).padStart(2, "0")}/${result.year}, Món ăn: ${result.topItem}, Số lượng: ${result.quantity.toLocaleString()}`);
        });
        showStatisticsMenu();
    }

    // Top 5 món ăn được đặt nhiều nhất toàn thời gian
    async function showTopItemsAllTime() {
        const results = await db.collection("TopItemsAllTime").find().toArray();
        console.log(`Từ ${firstOrderFormattedDate} đến ${lastOrderFormattedDate}`);
        console.log("Top 5 món ăn được đặt nhiều nhất (toàn thời gian):");
        results.forEach(result => {
            console.log(`Món ăn: ${result.itemName}, Số lượng: ${result.totalQuantity.toLocaleString()}`);
        });
        showStatisticsMenu();
    }

    // Top danh mục bán chạy nhất theo tháng
    async function showTopCategoriesByMonth() {
        const results = await db.collection("TopCategoriesByMonth").find().toArray();
        console.log("Phân tích danh mục bán chạy nhất (theo tháng):");
        results.forEach(result => {
            console.log(`Tháng: ${String(result.month).padStart(2, "0")}/${result.year}, Danh mục: ${result.topCategory}, Số lượng: ${result.quantity.toLocaleString()}`);
        });
        showStatisticsMenu();
    }

    // Top danh mục bán chạy nhất
    async function showTopCategoriesAllTime() {
        const results = await db.collection("TopCategoriesAllTime").find().toArray();
        console.log(`Từ ${firstOrderFormattedDate} đến ${lastOrderFormattedDate}`);
        console.log("Top 3 danh mục bán chạy nhất (toàn thời gian):");
        results.forEach(result => {
            console.log(`Danh mục: ${result._id}, Số lượng: ${result.totalQuantity.toLocaleString()}`);
        });
        showStatisticsMenu();
    }

    // Doanh thu theo danh mục
    async function showRevenueByCategory() {
        const results = await db.collection("RevenueByCategory").find().toArray();
        console.log(`Từ ${firstOrderFormattedDate} đến ${lastOrderFormattedDate}`);
        console.log("Doanh thu theo danh mục món ăn:");
        results.forEach(result => {
            console.log(`Danh mục: ${result._id}, Doanh thu: ${result.totalRevenue.toLocaleString()} VND`);
        });
        showStatisticsMenu();
    }

    // Tần suất đặt hàng theo tháng
    async function showOrderFrequencyByMonth() {
        const results = await db.collection("OrderFrequencyByMonth").find().toArray();
        console.log("Tần suất đặt hàng theo từng tháng:");
        results.forEach(result => {
            console.log(`Tháng: ${String(result.month).padStart(2, "0")}/${result.year}, Số đơn hàng: ${result.orderCount.toLocaleString()}`);
        });
        showStatisticsMenu();
    }

    // Hiển thị doanh thu theo ngày trong một tháng cụ thể
    async function showRevenueByDayInASpecificMonth() {
        rl.question("Nhập năm (YYYY): ", (year) => {
            if (!/^\d{4}$/.test(year)) {
                console.log("Năm không hợp lệ. Vui lòng nhập năm có 4 chữ số.");
                return showRevenueByDayInASpecificMonth();
            }
    
            rl.question("Nhập tháng (MM): ", async (month) => {
                if (!/^(0[1-9]|1[0-2])$/.test(month)) {
                    console.log("Tháng không hợp lệ. Vui lòng nhập tháng từ 01 đến 12.");
                    return showRevenueByDayInASpecificMonth();
                }
    
                const startDateStats = new Date(`${year}-${month}-01`);
                const endDateStats = new Date(startDateStats);
                endDateStats.setMonth(endDateStats.getMonth() + 1);
                endDateStats.setDate(0); // Ngày cuối cùng của tháng trước đó

                try {
                    // Xóa view cũ nếu tồn tại
                    await db.collection("RevenueByDayInASpecificMonth").drop().catch(() => {});
    
                    // Tạo view mới theo input người dùng
                    await db.createCollection("RevenueByDayInASpecificMonth", {
                        viewOn: ordersCollection.s.namespace.collection,
                        pipeline: [
                            {
                                $match: {
                                    createdAt: {
                                        $gte: startDateStats,
                                        $lte: endDateStats,
                                    },
                                },
                            },
                            {
                                $group: {
                                    _id: { $dayOfMonth: "$createdAt" },
                                    dailyRevenue: { $sum: "$total" },
                                },
                            },
                            { $sort: { _id: 1 } },
                        ],
                    });
    
                    // Hiển thị kết quả của view mới
                    const results = await db.collection("RevenueByDayInASpecificMonth").find().toArray();
                    console.log(`Doanh thu theo ngày trong tháng ${String(month).padStart(2, "0")}/${year}`);
                    results.forEach(result => {
                        console.log(`Ngày ${result._id}: ${result.dailyRevenue.toLocaleString()} VND`);
                    });
                } catch (error) {
                    console.error("Lỗi khi tạo view:", error);
                }
                showStatisticsMenu();
            });
        });
    }

    // Top nguyên liệu được dùng nhiều nhất theo tháng
    async function showTopIngredientsByMonth() {
        const results = await db.collection("TopIngredientsByMonth").find().toArray();
        console.log("Top nguyên liệu được dùng nhiều nhất (theo tháng):");
        results.forEach(result => {
            console.log(`Tháng: ${String(result.month).padStart(2, "0")}/${result.year}, ID: ${result.ingredientId}, Nguyên liệu: ${result.ingredientName}, Đã sử dụng: ${result.ingredientUsed.toLocaleString()}, Tồn kho: ${result.inStock}`);
            
        });
        showStatisticsMenu();
    }

    // Top nguyên liệu được dùng nhiều nhất toàn thời gian
    async function showTopIngredientsAllTime() {
        const results = await db.collection("TopIngredientsAllTime").find().toArray();
        console.log(`Từ ${firstOrderFormattedDate} đến ${lastOrderFormattedDate}`);
        console.log("Top nguyên liệu được dùng nhiều nhất (toàn thời gian):");
        results.forEach(result => {
            console.log(`ID: ${result.ingredientId}, Nguyên liệu: ${result.ingredientName}, Đã sử dụng: ${result.ingredientUsed.toLocaleString()}, Tồn kho: ${result.inStock}`);
            
        });
        showStatisticsMenu();
    }

    // Trung bình đánh giá khách hàng theo tháng
    async function showAverageCustomerSatisfactionByMonth() {
        const results = await db.collection("AvgCustomerSatisfactionRatingsByMonth").find().toArray();
        console.log("Trung bình đánh giá khách hàng (theo tháng):");
        results.forEach(result => {
            console.log(`Tháng: ${String(result.month).padStart(2, "0")}/${result.year}, Đánh giá: ${result.avgRatings.toFixed(1)}`);
        });
        showStatisticsMenu();
    }

    // Trung bình đánh giá khách hàng toàn thời gian
    async function showAverageCustomerSatisfactionAllTime() {
        const result = await db.collection("AvgCustomerSatisfactionRatingsAllTime").findOne();
        console.log(`Từ ${firstOrderFormattedDate} đến ${lastOrderFormattedDate}`);
        console.log(`Trung bình đánh giá khách hàng (toàn thời gian): ${result.avgRatings.toFixed(1)}`);

        showStatisticsMenu();
    }

    showStatisticsMenu()
}

// Function chạy chương trình
async function main() {
    try {
        await client.connect();
        console.log("Kết nối đến MongoDB thành công!");
        await initializeData()
        showMenuDialog();
    } catch (error) {
        console.error("Lỗi kết nối MongoDB:", error);
        rl.close();
        client.close();
    }
}

main();