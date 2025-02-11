const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
// Middleware để parse JSON
app.use(express.json());

// Kết nối Mongoose
mongoose.connect('mongodb://localhost:27017/lab02')
.then(() => console.log('Kết nối thành công với MongoDB'))
.catch(err => console.error('Lỗi kết nối', err));

// Định nghĩa Schema và Model
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
})

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, required: true }
});

// API Endpoints
// CRUD cho products
