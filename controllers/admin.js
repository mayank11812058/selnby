const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const {validationResult} = require('express-validator');

exports.addProduct = (req, res, next) => {
    const err = validationResult(req);

    if(err.errors.length > 0){
        res.json({error : err.errors});
    }else{
        let edit = null;

        if(req.query){
            edit = req.query.edit;
        }

        const productId = req.params.productId;
        const title = req.body.title;
        let imageUrl;
        if(req.file){
            imageUrl = req.file.path;
        }

        const description = req.body.description;
        const price = req.body.price;
        const userId = req.user._id;

        if(edit){
            Product.findById(productId)
            .then(product => {
                product.title = title;
                product.price = price;
                product.description = description;

                if(imageUrl){
                    product.imageUrl = imageUrl;
                }

                return product.save();
            }).then(product => {
                res.json({product : product});
            }).catch(err => {
                res.json({error : err});
            })
        }else{
            const product = new Product({
                title : title,
                price : price,
                description : description,
                userId : userId,
                imageUrl : imageUrl,
                reviews : []
            });

            product.save()
            .then(product => {
                res.json({product : product});
            }).catch(err => {
                res.json({error : err});
            });
        }
    }
}

exports.getProducts = (req, res, next) => {
    Product.find({userId : req.user._id})
    .then(products => {
        res.json({products : products});
    }).catch(err => {
        res.json({error : err});
    });
}

exports.deleteProduct = (req, res, next) => {
    const productId = req.params.productId;

    Product.findByIdAndRemove(productId)
    .then(products => {
        res.json({products : products});
    }).catch(err => {
        res.json({error : err});
    });
}

exports.addToCart = (req, res, next) => {
    const productId = req.body.productId;
    const items = [...req.user.cart.items];

    const index = items.findIndex(item => item.productId._id.toString() === productId.toString());

    if(index >= 0){
        items[index].count += 1;
    }else{
        items.push({productId : productId, count : 1});
    }

    let price;

    Product.findById(productId)
    .then(product => {
        price = product.price;

        if(req.user.cart.total){
            price += +req.user.cart.total;
        }

        req.user.cart = {
            total : price,
            items : items
        };

        return req.user.save();
    }).then(user => {
        res.json({cart : user.cart});
    }).catch(err => {
        res.json({error : err});
    });
}

exports.removeFromCart = (req, res, next) => {
    const productId = req.body.productId;
    const items = [...req.user.cart.items];

    const index = items.findIndex(item => item.productId.toString() === productId.toString());

    if(index >= 0){
        items[index].count -= 1;

        if(+items[index].count === 0){
            items.splice(index, 1);
        }

        let price;

        Product.findById(productId)
        .then(product => {
            price = +product.price;

            if(req.user.cart.total){
                price = +req.user.cart.total - price;
            }

            req.user.cart = {
                total : price,
                items : items
            };
    
            return req.user.save();
        }).then(user => {
            res.json({cart : user.cart});
        }).catch(err => {
            res.json({error : err});
        });
    }else{
        res.json({cart : req.user.cart});
    }
}

exports.clearItemFromCart = (req, res, next) => {
    const productId = req.body.productId;

    const items = [...req.user.cart.items];
    const index = items.findIndex(item => item.productId.toString() === productId.toString());

    if(index >= 0){
        const count = items[index].count;
        let price;
        items.splice(index, 1);
        Product.findById(productId).then(product => {
            price = count * product.price;

            if(req.user.cart.total){
                price = req.user.cart.total - price;
            }else{
                price = 0;
            }

            req.user.cart = {
                total : price,
                items : [...items]
            }

            return req.user.save();
        }).then(user => {
            res.json({msg : 'Item cleared successfully'});
        })
        .catch(err => {
            res.json({error : err});
        });
    }else{
        res.json({msg : 'Item not in cart'});
    }
}

exports.getCart = (req, res, next) => {
    User.findById(req.user._id).populate('cart.items.productId')
    .then(user => {
        res.json({
            cart : user.cart
        });
    }).catch(err => {
        res.json({error : err});
    });
}

exports.getOrders = (req, res, next) => {
    Order.find({userId : req.user._id})
    .then(orders => {
        res.json({orders : orders});
    }).catch(err => {
        res.json({error : err});
    })
}

exports.order = (req, res, next) => {
    let tempOrder, items = [], boughtProducts = [...req.user.boughtProducts];

    if(req.user.cart.items.length > 0){
        User.findOne(req.user._id).populate('cart.items.productId').then(user => {
            items = user.cart.items.map(item => {
                boughtProducts.push({productId : item.productId._id});
                return {
                    productId : item.productId._id,
                    title : item.productId.title,
                    imageUrl : item.productId.imageUrl,
                    description : item.productId.description,
                    price : item.productId.price,
                    count : item.count
                };
            });

            const order = new Order({
                userId : user._id,
                cart : {
                    total : user.cart.total,
                    items : [...items]
                }
            });

            return order.save();
        }).then(order => {
            tempOrder = order;
            req.user.cart.items = [];
            req.user.cart.total = 0;
            req.user.boughtProducts = boughtProducts;
            return req.user.save();
        }).then(user => {
            res.json({order : tempOrder});
        }).catch(err => {
            res.json({error : err});
        });;
    }else{
        res.json({
            error : 'Cart is empty'
        });
    }
}

exports.addReview = (req, res, next) => {
    const productId = req.body.productId;
    const review = req.body.review;

    Product.findById(productId)
    .then(product => {
        const reviews = [...product.reviews];

        const index = reviews.findIndex(review => review.userId.toString() === req.user._id.toString());

        if(index >= 0){
            reviews[index].review = review;
            reviews[index].date = Date.now();
        }else{
            reviews.push({
                userId : req.user._id,
                userName : req.user.name,
                date : Date.now(),
                review : review
            });
        }

        reviews.sort((a, b) => b.date - a.date);
        product.reviews = reviews;
        return product.save();
    }).then(product => {
        const reviews = [...req.user.reviews];

        const index = reviews.findIndex(review => review.productId.toString() === product._id.toString());

        if(index >= 0){
            reviews[index].review = review;
            reviews[index].date = Date.now();
        }else{
            reviews.push({
                productId : product._id,
                date : Date.now(),
                review : review
            });
        }

        reviews.sort((a, b) => b.date - a.date);
        req.user.reviews = reviews;
        return req.user.save();
    }).then(user => {
        res.json({msg : "Success"});
    }).catch(err => {
        res.json({erroe : err});
    });
}

exports.removeReview = (req, res, next) => {
    const productId = req.body.productId;

    Product.findById(productId)
    .then(product => {
        const reviews = [...product.reviews];
        const index = reviews.findIndex(review => review.userId.toString() === req.user._id.toString());

        if(index >= 0){
            reviews.splice(index, 1);
        }

        product.reviews = reviews;
        return product.save();
    }).then(product => {
        const reviews = [...req.user.reviews];
        const index = reviews.findIndex(review => review.productId.toString() === product._id.toString());

        if(index >= 0){
            reviews.splice(index, 1);
        }

        req.user.reviews = reviews;
        return req.user.save();
    }).then(user => {
        res.json({msg : "Success"});
    }).catch(err => {
        res.json({erroe : err});
    });   
}

exports.getBoughtProducts = (req, res, next) => {
    res.json({boughtProducts : req.user.boughtProducts});
}