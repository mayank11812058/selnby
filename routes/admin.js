const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const Product = require('../models/Product');
const {check} = require('express-validator');
const middleware = require('../middleware/auth');

router.post('/addProduct', [check('title').isLength({min : 3}).withMessage('Title must be of 3 characters').trim().custom(value => {
                            return Product.findOne({title : value})
                            .then(product => {
                                if(product){
                                    return Promise.reject('Title exists already.');
                                }else{
                                    return true;
                            }})}), 
                            check('price').trim().exists({checkFalsy : true, checkNull : true})
                            .withMessage('Price must not be 0 or empty')
                            .isDecimal().withMessage('Price must be decimal')
                            .custom((value) => {
                                if(parseFloat(value) < 0){
                                    throw new Error('Price must be positive');
                                }else{
                                    return true;
                                }}),
                            check('description').trim().isLength({min : 10}).withMessage('Description must be of 10 characters')], middleware, adminController.addProduct);

router.post('/editProduct/:productId', [check('title').isLength({min : 3}).withMessage('Title must be of 3 characters'),
                                        check('price').trim().exists({checkFalsy : true, checkNull : true})
                                        .withMessage('Price must not be 0 or empty')
                                        .isDecimal().withMessage('Price must be decimal')
                                        .custom(value => {
                                            if(parseFloat(value) < 0){
                                                throw new Error('Price must be positive');
                                            }else{
                                                return true;
                                            }}),
                                        check('description').trim().isLength({min : 10}).withMessage('Description must be of 10 characters')], middleware, adminController.addProduct);

router.get('/myProducts', middleware, adminController.getProducts);

router.delete('/delete/:productId', middleware, adminController.deleteProduct);

router.get('/getCart', middleware, adminController.getCart);

router.post('/addToCart', middleware, adminController.addToCart);

router.post('/removeFromCart', middleware, adminController.removeFromCart);

router.post('/clearItemFromCart', middleware, adminController.clearItemFromCart);

router.get('/myOrders', middleware, adminController.getOrders);

router.post('/order', middleware, adminController.order);

router.post('/addReview', middleware, adminController.addReview);

router.post('/removeReview', middleware, adminController.removeReview);

router.get('/getBoughtProducts', middleware, adminController.getBoughtProducts);

module.exports = router;