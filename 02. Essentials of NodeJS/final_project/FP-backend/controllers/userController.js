const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Lấy danh sách người dùng (Chỉ Admin) - có phân trang và lọc tìm kiếm
const getUsers = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden - Admins only" });
    }
    
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: "i" };
        }
        const users = await User.find(query).skip(skip).limit(limit);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// * Lấy thông tin chi tiết người dùng (Admin hoặc chính chủ)
const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (req.user.role !== "admin" && req.user._id.toString() !== user._id.toString()) {
        return res.status(403).json({ message: "Forbidden - Access denied" });
    }

    res.json(user);
};

// Cập nhật thông tin người dùng (Admin hoặc chính chủ)
const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (req.user.role !== "admin" && req.user._id.toString() !== user._id.toString()) {
        return res.status(403).json({ message: "Forbidden - Access denied" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    await user.save();
    res.json({ message: "User updated successfully", user });
};

// Xóa người dùng (Chỉ Admin)
const deleteUser = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden - Admins only" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };
