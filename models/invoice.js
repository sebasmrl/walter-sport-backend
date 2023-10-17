const { Schema, model } = require('mongoose');

const InvoiceSchema = new Schema({
    owner: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true  
    },
    products: {
        type: Object,
        required: true
    },
    date:{
        type: Date,
        required:true,
        default: new Date()
    },
    state: {
        type: Boolean,
        default: true
    },


}, {
    toJSON: {
        transform: function (doc, record) {
            
            const  { _id, __v, ...product } = record
            console.log('ret: ', record)
            product.uid = _id;

            return product;
        }
    }
}
)






module.exports = model('Invoice', InvoiceSchema);


