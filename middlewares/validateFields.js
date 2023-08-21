const { validationResult } = require("express-validator")

const validateFields = (req, res, next) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty() ){
        return res.status(400).json({
            msg: 'Error al validar campos necesarios para la ruta',
            data: {errors},
            code: 400
        })
    }

    next()
}



module.exports = { 
    validateFields
}