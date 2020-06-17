const Product = require('../models/Product');

exports.getProducts = (req, res, next) => {
    Product.find().then(products => {
        res.json({products : products});
    }).catch(err => {
        res.json({error : err});
    });
}

exports.getProduct = (req, res, next) => {
    Product.findById(req.params.productId)
    .then(product => {
        res.json({product : product});
    }).catch(err => {
        res.json({error : err});
    });
}