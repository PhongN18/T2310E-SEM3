require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require('./src/routes/userRoutes');
const User = require('./src/models/User')

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully")
        addInitialUsers()
    })
    .catch(err => {
        console.error("MongoDB Connection Error:", err)
        process.exit(1)
    });


// Định nghĩa routes
app.use('/api/users', userRoutes);
app.get("/", (req, res) => {
    res.send("API is running...");
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Thêm dữ liệu mẫu nếu chưa có trong db
const addInitialUsers = async () => {
    try {
        const count = await User.countDocuments()
        if (count === 0) {
            const users = [
                { name: "John Doe", email: "john@example.com", password: "password123" },
                { name: "Jane Smith", email: "jane@example.com", password: "password456" },
                { name: "Sam Wilson", email: "sam@example.com", password: "password789" }
            ]

            await User.insertMany(users)
            console.log("Added initial users to the database");
        } else {
            console.log("Users already exist in the database");
            
        }
    } catch (error) {
        console.error("Error adding initial users to the database");
        console.error(error);
    }
}