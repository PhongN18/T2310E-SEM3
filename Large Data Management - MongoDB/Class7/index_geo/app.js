// Import MongoDB Client
const { MongoClient } = require("mongodb");

// MongoDB connection URI
const uri = "mongodb://localhost:27017/"; // Thay bằng URI của bạn nếu khác
const client = new MongoClient(uri);

// Database and collection
const dbName = "geoDB";
const collectionName = "places";

async function main() {
    try {
        // Kết nối tới MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Xóa bộ sưu tập nếu đã tồn tại (để chạy lại từ đầu)
        await collection.drop().catch(() => console.log("Collection does not exist, creating new one"));

        // Bước 1: Chèn dữ liệu mẫu
        const sampleData = [
            { name: "Park", location: { type: "Point", coordinates: [106.6297, 10.8231] } }, // TPHCM
            { name: "Mall", location: { type: "Point", coordinates: [106.6652, 10.7626] } }, // Landmark 81
            { name: "Cafe", location: { type: "Point", coordinates: [106.7009, 10.7758] } }  // Nhà thờ Đức Bà
        ];

        await collection.insertMany(sampleData);
        console.log("Sample data inserted");

        // Bước 2: Tạo 2dsphere Index
        await collection.createIndex({ location: "2dsphere" });
        console.log("2dsphere index created");

        // Bước 3: Truy vấn địa lý
        // Truy vấn 1: Tìm địa điểm gần Nhà thờ Đức Bà (trong bán kính 2km)
        const nearResults = await collection.find({
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [106.7009, 10.7758] },
                    $maxDistance: 2000 // 2 km
                }
            }
        }).toArray();
        console.log("Locations near Nhà thờ Đức Bà (within 2km):", nearResults);

        // Truy vấn 2: Tìm các địa điểm nằm trong một tam giác
        const withinResults = await collection.find({
        location: {
            $geoWithin: {
                $geometry: {
                    type: "Polygon",
                    coordinates: [
                        [
                            [106.6, 10.7],
                            [106.7, 10.8],
                            [106.8, 10.7],
                            [106.6, 10.7] // Điểm đầu và cuối phải trùng nhau
                        ]
                    ]
                }
            }
        }
        }).toArray();
        console.log("Locations within the defined triangle:", withinResults);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        // Đóng kết nối
        await client.close();
        console.log("Connection closed");
    }
}

main();
