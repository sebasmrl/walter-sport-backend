const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    name: {
            type: String,
            requiered: true  
    },
    email: {
        type: String,
        requiered: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    state: {
        type: Boolean,
        default: true
    },


}, {
    toJSON: {
        transform: function (doc, record) {
            
            const  { _id, password, __v, ...user } = record
            console.log('ret: ', record)
            user.uid = _id;

            return user;
        }
    }
}
)






module.exports = model('User', UserSchema);


