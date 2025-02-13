const { table } = require('console');
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "finalExam";
const db = client.db(dbName)
const orderCollection = db.collection("order");

let noOfOrders = 100
let currentOrderId = 1

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

function generateRandomOrder(orderId) {
    const products = [];
    const productNames = ["quan au", "quan jeans", "quan dui", "ao so mi", "ao khoac", "ao phong", "ao polo", "giay", "mu", "gang tay", "khan"];
    const sizes = ["S", "M", "L", "XL", "XXL"];
    const numProducts = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < numProducts; i++) {
        const productIndex = Math.floor(Math.random() * productNames.length)
        let productId = productNames[productIndex].replace(/ /g, "").toLowerCase();
        const productName = productNames[productIndex];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const price = parseFloat((Math.random() * 100).toFixed(2));
        const quantity = Math.floor(Math.random() * 10) + 1;

        // Format product_id
        if (productId.startsWith("ao")) {
            productId = productId.substring(2);
        } else if (productId.startsWith("quan")) {
            productId = productId.substring(4);
        }

        products.push({
            product_id: productId,
            product_name: productName,
            size: size,
            price: price,
            quantity: quantity
        });
    }

    const totalAmount = parseFloat(products.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2));
    const deliveryAddress = "Hanoi";

    return {
        order_id: orderId,
        products: products,
        total_amount: totalAmount,
        delivery_address: deliveryAddress,
        order_date: new Date(),
        customer_id: Math.floor(Math.random() * 100),
        status: Math.floor(Math.random() * 2)
    };
}

async function initializeSampleData() {

    // Xóa dữ liệu cũ nếu có
    await orderCollection.deleteMany({});

    // Xóa các view cũ nếu có
    const collections = await db.listCollections({ type: "view" }).toArray();
    for (const collection of collections) {
        await db.collection(collection.name).drop();
    }

    const orderData = [];
    for (let i = 1; i <= noOfOrders; i++) {
        orderData.push(generateRandomOrder(i));
    }

    await orderCollection.insertMany(orderData);
    currentOrderId = noOfOrders + 1;

    // Tạo view TotalAmountView
    await db.createCollection("TotalAmountView", {
        viewOn: orderCollection.s.namespace.collection,
        pipeline: [
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$total_amount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalAmount: 1
                }
            }
        ]
    });
}

function showMenu() {
    console.log(`
        ================================================
        SELECT FEATURE
        ================================================
        1. Insert Orders
        2. Edit delivery_address by order_id
        3. Remove an order
        4. Read all orders
        5. Calculate total amount
        6. Count total product_id equals...
        7. Exit
    `);

    rl.question('Choose an option: ', async (option) => {
        switch (option) {
            case '1':
                await insertOrders();
                break;
            case '2':
                await updateOrder();
                break;
            case '3':
                await deleteOrder();
                break;
            case '4':
                await readOrders();
                break;
            case '5':
                await calcTotalAmount();
                break;
            case '6':
                await countTotalProductId();
                break;
            case '7':
                console.log("Closing program... Goodbye!");
                rl.close();
                client.close();
                return;
            default:
                console.log('Invalid option');
                showMenu();
                break;
        }
    });
}

async function insertOrders() {
    rl.question('How many orders do you want to generate? ', async (numOrders) => {
        const orderData = [];
        for (let i = 0; i < parseInt(numOrders); i++) {
            orderData.push(generateRandomOrder(currentOrderId++));
        }
        await orderCollection.insertMany(orderData);
        console.log(`${numOrders} orders have been generated and inserted into the database.`);
        showMenu();
    });
}

async function updateOrder() {
    rl.question('Enter order ID to update: ', async (orderId) => {
        const order = await orderCollection.findOne({ order_id: parseInt(orderId) });
        if (order) {
            rl.question('Enter new delivery address: ', async (newDeliveryAddress) => {
                await orderCollection.updateOne(
                    { order_id: order.order_id },
                    { $set: { delivery_address: newDeliveryAddress } }
                );
                console.log('Order updated with new delivery address:', newDeliveryAddress);
                showMenu();
            });
        } else {
            console.log('Order not found');
            showMenu();
        }
    });
}

async function deleteOrder() {
    rl.question('Enter order ID to delete: ', async (orderId) => {
        const result = await orderCollection.deleteOne({ order_id: parseInt(orderId) });
        if (result.deletedCount > 0) {
            console.log('Order deleted');
        } else {
            console.log('Order not found');
        }
        showMenu();
    });
}

async function readOrders() {
    const orders = await orderCollection.find({}).toArray();
    const ordersTable = []

    orders.forEach(order => {
        order.products.forEach(product => {
            ordersTable.push({
                orderId: order.order_id,
                productName: product.product_name,
                price: product.price,
                quantity: product.quantity,
                total: parseFloat((product.price * product.quantity).toFixed(2))
            })
        })
    })

    console.table(ordersTable);
    showMenu();
}

async function calcTotalAmount() {
    const totalAmount = await db.collection("TotalAmountView").findOne();
    console.log('Total amount of all orders:', totalAmount.totalAmount);
    showMenu();
}

async function countTotalProductId() {
    rl.question('Enter product ID to count: ', async (productId) => {
        const result = await orderCollection.aggregate([
            { $unwind: "$products" },
            { $match: { "products.product_id": productId } },
            { $group: { _id: "$products.product_id", totalQuantity: { $sum: "$products.quantity" } } }
        ]).toArray();

        if (result.length > 0) {
            console.log(`Total quantity of product ID ${productId}:`, result[0].totalQuantity);
        } else {
            console.log(`Product ID ${productId} not found in any orders.`);
        }
        showMenu();
    });
}

async function main() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        await initializeSampleData();
        showMenu()
    } catch (err) {
        console.error("Trouble connecting to MongoDB:", err.message);
        process.exit(1);
    }
}

main();