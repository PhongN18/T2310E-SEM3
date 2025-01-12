const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "todoDB";
const collectionName = "tasks";
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Convert callbacks to promise to avoid errors and handle async
const { promisify } = require('util');
const rlQuestion = promisify(rl.question).bind(rl);

let nextId = 1

const sampleTasks = [
    { id: nextId++, description: "Hoàn thành báo cáo công việc", done: false },
    { id: nextId++, description: "Lên kế hoạch họp nhóm", done: false },
    { id: nextId++, description: "Gửi email cho đối tác", done: true },
    { id: nextId++, description: "Kiểm tra tiến độ dự án", done: false },
    { id: nextId++, description: "Chuẩn bị tài liệu thuyết trình", done: true },
    { id: nextId++, description: "Cập nhật thông tin sản phẩm", done: false },
    { id: nextId++, description: "Họp với bộ phận kỹ thuật", done: true },
    { id: nextId++, description: "Thực hiện khảo sát khách hàng", done: false },
    { id: nextId++, description: "Đánh giá hiệu quả chiến dịch", done: true },
    { id: nextId++, description: "Viết báo cáo phân tích dữ liệu", done: false },
    { id: nextId++, description: "Lên lịch làm việc tuần tới", done: true },
    { id: nextId++, description: "Kiểm tra và sửa lỗi phần mềm", done: false },
    { id: nextId++, description: "Nghiên cứu thị trường mới", done: false },
    { id: nextId++, description: "Tham dự hội thảo trực tuyến", done: true },
    { id: nextId++, description: "Cập nhật thông tin khách hàng", done: false }
];

async function initializeSampleData() {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const existingTasks = await collection.countDocuments();
    if (existingTasks === 0) {
        console.log("Không có dữ liệu, khởi tạo 15 công việc mẫu...");
        await collection.insertMany(sampleTasks);
    } else {
        const maxIdTask = await collection.find().sort({ id: -1 }).limit(1).toArray();
        nextId = maxIdTask.length > 0 ? maxIdTask[0].id + 1 : 1;
        console.log("Dữ liệu đã tồn tại.", nextId);
    }
}

async function showMenu() {
    console.log("\n=== To-Do List ===");
    console.log("1. Xem tất cả công việc");
    console.log("2. Thêm công việc mới");
    console.log("3. Cập nhật công việc");
    console.log("4. Xóa công việc");
    console.log("5. Thoát");
    rl.question("Chọn một tùy chọn: ", handleOption);
}

async function handleOption(option) {
    switch (option.trim()) {
        case '1':
            await viewTasks();
            break;
        case '2':
            await addTask();
            break;
        case '3':
            await updateTask();
            break;
        case '4':
            await deleteTask();
            break;
        case '5':
            console.log("Thoát chương trình. Tạm biệt!");
            rl.close();
            await client.close();
            process.exit(0);
        default:
            console.log("Lựa chọn không hợp lệ. Vui lòng thử lại.");
            break;
        }
}

async function viewTasks() {
    const db = client.db(dbName);
    const tasks = await db.collection(collectionName).find().toArray();
    console.log("\n=== Danh sách công việc ===");
    if (tasks.length === 0) {
        console.log("Không có công việc nào.");
    } else {
        tasks.forEach(task => {
            console.log(`[ID: ${String(task.id).padStart(2, '0')}] ${task.done ? "[X]" : "[ ]"} ${task.description}`);
        });
    }
    showMenu();
}

async function addTask() {
    try {
        const description = await rlQuestion("Nhập mô tả công việc: ");
        const db = client.db(dbName);
        const newTask = { id: nextId++, description, done: false };
        await db.collection(collectionName).insertOne(newTask);
        console.log("Công việc đã được thêm.");
    } catch (err) {
        console.error("Lỗi khi thêm công việc:", err.message);
    } finally {
        showMenu();
    }
}

async function updateTask() {
    try {
        const id = await rlQuestion("Nhập ID công việc cần cập nhật: ");
        const taskId = parseInt(id.trim());
        const db = client.db(dbName);

        const task = await db.collection(collectionName).findOne({ id: taskId });
        if (!task) {
            console.log("Không tìm thấy công việc.");
        } else {
            const done = await rlQuestion("Công việc đã hoàn thành chưa? (yes/no): ");
            const isDone = done.trim().toLowerCase() === 'yes';
            await db.collection(collectionName).updateOne({ id: taskId }, { $set: { done: isDone } });
            console.log("Công việc đã được cập nhật.");
        }
    } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
    } finally {
        showMenu();
    }
}

async function deleteTask() {
    try {
        const id = await rlQuestion("Nhập ID công việc cần xóa: ");
        const taskId = parseInt(id.trim());

        // Validate the ID
        if (isNaN(taskId)) {
            console.log("ID không hợp lệ. Vui lòng nhập một số.");
            return;
        }

        const db = client.db(dbName);
        const result = await db.collection(collectionName).deleteOne({ id: taskId });
        if (result.deletedCount === 0) {
            console.log("Không tìm thấy công việc với ID đã nhập.");
        } else {
            console.log("Công việc đã được xóa thành công.");
        }
    } catch (err) {
        console.error("Đã xảy ra lỗi", err.message);
    } finally {
        showMenu();
    }
}

async function main() {
    try {
        await client.connect();
        console.log("Kết nối đến MongoDB thành công!");
        await initializeSampleData()
        showMenu()
    } catch (err) {
        console.error("Lỗi khi kết nối MongoDB:", err.message);
        process.exit(1);
    }
}

main();