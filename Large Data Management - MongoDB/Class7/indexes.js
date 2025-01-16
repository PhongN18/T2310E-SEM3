// Index giúp MongoDB nhanh chóng truy xuất dữ liệu
// Khi dùng index, MongoDB không cần phải quét toàn bộ collection mà chỉ duyệt các tài liệu phù hợp
// Nhược điểm: chiếm thêm không gian bộ nhớ, thay đổi dữ liệu cần cập nhật index

// Cú pháp
db.collection.createIndex({ field: 1 }) // Tăng dần theo giá trị trường dữ liệu
db.collection.createIndex({ field: -1 }) // Giảm dần theo giá trị trường dữ liệu

// Compound index
db.collection.createIndex({ field1: 1, field2: -1 }) // field1 tăng dần, field2 giảm dần

// Multikey index - dùng cho field có giá trị là array
db.collection.createIndex({ field: 1 }) // field là array
// Mỗi giá trị trong mảng sẽ được index

// Text index
db.articles.createIndex({ content: "text" }); // tạo text index trên trường content có data type là string
db.articles.find({ $text: { $search: "mongodb indexing" } });
// tìm kiếm nội dung "mongodb indexing" trong trường content

// Geospatial index -tìm kiếm theo tọa độ và địa lý
db.collection.createIndex({ location: "2d" || "2dsphere" }); // tạo index cho trường location
// 2d: sử dụng cho dữ liệu không gian hai chiều trên mặt phẳng Euclidean, thích hợp cho các truy vấn với dữ liệu tọa độ đơn giản
// 2dsphere: sử dụng cho dữ liệu địa lý trên bề mặt hình cầu, hỗ trợ cho các dữ liệu không gian địa lý thực tế

// Sử dụng với $near hoặc $geoWithin

// Time-to-Live (TTL) index
// sử dụng để tự động xóa các tài liệu khỏi một bộ sưu tập sau một khoảng thời gian xác định
db.sessions.createIndex(
    { "createdAt": 1 }, // trường chứa giá trị Date mà TTL index sẽ dựa vào
    { expireAfterSeconds: 86400 }  // 86400 giây = 24 giờ
);