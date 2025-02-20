// File: backend/config/db.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // Không cần các option cũ
        console.log("✅ MongoDB Connected...");

        // Chèn dữ liệu mẫu nếu chưa có
        await seedUsers();
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};

// Chèn dữ liệu mẫu nếu chưa có user nào
const seedUsers = async () => {
    try {
        const count = await User.countDocuments();
        if (count === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("123456", salt);

            const users = [
                { name: "Admin User", email: "admin@example.com", password: hashedPassword, role: "admin" },
                { name: "Regular User", email: "user@example.com", password: hashedPassword, role: "user" },
                { name: "Test User", email: "test@example.com", password: hashedPassword, role: "user" }
            ];

            await User.insertMany(users);

            console.log("✅ Sample users inserted successfully!");
        } else {
            console.log("✅ Users already exist, skipping seeding...");
        }
    } catch (error) {
        console.error("❌ Error seeding users:", error);
    }
};

module.exports = connectDB;
