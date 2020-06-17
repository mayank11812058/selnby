const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SECRET = require('../config/keys').SECRET;

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if(!authHeader){
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, SECRET);
    }catch(err){
        err.statusCode = 500;
        throw err;
    }

    if(!decodedToken){
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

    User.findById(decodedToken.user).then(user => {
        req.user = user;
        next();
    }).catch(err => {
        res.json({error : err});
        next();
    });
}