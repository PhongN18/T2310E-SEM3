const http = require('http');
// Danh sách sản phẩm mẫu ban đầu
let products = [
    { id: 1, name: "Laptop", price: 15000000 },
    { id: 2, name: "Chuột không dây", price: 500000 },
    { id: 3, name: "Bàn phím cơ", price: 1200000 }
];
let productId = products.length + 1; // Biến đếm ID sản phẩm
const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'GET') {
        // Trả về danh sách sản phẩm
        res.writeHead(200);
        res.end(JSON.stringify(products));
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const product = JSON.parse(body);
                // Kiểm tra nếu dữ liệu thiếu name hoặc price
                if (!product.name || !product.price) {
                    res.writeHead(400);
                    res.end(JSON.stringify({
                        error: "Dữ liệu không hợp lệ. Vui lòng gửi theo định dạng:",
                        example: { name: "Sản phẩm mẫu", price: 100000 }
                    }));
                    return;
                }
                product.id = productId++; // Gán ID tự động
                products.push(product); // Thêm vào danh sách
                res.writeHead(201);
                res.end(JSON.stringify({ message: 'Sản phẩm đã thêm!', data: product }));
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({
                    error: "Dữ liệu JSON không hợp lệ. Vui lòng gửi theo định dạng:",
                    example: { name: "Sản phẩm mẫu", price: 100000 }
                }));
            }
        });
    } else {
        res.writeHead(405);
        res.end(JSON.stringify({ error: 'Phương thức không được hỗ trợ'}));
    }
});
server.listen(4000, () => console.log('API chạy tại http://localhost:4000'))