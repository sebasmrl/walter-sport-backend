const { Schema, model } =  require('mongoose');

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cost: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    descripcion: { type: String },

    stock: { 
        type: Number,
        default: 1,
        required: true 
    },
    profile_img: {  
        type: String,
        default: "" 
    },
    more_imgs:{
        type: Object,
        default: { 
            /* 1:"",
            2:"",
            3:"" */
        }
    }
    

},{
    toJSON: {
        transform: function (doc, record) {

            const { _id, user, __v, ...product } = record
            console.log('ret: ', record)
            product.uid = _id;

            return product;
        }
    }
});

module.exports = model('Product', ProductSchema);