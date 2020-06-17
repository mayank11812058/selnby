const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    name : {
        type : String,
        required : true
    },

    email : {
        type : String,
        required : true
    },

    password : {
        type : String,
        required : true
    },

    address : {
        type : String
    },

    cart : {
        total : {
            type : Number
        },

        items : [{
            productId : {
                type : schema.Types.ObjectId,
                ref : 'Product'
            },

            count : {
                type : Number
            }
        }]
    },

    token : {
        type : String
    },

    tokenTime : {
        type : Number
    },

    reviews : [{
        productId : {
            type : schema.Types.ObjectId,
            ref : 'Product'
        },

        review : {
            type : String
        },

        date : {
            type : Date
        }
    }],

    boughtProducts : [{
        productId : {
            type : schema.Types.ObjectId
        }
    }]
});

module.exports = mongoose.model('User', userSchema);