const jwt = require('jsonwebtoken');

const generateJwt = async ( uid )=> {

    const payload = { uid }
    const options = {  
            expiresIn: '1d'
       }
    
    try {
        const token = await jwt.sign(payload, process.env.SECRET_OR_PRIVATE_KEY, options)
        return token;
    } catch (e) {
       console.log(`Error: ${e}`);
       throw new Error('Error al generar el token');
    }
}


module.exports = {
    generateJwt
}