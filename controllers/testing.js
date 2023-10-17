const { request, response } = require('express')
const { subirArchivo } = require('../helpers/subir-archivo');
const User = require('../models/user');
const Product = require('../models/product');


const cargarArchivo = async(req = request, res = response) => {
    
    console.log('req.files >>>', req.files); // eslint-disable-line


    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        res.status(400).json({ msj: 'No hay archivos en la peticion' });
        return;
    }
   
    try{
       //formato {msg, data, code}
       const resDataFile = await subirArchivo(req.files, ['png', 'txt'], 'imgs'); 

        return res.status(resDataFile?.code).json(resDataFile);
        
    }catch(err){
        console.log(err)
        return res.status(err.code).json(err);
    }
    
}


const actualizarImagen = async(req, res= response) => {

    const { coleccion, id} = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await User.findById(id);
            if(!modelo){
                return res.status(400).json({ 
                    msg: 'Usuario no encontrado',
                    data: id,
                    code: 400
                })
            }
            break;

            case 'productos':
                modelo = await Product.findById(id);
                if(!modelo){
                    return res.status(400).json({ 
                        msg: 'Producto no encontrado',
                        data: id,
                        code: 400
                    })
                }
            break;
    
        default:
            return res.status(500).json({ 
                msg: 'Coleccion no disponible para actualizar',
                data: {},
                code: 500
            })
    }

    const resDataFile = await subirArchivo(req.files, undefined, coleccion)
    modelo.img
    
}

module.exports = {
    cargarArchivo,
    actualizarImagen
}