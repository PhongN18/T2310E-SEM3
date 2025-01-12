const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "todoDB";
const collectionName = "tasks";

async function main() {
    try {
        await client.connect();
        console.log("Kết nối đến MongoDB thành công!");
    } catch (err) {
        console.error("Lỗi khi kết nối MongoDB:", err.message);
        process.exit(1);
    }
}

main();