const { MongoClient } = require("mongodb");
const readline = require("readline");

// Kết nối MongoDB
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "food_delivery";
const db = client.db(dbName);
const menuCollection = db.collection("menu");
const storageCollection = db.collection("storage");
const ordersCollection = db.collection("orders");

let nextId = 1

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

function randomDate(start, end) {
    const startTimestamp = start.getTime();
    const endTimestamp = end.getTime();
    const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp);
    return new Date(randomTimestamp);
}

const startDate = new Date(2024, 7, 1);
const endDate = new Date(2025, 0, 17);

async function initializeData() {
    console.log("Inserting data...");

    // Xóa dữ liệu cũ nếu có
    await menuCollection.deleteMany({})
    await storageCollection.deleteMany({})
    await ordersCollection.deleteMany({})
    // Sinh dữ liệu mẫu

    const storageData = []
    for (let i = 1; i <= 100; i++) {
        storageData.push({
            _id: `I0${String(i).padStart(3, "0")}`,
            name: `Ingredient_${i}`,
            inStock: Math.round(Math.random() * 200)
        })
    }
    await storageCollection.insertMany(storageData)
    console.log("Storage data inserted.")

    const menuData = [];
    const categories = ['Fast Food', 'Beverage', 'Vietnamese', 'Chinese', 'Italian']
    for (let i = 1; i <= 100; i++) {
        const noOfIngredients = Math.round(Math.random() * 9) + 1
        const ingredients = Array.from({ length: noOfIngredients }, () => {
            const randomIndex = Math.floor(Math.random() * storageData.length);
            return storageData[randomIndex]._id;
        })
        menuData.push({
            _id: `MI0${String(i).padStart(3, "0")}`,
            name: `Menu_item_${i}`,
            category: categories[Math.floor(Math.random() * categories.length)],
            price: (Math.floor(Math.random() * 200) + 50) * 1000,
            ingredients: ingredients
        })
    }
    await menuCollection.insertMany(menuData);
    console.log("Menu data inserted.");
    
    const ordersData = []
    for (let i = 1; i <= 1000000; i++) {
        const noOfItems = Math.round(Math.random() * 4) + 1
        const items = Array.from({ length: noOfItems }, () => {
            const randomIndex = Math.floor(Math.random() * menuData.length);
            return {
                itemId: menuData[randomIndex]._id,
                quantity: Math.round(Math.random() * 4) + 1 // Random quantity between 1 and 5
            };
        })

        const total = items.reduce((total, item) => {
            const menuItem = menuData.find(menu => menu._id === item.itemId)
            return total + (menuItem.price * item.quantity)
        }, 0)

        ordersData.push({
            _id: 'ORD' + String(i).padStart(9, '0'),
            items: items,
            total: total,
            address: `Address_${i}`,
            createdAt: randomDate(startDate, endDate)
        })
    }
    await ordersCollection.insertMany(ordersData)
    console.log("Orders data inserted.")
}

function showMenu() {
    console.log(`
        ================================
        LỰA CHỌN CRUD CHO MENU
        ================================
        1. Thêm món ăn mới (Create)
        2. Xem danh sách món ăn (Read)
        3. Cập nhật món ăn (Update)
        4. Xóa món ăn (Delete)
        5. Thoát
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
                console.log("Thoát ứng dụng. Tạm biệt!");
                rl.close();
                client.close();
                return;
            default:
                console.log("Lựa chọn không hợp lệ. Vui lòng thử lại.");
                showMenu();
        }
    });
}

function capitalize(text) {
    return text.trim().replace(/\b\w/g, (char) => char.toUpperCase());
}

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
    async function checkItemExists(item_name) {
        try {
            const existingItem = await collection.findOne({ item_name });
            return !!existingItem;
        } catch (error) {
            console.error("Lỗi khi kiểm tra món ăn tồn tại:", error);
            return false;
        }
    }

    // Validate danh mục món ăn
    function askCategory(item_name) {
        rl.question("Nhập danh mục món ăn: ", (category) => {
            if (!category.trim()) {
                console.log("Danh mục món ăn không được để trống.");
                return askCategory();
            }
            category = capitalize(category);
            askPrice(item_name, category);
        });
    }

    // Validate giá
    function askPrice(item_name, category) {
        rl.question("Nhập giá món ăn: ", async (price) => {
            const parsedPrice = validatePrice(price, () => askPrice(item_name, category));
            if (!parsedPrice) return;

            try {
                const newItem = {
                    _id: nextId++,
                    item_name,
                    category,
                    price: parsedPrice,
                };
                await collection.insertOne(newItem);
                console.log("Thêm món ăn thành công:", newItem);
            } catch (error) {
                console.error("Lỗi khi thêm món ăn:", error);
            }
            showMenu();
        });
    }

    // Validate tên món ăn
    rl.question("Nhập tên món ăn: ", async (item_name) => {
        if (!item_name.trim()) {
            console.log("Tên món ăn không được để trống. Quay lại menu.");
            return showMenu();
        }

        item_name = capitalize(item_name)
        const exists = await checkItemExists(item_name);
        if (exists) {
            console.log("Món ăn đã tồn tại trong cơ sở dữ liệu.");
            return showMenu();
        }
        askCategory(item_name);
    });
}

// Xem danh sách món ăn
async function readMenuItems(collection) {
    try {
        const items = await collection.find().toArray();
        console.log("Danh sách món ăn:");
        items.forEach((item, index) => {
            console.log(`${index + 1}. ID: ${item._id}, ${item.item_name} - ${item.category} - ${item.price} VND`);
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách món ăn:", error);
    }
    showMenu();
}

// Cập nhật món ăn
async function updateMenuItem(collection) {
    rl.question("Nhập ID món ăn cần cập nhật (integer): ", async (id) => {
        try {
            const item = await collection.findOne({ _id: parseInt(id) });
            if (!item) {
                console.log("Không tìm thấy món ăn với ID này.");
                return showMenu();
            }
            rl.question("Nhập tên mới (để trống nếu không thay đổi): ", (item_name) => {
                rl.question("Nhập danh mục mới (để trống nếu không thay đổi): ", (category) => {
                    // Validate price
                    function updatePrice() {
                        rl.question("Nhập giá mới (để trống nếu không thay đổi): ", async (price) => {
                            const updatedData = {};
                            if (item_name) updatedData.item_name = capitalize(item_name);
                            if (category) updatedData.category = capitalize(category);

                            if (price) {
                                const parsedPrice = validatePrice(price, updatePrice);
                                if (!parsedPrice) return;
                                updatedData.price = parsedPrice;
                            }

                            try {
                                await collection.updateOne({ _id: parseInt(id) }, { $set: updatedData });
                                console.log("Cập nhật món ăn thành công.");
                            } catch (error) {
                                console.error("Lỗi khi cập nhật món ăn:", error);
                            }
                            showMenu();
                        });
                    }

                    updatePrice();
                });
            });
        } catch (error) {
            console.error("Lỗi khi tìm món ăn:", error);
            showMenu();
        }
    });
}

// Xóa món ăn
async function deleteMenuItem(collection) {
    rl.question("Nhập ID món ăn cần xóa (integer): ", async (id) => {
        try {
            const result = await collection.deleteOne({ _id: parseInt(id) });
            if (result.deletedCount > 0) {
                console.log("Xóa món ăn thành công.");
            } else {
                console.log("Không tìm thấy món ăn với ID này.");
            }
        } catch (error) {
            console.error("Lỗi khi xóa món ăn:", error);
        }
        showMenu();
    });
}

async function main() {
    try {
        await client.connect();
        console.log("Kết nối đến MongoDB thành công!");
        await initializeData()
        showMenu();
    } catch (error) {
        console.error("Lỗi kết nối MongoDB:", error);
        rl.close();
        client.close();
    }
}

main();
