const {validationResult} = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = require('../config/keys').SECRET;
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const API_KEY = require('../config/keys').API_KEY;

const mailCreator = nodemailer.createTransport(sgTransport({
    auth : {
        api_key : API_KEY
    }
}));

exports.postSignUp = (req, res, next) => {
    const err = validationResult(req);

    if(err.errors.length > 0){
        res.json({error : err.errors});
    }else{
        bcrypt.hash(req.body.password, 12)
        .then(password => {
            const user = new User({
                name : req.body.name,
                email : req.body.email,
                password : password,
                boughtProducts : [],
                reviews : []
            });

            return user.save();
        }).then(user => {
            mailCreator.sendMail({
                from : 'selnby@gmail.com',
                to : user.email,
                subject : 'Hello',
                html : '<p>Thanks for signing up with us.</p>'
            });
            res.json({msg : 'Sucess'});
        }).catch(err => {
            res.json({error : err});
        })
    }
}

exports.postLogin = (req, res, next) => {
    const err = validationResult(req);

    if(err.errors.length > 0){
        res.json({error : err.errors});
    }else{
        User.findOne({email : req.body.email})
        .then(user => {
            if(!user){
                res.json({error : [{
                    value : req.body.email,
                    msg : 'Account with this e-mail do not exist',
                    param : 'email',
                    location : 'body'
                }]});
            }else{
                bcrypt.compare(req.body.password, user.password)
                .then(bool => {
                    if(!bool){
                        res.json({error : [{
                            value : req.body.password,
                            msg : 'Password did not match',
                            param : 'password',
                            location : 'body'
                        }]});
                    }

                    const token = jwt.sign({user : user._id, boughtProducts : user.boughtProducts}, SECRET);
                    res.json({token : 'Bearer ' + token});
                })
                .catch(err => {
                    next(err);
                })
            }
        }).catch(err => {
            res.json({error : err});
        });
    }
}

exports.resetConfirm = (req, res, next) => {
    const err = validationResult(req);

    if(err.errors.length > 0){
        res.json({error : err.errors});
    }else{
        crypto.randomBytes(32, (err, buffer) => {
            if(err){
                res.json({error : err});
            }else{
                User.findOne({email : req.body.email})
                .then(user => {
                    if(!user){
                        res.json({
                            error : [{
                                param : "email",
                                location : "body",
                                value : req.body.email,
                                msg : "Account do not exist with this email."
                            }]
                        });
                    }else{
                        const token = buffer.toString('hex');
                        user.token = token;
                        user.tokenTime = Date.now() + 300000;

                        mailCreator.sendMail({
                            from : 'selnby@gmail.com',
                            to : user.email,
                            subject : 'Reset Password',
                            html : `Hi ${user.name}, click on this https://selnby.herokuapp.com/resetPassword/${token} to reset your password.`
                        });

                        user.save()
                        .then(user => {
                            res.json({msg : "Success"});
                        }).catch(err => {
                            res.json({error : err});
                        });
                    }}).catch(err => {
                        res.json({error : err});
                    });
            }
        });
    }   
}

exports.resetPassword = (req, res, next) => {
    const err = validationResult(req);

    if(err.errors.length > 0){
        res.json({error : err.errors});
    }else{
        User.findOne({token : req.params.token})
        .then(user => {
            if(!user){
                res.json({msg : 'Invalid URL'
                });
            }else{
                if(Date.now() > user.tokenTime){
                    res.json({msg : 'Link has expired. Please go on to previous page to generate new Link.'
                    });
                }else{
                    bcrypt.hash(req.body.password, 12)
                    .then(password => {
                        user.password = password;
                        return user.save();
                    }).then(user => {
                        mailCreator.sendMail({
                            from : 'selnby@gmail.com',
                            to : user.email,
                            subject : 'Password Successfully Reset',
                            html : '<p>Your password has been successfully changed.</p>'
                        });
                        res.json({msg : 'Success'});
                    }).catch(err => {
                        res.json({error : err});
                    });
                }
            }
        }).catch(err => {
            res.json({error : err});
        })
    }
}