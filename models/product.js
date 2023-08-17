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
        ref: 'Categoria',
        required: true
    },
    descripcion: { type: String },
    available: { type: Boolean, defult: true },
    imgs: { 
        profile: { 
            type: String 
        },
        more: {
            type: Array
        }
    },

},)