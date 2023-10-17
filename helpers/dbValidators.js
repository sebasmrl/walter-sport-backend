const User = require("../models/user");

const validateEmail = async (req, res) => {
    const user = await User.findOne({ email: email });
    // Verificar si el email existe
    if (!user) {
          throw new Error( 'Usuario / Password no son correctos - correo');  
    }
}

const collectionsAvailables = (collection='', collections=[])=>{
    const isIncludes = collections.includes(collection);
    
    if(!isIncludes)
        throw new Error(`La coleccion ${collection} no es permitida, solo ${collections}`);
    return true;
}





module.exports = {
    validateEmail,
    collectionsAvailables,
}