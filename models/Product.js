const mongoose = require('mongoose');
const schema = mongoose.Schema;

const productSchema = new schema({
    title : {
        type : String,
        required : true
    },

    price : {
        type : Number,
        required : true
    },

    imageUrl : {
        type : String,
        required : true
    },

    description : {
        type : String,
        required : true
    },

    userId : {
        type : schema.Types.ObjectId,
        ref : 'User',
        required : true
    },    

    reviews : [{
        userId : {
            type : schema.Types.ObjectId,
            ref : 'User'
        },

        userName : {
            type : String
        }, 

        review : {
            type : String
        },

        date : {
            type : Date
        }
    }]
});

module.exports = mongoose.model('Product', productSchema);