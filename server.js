const express = require('express');
const server = express();
const multer = require('multer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const path = require('path');
const MONGO_URI = require('./config/keys').MONGO_URI;

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'images');
    },
    filename : (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};

server.use(bodyParser.urlencoded({extended : false}));
server.use(bodyParser.json());
server.use(multer({storage : storage, fileFilter : fileFilter}).single('imageUrl'));

server.use('/images', express.static('images'));
server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

server.use(shopRoutes);
server.use(adminRoutes);
server.use(authRoutes);

if(process.env.NODE_ENV === 'production'){
    server.use(express.static(path.join(__dirname, 'client', 'build')));
    server.get('/*', (req, res, next) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
.then(result => {
    server.listen(PORT);
}).catch(err => {
});
