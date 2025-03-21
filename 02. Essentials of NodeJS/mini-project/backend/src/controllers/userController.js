const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const user = await User.create({ name, email, password: hashedPassword })
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({ error: "Email already exists" })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid email or password" })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
    res.json({ token, user })
}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}