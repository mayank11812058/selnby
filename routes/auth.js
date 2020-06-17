const express = require('express');
const router = express.Router();

const {check} = require('express-validator');
const User = require('../models/User');

const authControllers = require('../controllers/auth');

router.post('/signup', [check('name').trim()
                        .isLength({min : 4}).withMessage('Name must be 4 characters long')
                        .isAlpha().withMessage('Name must be made up of alphabets'),
                       check('email').trim().normalizeEmail()
                        .isEmail().withMessage('Should be valid e-mail')
                        .custom(value => {
                            return User.findOne({email : value}).then(user => {
                                if(user){
                                    return Promise.reject('Account with E-mail already exists.');
                                }

                                return true;
                            });
                        }), 
                       check('password').trim()
                        .isLength({min : 8}).withMessage('Password must be 8 characters long.'),
                       check('confirmPassword')
                       .custom((value, {req}) => {
                        if(value !== req.body.password){
                            throw new Error('Confirm Password must be equal to Password field.');
                        }

                            return true;
                        })], authControllers.postSignUp);

router.post('/login', [check('email').trim().normalizeEmail()
                        .isEmail().withMessage('Should be valid e-mail'), 
                       check('password').trim()
                        .isLength({min : 8}).withMessage('Password must be 8 characters long.')
                      ], authControllers.postLogin);

router.post('/resetConfirm', [check('email').trim().normalizeEmail()
                      .isEmail().withMessage('Should be valid e-mail')
                    ], authControllers.resetConfirm);

router.post('/resetPassword/:token', [ check('password').trim()
                    .isLength({min : 8}).withMessage('Password must be 8 characters long.')
                  ], authControllers.resetPassword);


module.exports = router;
