const User = require("../models/user");

const validateEmail = async (req, res) => {
    const user = await User.findOne({ email: email });
    // Verificar si el email existe
    if (!user) {
          throw new Error( 'Usuario / Password no son correctos - correo');  
    }
}






module.exports = {
    validateEmail
}