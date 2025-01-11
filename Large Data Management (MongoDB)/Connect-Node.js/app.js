const { MongoClient } = require('mongodb');
const execSync = require('child_process').execSync;
function checkEnvironment() {
    try {
        // Kiểm tra Node.js
        console.log("Node.js version:", execSync("node -v").toString().trim());
        // Kiểm tra MongoDB
        console.log("MongoDB version:", execSync("mongo --version").toString().split('\n')[0]);
    } catch (error) {
        console.error("Error: Môi trường chưa sẵn sàng. Hãy đảm bảo Node.js và MongoDB đã được cài đặt.");
        process.exit(1);
    }
}
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
async function run() {
    checkEnvironment();
    try {
    // Kết nối tới MongoDB
        await client.connect();
        console.log("Connected to MongoDB");
        // Chọn cơ sở dữ liệu và collection
        const db = client.db("testDB");
        const users = db.collection("users");
        // Đọc dữ liệu
        const data = await users.find().toArray();
        console.log("Users:", data);
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    } finally {
        // Đóng kết nối
        await client.close();
        console.log("Connection closed");
    }
}
run().catch(console.dir);