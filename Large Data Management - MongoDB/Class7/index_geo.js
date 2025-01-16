// Truy vấn không gian: Tối ưu truy vấn theo không gian đòi hỏi một công cục có thể hiểu được các đối
// tượng địa lý như điểm, đường, vùng. 2dsphere Index cung cấp các khả năng này, giúp MongoDB
// hiểu và xử lý nhanh các truy vấn địa lý phức tạp.

// Cấu trúc dữ liệu mẫu
[{
    "name": "Location A",
    "location": {
        "type": "Point", // kiểu hình học (điểm, đường, vùng, ...)
        "coordinates": [longitude, latitude]
    }
}]

// tạo index 2dsphere trên trường địa lý
db.collectionName.createIndex({ location: "2dsphere" });

// Chạy truy vấn địa lý
// 1. Tìm các điểm gần nhất
db.collectionName.find({
    location: {
        $near: {
            $geometry: { type: "Point", coordinates: [longitude, latitude] },
            $maxDistance: 1000 // Khoảng cách tối đa (mét)
        }
    }
});

// 2. Tìm các điểm trong một vùng
db.collectionName.find({
    location: {
    $geoWithin: {
        $geometry: {
            type: "Polygon",
            coordinates: [
                [
                    [long1, lat1],
                    [long2, lat2],
                    [long3, lat3],
                    [long1, lat1] // Điểm đầu phải trùng điểm cuối
                ]
            ]
            }
        }
    }
});


// Example
db.places.insertMany([
    { name: "Park", location: { type: "Point", coordinates: [106.6297, 10.8231] } }, // TPHCM
    { name: "Mall", location: { type: "Point", coordinates: [106.6652, 10.7626] } }, // Landmark 81
    { name: "Cafe", location: { type: "Point", coordinates: [106.7009, 10.7758] } } // Nhà thờ Đức Bà
]);

// tạo index
db.places.createIndex({ location: "2dsphere" });

// tìm địa điểm gần Nhà thờ Đức Bà trong bán kính 2km
db.places.find({
    location: {
        $near: {
            $geometry: { type: "Point", coordinates: [106.7009, 10.7758] },
            $maxDistance: 2000 // 2 km
        }
    }
});

// tìm địa điểm nằm trong một tam giác
db.places.find({
    location: {
        $geoWithin: {
            $geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [106.6, 10.7],
                        [106.7, 10.8],
                        [106.8, 10.7],
                        [106.6, 10.7] // Đóng vòng
                    ]
                ]
            }
        }
    }
});
