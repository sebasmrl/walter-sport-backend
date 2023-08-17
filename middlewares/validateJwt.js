const { request, response } = require('express')
const jwt =  require('jsonwebtoken')

const validateJwt = (req= request, res=response, next) => {
    const token = req.header('waltersport-token');
    
    if(!token) return res.status(401).json({
        msj: 'Sin token en la peticion',
        data: '',
        code: 401
    })

    try {
        
        const { uid } = jwt.verify( token, process.env.SECRET_OR_PRIVATE_KEY);
        req.user = uid;
        
        next();
    } catch (e) {
        res.status(401).json({
            msj: 'Token no valido',
            data: token,
            code: 401
        })
    }

}

module.exports = {
    validateJwt
}