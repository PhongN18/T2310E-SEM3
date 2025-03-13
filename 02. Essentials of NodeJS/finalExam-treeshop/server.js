// server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/TreeShop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const treeSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String
});

const Tree = mongoose.model('Tree', treeSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Set up EJS and static files
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.get('/', async (req, res) => {
    const trees = await Tree.find();
    res.render('home', { trees: trees, body: "home" });
});

app.get('/about', (req, res) => {
    res.render('about', { body: "about" });
});

// Add Tree
app.post('/add-tree', upload.single('image'), async (req, res) => {
    const tree = new Tree({
        name: req.body.name,
        description: req.body.description,
        image: req.file.filename
    });
    await tree.save();
    res.redirect('/');
});

// Reset
app.get('/reset', async (req, res) => {
    await Tree.deleteMany({});
    res.redirect('/');
});

// Edit Tree Page
app.get('/edit-tree/:id', async (req, res) => {
    try {
        const tree = await Tree.findById(req.params.id); // Find the tree by ID
        res.render('editTree', { tree: tree }); // Render the edit form with the tree data
    } catch (error) {
        console.error(error);
        res.status(500).send('Error finding tree');
    }
});

// Update Tree
app.post('/edit-tree/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedImage = req.file ? req.file.filename : req.body.oldImage; // If new image is uploaded, use it; otherwise, keep old image

        const updatedTree = await Tree.findByIdAndUpdate(
            req.params.id,
            { name, description, image: updatedImage },
            { new: true }
        );

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating tree');
    }
});

// Delete
app.get('/delete-tree/:id', async (req, res) => {
    try {
        const treeId = req.params.id;
        await Tree.findByIdAndDelete(treeId);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting tree');
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
