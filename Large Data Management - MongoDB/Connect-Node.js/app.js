const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
async function testConnection() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        // Chọn cơ sở dữ liệu và collection
        const db = client.db("testDB");
        const users = db.collection("users");
        // Đọc dữ liệu
        const data = await users.find().toArray();
        console.log("Users:", data);
    } catch (err) {
        console.error("Connection failed", err);
    } finally {
        await client.close();
    }
}

testConnection().catch(console.dir);