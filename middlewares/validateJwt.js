const User = require('../models/user');
const { request, response } = require('express')
const jwt =  require('jsonwebtoken');

const validateJwt = async(req= request, res=response, next) => {
    const token = req.header('waltersport-token');
    
    if(!token) return res.status(401).json({
        msj: 'Sin token en la peticion',
        data: '',
        code: 401
    })

    try {
        
        const { uid } = jwt.verify( token, process.env.SECRET_OR_PRIVATE_KEY);
        console.log("uid-validatejwt:", uid)
         // leer el usuario que corresponde al uid
         const user = await User.findById( uid );
         if( !user ) {
             return res.status(401).json({
                 msg: 'Token no válido - usuario no existe DB',
                 data: { token },
                 code: 401
             })
         }
 
         // Verificar si el uid tiene estado true
         if ( !user.state ) {
             return res.status(401).json({
                 msg: 'Token no válido - Usuario deshabilitado',
                 data: { token },
                 code: 401
             })
         }
         
        req.user = user;
        next();

    } catch (e) {
        res.status(401).json({
            msj: 'Token no valido',
            data: token,
            code: 401,
            error: e
        })
    }

}

module.exports = {
    validateJwt
}