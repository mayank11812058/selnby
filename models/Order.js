const mongoose = require('mongoose');
const schema = mongoose.Schema;

const orderSchema = new schema({
    userId : {
        type : schema.Types.ObjectId,
        ref : 'User',
        required : true
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

            title : {
                type : String
            },

            price : {
                type : Number
            },

            description : {
                type : String
            },

            imageUrl : {
                type : String
            },

            count : {
                type : Number
            }
        }]
    }
});

module.exports = mongoose.model('Order', orderSchema);