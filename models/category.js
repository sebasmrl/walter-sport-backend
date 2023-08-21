const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la categoria es obligatorio'],
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
    }
}, {
    toJSON: {
        transform: function (doc, record) {

            const { _id, __v, ...category } = record
            //console.log('ret: ', record)
            category.uid = _id;

            return category;
        }
    }
});





module.exports = model('Category', CategorySchema);
