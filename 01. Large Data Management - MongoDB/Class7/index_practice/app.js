const { MongoClient } = require("mongodb");
async function main() {
    const uri = "mongodb://localhost:27017"; // Thay bằng URI của bạn nếu khác
    const client = new MongoClient(uri);
    try {
        // Kết nối tới MongoDB
        await client.connect();
        console.log("Connected to MongoDB!");
        const db = client.db("testDB");
        const collection = db.collection("testCollection");

        // Xóa dữ liệu cũ nếu có
        await collection.deleteMany({})
        console.log("Collection cleared.");

        // Sinh dữ liệu mẫu (1 triệu bản ghi)
        console.log("Inserting test data...");
        const bulkData = [];
        for (let i = 0; i < 1000000; i++) {
            bulkData.push({
                name: `User_${i}`,
                age: Math.floor(Math.random() * 85) + 15,
                email: `user_${i}@example.com`,
                createdAt: new Date()
            });
        }
        await collection.insertMany(bulkData);
        console.log("Test data inserted.");
    
        // Thử truy vấn mà không có index
        console.time("Query without index");
        await collection.find({ age: 25 }).toArray();
        console.timeEnd("Query without index");
    
        // Tạo index
        console.log("Creating index on 'age' field...");
        await collection.createIndex({ age: 1 });
        console.log("Index created.");
    
        // Thử truy vấn với index
        console.time("Query with index");
        await collection.find({ age: 25 }).toArray();
        console.timeEnd("Query with index");
    
        // Kiểm tra danh sách index
        const indexes = await collection.indexes();
        console.log("Indexes:", indexes);
    } catch (err) {
        console.error(err);
    } finally {
        // Đóng kết nối
        await client.close();
        console.log("Disconnected from MongoDB!");
    }
}

main().catch(console.error);